# IaC demo: intentionally insecure Terraform. DO NOT USE IN PRODUCTION.
provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "data" {
  bucket = "frogbot-demo-public-data"
  acl    = "public-read"
}

resource "aws_security_group" "open" {
  name = "open-to-world"
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 3389
    to_port     = 3389
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "db" {
  engine              = "postgres"
  instance_class      = "db.t3.micro"
  publicly_accessible = true
  storage_encrypted   = false
  skip_final_snapshot = true
  username            = "admin"
  password            = "Sup3rS3cretP4ssw0rd!"
}
