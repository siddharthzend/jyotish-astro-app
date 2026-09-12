# Kubernetes Deployment Notes

This repository now includes a Kubernetes structure for AWS deployment on a single
EC2 instance running k3s.

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

The base manifest uses the Traefik Ingress Controller bundled with k3s. `/api` routes
to the backend and `/` routes to the frontend. The EC2 security group must allow TCP
ports 80 and 443 from the intended clients.

Apply it on the EC2 k3s node with:

kubectl apply -k k8s/overlays/dev
kubectl get ingress -n jyotish

The public address is the EC2 public IP or DNS name. A DNS A record should point your
domain to that address. HTTPS can be added with a DNS challenge and a cert-manager
ClusterIssuer after HTTP is working.

## Notes

- This is a starter Kubernetes setup.
- For production AWS deployment, use EKS or k3s on EC2.
- Replace image names with your real registry images.
- For secure production deployments, move secrets to AWS Secrets Manager / Kubernetes Secrets externally.
