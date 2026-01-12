import { useState } from 'react';
import { Shield, Zap, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import axios from 'axios';
import Dashboard from './Dashboard';

export default function App() {
  const [step, setStep] = useState('form'); // 'form', 'loading', 'results', 'dashboard'
  const [analysisResult, setAnalysisResult] = useState(null);
  const [formData, setFormData] = useState({
    systemName: '',
    components: '',
    databases: '',
    caching: '',
    messageQueue: '',
    externalAPIs: '',
    trafficLoad: '',
    scaling: '',
    redundancy: ''
  });

  if (step === 'dashboard') {
    return <Dashboard result={analysisResult} onBack={() => setStep('results')} />;
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const loadExample = (type) => {
    const examples = {
      startup: {
        systemName: 'E-commerce Platform v2.0',
        components: 'React frontend, Node.js API (single instance), Auth service, Payment service, Notification service',
        databases: 'PostgreSQL (single instance, no replicas)',
        caching: 'None',
        messageQueue: 'None',
        externalAPIs: 'Stripe for payments (synchronous), SendGrid for emails (synchronous)',
        trafficLoad: '500 requests per second at peak',
        scaling: 'No auto-scaling configured',
        redundancy: 'No redundancy - all services are single instance'
      },
      medium: {
        systemName: 'SaaS Platform v1.5',
        components: 'React frontend, 3× Node.js API instances, Auth service, Payment service, Email service',
        databases: 'PostgreSQL (1 primary + 2 read replicas)',
        caching: 'Redis for sessions and frequently accessed data',
        messageQueue: 'RabbitMQ for email notifications',
        externalAPIs: 'Stripe (async via queue), AWS S3, Twilio',
        trafficLoad: '2000 requests per second at peak',
        scaling: 'Auto-scaling for API (min 3, max 10 instances)',
        redundancy: 'Database replicas, load-balanced API instances'
      },
      enterprise: {
        systemName: 'Enterprise Financial Platform',
        components: 'React + Next.js frontend (CDN), 5-20 auto-scaling API instances, Microservices architecture',
        databases: 'PostgreSQL cluster (1 primary + 3 replicas), MongoDB for analytics',
        caching: 'Multi-layer caching: Redis L1, Memcached L2, CDN edge caching',
        messageQueue: 'Apache Kafka for event streaming, AWS SQS for async tasks',
        externalAPIs: 'All external APIs behind circuit breakers with fallback mechanisms',
        trafficLoad: '10,000+ requests per second, burst capability to 50k',
        scaling: 'Full auto-scaling with health checks, load balancing, and auto-recovery',
        redundancy: 'Multi-AZ deployment, automatic failover, backup systems in place'
      }
    };
    setFormData(examples[type]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStep('loading');

    try {
      // Call backend API
      const response = await axios.post('https://risk-analysis-backend.onrender.com/api/analyze', formData);
      
      // Store the analysis result
      setAnalysisResult(response.data);
      localStorage.setItem('analysisResult', JSON.stringify(response.data));
      
      // Simulate processing time
      setTimeout(() => {
        setStep('results');
      }, 2000);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Analysis failed! Make sure your backend is running on port 5000');
      setStep('form');
    }
  };

  // LOADING SCREEN
  if (step === 'loading') {
    const loadingMessages = [
      `Analyzing components for ${formData.systemName}...`,
      `Evaluating ${formData.databases || 'database'} resilience...`,
      `Checking ${formData.externalAPIs ? 'external API' : 'dependency'} risk factors...`,
      `Simulating ${formData.trafficLoad || 'peak'} traffic load...`,
      'Calculating cascading failure probabilities...',
      'Generating mitigation recommendations...'
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <Loader2 className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Gemini AI is Analyzing Your Architecture...</h2>
          <div className="space-y-3 text-slate-400 mt-8">
            {loadingMessages.map((msg, i) => (
              <p key={i} className={`flex items-center gap-2 justify-center transition-opacity duration-500`} style={{ opacity: 1 - (i * 0.15) }}>
                {i < 2 ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Loader2 className="w-4 h-4 animate-spin text-blue-400" />}
                {msg}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // RESULTS SCREEN
  if (step === 'results' && analysisResult) {
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-green-900/30 border-2 border-green-600 rounded-xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-3">Analysis Complete! ✅</h2>
            <p className="text-lg text-slate-300 mb-6">
              Risk Score: <span className="text-4xl font-bold text-red-400">{analysisResult.riskScore || 'N/A'}</span> / 10
            </p>
            
            <div className="bg-slate-800 rounded-lg p-6 text-left mb-6">
              <h3 className="font-bold text-lg mb-3">📊 Analysis Summary</h3>
              <div className="space-y-2 text-sm">
                <p>✓ <strong>{analysisResult.scenarios?.length || 0}</strong> failure scenarios identified</p>
                <p>✓ <strong>{analysisResult.components?.length || 0}</strong> components analyzed</p>
                <p>✓ <strong>{analysisResult.recommendations?.length || 0}</strong> recommendations generated</p>
                <p>✓ Analysis ID: <span className="font-mono text-blue-400">{analysisResult.metadata?.analysisId || 'N/A'}</span></p>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setStep('form')}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
              >
                ← Analyze Another System
              </button>
              <button
                onClick={() => setStep('dashboard')}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold"
              >
                View Full Dashboard →
              </button>
            </div>

            <div className="mt-6 bg-blue-900/30 border border-blue-600 rounded-lg p-4 text-sm text-left">
              <p className="text-blue-200">
                <strong>💡 Next Steps:</strong> The detailed risk analysis dashboard shows failure scenarios, 
                component health, recommendations, and AI reasoning. Open it to see the complete analysis!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // FORM SCREEN
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Shield className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl font-bold">Design-Time Risk Analysis</h1>
          </div>
          <p className="text-slate-400 text-lg">Powered by Gemini AI • Predict failures before deployment</p>
        </div>

        {/* Quick Examples */}
        <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-600">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Try Example Architecture
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => loadExample('startup')}
              type="button"
              className="bg-gradient-to-br from-red-900/40 to-red-800/40 hover:from-red-900/60 hover:to-red-800/60 border border-red-600 rounded-lg p-4 text-left transition-all"
            >
              <p className="font-bold mb-1">🔴 High Risk Startup</p>
              <p className="text-xs text-slate-300">Single DB, no caching, no redundancy</p>
              <p className="text-xs text-red-400 mt-2">Design-Time Estimate: High Risk</p>
            </button>
            <button
              onClick={() => loadExample('medium')}
              type="button"
              className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/40 hover:from-yellow-900/60 hover:to-yellow-800/60 border border-yellow-600 rounded-lg p-4 text-left transition-all"
            >
              <p className="font-bold mb-1">🟡 Medium SaaS</p>
              <p className="text-xs text-slate-300">DB replicas, some caching</p>
              <p className="text-xs text-yellow-400 mt-2">Design-Time Estimate: Medium Risk</p>
            </button>
            <button
              onClick={() => loadExample('enterprise')}
              type="button"
              className="bg-gradient-to-br from-green-900/40 to-green-800/40 hover:from-green-900/60 hover:to-green-800/60 border border-green-600 rounded-lg p-4 text-left transition-all"
            >
              <p className="font-bold mb-1">🟢 Enterprise</p>
              <p className="text-xs text-slate-300">Full resilience, multi-AZ</p>
              <p className="text-xs text-green-400 mt-2">Design-Time Estimate: Low Risk</p>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl p-6 border border-slate-600">
          <h2 className="text-xl font-bold mb-4">Describe Your System Architecture</h2>
          
          <div className="space-y-4">
            {/* System Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                System Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.systemName}
                onChange={(e) => handleInputChange('systemName', e.target.value)}
                placeholder="e.g., E-commerce Platform v2.0"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Components */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Components & Services <span className="text-red-400">*</span>
              </label>
              <textarea
                value={formData.components}
                onChange={(e) => handleInputChange('components', e.target.value)}
                placeholder="e.g., React frontend, Node.js API (single instance), Auth service, Payment service, Notification service"
                rows="3"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-slate-500 mt-1">List all your services and mention if they're single instance or multiple</p>
            </div>

            {/* Database Configuration */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Database Configuration <span className="text-red-400">*</span>
              </label>
              <textarea
                value={formData.databases}
                onChange={(e) => handleInputChange('databases', e.target.value)}
                placeholder="e.g., PostgreSQL (single instance, no replicas) OR PostgreSQL (1 primary + 2 read replicas)"
                rows="2"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-slate-500 mt-1">Mention: single instance, replicas, clustering, backup strategy</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Caching */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Caching Strategy <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.caching}
                  onChange={(e) => handleInputChange('caching', e.target.value)}
                  placeholder="e.g., None OR Redis for sessions"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Message Queue */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Message Queue <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.messageQueue}
                  onChange={(e) => handleInputChange('messageQueue', e.target.value)}
                  placeholder="e.g., None OR RabbitMQ for emails"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* External APIs */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                External API Dependencies <span className="text-red-400">*</span>
              </label>
              <textarea
                value={formData.externalAPIs}
                onChange={(e) => handleInputChange('externalAPIs', e.target.value)}
                placeholder="e.g., Stripe for payments (synchronous), SendGrid for emails (synchronous)"
                rows="2"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-slate-500 mt-1">Mention: service name and if calls are synchronous or asynchronous</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Traffic Load */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Expected Traffic Load <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.trafficLoad}
                  onChange={(e) => handleInputChange('trafficLoad', e.target.value)}
                  placeholder="e.g., 500 requests/second at peak"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Auto-Scaling */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Auto-Scaling Configuration <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.scaling}
                  onChange={(e) => handleInputChange('scaling', e.target.value)}
                  placeholder="e.g., No auto-scaling OR Auto-scales 3-10"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Redundancy */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Redundancy & Failover Strategy <span className="text-red-400">*</span>
              </label>
              <textarea
                value={formData.redundancy}
                onChange={(e) => handleInputChange('redundancy', e.target.value)}
                placeholder="e.g., No redundancy - all services single instance OR Multi-AZ deployment with automatic failover"
                rows="2"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-slate-500 mt-1">Describe backup systems, failover mechanisms, multi-region deployment</p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 text-lg"
          >
            <Zap className="w-6 h-6" />
            Analyze Architecture with Gemini AI
            <ArrowRight className="w-6 h-6" />
          </button>
        </form>

        {/* Tips */}
        <div className="mt-6 bg-blue-900/30 border border-blue-600 rounded-lg p-4 text-sm text-blue-200">
          <strong>💡 Pro Tips for Accurate Analysis:</strong>
          <ul className="mt-2 space-y-1 ml-4 list-disc">
            <li>Mention "single instance" or "no replicas" for databases to flag risks</li>
            <li>Specify if API calls to external services are "synchronous" or "asynchronous"</li>
            <li>Write "None" for caching/queues if you don't have them (AI will flag as risk)</li>
            <li>Be specific about scaling: "No auto-scaling" vs "Scales 3-10 instances"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
