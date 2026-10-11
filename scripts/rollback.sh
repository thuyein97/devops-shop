#!/usr/bin/env bash
set -euo pipefail

helm rollback devops-shop "${1:-0}" -n devops-shop
kubectl rollout status deployment/devops-shop-devops-shop -n devops-shop
