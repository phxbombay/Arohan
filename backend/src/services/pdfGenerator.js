import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

/**
 * Generate Invoice PDF
 */
export async function generateInvoicePDF(invoice, outputPath) {
    return new Promise((resolve, reject) => {
        try {
            // Create PDF document
            const doc = new PDFDocument({ size: 'A4', margin: 50 });

            // Pipe to file
            const writeStream = fs.createWriteStream(outputPath);
            doc.pipe(writeStream);

            // Company Header
            doc
                .fontSize(24)
                .font('Helvetica-Bold')
                .fillColor('#1976d2')
                .text('AROHAN HEALTH', 50, 50);

            doc
                .fontSize(10)
                .font('Helvetica')
                .fillColor('#666666')
                .text('Health Monitoring Devices', 50, 80)
                .text('contact@arohanhealth.com | www.arohanhealth.com', 50, 95);

            // Invoice Title
            doc
                .fontSize(20)
                .font('Helvetica-Bold')
                .fillColor('#000000')
                .text('INVOICE', 400, 50, { align: 'right' });

            // Invoice Details Box
            doc
                .fontSize(10)
                .font('Helvetica')
                .fillColor('#333333');

            const detailsX = 380;
            let detailsY = 80;

            doc.text(`Invoice #: ${invoice.invoiceNumber}`, detailsX, detailsY, { align: 'right' });
            detailsY += 15;
            doc.text(`Date: ${formatDate(invoice.invoiceDate)}`, detailsX, detailsY, { align: 'right' });
            detailsY += 15;
            doc.text(`Order #: ${invoice.orderNumber}`, detailsX, detailsY, { align: 'right' });

            // Horizontal line
            doc
                .strokeColor('#cccccc')
                .lineWidth(1)
                .moveTo(50, 130)
                .lineTo(550, 130)
                .stroke();

            // Bill To Section
            doc
                .fontSize(12)
                .font('Helvetica-Bold')
                .fillColor('#000000')
                .text('BILL TO:', 50, 150);

            doc
                .fontSize(10)
                .font('Helvetica')
                .fillColor('#333333')
                .text(invoice.customer.name, 50, 170)
                .text(invoice.customer.mobile, 50, 185);

            if (invoice.customer.email) {
                doc.text(invoice.customer.email, 50, 200);
            }

            // Address
            if (invoice.customer.address) {
                const addr = invoice.customer.address;
                let addressY = invoice.customer.email ? 215 : 200;

                if (addr.street) doc.text(addr.street, 50, addressY), addressY += 15;
                if (addr.landmark) doc.text(`Near ${addr.landmark}`, 50, addressY), addressY += 15;
                if (addr.city && addr.state) {
                    doc.text(`${addr.city}, ${addr.state} - ${addr.pincode}`, 50, addressY);
                }
            }

            // Items Table
            const tableTop = 280;

            // Table Header
            doc
                .fontSize(10)
                .font('Helvetica-Bold')
                .fillColor('#ffffff')
                .rect(50, tableTop, 500, 25)
                .fill('#1976d2');

            doc
                .fillColor('#ffffff')
                .text('ITEM', 60, tableTop + 8)
                .text('QTY', 320, tableTop + 8)
                .text('PRICE', 380, tableTop + 8)
                .text('TOTAL', 480, tableTop + 8);

            // Table Rows
            let itemY = tableTop + 30;
            doc.fillColor('#333333').font('Helvetica');

            invoice.items.forEach((item, index) => {
                const bgColor = index % 2 === 0 ? '#f5f5f5' : '#ffffff';
                doc.rect(50, itemY - 5, 500, 25).fill(bgColor);

                doc
                    .fillColor('#333333')
                    .text(item.name, 60, itemY)
                    .text(item.quantity.toString(), 320, itemY)
                    .text(`₹${item.price.toFixed(2)}`, 380, itemY)
                    .text(`₹${item.total.toFixed(2)}`, 480, itemY);

                itemY += 25;
            });

            // Totals Section
            const totalsY = itemY + 20;
            const totalsX = 350;

            doc
                .fontSize(10)
                .font('Helvetica')
                .fillColor('#666666');

            doc.text('Subtotal:', totalsX, totalsY);
            doc.text(`₹${invoice.pricing.subtotal.toFixed(2)}`, 480, totalsY);

            doc.text(`Tax (${invoice.pricing.taxRate}%):`, totalsX, totalsY + 15);
            doc.text(`₹${invoice.pricing.tax.toFixed(2)}`, 480, totalsY + 15);

            doc.text('Shipping:', totalsX, totalsY + 30);
            doc.text(invoice.pricing.shipping === 0 ? 'FREE' : `₹${invoice.pricing.shipping.toFixed(2)}`, 480, totalsY + 30);

            if (invoice.pricing.discount > 0) {
                doc.text('Discount:', totalsX, totalsY + 45);
                doc.text(`-₹${invoice.pricing.discount.toFixed(2)}`, 480, totalsY + 45);
            }

            // Total line
            doc
                .strokeColor('#cccccc')
                .lineWidth(1)
                .moveTo(totalsX, totalsY + (invoice.pricing.discount > 0 ? 60 : 50))
                .lineTo(550, totalsY + (invoice.pricing.discount > 0 ? 60 : 50))
                .stroke();

            // Grand Total
            const totalY = totalsY + (invoice.pricing.discount > 0 ? 65 : 55);
            doc
                .fontSize(12)
                .font('Helvetica-Bold')
                .fillColor('#000000')
                .text('TOTAL:', totalsX, totalY)
                .text(`₹${invoice.pricing.total.toFixed(2)}`, 480, totalY);

            // Payment Info
            const paymentY = totalY + 40;
            doc
                .fontSize(10)
                .font('Helvetica')
                .fillColor('#666666')
                .text(`Payment Method: ${invoice.paymentMethod}`, 50, paymentY)
                .text(`Payment Status: ${invoice.paymentStatus}`, 50, paymentY + 15);

            // Footer
            doc
                .strokeColor('#cccccc')
                .lineWidth(1)
                .moveTo(50, 700)
                .lineTo(550, 700)
                .stroke();

            doc
                .fontSize(9)
                .fillColor('#666666')
                .text('Thank you for your purchase!', 50, 720, { align: 'center', width: 500 })
                .text('For queries, contact: contact@arohanhealth.com | +91 XXXXXXXXXX', 50, 735, { align: 'center', width: 500 });

            // Terms (if any)
            if (invoice.notes) {
                doc
                    .fontSize(8)
                    .fillColor('#999999')
                    .text(`Notes: ${invoice.notes}`, 50, 755, { width: 500 });
            }

            // Finalize PDF
            doc.end();

            writeStream.on('finish', () => {
                resolve(outputPath);
            });

            writeStream.on('error', (err) => {
                reject(err);
            });

        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Format date helper
 */
function formatDate(date) {
    const d = new Date(date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
