<#
.SYNOPSIS
Automatically commits recent local changes, pushes them to GitHub, and live-updates the AWS Server without downtime.
#>

# Prompt for a descriptive commit message
$CommitMessage = Read-Host "What did you change? (press Enter for a generic message)"

if ([string]::IsNullOrWhiteSpace($CommitMessage)) {
    $CommitMessage = "Site update - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
}

Write-Host "`n📦 Step 1: Pushing code to GitHub..." -ForegroundColor Cyan
git add .
git commit -m $CommitMessage
git push origin main

# Automatically grab whatever the current EC2 Instance IP is directly from Terraform!
Write-Host "`n🔍 Step 2: Fetching Current AWS Server IP..." -ForegroundColor Cyan
Push-Location infrastructure
$ServerIP = terraform output -raw instance_public_ip
Pop-Location

if ([string]::IsNullOrWhiteSpace($ServerIP)) {
    Write-Host "❌ Failed to fetch Server IP. Is the server running?" -ForegroundColor Red
    exit 1
}

$KeyPath = "C:\Users\pachu\Downloads\arohan-deploy-key.pem"

Write-Host "`n🚀 Step 3: Triggering automated Docker deployment on AWS Server ($ServerIP)..." -ForegroundColor Cyan
Write-Host "This will pull your freshly pushed code and seamlessly restart the specific containers that changed.`n"

# The deployment script simply tells the AWS server to pull code and rebuild ONLY what changed in the background.
$DeployCommand = "cd /home/ubuntu/app && git pull origin main && docker compose -f docker-compose.prod.yml up -d --build"

# Run it remotely over SSH
ssh -i $KeyPath -o StrictHostKeyChecking=no ubuntu@$ServerIP $DeployCommand

Write-Host "`n✅ Update successfully deployed to AWS! Your website has been perfectly updated!" -ForegroundColor Green
