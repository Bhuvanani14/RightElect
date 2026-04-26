# 🏛️ Right Elect - Intelligent Election Assistant

**Right Elect** is an interactive, mobile-first AI assistant designed to empower citizens by simplifying the electoral process. Build with modern web technologies, it provides a guided journey from understanding the basics to simulating the actual voting experience.

![Right Elect Banner](https://images.unsplash.com/photo-1540910419892-f0c9797c5673?q=80&w=1000&auto=format&fit=crop)

## ✨ Key Features

### 1. 🤖 Conversational Assistant (Chat)
- **Guided Flows**: Handles queries ranging from basic ("What is voting?") to complex ("How to register if I moved?").
- **Smart Suggestions**: Context-aware buttons that suggest the next logical step in your journey.
- **Tone**: Friendly, neutral, and encouraging civic participation.

### 2. 🗓️ Election Timeline Visualizer
- **Visual Stages**: Registration → Nominations → Campaigning → Voting → Results.
- **Deep Dives**: Click any stage for a detailed explanation of what happens and why it's important.

### 3. 🧾 Eligibility Checker
- **Quick Quiz**: A 30-second multi-step check to verify citizenship, age, and registration status.
- **Actionable Results**: Provides clear next steps (e.g., "Register now" or "Find your booth").

### 4. 🎮 Voting Simulator
- **Booth Walkthrough**: Experience stages like Verification, Indelible Ink, and the EVM compartment.
- **Interactive EVM/VVPAT**: A visual simulation of casting a vote and seeing the VVPAT slip verification.

### 5. 📍 Location-Aware Hub
- **Constituency Search**: Auto-detect or manually find your constituency.
- **Schedule Tracking**: Personalized election dates and countdowns for your specific area.

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Steps
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd RightElect
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
 - CI: a GitHub Actions workflow is included at `.github/workflows/ci.yaml` which runs lint and build. To enable smoke tests against your deployed Cloud Run service, set the repository secret `DEPLOYED_URL` to your Cloud Run URL.
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser. Use **Mobile View** (Cmd+Shift+M / F12) for the best experience.

---

## ☁️ Deployment to Google Cloud Run

To deploy Right Elect to Google Cloud Run, follow these steps:

### 1. Build the Container
Create a `Dockerfile` in the root (already included):
```dockerfile
FROM node:18-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npx", "serve", "-s", "dist", "-l", "8080"]
```

### 2. Deploy using gcloud CLI
```bash
# Set your project ID
gcloud config set project [YOUR_PROJECT_ID]

# Submit the build to Cloud Build
gcloud builds submit --tag gcr.io/[YOUR_PROJECT_ID]/right-elect

# Deploy to Cloud Run
gcloud run deploy right-elect \
  --image gcr.io/[YOUR_PROJECT_ID]/right-elect \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 🛠️ Technology Stack
- **Framework**: React.js with TypeScript
- **Styling**: Vanilla CSS (Premium Glassmorphism Design)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Tools**: Vite

## 🛡️ Trust & Safety
Right Elect is built on **verified election processes** as defined by the Election Commission of India. It maintains a strictly neutral, non-political stance and cites official sources for all critical information.

---
*Created with ❤️ for a stronger democracy.*
