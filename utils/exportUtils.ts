
import type { ScoredNiche } from '../types';

const downloadFile = (content: string, fileName: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportSingleNicheBlueprint = (niche: ScoredNiche) => {
  const markdown = `
# 🚀 2026 EXECUTION BLUEPRINT: ${niche.niche}
*Audited: January 2026 | Strategic Node Analysis*

---

## 💎 1. MARKET OPPORTUNITY OVERVIEW
- **Intelligence Score:** ${niche.score}/100
- **Market Dynamics:** Demand (${niche.demand}/10) | Friction (${niche.competition}/10) | Growth Momentum (${niche.trend.toFixed(2)})
- **Scalability Index:** ${niche.scalabilityIndex}/10
- **Target Persona:** ${niche.targetAudience}
- **Value Proposition:** ${niche.description}

## ⚡ 2. THE COMPETITIVE BATTLE PLAN (2026)
- **The Gap (Competitor Weakness):** ${niche.competitorWeakness}
- **Tactical Disruption:** ${niche.battlePlan}
- **Future Strategy Forecast:** ${niche.strategicForecast}

## 💰 3. FINANCIAL PROJECTIONS
- **Strategic Entry Price:** $${niche.averagePrice}
- **Value Tiers:**
  - Basic (Entry): $${Math.round(niche.averagePrice * 0.5)}
  - Standard (Scale): $${niche.averagePrice}
  - Premium (Authority): $${Math.round(niche.averagePrice * 1.8)}

## ✍️ 4. HIGH-CONVERSION GIG ASSETS
### Psychological Hook Titles:
${niche.gigTitles.map(t => `- [HOOK] ${t}`).join('\n')}

### Semantic Search Tags:
${niche.keywords.join(', ')}

## 🛡️ 5. OBJECTION-SLAYER FAQS
${niche.faqs.map(f => `### Q: ${f.question}\n**RESPONSE:** ${f.answer}`).join('\n\n')}

---
**CONFIDENTIAL STRATEGY DOCUMENT**
*Disclaimer: Strategic node projections for January 2026. Data is synthesized from live marketplace audits.*
  `.trim();

  downloadFile(markdown, `${niche.niche.toLowerCase().replace(/\s+/g, '_')}_blueprint.md`, 'text/markdown');
};

export const exportToCSV = (data: ScoredNiche[], fileName: string): boolean => {
  if (data.length === 0) return false;
  const columns = ['niche', 'score', 'averagePrice', 'demand', 'competition', 'trend', 'targetAudience', 'battlePlan'];
  const headers = columns.join(',');
  const rows = data.map(n => columns.map(c => `"${String((n as any)[c]).replace(/"/g, '""')}"`).join(','));
  downloadFile([headers, ...rows].join('\n'), fileName, 'text/csv');
  return true;
};

export const exportToJSON = (data: ScoredNiche[], fileName: string): boolean => {
  if (data.length === 0) return false;
  downloadFile(JSON.stringify(data, null, 2), fileName, 'application/json');
  return true;
};
