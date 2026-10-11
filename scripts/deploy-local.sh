#!/usr/bin/env bash
set -euo pipefail

minikube status
minikube image build -t "devops-shop:${1:-local}" .

kubectl create namespace devops-shop \
  --dry-run=client -o yaml | kubectl apply -f -

helm upgrade --install devops-shop ./helm/devops-shop \
  --namespace devops-shop \
  --set image.repository=devops-shop \
  --set image.tag="${1:-local}" \
  --set image.pullPolicy=Never

kubectl rollout status \
  deployment/devops-shop-devops-shop \
  -n devops-shop \
  --timeout=180s

kubectl get pods -n devops-shop
kubectl get svc -n devops-shop

echo "Run:"
echo "kubectl port-forward -n devops-shop service/devops-shop-devops-shop 8080:80"
