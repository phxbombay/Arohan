# Helper script to install AWS CLI and Terraform on Windows
Write-Host "Installing AWS CLI..." -ForegroundColor Cyan
winget install -e --id Amazon.AWSCLI

Write-Host "Installing Terraform..." -ForegroundColor Cyan
winget install -e --id HashiCorp.Terraform

Write-Host "Installation complete. Please restart your terminal." -ForegroundColor Green
Write-Host "To verify installation, run: aws --version && terraform -v" -ForegroundColor Yellow
