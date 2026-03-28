import { EC2Client, GetConsoleOutputCommand } from "@aws-sdk/client-ec2";
import fs from "fs";

(async () => {
    try {
        const client = new EC2Client({ 
            region: "ap-south-1",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });
        const command = new GetConsoleOutputCommand({ InstanceId: "i-0d3c57d344143e004" });
        const response = await client.send(command);
        const decoded = Buffer.from(response.Output || "", 'base64').toString('utf8');
        fs.writeFileSync("console.txt", decoded);
        console.log("Written successfully.");
    } catch (e) {
        console.error("SDK Error:", e);
    }
})();
