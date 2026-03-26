$ErrorActionPreference = "Stop"

# AWS Credentials should be set in the environment or AWS CLI profile
# $env:AWS_ACCESS_KEY_ID="..."
# $env:AWS_SECRET_ACCESS_KEY="..."
$env:AWS_DEFAULT_REGION="ap-south-1"

Write-Host "Forcefully terminating the old EC2 Instance and triggering a replacement..."
terraform apply -replace="aws_instance.app_server" -auto-approve -var="db_password=ArohanSecureDb2026!" -var="key_name=arohan-deploy-key" | Tee-Object -FilePath "terraform_replace.log"

if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: The replacement EC2 instance is now booting. Initializing GitHub Pull & Docker Compose build..."
} else {
    Write-Host "ERROR: EC2 Replacement failed."
}
