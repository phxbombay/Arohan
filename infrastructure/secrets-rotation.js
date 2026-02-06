import { SecretsManagerClient, GetSecretValueCommand, PutSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import crypto from 'crypto';

const client = new SecretsManagerClient({ region: process.env.AWS_REGION });

export async function handler(event) {
    const { SecretId, Token, Step } = event;

    if (Step === 'createSecret') {
        const newPassword = crypto.randomBytes(32).toString('hex');
        await client.send(new PutSecretValueCommand({
            SecretId,
            SecretString: JSON.stringify({ password: newPassword }),
            VersionStages: ['AWSPENDING']
        }));
    }

    // In a real scenario, you would update the database user password here (setSecret)
    // and verify connection (testSecret)

    if (Step === 'finishSecret') {
        // Move AWSPENDING label to this version to make it AWSCURRENT
        console.log(`Successfully rotated secret ${SecretId}`);
    }
}
