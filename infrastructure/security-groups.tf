provider "aws" {
  region = "ap-south-1"
}

# Backend Security Group
resource "aws_security_group" "backend_sg" {
  name        = "arohan-backend-sg"
  description = "Security group for Arohan Backend API"
  vpc_id      = var.vpc_id

  # Allow inbound from ALB only
  ingress {
    description     = "Allow HTTP from ALB"
    from_port       = 5000
    to_port         = 5000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  # Allow inbound SSH from Bastion
  ingress {
    description     = "Allow SSH from Bastion"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion_sg.id]
  }

  # Outbound to Internet (for external APIs)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ALB Security Group
resource "aws_security_group" "alb_sg" {
  name        = "arohan-alb-sg"
  description = "Security group for Load Balancer"
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTPS from World"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP from World (Redirect)"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description     = "Traffic to Backend"
    from_port       = 5000
    to_port         = 5000
    protocol        = "tcp"
    security_groups = [aws_security_group.backend_sg.id]
  }
}

# Database Security Group
resource "aws_security_group" "db_sg" {
  name        = "arohan-db-sg"
  description = "Security group for PostgreSQL RDS"
  vpc_id      = var.vpc_id

  ingress {
    description     = "PostgreSQL from Backend"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.backend_sg.id]
  }
}
