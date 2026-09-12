# 🔮 Vedic Jyotish Astrologer Platform (`jyotish-astro-app`)

Modern Vedic Astrology prediction platform built with **Svelte**, **Bootstrap 5**, **Node.js**, **MySQL**, and **Google Gemini AI**, fully containerized using **Docker** and automated with **Jenkins CI/CD** pipelines across 3 environments (**Dev**, **UAT**, **Prod**).

---

## 🏗️ Architecture & Tech Stack

### 1. **Frontend (UI/UX)**
- **Framework:** Svelte / SvelteKit
- **Styling:** Bootstrap 5 (Fancy astrology theme with dark night-sky aesthetics, glowing zodiac cards, responsive forms)
- **Features:**
  - Advanced Kundli Input Form (Full Name, Contact, DOB, TOB, POB with Lat/Long calculation)
  - Timeframe Selection (Next 3 Months, Next 1 Year, Whole Life)
  - Category Selection (Career, Finance, Health, Overall Prediction)
  - Interactive "Ask Your Jyotish" loader & rich prediction cards

### 2. **Backend Engine (Node.js REST API)**
- **Language:** Node.js (Express.js)
- **Mathematical Jyotish Engine:**
  - In-app mathematical calculation of planetary positions (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu).
  - Sidereal Zodiac (Lahiri Ayanamsa) calculations for Rashi, Nakshatra, Dasha predictions, and house placements.
- **AI Refinement Engine:**
  - Integrates **Google Gemini AI API** to refine mathematical Jyotish outputs into elegant, inspiring, authentic Vedic language without altering the core mathematical astrological meaning.
- **Database Layer:** MySQL (Stores user details, query parameters, short prediction summaries, and timestamp).

### 3. **DevOps & Deployment (AWS Free Tier Compatible)**
- **Containerization:** Docker & Docker Compose
- **CI/CD:** Jenkins Pipelines for 3 isolated environments:
  - **DEV:** Port `3001` (Auto-deploy on `dev` branch push)
  - **UAT:** Port `3002` (Auto-deploy on `uat` branch push)
  - **PROD:** Port `80` / `3000` (Manual/Approval deploy on `main` branch tag)
- **AWS Hosting:** Single EC2 Instance (t2/t3.micro) hosting Dev, UAT, Prod containers & MySQL container/RDS.

---

## 🚀 Environments Overview
| Environment | Port | Git Branch | Jenkins Pipeline |
|---|---|---|---|
| **Development (DEV)** | 3001 | `dev` | `Jenkinsfile.dev` |
| **Testing (UAT)** | 3002 | `uat` | `Jenkinsfile.uat` |
| **Production (PROD)** | 3000 / 80 | `main` | `Jenkinsfile.prod` |

---

## 🛠️ Project Structure
```text
jyotish-astro-app/
├── backend/                # Node.js + Express API & Math Jyotish Calculation Engine
│   ├── src/
│   │   ├── config/         # Database & Gemini AI config
│   │   ├── controllers/    # Request handlers
│   │   ├── jyotish/        # Mathematical planetary & Kundli calculation algorithms
│   │   ├── services/       # Gemini AI refinement service & DB service
│   │   └── index.js        # Express server entrypoint
│   ├── Dockerfile
│   └── package.json
├── frontend/               # Svelte App with Bootstrap 5 UI
│   ├── src/                # Svelte components & prediction view
│   ├── Dockerfile
│   └── package.json
├── jenkins/                # CI/CD Jenkinsfiles for Dev, UAT, Prod
│   ├── Jenkinsfile.dev
│   ├── Jenkinsfile.uat
│   └── Jenkinsfile.prod
├── docker-compose.yml       # Multi-container orchestration (Backend, Frontend, MySQL)
├── docker-compose.dev.yml
├── docker-compose.uat.yml
├── docker-compose.prod.yml
└── README.md
```
