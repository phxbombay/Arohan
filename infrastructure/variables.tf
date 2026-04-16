variable "aws_region" {
  description = "AWS Region to deploy to"
  default     = "ap-south-1"
}

variable "instance_type" {
  description = "EC2 Instance Type"
  default     = "t3.micro"
}

variable "key_name" {
  description = "Name of the SSH Key Pair"
  default     = "arohan-deploy-key"
}

variable "db_name" {
  default = "arohan"
}

variable "db_username" {
  default = "admin"
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "jwt_secret" {
  type      = string
  sensitive = true
  default   = "arohan-prod-secret-2026-change-me-later"
}

variable "smtp_host" {
  default = "smtp.gmail.com"
}

variable "smtp_port" {
  default = "587"
}

variable "smtp_user" {
  default = "arohanhealth@gmail.com"
}

variable "smtp_password" {
  type      = string
  sensitive = true
  default   = "Arohan@2026!Health"
}

variable "admin_email" {
  default = "info@haspranahealth.com"
}

variable "razorpay_key_id" {
  default = "rzp_test_1aeb96771bd3a43a5cb82401"
}

variable "razorpay_key_secret" {
  type      = string
  sensitive = true
  default   = "3187d450123270110537c29051e8d9c3"
}

variable "allowed_origins" {
  default = "https://haspranahealth.com,https://www.haspranahealth.com"
}

variable "vite_api_url" {
  default = "https://haspranahealth.com/v1"
}

variable "domain_name" {
  default = "haspranahealth.com"
}

