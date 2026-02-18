# AWS Deployment Guide for Arohan Health

This guide walks you through deploying the Arohan Health platform to AWS using Terraform and Docker.

## 1. Install Prerequisites

You need the AWS CLI and Terraform installed on your machine.
We have provided a PowerShell script to install these automatically via `winget`.

1.  Open PowerShell as Administrator.
2.  Run the helper script:
    ```powershell
    .\infrastructure\install_tools.ps1
    ```
3.  **Restart your terminal** after installation.

Alternatively, execute manually:
```powershell
winget install Amazon.AWSCLI
winget install HashiCorp.Terraform
```

## 2. Configure AWS Credentials

Run the following command and enter your AWS Access Key ID and Secret Access Key when prompted:

```bash
aws configure
# Region: ap-south-1
# Output format: json
```

## 3. Provision Infrastructure (Terraform)

Navigate to the infrastructure directory and apply the configuration.

```bash
cd infrastructure

# Initialize Terraform
terraform init

# Review the plan
terraform plan

# Apply changes (Type 'yes' when prompted)
terraform apply
```

**Output:**
Terraform will output the **Public IP** of your new EC2 instance.
Example: `instance_public_ip = "13.232.10.5"`

## 4. Deploy Application

Since the repository is private (or local), we will copy the code to the server using `scp` (or you can use Git if you set up keys).

### Option A: Manual Copy (Recommended for First Run)
1.  Ensure you have the `arohan-deploy-key.pem` file (Terraform expects this key to exist in AWS. **Important**: You must create this key pair in AWS Console -> EC2 -> Key Pairs -> "arohan-deploy-key" and download it *before* running terraform apply, or update `variables.tf` to use an existing key).

2.  Copy files to the server:
    ```bash
    # From project root
    scp -i path/to/arohan-deploy-key.pem -r . ubuntu@<INSTANCE_IP>:/home/ubuntu/app
    ```

3.  SSH into the server:
    ```bash
    ssh -i path/to/arohan-deploy-key.pem ubuntu@<INSTANCE_IP>
    ```

4.  Start the Application:
    ```bash
    cd /home/ubuntu/app
    sudo docker compose up -d --build
    ```

## 5. Clean Up

To destroy the infrastructure and stop billing:

```bash
cd infrastructure
terraform destroy
```
