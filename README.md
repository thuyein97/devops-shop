# DevOps Shop — Real-World GitHub Actions + Minikube Lab

A production-style DevOps practice repository using:

- Node.js + Express
- Jest + Supertest
- Docker
- GitHub Actions
- Trivy
- Helm
- Kubernetes / Minikube
- Terraform validation
- Prometheus metrics
- Local GitHub Actions self-hosted runner for CD to Minikube

## Architecture

Developer -> Pull Request -> CI -> Merge -> Docker build/scan -> local Minikube deployment

CI runs on GitHub-hosted runners.

The deployment-to-Minukube workflow uses a **self-hosted GitHub Actions runner installed on the same machine as Minikube**. A normal GitHub-hosted runner cannot directly reach your laptop's Minikube cluster.

## 1. Start Minikube

```bash
minikube start --driver=docker
kubectl get nodes
```

## 2. Deploy manually first

This proves the application works before adding GitHub Actions CD.

```bash
minikube image build -t devops-shop:local .
kubectl create namespace devops-shop --dry-run=client -o yaml | kubectl apply -f -
helm upgrade --install devops-shop ./helm/devops-shop \
  --namespace devops-shop \
  --set image.repository=devops-shop \
  --set image.tag=local \
  --set image.pullPolicy=Never

kubectl rollout status deployment/devops-shop -n devops-shop
kubectl port-forward -n devops-shop service/devops-shop 8080:80
```

Open another terminal:

```bash
curl http://127.0.0.1:8080/health
curl http://127.0.0.1:8080/api/products
curl http://127.0.0.1:8080/metrics
```

## 3. Run tests locally

```bash
npm ci
npm test
npm run lint
```

## 4. GitHub Actions CI

Create a GitHub repository and push this project.

The PR workflow runs:

1. npm install
2. lint
3. unit/API tests
4. Docker build
5. Trivy filesystem scan

The main workflow builds the Docker image and scans it.

## 5. Enable CD to your Minikube

Install a GitHub Actions self-hosted runner on the same machine where Minikube is running.

In GitHub:

Settings -> Actions -> Runners -> New self-hosted runner -> Linux

Follow GitHub's generated commands. Give the runner these labels:

```text
self-hosted
linux
x64
minikube
```

Make sure the runner can execute:

```bash
docker version
kubectl version --client
minikube version
helm version
```

Then the workflow `.github/workflows/deploy-minikube.yml` can run against:

```yaml
runs-on:
  - self-hosted
  - linux
  - x64
  - minikube
```

Push to `main` and the workflow will:

1. Checkout code
2. Run tests
3. Build the image directly into Minikube
4. Deploy with Helm
5. Wait for rollout
6. Run a health check
7. Show pods/services

## Important security note

A self-hosted runner has access to the machine hosting it. Do not use an untrusted public repository or arbitrary pull-request code on a runner that has access to important systems.

For this lab, keep the repository private or control who can push/approve changes.

## Useful commands

```bash
kubectl get pods -n devops-shop
kubectl get svc -n devops-shop
kubectl describe deployment devops-shop -n devops-shop
kubectl logs deployment/devops-shop -n devops-shop
helm list -n devops-shop
minikube image ls | grep devops-shop
```

Cleanup:

```bash
helm uninstall devops-shop -n devops-shop
kubectl delete namespace devops-shop
```

## Next stages

After the Minikube version works, extend this lab with:

- PostgreSQL
- External secrets / Vault
- Argo CD
- Terraform AWS infrastructure
- EKS
- GHCR
- Prometheus Operator
- Grafana
- Alertmanager
- Slack notifications
- staging/production GitHub environments
- manual production approval
- blue/green or canary deployment
# devops-shop
