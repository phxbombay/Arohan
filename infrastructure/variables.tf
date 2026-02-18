variable "aws_region" {
  description = "AWS Region to deploy to"
  default     = "ap-south-1"
}

variable "instance_type" {
  description = "EC2 Instance Type"
  default     = "t3.medium"
}

variable "key_name" {
  description = "Name of the SSH Key Pair to launch the instance with"
  default     = "arohan-deploy-key" 
}
