output "environment" {
  value = var.environment
}

output "cluster_name" {
  value       = module.eks.cluster_name
  description = "EKS Cluster Name to put in GitHub Secrets"
}

output "aws_region" {
  value       = "us-east-1"
  description = "AWS Region to put in GitHub Secrets"
}