data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

resource "aws_instance" "app_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  key_name      = var.key_name

  vpc_security_group_ids = [
    aws_security_group.backend_sg.id
  ]


  root_block_device {
    volume_size = 20
    volume_type = "gp2"
  }

  user_data = templatefile("${path.module}/user_data.sh", {
    db_host             = aws_db_instance.default.address
    db_name             = var.db_name
    db_user             = var.db_username
    db_password         = var.db_password
    jwt_secret          = var.jwt_secret
    smtp_host           = var.smtp_host
    smtp_port           = var.smtp_port
    smtp_user           = var.smtp_user
    smtp_password       = var.smtp_password
    admin_email         = var.admin_email
    razorpay_key_id     = var.razorpay_key_id
    razorpay_key_secret = var.razorpay_key_secret
    allowed_origins     = var.allowed_origins
    vite_api_url        = var.vite_api_url
  })

  user_data_replace_on_change = true

  tags = {
    Name = "Arohan-App-Server"
  }
}

# Attach instance to Target Group
resource "aws_lb_target_group_attachment" "app_tg_attachment" {
  target_group_arn = aws_lb_target_group.app_tg.arn
  target_id        = aws_instance.app_server.id
  port             = 80 # Forwarding to Frontend (Standard HTTP)
}

