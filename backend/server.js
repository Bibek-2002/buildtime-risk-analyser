import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Gemini - Using gemini-2.5-flash as specified
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Backend is running with Gemini AI! ✅' });
});

// Risk analysis endpoint with FULLY DYNAMIC Gemini AI
app.post('/api/analyze', async (req, res) => {
  try {
    const formData = req.body;
    
    // Input validation
    if (!formData.systemName || !formData.components) {
      return res.status(400).json({
        error: 'Missing required fields: systemName or components'
      });
    }

    console.log('📥 Received analysis request for:', formData.systemName);
    console.log('🤖 Sending to Gemini AI for analysis...\n');
    
    // Create COMPREHENSIVE prompt for Gemini - ALL DATA MUST BE DYNAMIC
    const prompt = `CRITICAL RULES:
- Respond with ONLY valid JSON
- No markdown, no comments, no explanations outside JSON
- Use MTTR strictly in "XX-YY" numeric format (e.g., "45-90")
- Use percentages with ~ prefix (e.g., "~87%")
- All numerical values should be realistic and vary based on input
- NO hardcoded or preset values - each response must be unique
- Use decimals for scores (e.g., 7.3, 8.5, not 7, 8)
- No trailing commas in JSON
- Generate realistic, non-round numbers
- Include specific technical details for this architecture

You are a senior system reliability engineer. Analyze this architecture and provide a detailed risk assessment.

System Architecture Details:
- System Name: ${formData.systemName}
- Components: ${formData.components}
- Database: ${formData.databases}
- Caching: ${formData.caching}
- Message Queue: ${formData.messageQueue}
- External APIs: ${formData.externalAPIs}
- Traffic Load: ${formData.trafficLoad}
- Auto-Scaling: ${formData.scaling}
- Redundancy: ${formData.redundancy}

Please analyze and provide:

1. Overall risk score (0-10, with decimal, where 10 is highest risk)

2. Top 3 failure scenarios with:
   - rank: number (1-3)
   - title: specific failure scenario name
   - firstFailure: which component fails first
   - impact: what happens
   - probability: string with ~ and % (e.g., "~87")
   - severity: "Critical" or "High"
   - mttr: string in "XX-YY" format (minutes)
   - affectedUsers: string with ~ and % (e.g., "~85%")
   - reasons: array of 3-4 specific reasons why it happens
   - fixes: array of 3-4 specific solutions

3. Component health scores (0-10 with decimal for each):
   - name: component name
   - score: decimal number 0-10
   - status: "critical" (score < 5), "warning" (5-7), "good" (> 7), or "missing" (score 0)
   - issues: number of issues
   - dependencies: number of dependencies

4. Top 4 recommendations with:
   - priority: number (1-4)
   - action: specific action
   - impact: "High" or "Medium"
   - effort: "High", "Medium", or "Low"
   - timeframe: string (e.g., "1-2 weeks")
   - costSaving: string with ~ and $ (e.g., "~$2,450/mo")

5. Traffic simulation data (7 data points) with:
   - time: string in format "Xh" (e.g., "0h", "2h", "4h", "6h", "8h", "10h", "12h")
   - normal: number (normal traffic, varying realistically)
   - spike: number (peak/spike traffic, varying realistically, should cause failure at some point)
   - spikeLabel: string for the legend (e.g., "3x Spike", "10x Burst")

6. Failure information:
   - failurePoint: string describing when system fails. THIS MUST correspond to the 'time' in trafficSimulation where the spike is highest or where the system would realistically fail based on the components.
   - failureComponent: which component fails at that point

7. Historical incidents (5 months) with:
   - month: string (e.g., "Jan", "Feb", "Mar", "Apr", "May")
   - incidents: number (varying realistically, 8-25 range)
   - severity: decimal number (4.0-9.0 range)
   - trend: string describing the trend

8. Risk distribution with:
   - category: string ("Infrastructure", "Dependencies", "Architecture", "Monitoring")
   - percentage: number (total must equal 100)
   - color: css color class ("bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500")

9. Key metrics:
   - totalScenarios: number
   - totalSPOF: number (single points of failure)
   - avgMTTR: number (average of scenario MTTRs)
   - projectedDowntime: number (hours per month)
   - totalSavings: string with ~ and $/K

10. AI Reasoning & Assumptions:
   - reasoning: array of 4-6 specific technical reasoning points for this specific architecture
   - assumptions: array of 5-7 specific assumptions made during this analysis

Respond in valid JSON format only:
{
  "riskScore": decimal_number,
  "scenarios": [
    {
      "rank": number,
      "title": "string",
      "firstFailure": "string",
      "impact": "string",
      "probability": "~XX",
      "severity": "Critical/High",
      "mttr": "XX-YY",
      "affectedUsers": "~XX%",
      "reasons": ["string", "string", "string"],
      "fixes": ["string", "string", "string"]
    }
  ],
  "components": [
    {
      "name": "string",
      "score": decimal_number,
      "status": "critical/warning/good/missing",
      "issues": number,
      "dependencies": number
    }
  ],
  "recommendations": [
    {
      "priority": number,
      "action": "string",
      "impact": "High/Medium",
      "effort": "High/Medium/Low",
      "timeframe": "string",
      "costSaving": "~$X,XXX/mo"
    }
  ],
  "trafficSimulation": [
    {
      "time": "Xh",
      "normal": number,
      "spike": number
    }
  ],
  "spikeLabel": "string",
  "failureInfo": {
    "failurePoint": "string",
    "failureComponent": "string"
  },
  "historicalIncidents": [
    {
      "month": "string",
      "incidents": number,
      "severity": decimal_number
    }
  ],
  "incidentTrend": "string",
  "riskDistribution": [
    {
      "category": "string",
      "percentage": number,
      "color": "bg-red-500/bg-orange-500/bg-yellow-500/bg-blue-500"
    }
  ],
  "metrics": {
    "totalScenarios": number,
    "totalSPOF": number,
    "avgMTTR": number,
    "projectedDowntime": number,
    "totalSavings": "~$X,XXX"
  },
  "aiReasoning": ["string"],
  "assumptions": ["string"]
}`;

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Received response from Gemini AI\n');
    
    // Parse JSON response
    let analysisData;
    try {
      // Remove markdown code blocks if present
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysisData = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('❌ Error parsing Gemini response:', parseError);
      console.log('Raw response:', text);
      
      // Fallback to calculated analysis if parsing fails
      analysisData = generateFallbackAnalysis(formData);
    }
    
    // Add metadata
    const finalAnalysis = {
      metadata: {
        generatedBy: 'Gemini AI (gemini-2.5-flash)',
        timestamp: new Date().toISOString().slice(0, 19).replace('T', ' ') + ' UTC',
        analysisId: `RAS-${Date.now()}`,
        confidenceLevel: analysisData.riskScore >= 7 ? 'High' : 'Medium',
        systemName: formData.systemName
      },
      ...analysisData
    };
    
    console.log('📊 Final Risk Score:', finalAnalysis.riskScore);
    console.log('🚨 Total Scenarios:', finalAnalysis.scenarios?.length || 0);
    console.log('🔧 Total Recommendations:', finalAnalysis.recommendations?.length || 0);
    console.log('✅ Analysis complete! Sending response...\n');
    
    res.json(finalAnalysis);
    
  } catch (error) {
    console.error('❌ Error during analysis:', error.message);
    
    // Fallback analysis if Gemini fails
    const fallbackData = generateFallbackAnalysis(req.body);
    res.json(fallbackData);
  }
});

// Normalize string access
const normalize = (v) => (v || '').toString().toLowerCase();

// Fallback analysis function (DYNAMIC fallback - only used if Gemini fails)
function generateFallbackAnalysis(data) {
  // Use data to seed randomness for better dynamicity
  const seedStr = (data.systemName || '') + (data.components || '') + (data.databases || '');
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
    hash |= 0;
  }
  
  const seededRandom = (min, max) => {
    const x = Math.sin(hash++) * 10000;
    const r = x - Math.floor(x);
    return min + (r * (max - min));
  };

  const riskScore = seededRandom(2, 9).toFixed(1);
  const compNames = (data.components || 'API,Database,Frontend').split(',').map(s => s.trim().split(' ')[0]).slice(0, 4);
  
  const trafficSim = Array.from({ length: 7 }, (_, i) => ({
    time: `${i * 2}h`,
    normal: Math.round(seededRandom(100, 500)),
    spike: Math.round(seededRandom(500, 2500))
  }));

  return {
    riskScore: parseFloat(riskScore),
    metadata: {
      generatedBy: 'Gemini AI (Fallback Engine)',
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' ') + ' UTC',
      analysisId: `RAS-${Date.now()}`,
      confidenceLevel: 'Low (Fallback)',
      systemName: data.systemName
    },
    scenarios: [
      {
        rank: 1,
        title: `Unexpected failure in ${compNames[0] || 'Primary'} component`,
        firstFailure: compNames[0] || 'Main Service',
        impact: 'Degraded system performance and partial outage',
        probability: `~${Math.round(seededRandom(40, 90))}%`,
        severity: seededRandom(0, 1) > 0.5 ? 'Critical' : 'High',
        mttr: `${Math.round(seededRandom(30, 60))}-${Math.round(seededRandom(60, 120))}`,
        affectedUsers: `~${Math.round(seededRandom(30, 95))}%`,
        reasons: [
          'Resource exhaustion under unexpected load',
          'Cascading failure from dependent services',
          'Insufficient health check monitoring'
        ],
        fixes: [
          'Implement automated horizontal scaling',
          'Add circuit breaker patterns',
          'Enhance observability and alerting'
        ]
      }
    ],
    components: compNames.map(name => ({
      name,
      score: seededRandom(3, 9).toFixed(1),
      status: seededRandom(0, 1) > 0.7 ? 'critical' : (seededRandom(0, 1) > 0.4 ? 'warning' : 'good'),
      issues: Math.floor(seededRandom(1, 10)),
      dependencies: Math.floor(seededRandom(1, 15))
    })),
    recommendations: [
      {
        priority: 1,
        action: `Scale ${compNames[0] || 'core'} services horizontally`,
        impact: 'High',
        effort: 'Medium',
        timeframe: '1-2 weeks',
        costSaving: `~$${Math.round(seededRandom(1000, 5000))}/mo`
      }
    ],
    trafficSimulation: trafficSim,
    spikeLabel: `${Math.round(seededRandom(3, 8))}x Spike`,
    failureInfo: {
      failurePoint: `${trafficSim[Math.floor(seededRandom(3, 6))].time} (${Math.round(seededRandom(1000, 3000))} req/s spike)`,
      failureComponent: compNames[0] || 'System'
    },
    historicalIncidents: ['Jan', 'Feb', 'Mar', 'Apr', 'May'].map(month => ({
      month,
      incidents: Math.floor(seededRandom(5, 20)),
      severity: seededRandom(3, 8).toFixed(1)
    })),
    incidentTrend: 'Fluctuating reliability patterns detected',
    riskDistribution: [
      { category: 'Infrastructure', percentage: 40, color: 'bg-red-500' },
      { category: 'Dependencies', percentage: 30, color: 'bg-orange-500' },
      { category: 'Architecture', percentage: 20, color: 'bg-yellow-500' },
      { category: 'Monitoring', percentage: 10, color: 'bg-blue-500' }
    ],
    metrics: {
      totalScenarios: 3,
      totalSPOF: Math.floor(seededRandom(1, 5)),
      avgMTTR: Math.round(seededRandom(40, 90)),
      projectedDowntime: Math.round(seededRandom(5, 25)),
      totalSavings: `~$${Math.round(seededRandom(5, 15))}K`
    },
    aiReasoning: [
      `Analysis of ${data.systemName} indicates potential bottlenecks in the ${compNames[0]} layer.`,
      'Resource utilization exceeds safety thresholds during peak traffic simulation.',
      'Single points of failure identified in the current deployment configuration.'
    ],
    assumptions: [
      'Standard cloud infrastructure SLAs are applicable.',
      'Network latency between components is within normal bounds.',
      'Current configuration reflects the production environment.'
    ]
  };
}

function calculateRiskScore(data) {
  let score = 0;
  if (normalize(data.databases).includes('single')) score += 2.5;
  if (normalize(data.caching).includes('none')) score += 1.5;
  if (normalize(data.messageQueue).includes('none')) score += 1.2;
  if (normalize(data.scaling).includes('no')) score += 1.8;
  if (normalize(data.redundancy).includes('no')) score += 2.0;
  if (normalize(data.externalAPIs).includes('synchronous')) score += 1.0;
  return Math.min(score, 10).toFixed(1);
}

app.listen(PORT, () => {
  console.log(`\n🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`🤖 Gemini AI integration: ${process.env.GEMINI_API_KEY ? 'ACTIVE ✅' : 'MISSING API KEY ❌'}`);
  console.log(`📡 Ready to receive analysis requests!\n`);
});