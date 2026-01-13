# 🛡️ Design-Time Risk Analysis AI

> **Predict system failures before deployment using Gemini AI**

A full-stack application that analyzes software architecture and predicts potential failure scenarios, component vulnerabilities, and provides actionable recommendations - all powered by Google's Gemini 2.5 Flash AI model.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-blue?style=for-the-badge)](https://buildtime-risk-analyser.onrender.com)
[![Backend API](https://img.shields.io/badge/Backend%20API-Live-green?style=for-the-badge)](https://risk-analysis-backend.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

## 🎯 **What Does This Do?**

This tool helps software architects and developers identify potential system failures **before** they deploy to production. Instead of waiting for production incidents, get AI-powered insights during the design phase to build more resilient systems.

### **Key Features:**

- 🤖 **AI-Powered Analysis** - Leverages Gemini 2.5 Flash to analyze architecture patterns
- 📊 **Risk Scoring** - Provides 0-10 risk score with detailed breakdown
- 🔴 **Failure Scenario Prediction** - Identifies top 3 most likely failure scenarios with probability estimates
- 🏥 **Component Health Analysis** - Evaluates each component's resilience score
- 💡 **Smart Recommendations** - Generates prioritized actions with cost/time estimates
- 📈 **Traffic Load Simulation** - Visualizes system behavior under load spikes
- 📚 **Similar Project Failures** - Shows real-world examples of similar architecture failures
- 🎨 **Interactive Dashboard** - Beautiful, responsive UI with charts and metrics

---

## 🏗️ **Architecture**
```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────┐
│   React + Vite  │ ──────> │  Express.js API  │ ──────> │  Gemini AI  │
│    Frontend     │  HTTPS  │     Backend      │   API   │   2.5 Flash │
└─────────────────┘         └──────────────────┘         └─────────────┘
     Render                      Render                    Google AI
  (Static Site)               (Web Service)
```

**Frontend:** React 18 + Vite + Tailwind CSS 4  
**Backend:** Node.js 18 + Express + Gemini AI SDK  
**AI Model:** Gemini 2.5 Flash  
**Deployment:** Render (Static Site + Web Service)

---

## 🚀 **Live Demo**

**🌐 Try it now:** [https://buildtime-risk-analyser.onrender.com](https://buildtime-risk-analyser.onrender.com)

### **Quick Start Guide:**

1. **Choose an Example Architecture:**
   - 🔴 **High Risk Startup** - Single database, no caching, no redundancy
   - 🟡 **Medium SaaS** - Basic resilience with replicas and caching
   - 🟢 **Enterprise** - Full resilience with multi-AZ deployment

2. **Click "Analyze Architecture with Gemini AI"**

3. **View Comprehensive Dashboard:**
   - Overall risk score
   - Failure scenarios with MTTR estimates
   - Component health visualization
   - Traffic simulation charts
   - Prioritized recommendations
   - Similar project failures (learning from others)

---

## 🛠️ **Tech Stack**

### **Frontend**
- ⚛️ **React 18** - Modern UI library
- ⚡ **Vite** - Lightning-fast build tool
- 🎨 **Tailwind CSS 4** - Utility-first styling with @tailwindcss/vite
- 📦 **Axios** - HTTP client for API calls
- 🎯 **Lucide React** - Beautiful icon library

### **Backend**
- 🟢 **Node.js 18+** - JavaScript runtime
- 🚂 **Express.js** - Web application framework
- 🤖 **Google Generative AI SDK** - Gemini AI integration
- 🔐 **CORS** - Cross-origin resource sharing
- 📝 **dotenv** - Environment variable management

### **AI Model**
- 🧠 **Gemini 2.5 Flash** - Google's latest fast AI model
  - Fast response times (2-5 seconds)
  - Advanced reasoning capabilities
  - Context-aware analysis

---

## 💻 **Local Development Setup**

### **Prerequisites**
- Node.js 18+ installed ([Download](https://nodejs.org/))
- Gemini API Key ([Get one free](https://aistudio.google.com/app/apikey))
- Git installed

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
echo "FRONTEND_URL=http://localhost:5173" >> .env

# Start backend server
npm start
```

Backend will run on: `http://localhost:5000`

### **3. Setup Frontend** (in a new terminal)
```bash
cd frontend
npm install

# Create .env file (optional for local dev)
echo "VITE_API_URL=http://localhost:5000" > .env

# Start frontend dev server
npm run dev
```

Frontend will run on: `http://localhost:5173`

### **4. Test the Application**
1. Open `http://localhost:5173` in your browser
2. Click one of the example architecture buttons
3. Click "Analyze Architecture with Gemini AI"
4. Wait for analysis (2-5 seconds)
5. Explore the interactive dashboard!

---

## 🌐 **Deployment on Render**

This app is deployed using Render's free tier. Here's how to deploy your own:

### **Backend Deployment**

1. **Create Web Service** on [Render Dashboard](https://dashboard.render.com/)
2. **Connect GitHub Repository**
3. **Configuration:**
   - **Name:** `risk-analysis-backend` (or your choice)
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. **Environment Variables:**
   - **Key:** `GEMINI_API_KEY`  
     **Value:** Your Gemini API key
   - **Key:** `FRONTEND_URL`  
     **Value:** `https://your-frontend-url.onrender.com`

5. **Deploy** - Wait 5-10 minutes for first deployment

6. **Copy Backend URL** (e.g., `https://risk-analysis-backend-abc.onrender.com`)

---

### **Frontend Deployment**

1. **Update `frontend/src/App.jsx`** - Line 90:
```javascript
const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/analyze`, formData);
```

2. **Create Static Site** on Render
3. **Configuration:**
   - **Name:** `buildtime-risk-analyser`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Plan:** Free

4. **Environment Variables:**
   - **Key:** `VITE_API_URL`  
     **Value:** Your backend URL from step above

5. **Deploy** - Wait 5-10 minutes

6. **Update Backend CORS** - Add your frontend URL to `backend/server.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend-url.onrender.com'
  ].filter(Boolean),
  credentials: true
}));
```

7. **Push to GitHub** - Backend will auto-redeploy

---

## 📁 **Project Structure**
```
buildtime-risk-analyser/
├── backend/
│   ├── server.js              # Main Express server + Gemini AI integration
│   ├── package.json           # Backend dependencies
│   ├── .env                   # Environment variables (not in repo)
│   └── .gitignore             # Git ignore rules
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main form component with examples
│   │   ├── Dashboard.jsx      # Risk analysis dashboard
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Global styles (Tailwind)
│   ├── public/                # Static assets
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS config
│   └── index.html             # HTML template
│
├── README.md                  # This file
└── .gitignore                 # Root git ignore
```

---

## 🎨 **How It Works**

### **Step 1: Architecture Input**
Users describe their system architecture through a comprehensive form:
- **System Name** - Identifier for the analysis
- **Components** - All services (APIs, Auth, Payment, etc.)
- **Database Configuration** - Single instance, replicas, clustering
- **Caching Strategy** - Redis, Memcached, or none
- **Message Queue** - RabbitMQ, Kafka, SQS, or none
- **External APIs** - Third-party dependencies (sync/async)
- **Traffic Load** - Expected requests per second
- **Auto-Scaling** - Configuration details
- **Redundancy** - Failover and backup strategies

### **Step 2: AI Analysis**
Backend constructs a detailed prompt and sends to Gemini AI:
1. Analyzes architecture patterns and anti-patterns
2. Identifies single points of failure (SPOF)
3. Calculates risk scores for each component
4. Predicts top 3 failure scenarios with probabilities
5. Generates MTTR (Mean Time To Recovery) estimates
6. Simulates traffic behavior under load
7. Finds similar project failures from knowledge base
8. Creates prioritized recommendations with ROI estimates

### **Step 3: Results Dashboard**
Frontend displays comprehensive analysis:
- **Risk Score Card** - Overall 0-10 score with confidence level
- **Key Metrics** - Scenarios, SPOF count, MTTR, downtime projections
- **Failure Scenarios** - Expandable cards with reasons and fixes
- **Component Health** - Visual dependency map with scores
- **Traffic Simulation** - Chart showing normal vs spike behavior
- **Similar Failures** - Real-world examples to learn from
- **Recommendations** - Prioritized by impact, effort, and ROI
- **AI Reasoning** - Transparency into analysis logic

---

## 📊 **Example Analysis Output**

### **Input: High Risk Startup**
```
System: E-commerce Platform v2.0
Database: PostgreSQL (single instance, no replicas)
Caching: None
Message Queue: None
Scaling: No auto-scaling configured
```

### **Output:**
```json
{
  "riskScore": 8.2,
  "scenarios": [
    {
      "rank": 1,
      "title": "Database Overwhelmed Under Peak Load",
      "probability": "~87%",
      "severity": "Critical",
      "mttr": "45-90 min",
      "affectedUsers": "~95%"
    }
  ],
  "components": [
    {
      "name": "PostgreSQL (Single)",
      "score": 2.8,
      "status": "critical"
    }
  ],
  "recommendations": [
    {
      "priority": 1,
      "action": "Add database read replicas (2-3 replicas)",
      "impact": "High",
      "effort": "Medium",
      "timeframe": "1-2 weeks",
      "costSaving": "~$3,450/mo"
    }
  ]
}
```

---

## 🔐 **Environment Variables**

### **Backend (`backend/.env`)**
```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional (for production)
PORT=5000
FRONTEND_URL=https://your-frontend-url.onrender.com
```

### **Frontend (`frontend/.env`)** *(Optional)*
```env
# Backend API URL (defaults to localhost:5000)
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## 🤝 **Contributing**

Contributions are welcome! Here's how you can help:

### **Ways to Contribute:**
1. 🐛 **Report Bugs** - Open an issue with details
2. ✨ **Suggest Features** - Share your ideas
3. 📝 **Improve Documentation** - Fix typos, add examples
4. 🔧 **Submit Pull Requests** - Fix bugs or add features

### **Development Workflow:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Test locally (both frontend and backend)
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

---

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 **Author**

**Bibek Kumar**

- GitHub: [@Bibek-2002](https://github.com/Bibek-2002)
- Project: [buildtime-risk-analyser](https://github.com/Bibek-2002/buildtime-risk-analyser)
- Live Demo: [https://buildtime-risk-analyser.onrender.com](https://buildtime-risk-analyser.onrender.com)

---

## 🙏 **Acknowledgments**

- **Google Gemini AI** - For powering intelligent architecture analysis
- **Render** - For free hosting infrastructure
- **Tailwind CSS** - For beautiful, responsive UI components
- **Lucide Icons** - For clean, modern icons
- **Vite** - For lightning-fast development experience

---

## 🐛 **Known Issues & Troubleshooting**

### **Issue: Backend fails to start**
**Solution:**
- Ensure `GEMINI_API_KEY` is set in `.env` file
- Check Node.js version: `node --version` (must be 18+)
- Verify API key is valid at [Google AI Studio](https://aistudio.google.com/)

### **Issue: CORS errors in browser console**
**Solution:**
- Check `backend/server.js` CORS configuration includes your frontend URL
- Ensure both frontend and backend are deployed and showing "Live" status
- Clear browser cache and try again

### **Issue: "Analysis failed" message**
**Solution:**
- Check if backend is running (visit backend URL in browser)
- Open browser DevTools (F12) → Console tab for error details
- Verify `VITE_API_URL` is set correctly in frontend
- Check backend logs in Render dashboard

### **Issue: Build fails on Render**
**Solution:**
- Ensure all dependencies are listed in `package.json`
- Check Render build logs for specific error messages
- Verify Node.js version in `package.json` engines field
- For frontend: Ensure `dist` is the publish directory

### **Issue: Gemini API rate limits**
**Solution:**
- Free tier has rate limits (requests per minute)
- Wait a few minutes before retrying
- Consider upgrading to paid tier for production use
- Implement request queuing in backend

### **Issue: First request takes 30+ seconds**
**Solution:**
- Render free tier puts services to sleep after 15 minutes of inactivity
- First request "wakes up" the service (cold start)
- Subsequent requests are fast (2-5 seconds)
- Upgrade to paid tier for always-on services

---

## 📈 **Future Enhancements**

### **Planned Features:**
- [ ] **User Authentication** - Save and manage multiple analyses
- [ ] **PDF Export** - Download analysis reports
- [ ] **Comparison Mode** - Compare different architecture versions
- [ ] **CI/CD Integration** - GitHub Actions workflow for automated analysis
- [ ] **More AI Models** - Support for Claude, GPT-4, etc.
- [ ] **Real-time Collaboration** - Multiple users analyzing together
- [ ] **Custom Risk Thresholds** - Configurable risk parameters
- [ ] **Historical Tracking** - Track risk scores over time
- [ ] **Integration APIs** - REST API for external tools
- [ ] **Slack/Discord Notifications** - Alert on high-risk detections

### **Want to Contribute?**
Pick an item from the list above and open a PR! 🚀

---

## 📚 **API Documentation**

### **POST /api/analyze**

Analyzes system architecture and returns risk assessment.

**Request Body:**
```json
{
  "systemName": "string",
  "components": "string",
  "databases": "string",
  "caching": "string",
  "messageQueue": "string",
  "externalAPIs": "string",
  "trafficLoad": "string",
  "scaling": "string",
  "redundancy": "string"
}
```

**Response:**
```json
{
  "metadata": {
    "generatedBy": "Gemini AI (gemini-2.5-flash)",
    "timestamp": "2024-01-13 10:30:00 UTC",
    "analysisId": "RAS-1705144200000",
    "confidenceLevel": "High",
    "systemName": "E-commerce Platform"
  },
  "riskScore": 7.8,
  "scenarios": [...],
  "components": [...],
  "recommendations": [...],
  "trafficSimulation": [...],
  "similarProjectFailures": [...],
  "riskDistribution": [...],
  "metrics": {...},
  "aiReasoning": [...],
  "assumptions": [...]
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing required fields
- `500` - Server error (fallback analysis returned)

---

## 🌟 **Star History**

If you find this project helpful, please consider giving it a ⭐ on GitHub!

[![Star History Chart](https://api.star-history.com/svg?repos=Bibek-2002/buildtime-risk-analyser&type=Date)](https://star-history.com/#Bibek-2002/buildtime-risk-analyser&Date)

---

## 💬 **Support**

Need help? Have questions?

- 📧 Open an [Issue](https://github.com/Bibek-2002/buildtime-risk-analyser/issues)
- 💬 Start a [Discussion](https://github.com/Bibek-2002/buildtime-risk-analyser/discussions)
- 🌐 Try the [Live Demo](https://buildtime-risk-analyser.onrender.com)

---

## ⭐ **Show Your Support**

Give a ⭐️ if this project helped you build more resilient systems!

**Live Demo:** [https://buildtime-risk-analyser.onrender.com](https://buildtime-risk-analyser.onrender.com)

---

<div align="center">

**Made with ❤️ using Gemini AI**

[Report Bug](https://github.com/Bibek-2002/buildtime-risk-analyser/issues) · [Request Feature](https://github.com/Bibek-2002/buildtime-risk-analyser/issues) · [Live Demo](https://buildtime-risk-analyser.onrender.com)

</div>