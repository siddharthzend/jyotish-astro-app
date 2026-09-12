# Kubernetes Deployment Notes

This repository now includes a basic Kubernetes structure for AWS deployment.

## Structure

k8s/
├── base/
│   ├── kustomization.yaml
│   ├── namespace.yaml
│   ├── secret.yaml
│   ├── configmap.yaml
│   ├── mysql-pvc.yaml
│   ├── mysql-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
├── overlays/
│   ├── dev/
│   ├── uat/
│   └── prod/

## Deploy

kubectl apply -k k8s/overlays/dev
kubectl apply -k k8s/overlays/uat
kubectl apply -k k8s/overlays/prod

## Notes

- This is a starter Kubernetes setup.
- For production AWS deployment, use EKS or k3s on EC2.
- Replace image names with your real registry images.
- For secure production deployments, move secrets to AWS Secrets Manager / Kubernetes Secrets externally.
