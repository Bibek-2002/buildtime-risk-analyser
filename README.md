# 🛡️ Design-Time Risk Analysis AI

> **Predict system failures before deployment using Gemini AI**

A full-stack application that analyzes software architecture and predicts potential failure scenarios, component vulnerabilities, and provides actionable recommendations - all powered by Google's Gemini AI.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-blue?style=for-the-badge)](https://buildtime-risk-analyser.onrender.com)
[![Backend API](https://img.shields.io/badge/Backend%20API-Live-green?style=for-the-badge)](https://risk-analysis-backend.onrender.com)

---

## 🎯 **What Does This Do?**

This tool helps architects and developers identify potential system failures **before** they deploy to production. Instead of waiting for production incidents, get AI-powered insights during the design phase.

### **Key Features:**

- 🤖 **AI-Powered Analysis** - Uses Gemini AI to analyze architecture patterns
- 📊 **Risk Scoring** - Get a 0-10 risk score based on your architecture
- 🔴 **Failure Scenarios** - Predicts top 3 most likely failure scenarios with probability
- 🏥 **Component Health** - Analyzes each component's resilience score
- 💡 **Smart Recommendations** - Get prioritized actions with cost/time estimates
- 📈 **Traffic Simulation** - Visualize how your system handles load spikes
- 🎨 **Interactive Dashboard** - Beautiful UI with charts and metrics

---

## 🏗️ **Architecture**
```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────┐
│   React + Vite  │ ──────> │  Express.js API  │ ──────> │  Gemini AI  │
│    Frontend     │  HTTPS  │     Backend      │   API   │   Analysis  │
└─────────────────┘         └──────────────────┘         └─────────────┘
```

**Frontend:** React 18 + Vite + Tailwind CSS  
**Backend:** Node.js + Express + Gemini 2.5 Flash  
**Deployment:** Render (Static Site + Web Service)

---

## 🚀 **Live Demo**

**Try it now:** [https://buildtime-risk-analyser.onrender.com](https://buildtime-risk-analyser.onrender.com)

### **Quick Start Guide:**

1. Click one of the example architectures:
   - 🔴 **High Risk Startup** - Single database, no caching, no redundancy
   - 🟡 **Medium SaaS** - Basic resilience with replicas
   - 🟢 **Enterprise** - Full resilience with multi-AZ deployment

2. Click **"Analyze Architecture with Gemini AI"**

3. View comprehensive risk analysis dashboard

---

## 🛠️ **Tech Stack**

### **Frontend**
- ⚛️ React 18
- ⚡ Vite
- 🎨 Tailwind CSS 4
- 📦 Axios
- 🎯 Lucide Icons

### **Backend**
- 🟢 Node.js 18+
- 🚂 Express.js
- 🤖 Google Generative AI SDK
- 🔐 CORS
- 📝 dotenv

### **AI Model**
- 🧠 **Gemini 2.5 Flash** - Fast, intelligent analysis

---

## 💻 **Local Development Setup**

### **Prerequisites**
- Node.js 18+ installed
- Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))
- Git

### **1. Clone the Repository**
```bash
git clone https://github.com/Bibek-2002/buildtime-risk-analyser.git
cd buildtime-risk-analyser
```

### **2. Setup Backend**
```bash
cd backend
npm install

# Create .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Start backend
npm start
```

Backend runs on: `http://localhost:5000`

### **3. Setup Frontend**
```bash
cd ../frontend
npm install

# Start frontend
npm run dev
```

Frontend runs on: `http://localhost:5173`

### **4. Test the App**
Open `http://localhost:5173` in your browser and try the examples!

---

## 🌐 **Deployment on Render**

### **Backend Deployment**

1. **Create Web Service** on Render
2. **Configuration:**
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variable:** `GEMINI_API_KEY=your_key`

### **Frontend Deployment**

1. **Create Static Site** on Render
2. **Configuration:**
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

3. **Update `App.jsx`** with your backend URL:
```javascript
const response = await axios.post('https://your-backend.onrender.com/api/analyze', formData);
```

4. **Update Backend CORS** in `server.js`:
```javascript
app.use(cors({
  origin: 'https://your-frontend.onrender.com'
}));
```

---

## 📁 **Project Structure**
```
buildtime-risk-analyser/
├── backend/
│   ├── server.js           # Express API + Gemini integration
│   ├── package.json        # Backend dependencies
│   └── .env               # API keys (not in repo)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main form component
│   │   ├── Dashboard.jsx  # Analysis dashboard
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Tailwind styles
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
│
└── README.md              # You are here!
```

---

## 🎨 **How It Works**

### **1. Architecture Input**
User describes their system architecture:
- Components (API, Database, Frontend, etc.)
- Database configuration (single/replicas)
- Caching strategy
- Message queues
- External API dependencies
- Traffic load expectations
- Auto-scaling setup
- Redundancy/failover mechanisms

### **2. AI Analysis**
Backend sends structured prompt to Gemini AI:
- Analyzes architecture patterns
- Identifies single points of failure (SPOF)
- Calculates risk scores for each component
- Predicts failure scenarios with probabilities
- Generates MTTR (Mean Time To Recovery) estimates

### **3. Results Dashboard**
Frontend displays:
- Overall risk score (0-10)
- Top 3 failure scenarios with fixes
- Component health visualization
- Traffic load simulation
- Historical incident trends
- Prioritized recommendations
- AI reasoning and assumptions

---

## 📊 **Example Analysis Output**
```json
{
  "riskScore": 7.8,
  "scenarios": [
    {
      "rank": 1,
      "title": "Database Overwhelmed Under Peak Load",
      "probability": "~87%",
      "mttr": "45-90 min",
      "affectedUsers": "~95%"
    }
  ],
  "components": [
    {
      "name": "PostgreSQL (Single)",
      "score": 3.2,
      "status": "critical"
    }
  ],
  "recommendations": [
    {
      "priority": 1,
      "action": "Add database read replicas",
      "impact": "High",
      "costSaving": "~$3,450/mo"
    }
  ]
}
```

---

## 🔐 **Environment Variables**

### **Backend (.env)**
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

### **Frontend (.env)** *(optional for local dev)*
```env
VITE_API_URL=http://localhost:5000
```

---

## 🤝 **Contributing**

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 **Author**

**Bibek Kumar**

- GitHub: [@Bibek-2002](https://github.com/Bibek-2002)
- Project: [buildtime-risk-analyser](https://github.com/Bibek-2002/buildtime-risk-analyser)

---

## 🙏 **Acknowledgments**

- **Google Gemini AI** - For powering the intelligent analysis
- **Render** - For hosting infrastructure
- **Tailwind CSS** - For beautiful UI components
- **Lucide React** - For amazing icons

---

## 🐛 **Known Issues & Troubleshooting**

### **Backend fails to start**
- Ensure `GEMINI_API_KEY` is set in environment variables
- Check Node.js version (must be 18+)

### **CORS errors in browser**
- Verify backend CORS configuration includes your frontend URL
- Check that both services are deployed and live

### **Build fails on Render**
- Ensure all dependencies are in `package.json`
- Check build logs for specific errors

### **Gemini API rate limits**
- Free tier has request limits
- Consider upgrading to paid tier for production use

---

## 📈 **Future Enhancements**

- [ ] User authentication and saved analyses
- [ ] Export reports to PDF
- [ ] Real-time collaboration features
- [ ] Integration with CI/CD pipelines
- [ ] Support for more AI models (Claude, GPT-4)
- [ ] Historical analysis comparison
- [ ] Custom risk thresholds

---

## ⭐ **Star this repo if you found it helpful!**

**Live Demo:** [https://buildtime-risk-analyser.onrender.com](https://buildtime-risk-analyser.onrender.com)

---

Made with ❤️ using Gemini AI
