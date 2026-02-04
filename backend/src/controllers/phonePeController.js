import crypto from 'crypto';
import axios from 'axios';

// PhonePe Test Credentials
const PHONEPE_CONFIG = {
    merchantId: 'PGTESTPAYUAT',
    saltKey: '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399',
    saltIndex: 1,
    apiUrl: 'https://api-preprod.phonepe.com/apis/hermes',
    redirectUrl: process.env.PHONEPE_REDIRECT_URL || 'http://localhost:3000/payment/status',
    callbackUrl: process.env.PHONEPE_CALLBACK_URL || 'http://localhost:5000/api/phonepe/callback'
};

/**
 * Generate X-VERIFY checksum for PhonePe
 * Formula: SHA256(Base64(Payload) + API_ENDPOINT + SALT_KEY) + ### + SALT_INDEX
 */
function generateChecksum(payload, endpoint) {
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const stringToHash = base64Payload + endpoint + PHONEPE_CONFIG.saltKey;
    const sha256Hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const checksum = sha256Hash + '###' + PHONEPE_CONFIG.saltIndex;
    return { checksum, base64Payload };
}

/**
 * Verify checksum from PhonePe callback
 */
function verifyChecksum(base64Response, receivedChecksum) {
    const stringToHash = base64Response + PHONEPE_CONFIG.saltKey;
    const sha256Hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const expectedChecksum = sha256Hash + '###' + PHONEPE_CONFIG.saltIndex;
    return expectedChecksum === receivedChecksum;
}

/**
 * Initiate PhonePe Payment
 * POST /api/phonepe/pay
 * Body: { amount, mobile, userName, userId, orderId }
 */
export const initiatePayment = async (req, res) => {
    try {
        const { amount, mobile, userName, userId, orderId } = req.body;

        // Validation
        if (!amount || !mobile) {
            return res.status(400).json({
                success: false,
                message: 'Amount and mobile number are required'
            });
        }

        if (amount < 1) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be at least ₹1'
            });
        }

        // Generate unique transaction ID
        const merchantTransactionId = orderId || `TXN_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const merchantUserId = userId || `USER_${mobile}`;

        // Prepare payload (amount in paise)
        const payload = {
            merchantId: PHONEPE_CONFIG.merchantId,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: merchantUserId,
            amount: Math.round(amount * 100), // Convert to paise
            redirectUrl: `${PHONEPE_CONFIG.redirectUrl}?txnId=${merchantTransactionId}`,
            redirectMode: 'POST',
            callbackUrl: PHONEPE_CONFIG.callbackUrl,
            mobileNumber: mobile,
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };

        // Generate checksum
        const endpoint = '/pg/v1/pay';
        const { checksum, base64Payload } = generateChecksum(payload, endpoint);

        // Make API call to PhonePe
        const response = await axios.post(
            `${PHONEPE_CONFIG.apiUrl}${endpoint}`,
            {
                request: base64Payload
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-VERIFY': checksum
                }
            }
        );

        const data = response.data;

        if (data.success && data.data && data.data.instrumentResponse) {
            // Store transaction in database here (optional)
            // await Transaction.create({ merchantTransactionId, amount, mobile, status: 'PENDING' });

            return res.status(200).json({
                success: true,
                message: 'Payment initiated successfully',
                data: {
                    redirectUrl: data.data.instrumentResponse.redirectInfo.url,
                    transactionId: merchantTransactionId
                }
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Failed to initiate payment',
                error: data.message || 'Unknown error'
            });
        }

    } catch (error) {
        console.error('PhonePe Payment Error:', error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: 'Payment initiation failed',
            error: error.response?.data || error.message
        });
    }
};

/**
 * Check Payment Status
 * GET /api/phonepe/status/:txnId
 */
export const checkPaymentStatus = async (req, res) => {
    try {
        const { txnId } = req.params;

        if (!txnId) {
            return res.status(400).json({
                success: false,
                message: 'Transaction ID is required'
            });
        }

        const endpoint = `/pg/v1/status/${PHONEPE_CONFIG.merchantId}/${txnId}`;

        // Generate checksum for status check
        const stringToHash = endpoint + PHONEPE_CONFIG.saltKey;
        const sha256Hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
        const checksum = sha256Hash + '###' + PHONEPE_CONFIG.saltIndex;

        // Make API call to check status
        const response = await axios.get(
            `${PHONEPE_CONFIG.apiUrl}${endpoint}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-VERIFY': checksum,
                    'X-MERCHANT-ID': PHONEPE_CONFIG.merchantId
                }
            }
        );

        const data = response.data;

        if (data.success) {
            const paymentStatus = data.data.state;
            const paymentCode = data.code;

            // Update transaction in database here (optional)
            // await Transaction.update({ status: paymentStatus }, { where: { merchantTransactionId: txnId } });

            return res.status(200).json({
                success: true,
                message: 'Status fetched successfully',
                data: {
                    transactionId: txnId,
                    status: paymentStatus,
                    code: paymentCode,
                    amount: data.data.amount / 100, // Convert paise to rupees
                    paymentInstrument: data.data.paymentInstrument
                }
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Failed to fetch payment status',
                error: data.message
            });
        }

    } catch (error) {
        console.error('PhonePe Status Check Error:', error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: 'Status check failed',
            error: error.response?.data || error.message
        });
    }
};

/**
 * Handle PhonePe Callback
 * POST /api/phonepe/callback
 */
export const handleCallback = async (req, res) => {
    try {
        const { response: base64Response } = req.body;
        const xVerify = req.headers['x-verify'];

        // Verify checksum
        if (!verifyChecksum(base64Response, xVerify)) {
            console.error('Invalid checksum in callback');
            return res.status(400).json({
                success: false,
                message: 'Invalid checksum'
            });
        }

        // Decode response
        const decodedResponse = JSON.parse(Buffer.from(base64Response, 'base64').toString('utf-8'));

        console.log('PhonePe Callback:', decodedResponse);

        // Update transaction in database
        // await Transaction.update(
        //     { status: decodedResponse.data.state, response: decodedResponse },
        //     { where: { merchantTransactionId: decodedResponse.data.merchantTransactionId } }
        // );

        return res.status(200).json({
            success: true,
            message: 'Callback processed successfully'
        });

    } catch (error) {
        console.error('PhonePe Callback Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Callback processing failed',
            error: error.message
        });
    }
};
