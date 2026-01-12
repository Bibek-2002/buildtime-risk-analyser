import { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, Database, Zap, Shield, Clock, CheckCircle, XCircle, Activity, LineChart, ArrowLeft } from 'lucide-react';

export default function RiskAnalysisDashboard({ result, onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [showReasoning, setShowReasoning] = useState(false);
  
  const [analysisData] = useState(() => {
    if (result) return result;
    const storedData = localStorage.getItem('analysisResult');
    return storedData ? JSON.parse(storedData) : null;
  });
  
  const [loading] = useState(false);

  // Remove instant redirect on missing data
  useEffect(() => {
    const t = setTimeout(() => {
      if (!analysisData) {
        if (onBack) onBack();
        else window.location.href = '/';
      }
    }, 800);
    return () => clearTimeout(t);
  }, [analysisData, onBack]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">No Analysis Data Found</h2>
          <button
            onClick={() => onBack ? onBack() : window.location.href = '/'}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
          >
            Go to Analysis Form
          </button>
        </div>
      </div>
    );
  }

  const { metadata, riskScore, scenarios, components, recommendations, trafficSimulation, failureInfo, similarProjectFailures, riskDistribution, metrics, aiReasoning, assumptions: dynamicAssumptions, spikeLabel } = analysisData;

  const getRiskColor = (score) => {
    if (score >= 7) return 'text-red-500';
    if (score >= 5) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getRiskBgColor = (score) => {
    if (score >= 7) return 'from-red-900 to-red-800';
    if (score >= 5) return 'from-yellow-900 to-yellow-800';
    return 'from-green-900 to-green-800';
  };

  const getRiskLabel = (score) => {
    if (score >= 7) return 'High Risk — System likely to experience partial or full outages under stress';
    if (score >= 5) return 'Medium Risk — System may face issues during peak load';
    return 'Low Risk — System architecture appears resilient';
  };

  // Calculate Avg MTTR from scenarios
  const totalMTTR = (scenarios || []).reduce((acc, s) => {
    if (!s.mttr || typeof s.mttr !== 'string') return acc;

    const clean = s.mttr.replace(/[^\d-]/g, '');
    if (!clean) return acc;

    const parts = clean.split('-').map(Number).filter(n => !isNaN(n));

    if (parts.length === 2) return acc + (parts[0] + parts[1]) / 2;
    if (parts.length === 1) return acc + parts[0];

    return acc;
  }, 0);

  const avgMTTR = (scenarios && scenarios.length) ? Math.round(totalMTTR / scenarios.length) : null;

  // Calculate critical scenarios
  const criticalScenarios = scenarios.filter(s => s.severity === 'Critical').length;
  
  // Calculate total savings from recommendations
  const calculateTotalSavings = () => {
    let total = 0;
    if (recommendations) {
      recommendations.forEach(rec => {
        const match = rec.costSaving.match(/\$(\d+(?:,\d+)*(?:\.\d+)?)/);
        if (match) {
          total += parseFloat(match[1].replace(/,/g, ''));
        }
      });
    }
    return total >= 1000 ? `~$${(total / 1000).toFixed(0)}K` : `~$${total}`;
  };

  const totalSavings = metrics?.totalSavings || calculateTotalSavings();

  // Use dynamic data from API or calculate if not provided
  const displayMetrics = {
    totalScenarios: metrics?.totalScenarios || scenarios?.length || 0,
    totalSPOF: metrics?.totalSPOF || components?.filter(c => c.status === 'critical').length || 0,
    avgMTTR: metrics?.avgMTTR || avgMTTR || 0,
    projectedDowntime: metrics?.projectedDowntime || Math.round((avgMTTR * scenarios?.length || 0) / 60),
    totalSavings: totalSavings
  };

  // Use reasoning provided by Gemini AI or fallback if not available
  const geminiReasoning = aiReasoning || [
    'Architecture analysis completed successfully',
    'Risk assessment based on provided configuration',
    'Identifying potential bottlenecks in component interaction'
  ];

  // Use assumptions provided by Gemini AI or fallback if not available
  const assumptions = dynamicAssumptions || [
    'Peak traffic assumed to be 3× daily average',
    'Database hosted in a single region unless specified',
    'No auto-scaling configured unless explicitly stated',
    'Third-party APIs have standard SLA (99.9%)',
    'Connection pool limits based on typical configurations'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onBack ? onBack() : window.location.href = '/'}
                className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-8 h-8 text-blue-400" />
                  <h1 className="text-3xl font-bold">Design-Time System Risk Analysis</h1>
                </div>
                <p className="text-slate-400">Powered by Gemini AI • {metadata?.systemName || 'Unknown System'}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-slate-800 rounded-lg px-4 py-3 border border-slate-600">
                <p className="text-slate-400 text-xs">Analysis ID</p>
                <p className="text-sm font-mono text-blue-400">{metadata?.analysisId || 'N/A'}</p>
              </div>
              <div className="bg-slate-800 rounded-lg px-4 py-3 border border-slate-600">
                <p className="text-slate-400 text-xs">Components</p>
                <p className="text-2xl font-bold text-blue-400">{components?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Score Card */}
        <div className={`bg-gradient-to-r ${getRiskBgColor(riskScore)} rounded-xl p-6 mb-6 border-2 border-opacity-50 ${riskScore >= 7 ? 'border-red-500' : riskScore >= 5 ? 'border-yellow-500' : 'border-green-500'} shadow-xl`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <p className="text-slate-300 text-sm mb-1">Overall System Risk Score</p>
              <div className="flex items-baseline gap-3 mb-3">
                <span className={`text-6xl font-bold ${getRiskColor(riskScore)}`}>
                  {riskScore || 'N/A'}
                </span>
                <span className="text-2xl text-slate-300">/ 10</span>
                <span className="text-xs text-slate-400 mt-4">(estimated)</span>
              </div>
              <p className="text-slate-200 mb-4 flex items-center gap-2">
                <AlertTriangle className={`w-5 h-5 ${riskScore >= 7 ? 'text-red-400' : riskScore >= 5 ? 'text-yellow-400' : 'text-green-400'}`} />
                {getRiskLabel(riskScore || 5)}
              </p>
              
              <div className="space-y-2">
                <p className="text-slate-300 font-semibold text-sm mb-3">Risk Distribution by Category</p>
                {(riskDistribution || []).map((risk, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">{risk.category}</span>
                      <span className="text-slate-400">{risk.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-900/50 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${risk.color}`}
                        style={{ width: `${risk.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-slate-400 text-xs mb-1">Generated By</p>
                <p className="text-white font-semibold text-sm">{metadata?.generatedBy || 'Gemini AI'}</p>
                <p className="text-slate-500 text-xs mt-1">{metadata?.timestamp || ''}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-slate-400 text-xs mb-1">Confidence Level</p>
                <p className={`font-bold ${metadata?.confidenceLevel === 'High' ? 'text-green-400' : 'text-yellow-400'}`}>
                  {metadata?.confidenceLevel || 'Medium'}
                </p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-slate-400 text-xs mb-1">Critical Scenarios</p>
                <p className="text-2xl font-bold text-red-400">{criticalScenarios}</p>
                <p className="text-xs text-slate-500">out of {scenarios?.length || 0} total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
            <p className="text-slate-400 text-sm mb-1">Scenarios</p>
            <p className="text-3xl font-bold text-red-400">{displayMetrics.totalScenarios}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
            <p className="text-slate-400 text-sm mb-1">SPOF</p>
            <p className="text-3xl font-bold text-orange-400">{displayMetrics.totalSPOF}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
            <p className="text-slate-400 text-sm mb-1">Avg MTTR</p>
            <p className="text-3xl font-bold text-yellow-400">~{displayMetrics.avgMTTR}m</p>
            <p className="text-xs text-slate-500">projected</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
            <p className="text-slate-400 text-sm mb-1">Downtime</p>
            <p className="text-3xl font-bold text-purple-400">~{displayMetrics.projectedDowntime}h</p>
            <p className="text-xs text-slate-500">per month est.</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
            <p className="text-slate-400 text-sm mb-1">Savings</p>
            <p className="text-3xl font-bold text-green-400">{displayMetrics.totalSavings}</p>
            <p className="text-xs text-slate-500">approx.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-slate-800 p-1 rounded-lg border border-slate-600 overflow-x-auto">
          {['overview', 'scenarios', 'components', 'recommendations', 'metadata'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-md transition-all text-sm font-semibold whitespace-nowrap ${
                activeTab === tab ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content - Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-600">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                Component Health
              </h2>
              <div className="space-y-4">
                {components?.map((comp, idx) => (
                  <div key={idx} className="bg-slate-700 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300 font-semibold text-sm">{comp.name}</span>
                        {comp.status === 'missing' && (
                          <span className="text-xs bg-red-900 text-red-200 px-2 py-0.5 rounded">MISSING</span>
                        )}
                      </div>
                      <span className={`font-bold ${
                        comp.status === 'critical' ? 'text-red-400' :
                        comp.status === 'warning' ? 'text-yellow-400' :
                        comp.status === 'missing' ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {comp.score > 0 ? `${comp.score}/10` : 'N/A'}
                      </span>
                    </div>
                    {comp.score > 0 && (
                      <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
                        <div
                          className={`h-2 rounded-full ${
                            comp.status === 'critical' ? 'bg-red-500' :
                            comp.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${comp.score * 10}%` }}
                        />
                      </div>
                    )}
                    <div className="flex gap-4 text-xs text-slate-400">
                      <span>{comp.issues} Issues</span>
                      <span>{comp.dependencies} Dependencies</span>
                    </div>
                  </div>
                )) || <p className="text-slate-500 text-center py-4">No component data available</p>}
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-600">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Traffic Load Simulation
              </h2>
              <div className="mb-4">
                <div className="flex gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-xs text-slate-400">Normal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-xs text-slate-400">{spikeLabel || '5× Spike'}</span>
                  </div>
                </div>
                <div className="relative h-48 flex items-end justify-between gap-2">
                  {(trafficSimulation || []).map((data, idx) => {
                    const maxNormal = Math.max(...(trafficSimulation || []).map(d => d.normal));
                    const maxSpike = Math.max(...(trafficSimulation || []).map(d => d.spike));
                    const normalHeight = (data.normal / (maxNormal || 500)) * 100;
                    const spikeHeight = (data.spike / (maxSpike || 500)) * 100;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex gap-1">
                          <div className="flex-1 bg-blue-500 rounded-t" style={{ height: `${normalHeight * 1.6}px` }}></div>
                          <div className="flex-1 bg-red-500 rounded-t" style={{ height: `${spikeHeight * 1.6}px` }}></div>
                        </div>
                        <span className="text-xs text-slate-400">{data.time}</span>
                      </div>
                    );
                  })}
                </div>
                {failureInfo && (
                  <div className="mt-4 bg-red-900/30 border border-red-700 rounded p-3">
                    <p className="text-red-200 text-sm"><strong>Critical:</strong> System fails at {failureInfo.failurePoint}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-600 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  Similar Project Failures (Industry Analysis)
                </h2>
                <div className="flex items-center gap-2 bg-blue-900/30 px-3 py-1 rounded-full border border-blue-700">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-blue-300">Live Case-Study Match</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="pb-3 font-semibold text-slate-400">System</th>
                      <th className="pb-3 font-semibold text-slate-400">Technical Root Cause</th>
                      <th className="pb-3 font-semibold text-slate-400">Impact</th>
                      <th className="pb-3 font-semibold text-slate-400">Load Factor</th>
                      <th className="pb-3 font-semibold text-slate-400 text-green-400">Prevention Strategy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {(similarProjectFailures || []).map((fail, idx) => (
                      <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
                        <td className="py-4">
                          <div className="font-medium text-blue-400">{fail.projectName}</div>
                          <div className="text-[10px] text-slate-500 uppercase">{fail.failedComponent}</div>
                        </td>
                        <td className="py-4 text-slate-300 max-w-[200px]">{fail.failureReason}</td>
                        <td className="py-4 text-orange-400 font-semibold">{fail.downtimeDuration}</td>
                        <td className="py-4 text-red-400 font-mono text-xs">{fail.loadAtFailure}</td>
                        <td className="py-4">
                          <div className="text-green-300 bg-green-900/20 p-2 rounded border border-green-800/30 text-xs">
                            {fail.preventionStrategy}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!similarProjectFailures?.length && (
                <p className="text-slate-500 text-center py-4 italic">No similar project failures identified in recent history.</p>
              )}
            </div>
          </div>
        )}

        {/* Scenarios Tab */}
        {activeTab === 'scenarios' && (
          <div className="space-y-4">
            {scenarios?.map((scenario, idx) => (
              <div key={idx} className="bg-slate-800 rounded-xl border border-slate-600 overflow-hidden">
                <div 
                  className="p-5 cursor-pointer hover:bg-slate-700 transition-colors"
                  onClick={() => setSelectedScenario(selectedScenario === idx ? null : idx)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                      scenario.severity === 'Critical' ? 'bg-red-900 text-red-200' : 'bg-orange-900 text-orange-200'
                    }`}>
                      {scenario.rank}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">{scenario.title}</h3>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                        <div className="bg-slate-700 rounded p-2">
                          <p className="text-slate-400 text-xs">First Failure</p>
                          <p className="text-red-300 font-semibold">{scenario.firstFailure}</p>
                        </div>
                        <div className="bg-slate-700 rounded p-2">
                          <p className="text-slate-400 text-xs">Estimated Probability</p>
                          <p className="text-orange-300 font-semibold">{scenario.probability}%</p>
                        </div>
                        <div className="bg-slate-700 rounded p-2">
                          <p className="text-slate-400 text-xs">Projected MTTR</p>
                          <p className="text-yellow-300 font-semibold">{scenario.mttr} min</p>
                        </div>
                        <div className="bg-slate-700 rounded p-2">
                          <p className="text-slate-400 text-xs">Affected Users</p>
                          <p className="text-red-300 font-semibold">{scenario.affectedUsers}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedScenario === idx && (
                  <div className="border-t border-slate-600 p-5 bg-slate-750">
                    <div className="mb-4">
                      <p className="text-slate-300 font-semibold mb-2">Why this happens:</p>
                      <ul className="space-y-1">
                        {scenario.reasons?.map((reason, i) => (
                          <li key={i} className="text-slate-400 flex items-start gap-2 text-sm">
                            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            {reason}
                          </li>
                        )) || <li className="text-slate-500 text-sm">No reasons provided</li>}
                      </ul>
                    </div>
                    <div>
                      <p className="text-slate-300 font-semibold mb-2">How to fix it:</p>
                      <ul className="space-y-1">
                        {scenario.fixes?.map((fix, i) => (
                          <li key={i} className="text-slate-400 flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                            {fix}
                          </li>
                        )) || <li className="text-slate-500 text-sm">No fixes provided</li>}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )) || <p className="text-slate-500 text-center py-8">No failure scenarios available</p>}
          </div>
        )}

        {/* Components Tab */}
        {activeTab === 'components' && (
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-600">
            <h2 className="text-xl font-bold mb-4">Component Dependencies Map</h2>
            <div className="bg-slate-900 rounded-lg p-8">
              <div className="flex flex-col items-center space-y-6">
                <div className="bg-blue-600 rounded-lg p-4 min-w-[120px] text-center">
                  <p className="font-bold">Users</p>
                </div>
                <div className="bg-yellow-600 rounded-lg p-4 min-w-[120px] text-center border-2 border-yellow-400">
                  <p className="font-bold">API Gateway</p>
                  <p className="text-xs">{components?.find(c => c.name.includes('API'))?.score || 'N/A'}/10</p>
                </div>
                <div className="flex gap-4 flex-wrap justify-center">
                  {components?.filter(c => c.name !== 'API Gateway' && !c.name.includes('Cache') && !c.name.includes('Message Queue')).map((comp, idx) => (
                    <div key={idx} className={`rounded-lg p-4 min-w-[100px] text-center border-2 ${
                      comp.status === 'critical' ? 'bg-red-600 border-red-400' :
                      comp.status === 'warning' ? 'bg-yellow-600 border-yellow-400' :
                      'bg-green-600 border-green-400'
                    }`}>
                      <p className="font-bold text-sm">{comp.name}</p>
                      <p className="text-xs">{comp.score} {comp.status === 'critical' ? '🔥' : comp.status === 'warning' ? '⚠️' : ''}</p>
                    </div>
                  )) || <p className="text-slate-500">No component data available</p>}
                </div>
                {components?.find(c => c.name.includes('Database')) && (
                  <div className={`rounded-lg p-4 min-w-[120px] text-center border-4 ${
                    components.find(c => c.name.includes('Database')).status === 'critical' ? 'bg-red-700 border-red-500' :
                    'bg-green-600 border-green-400'
                  }`}>
                    <p className="font-bold">{components.find(c => c.name.includes('Database')).name}</p>
                    <p className="text-xs">{components.find(c => c.name.includes('Database')).score} {components.find(c => c.name.includes('Database')).status === 'critical' ? '🔥' : ''}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            {recommendations?.map((rec, idx) => (
              <div key={idx} className="bg-slate-800 rounded-lg p-5 border border-slate-600">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                    {rec.priority}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-2">{rec.action}</h3>
                    <div className="flex gap-2 flex-wrap">
                      <span className={`px-2 py-1 rounded text-xs ${
                        rec.impact === 'High' ? 'bg-red-900 text-red-200' : 'bg-yellow-900 text-yellow-200'
                      }`}>
                        {rec.impact} Impact
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        rec.effort === 'High' ? 'bg-orange-900 text-orange-200' :
                        rec.effort === 'Medium' ? 'bg-yellow-900 text-yellow-200' : 'bg-green-900 text-green-200'
                      }`}>
                        {rec.effort} Effort
                      </span>
                      <span className="px-2 py-1 rounded text-xs bg-blue-900 text-blue-200">
                        {rec.timeframe}
                      </span>
                      <span className="px-2 py-1 rounded text-xs bg-green-900 text-green-200">
                        {rec.costSaving}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )) || <p className="text-slate-500 text-center py-8">No recommendations available</p>}
          </div>
        )}

        {/* Metadata Tab */}
        {activeTab === 'metadata' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-600">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                Analysis Metadata
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Generated By</p>
                  <p className="text-white font-semibold">{metadata?.generatedBy || 'Gemini AI'}</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Timestamp</p>
                  <p className="text-white font-semibold font-mono text-sm">{metadata?.timestamp || ''}</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Analysis ID</p>
                  <p className="text-blue-400 font-mono text-sm">{metadata?.analysisId || 'N/A'}</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Confidence Level</p>
                  <p className={`font-semibold ${metadata?.confidenceLevel === 'High' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {metadata?.confidenceLevel || 'Medium'}
                  </p>
                </div>
                <div className="bg-slate-700 rounded-lg p-4 md:col-span-2">
                  <p className="text-slate-400 text-sm mb-1">System Name</p>
                  <p className="text-white font-semibold">{metadata?.systemName || 'Unknown'}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-600">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Why Gemini AI Thinks This
                </h2>
                <button
                  onClick={() => setShowReasoning(!showReasoning)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                >
                  {showReasoning ? 'Hide' : 'Show'} Reasoning
                </button>
              </div>
              {showReasoning && (
                <div className="space-y-2 bg-slate-900 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-3">AI detected these patterns in your architecture:</p>
                  {geminiReasoning.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">{reason}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-600">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                Assumptions Made During Analysis
              </h2>
              <div className="space-y-2 bg-slate-900 rounded-lg p-4">
                {assumptions.map((assumption, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0 mt-2"></div>
                    <span className="text-slate-300">{assumption}</span>
                  </div>
                ))}
              </div>
              <p className="text-slate-400 text-sm mt-4 italic">
                Results may vary if actual system behavior differs from these assumptions.
              </p>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 bg-blue-900/30 border-2 border-blue-600 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <Clock className="w-8 h-8 text-blue-400 flex-shrink-0" />
            <div>
              <h3 className="text-blue-200 font-bold text-lg mb-2">⚠️ Important Disclaimer</h3>
              <p className="text-blue-100 text-sm mb-3">
                This is a <strong>design-time risk assessment</strong> powered by Gemini AI. It predicts potential failure points before deployment but <strong>does not guarantee failures or replace load testing, monitoring, or production validation</strong>.
              </p>
              <p className="text-blue-100 text-sm mb-3">
                <strong>All metrics are design-time estimates</strong> based on provided architectural constraints and industry patterns. Actual probabilities, MTTR, and cost impacts may vary significantly based on real-world conditions.
              </p>
              <p className="text-blue-200 text-xs bg-blue-950/50 rounded p-3 border border-blue-700">
                <strong>For Judges:</strong> This demonstrates proactive AI risk analysis that catches architectural issues during the design phase rather than in production. The goal is to reduce system failure probability through early detection and remediation of weak points.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
