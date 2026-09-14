import { useState } from "react";

function App() {
  const [companyName, setCompanyName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [expandedClaims, setExpandedClaims] = useState({});
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyName.trim() || !url.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("https://anakinhackathon.onrender.com/api/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An unknown error occurred.");
      }

      setResult(data);
    } catch (err) {
      console.error("Investigation error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleClaim = (id) => {
    setExpandedClaims(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = () => {
    const email = result?.actions?.draftEmail || result?.draftEmail;
    if (email) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case "LOW": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
      case "MEDIUM": return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      case "HIGH": return "bg-red-500/20 text-red-400 border-red-500/50";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    }
  };

  const getVerdictBadge = (verdict) => {
    switch (verdict) {
      case "verified": return <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50">Verified</span>;
      case "unverified": return <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/50">Unverified</span>;
      case "inconsistent": return <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/50">Inconsistent</span>;
      case "high_risk": return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-400 border border-red-500/50">High Risk</span>;
      default: return <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/50">{verdict}</span>;
    }
  };

  // Defensive: support both flat and nested actions shapes
  const actionsList = Array.isArray(result?.actions)
    ? result.actions
    : (result?.actions?.actions || []);
  const draftEmailText = result?.draftEmail || result?.actions?.draftEmail || "";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header & Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              DECEIVE Agent
            </h1>
            <p className="text-slate-400 mt-2">Automated Corporate Claim Investigation</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Company Name (e.g. Stripe)"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
              required
            />
            <input
              type="url"
              placeholder="Official URL (e.g. https://stripe.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="md:w-48 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl px-6 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                "Investigate"
              )}
            </button>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 text-red-400">
            <svg className="w-6 h-6 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="font-semibold">Investigation Failed</h3>
              <p className="text-sm opacity-90 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div className={`col-span-1 md:col-span-2 rounded-2xl p-6 border flex items-center justify-between ${getRiskColor(result?.riskScore?.riskLevel)}`}>
                <div>
                  <h2 className="text-lg font-medium opacity-80 uppercase tracking-wider">Overall Risk Score</h2>
                  <div className="text-5xl font-black mt-2">{result?.riskScore?.overallScore ?? "N/A"}<span className="text-2xl opacity-50 font-medium">/100</span></div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold tracking-tight">{result?.riskScore?.riskLevel ?? "UNKNOWN"} RISK</div>
                  <div className="text-sm opacity-75 mt-1">Based on {result?.claims?.length ?? 0} claims</div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center">
                <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Identity Verification</h3>
                <div className="flex items-center gap-2 text-emerald-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">Confirmed Official</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2" title={result?.identityCheck?.notes}>
                  {result?.identityCheck?.notes ?? ""}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left Column: Claims */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xl font-semibold border-b border-slate-800 pb-2 mb-4">Investigated Claims</h3>

                {(result?.results?.length ?? 0) === 0 ? (
                  <p className="text-slate-400 italic">No verifiable claims found on this page.</p>
                ) : (
                  result.results.map((res, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all">
                      <div
                        className="p-4 cursor-pointer hover:bg-slate-800/50 flex items-center justify-between gap-4"
                        onClick={() => toggleClaim(idx)}
                      >
                        <div className="flex-1">
                          <p className="font-medium text-slate-200">"{res?.claim?.text}"</p>
                          <div className="flex items-center gap-3 mt-2">
                            {getVerdictBadge(res?.verdict)}
                            <span className="text-xs text-slate-500">Conf: {res?.confidence}%</span>
                            {res?.wasChallenged && (
                              <span className="text-xs text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded-md border border-purple-400/20 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Challenged
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="shrink-0 text-slate-500">
                          <svg className={`w-5 h-5 transition-transform ${expandedClaims[idx] ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      {expandedClaims[idx] && (
                        <div className="p-4 border-t border-slate-800 bg-slate-950/50 space-y-4 text-sm">
                          <div>
                            <h4 className="text-slate-400 font-medium mb-1">Reasoning</h4>
                            <p className="text-slate-300 leading-relaxed">{res?.reasoning}</p>
                          </div>

                          {res?.sources && res.sources.length > 0 && (
                            <div>
                              <h4 className="text-slate-400 font-medium mb-2">Sources</h4>
                              <ul className="space-y-2">
                                {res.sources.map((src, i) => (
                                  <li key={i} className="flex gap-2">
                                    <svg className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                    <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 hover:underline line-clamp-1">
                                      {src.title || src.url}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Right Column: Actions & Email */}
              <div className="space-y-6">

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    Recommended Actions
                  </h3>
                  <ul className="space-y-3">
                    {actionsList.map((action, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-slate-300">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-slate-400 text-xs shrink-0 font-medium">
                          {idx + 1}
                        </span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
                    <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Draft Email
                    </h3>
                    <button
                      onClick={copyToClipboard}
                      className="text-xs font-medium px-3 py-1.5 rounded-md bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors flex items-center gap-1.5"
                    >
                      {copied ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Copied
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-4 bg-slate-950">
                    <pre className="whitespace-pre-wrap text-sm text-slate-300 font-sans">
                      {draftEmailText}
                    </pre>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default App;