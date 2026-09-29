# 🚀 DevOps Shop — AWS EKS DevOps Platform

A hands-on DevOps project demonstrating the application delivery lifecycle — from source code and automated testing to containerization, security scanning, Infrastructure as Code, and Kubernetes deployment on **Amazon EKS**.

> **Project goal:** Build and operate a realistic AWS-based DevOps platform while understanding the automation, security, deployment, infrastructure, and troubleshooting involved in running containerized applications on Kubernetes.

---

## 🏗️ What This Project Demonstrates

* CI/CD with GitHub Actions
* Pull request validation
* Automated testing and linting
* Docker containerization
* Trivy security scanning
* Infrastructure as Code with Terraform
* Amazon EKS
* Amazon ECR
* Kubernetes
* Helm
* GitHub Actions → AWS authentication using OIDC
* Staging and production deployment workflows
* GitHub Environments and production approval
* Kubernetes readiness and health checks
* Immutable container image deployment
* Prometheus application metrics

---

## 🎯 Project Objectives

This project was built to practice how a DevOps engineer designs and operates an application delivery platform rather than simply deploying an application once.

The main objectives are:

1. Automate application validation with CI.
2. Build reproducible Docker images.
3. Integrate security scanning into the CI pipeline.
4. Provision AWS infrastructure using Terraform.
5. Deploy containerized workloads to Amazon EKS.
6. Store container images in Amazon ECR.
7. Authenticate GitHub Actions to AWS using OIDC instead of long-lived credentials.
8. Separate staging and production deployment workflows.
9. Deploy immutable container image versions.
10. Validate Kubernetes deployments automatically.
11. Make the infrastructure reproducible so the EKS environment can be destroyed and recreated when required.
12. Build a foundation for observability and GitOps.

---

# 🏛️ Architecture

```mermaid
    Dev["Developer"] --> PR["Pull Request"]

    PR --> CI["GitHub Actions CI"]

    CI --> Test["Tests + Lint"]
    CI --> Security["Trivy Security Scan"]

    PR --> Review["PR Review / Branch Protection"]
    Review --> Main["main"]

    Main --> Build["Build Docker Image"]

    Build --> ECR["Amazon ECR"]

    TF["Terraform"] --> AWS["AWS Infrastructure"]
    AWS --> EKS["Amazon EKS"]
    AWS --> ECR

    OIDC["GitHub OIDC"] --> IAM["AWS IAM Role"]
    IAM --> Build
    IAM --> EKS

    ECR --> EKS

    EKS --> Helm["Helm"]
    Helm --> App["DevOps Shop Pods"]

    App --> Health["Health Checks"]
    App --> Metrics["Prometheus Metrics"]
```

---

# 🔄 CI/CD Flow

```text
          Developer
              │
              ▼
          Pull Request
              │
              ▼
┌─────────────────────────────┐
│       GitHub Actions CI     │
│                             │
│  • Install dependencies     │
│  • Lint                     │
│  • Tests                    │
│  • Docker build             │
│  • Trivy security scan      │
└──────────────┬──────────────┘
               │
         PR approved
               │
               ▼
             main
               │
               ▼
┌─────────────────────────────┐
│       Build & Publish       │
│                             │
│  Docker image               │
│  Immutable image reference  │
│  Amazon ECR                 │
└──────────────┬──────────────┘
               │
               ▼
          Staging EKS
               │
          Validation
               │
               ▼
        Production Approval
               │
               ▼
          Production EKS
```

---

# 🧰 Technology Stack

| Area                   | Technology       |
| ---------------------- | ---------------- |
| Application            | Node.js          |
| Testing                | Jest / Supertest |
| Code Quality           | ESLint           |
| Containerization       | Docker           |
| CI/CD                  | GitHub Actions   |
| Security               | Trivy            |
| Infrastructure as Code | Terraform        |
| Cloud                  | AWS              |
| Kubernetes             | Amazon EKS       |
| Container Registry     | Amazon ECR       |
| Kubernetes Packaging   | Helm             |
| AWS Authentication     | GitHub OIDC      |
| Metrics                | Prometheus       |
| Source Control         | Git / GitHub     |

---

# 📁 Repository Structure

```text
devops-shop/
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── deploy-staging.yml
│       └── deploy-production.yml
│
├── helm/
│   └── devops-shop/
│       ├── templates/
│       ├── values.yaml
│       └── values-staging.yaml
│
├── monitoring/
│   └── prometheus/
│
├── scripts/
│
├── src/
│
├── tests/
│
├── terraform/
│   ├── modules/
│   └── environments/
│
├── Dockerfile
├── package.json
└── README.md
```

---

# 🧪 Continuous Integration

Every pull request is validated before changes can be merged.

The CI pipeline performs:

1. Install dependencies
2. Run ESLint
3. Run automated tests
4. Build the Docker image
5. Run Trivy security scanning

The objective is to detect application, build, and security issues before changes reach the deployment pipeline.

---

# 🐳 Containerization

The application is packaged as a Docker image.

The container image provides a consistent artifact that can be promoted through the deployment pipeline.

Example:

```bash
docker build -t devops-shop .
```

The image is then published to Amazon ECR for deployment to EKS.

---

# 🔐 Container Security

Trivy is integrated into the CI pipeline to scan container images and identify known vulnerabilities.

Security is treated as part of the CI/CD process rather than as a separate manual activity.

The goal is to detect vulnerable dependencies and container packages before deployment.

---

# ☁️ AWS Infrastructure

AWS infrastructure is provisioned using Terraform.

The cloud architecture includes:

```text
Terraform
    │
    ├── Networking
    │
    ├── IAM
    │
    ├── ECR
    │
    └── EKS
```

Terraform provides reproducible infrastructure and allows the EKS environment to be recreated when required.

---

# ☸️ Amazon EKS

Amazon EKS provides the Kubernetes platform used to run the application.

The deployment flow is:

```text
GitHub Actions
      │
      ▼
Amazon ECR
      │
      ▼
Amazon EKS
      │
      ▼
Helm
      │
      ▼
DevOps Shop
```

The Kubernetes deployment uses:

* Deployment
* Service
* Readiness probes
* Health checks
* Configurable replicas
* Helm values
* Environment-specific configuration

---

# 📦 Helm

Helm is used to package and deploy the Kubernetes application.

The Helm chart contains the Kubernetes resources required by the application.

Deployment example:

```bash
helm upgrade --install devops-shop-release \
  ./helm/devops-shop \
  --namespace staging \
  --create-namespace \
  --wait \
  --atomic \
  --timeout 5m
```

The deployment uses `--wait` and `--atomic` so unsuccessful releases can be detected and rolled back.

---

# 🔑 GitHub Actions → AWS OIDC

GitHub Actions authenticates to AWS using OpenID Connect.

Instead of storing long-lived AWS access keys in GitHub, the workflow obtains temporary AWS credentials through an IAM role.

```text
GitHub Actions
      │
      │ OIDC Token
      ▼
AWS IAM OIDC Provider
      │
      │ AssumeRole
      ▼
Temporary AWS Credentials
      │
      ├──────────────► Amazon ECR
      │
      └──────────────► Amazon EKS
```

This reduces the need to manage long-lived AWS credentials in CI/CD.

---

# 🌎 Environment Strategy

The deployment pipeline separates staging and production.

## Staging

Changes merged into `main` are deployed to the staging environment for validation.

```text
main
 │
 ▼
Build Image
 │
 ▼
Push to ECR
 │
 ▼
Deploy to Staging EKS
 │
 ▼
Health / Rollout Validation
```

## Production

Production deployment is separated from staging and protected using a GitHub Environment approval gate.

```text
Staging
   │
   ▼
Validation
   │
   ▼
Production Approval
   │
   ▼
Production EKS
```

This provides a controlled promotion path between environments.

---

# 🏷️ Immutable Image Promotion

The deployment pipeline is designed around immutable container artifacts.

Instead of rebuilding a different image for each environment, the same built artifact can be promoted through the environments.

Conceptually:

```text
Source Commit
     │
     ▼
Docker Build
     │
     ▼
Image Digest
     │
     ▼
Amazon ECR
     │
     ├─────────────► Staging
     │
     └─────────────► Production
```

This reduces the risk of staging and production running different builds of the same source revision.

---

# 📊 Application Metrics

The application exposes Prometheus-compatible metrics.

Metrics endpoint:

```text
/metrics
```

Health endpoint:

```text
/health
```

These endpoints provide the foundation for Kubernetes health checks and application monitoring.

The next stage of the project will expand this into a complete observability stack using Prometheus and Grafana.

---

# 🩺 Deployment Validation

Deployment workflows validate the Kubernetes rollout after Helm deployment.

Example:

```bash
kubectl rollout status \
  deployment/devops-shop \
  -n staging
```

The Helm deployment also uses:

```bash
--wait
--atomic
--timeout 5m
```

This allows failed deployments to be detected automatically instead of treating a successful Helm command as proof that the application is healthy.

---

# 🧯 Troubleshooting & Engineering Lessons

This project is intentionally developed through real implementation and troubleshooting rather than simply following a static deployment tutorial.

Some of the engineering problems investigated include:

* GitHub Actions permission issues
* AWS OIDC trust configuration
* GitHub Environment protection
* EKS authentication
* Kubernetes rollout timeouts
* Helm deployment failures
* Container image version and digest handling
* Terraform infrastructure lifecycle
* ECR image management
* Kubernetes readiness and health checks

The goal is to understand not only how to configure the infrastructure, but also how to diagnose failures when individual components do not behave as expected.

---

# 💰 Cost-Conscious AWS Development

The EKS environment is created when cloud deployment testing is required and destroyed when it is no longer needed.

This keeps the learning environment cost-conscious while also testing whether the infrastructure is genuinely reproducible.

Typical lifecycle:

```text
terraform apply
      │
      ▼
AWS Infrastructure
      │
      ▼
EKS Deployment
      │
      ▼
Testing / Validation
      │
      ▼
terraform destroy
```

The ability to recreate the environment is an important part of the Infrastructure as Code approach.

---

# 🛠️ Development Workflow

Typical development flow:

```text
1. Create feature branch
2. Make application/infrastructure changes
3. Open Pull Request
4. GitHub Actions runs CI
5. Review and merge
6. Build container image
7. Scan image
8. Push image to ECR
9. Deploy to staging EKS
10. Validate deployment
11. Approve production
12. Deploy the same artifact to production
```

---

# 🧪 Useful Commands

## Run tests

```bash
npm ci
npm test
```

## Run linting

```bash
npm run lint
```

## Build Docker image

```bash
docker build -t devops-shop .
```

## Terraform

```bash
terraform init
terraform validate
terraform plan
terraform apply
```

## Kubernetes

```bash
kubectl get nodes
kubectl get pods -A
kubectl get deployments -A
```

## Helm

```bash
helm lint ./helm/devops-shop

helm list -A
```

---

# 🗺️ Project Roadmap

## Completed / Implemented

* [x] Node.js application
* [x] Docker containerization
* [x] GitHub Actions CI
* [x] Automated testing
* [x] ESLint
* [x] Trivy security scanning
* [x] Kubernetes deployment
* [x] Helm
* [x] Terraform
* [x] Amazon ECR
* [x] Amazon EKS
* [x] GitHub OIDC authentication
* [x] Staging deployment
* [x] Production environment approval
* [x] Deployment health checks


## Next
* [ ] Prometheus application metrics
* [ ] Prometheus observability
* [ ] Grafana dashboards
* [ ] Alerting
* [ ] GitOps with Argo CD
* [ ] Argo CD application deployment
* [ ] GitOps-based staging and production promotion

---

# 🎯 Why I Built This

This project is not intended to be another simple Kubernetes deployment demo.

It is a practical environment for understanding how the major components of a modern DevOps platform work together:

```text
Source Control
      ↓
     CI
      ↓
   Security
      ↓
    Docker
      ↓
  Terraform
      ↓
     AWS
      ↓
     ECR
      ↓
     EKS
      ↓
     Helm
      ↓
   Staging
      ↓
  Production
      ↓
  Observability
      ↓
    GitOps
```

The project is continuously evolved by introducing real deployment scenarios, troubleshooting failures, and automating the successful solutions.

---

# 📌 Project Status

**Active DevOps portfolio project**

Current technologies:

**AWS · EKS · ECR · Terraform · Kubernetes · Helm · GitHub Actions · Docker · Trivy · OIDC · Prometheus**

Next focus:

**Observability · Grafana · Alerting · Argo CD · GitOps**

---

## 🔗 Repository

[GitHub Repository](https://github.com/thuyein97/devops-shop)

---

## 📄 License

This project is intended for learning, experimentation, and portfolio purposes.
