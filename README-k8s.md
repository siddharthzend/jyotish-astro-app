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
│   ├── ingress.yaml
├── overlays/
│   ├── dev/
│   ├── uat/
│   └── prod/

## Deploy

kubectl apply -k k8s/overlays/dev
kubectl apply -k k8s/overlays/uat
kubectl apply -k k8s/overlays/prod

## AWS Ingress

The base manifest uses the AWS Load Balancer Controller and creates an internet-facing
Application Load Balancer. `/api` routes to the backend and `/` routes to the frontend.

Before applying it on EKS, install and configure the AWS Load Balancer Controller,
then run:

kubectl apply -k k8s/overlays/dev
kubectl get ingress -n jyotish

The ALB hostname will appear in the `ADDRESS` column. A DNS record should point your
domain to that hostname. HTTPS requires an ACM certificate and an additional HTTPS
listener annotation before production use.

## Notes

- This is a starter Kubernetes setup.
- For production AWS deployment, use EKS or k3s on EC2.
- Replace image names with your real registry images.
- For secure production deployments, move secrets to AWS Secrets Manager / Kubernetes Secrets externally.
