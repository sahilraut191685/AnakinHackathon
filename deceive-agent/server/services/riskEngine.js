/**
 * Calculates a risk score based on the results of the claim investigations.
 * 
 * @param {Array} claimResults - Array of verdict data objects.
 * @returns {Object} - The overall risk score, risk level, and breakdown.
 */
function calculateRiskScore(claimResults) {
    if (!claimResults || claimResults.length === 0) {
        return { overallScore: 0, riskLevel: "LOW", breakdown: [] };
    }

    const pointsMap = {
        "verified": 0,
        "unverified": 15,
        "inconsistent": 25,
        "high_risk": 40
    };

    let totalCalculatedPoints = 0;
    const maxPointsPerClaim = 40;
    const totalPossiblePoints = claimResults.length * maxPointsPerClaim;

    const breakdown = claimResults.map(result => {
        const basePoints = pointsMap[result.verdict] || 0;
        // Weight by confidence: higher confidence in a bad verdict = higher risk
        const confidenceWeight = (result.confidence || 0) / 100;
        const calculatedPoints = basePoints * confidenceWeight;
        
        totalCalculatedPoints += calculatedPoints;

        return {
            claimId: result.claim.id,
            verdict: result.verdict,
            basePoints,
            confidence: result.confidence,
            calculatedPoints
        };
    });

    // Normalize to 0-100 scale
    let overallScore = Math.round((totalCalculatedPoints / totalPossiblePoints) * 100);
    // Ensure it stays within bounds just in case
    overallScore = Math.max(0, Math.min(100, overallScore));

    let riskLevel = "LOW";
    if (overallScore >= 60) {
        riskLevel = "HIGH";
    } else if (overallScore >= 30) {
        riskLevel = "MEDIUM";
    }

    return {
        overallScore,
        riskLevel,
        breakdown
    };
}

module.exports = { calculateRiskScore };
