# SingReality Production Deployment Guide

This guide describes how to deploy the SingReality platform across Google Kubernetes Engine (GKE), Vercel (or Google Cloud Run), and migrate away from Hostinger.

## 1. Migration from Hostinger (IP 217.196.55.144)
Hostinger typically provides a cPanel or basic VPS. For a WebRTC/LiveKit and 3D WebGL heavy application like SingReality, you must migrate to a scalable edge network and dedicated SFU clusters.

1. **Backup Hostinger Assets:** Connect via FTP to `217.196.55.144` and download any uploaded `splash_intro.mp4` or user assets.
2. **DNS Cutover:** Point `www.singreality.com` away from 217.196.55.144 to your new Vercel/Google Cloud Load Balancer IP.

## 2. Deploying the Frontend (Vercel / Google Cloud Run)

The application is built with Vite + React. 

### Option A: Vercel (Recommended for Edge Caching)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel login`
3. Run `vercel --prod` in the root of this project.
4. Set environment variables in the Vercel Dashboard (e.g. `VITE_FIREBASE_API_KEY`).

### Option B: Google Cloud Run (Recommended for containerization)
1. Build the Docker image: `docker build -t gcr.io/YOUR_PROJECT_ID/singreality:latest .`
2. Push the image: `docker push gcr.io/YOUR_PROJECT_ID/singreality:latest`
3. Deploy to Cloud Run:
   ```bash
   gcloud run deploy singreality \
     --image gcr.io/YOUR_PROJECT_ID/singreality:latest \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

## 3. Deploying LiveKit SFU to GKE (Multi-Region)

We use LiveKit for Quantum Sync and spatial/ambisonic audio.

1. Provision a GKE Cluster:
   ```bash
   gcloud container clusters create singreality-sfu-cluster \
     --region us-central1 \
     --num-nodes 3 \
     --machine-type e2-standard-4
   ```
2. Connect `kubectl` to your cluster:
   ```bash
   gcloud container clusters get-credentials singreality-sfu-cluster --region us-central1
   ```
3. Deploy LiveKit using the provided Helm values:
   ```bash
   helm repo add livekit https://helm.livekit.io
   helm repo update
   helm install livekit-sfu livekit/livekit-server \
     --namespace singreality \
     --create-namespace \
     -f deploy/livekit-values.yaml
   ```

## 4. Setting up NFT Collectibles & Web3
- Configure your Smart Contract deployer (e.g., Hardhat or Foundry).
- Deploy the `SingReality.sol` contract to your target chain (Ethereum/Polygon).
- The frontend will interact with users using ethers.js/wagmi and pin assets to Arweave/IPFS via Irys or Pinata.
