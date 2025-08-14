import type { Scenario, CalculationResults } from '../types/index.js';

/**
 * ExportService handles exporting scenarios and results for sharing and presentations
 */
export class ExportService {
  
  /**
   * Generate a shareable URL with scenario parameters
   */
  static generateShareableUrl(scenario: Scenario): string {
    const params = new URLSearchParams({
      name: scenario.name,
      businessType: scenario.businessType,
      developerCount: scenario.developerCount.toString(),
      annualCostPerDeveloper: scenario.annualCostPerDeveloper.toString(),
      ctsSwImprovementPercent: scenario.ctsSwImprovementPercent.toString(),
      solutionCost: scenario.solutionCost.toString(),
      ...(scenario.revenuePercentage && { revenuePercentage: scenario.revenuePercentage.toString() }),
      ...(scenario.notes && { notes: scenario.notes })
    });

    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }

  /**
   * Parse scenario from URL parameters
   */
  static parseScenarioFromUrl(): Scenario | null {
    const params = new URLSearchParams(window.location.search);
    
    if (!params.has('name') || !params.has('businessType')) {
      return null;
    }

    try {
      const now = new Date();
      return {
        id: `shared-${Date.now()}`,
        name: params.get('name') || 'Shared Scenario',
        businessType: params.get('businessType') as 'traditional' | 'tech',
        developerCount: parseInt(params.get('developerCount') || '0'),
        annualCostPerDeveloper: parseInt(params.get('annualCostPerDeveloper') || '0'),
        ctsSwImprovementPercent: parseFloat(params.get('ctsSwImprovementPercent') || '0'),
        solutionCost: parseInt(params.get('solutionCost') || '0'),
        revenuePercentage: params.has('revenuePercentage') ? parseFloat(params.get('revenuePercentage')!) : undefined,
        notes: params.get('notes') || '',
        createdAt: now,
        updatedAt: now
      };
    } catch (error) {
      console.error('Failed to parse scenario from URL:', error);
      return null;
    }
  }

  /**
   * Export scenario and results as JSON
   */
  static exportAsJson(scenario: Scenario, results: CalculationResults): string {
    const exportData = {
      scenario,
      results,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Generate executive summary report as text
   */
  static generateExecutiveSummary(scenario: Scenario, results: CalculationResults): string {
    const formatCurrency = (value: number) => 
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

    const summary = `
DEVELOPER EXPERIENCE ROI CALCULATOR
Executive Summary Report

Generated: ${new Date().toLocaleDateString()}
Scenario: ${scenario.name}

═══════════════════════════════════════════════════════════════

KEY RESULTS

ROI Multiple: ${results.roiMultiple.toFixed(1)}x
Annual Cost Avoidance: ${formatCurrency(results.costAvoidance)}
ROI Percentage: ${results.roiPercentage.toFixed(1)}%

═══════════════════════════════════════════════════════════════

SCENARIO PARAMETERS

Business Type: ${scenario.businessType === 'tech' ? 'Tech Company' : 'Traditional Business'}
Number of Developers: ${scenario.developerCount.toLocaleString()}
Annual Cost per Developer: ${formatCurrency(scenario.annualCostPerDeveloper)}
Expected CTS-SW Improvement: ${scenario.ctsSwImprovementPercent}%
Solution Investment Cost: ${formatCurrency(scenario.solutionCost)}
${scenario.revenuePercentage ? `Revenue from Software Development: ${scenario.revenuePercentage}%` : ''}

═══════════════════════════════════════════════════════════════

CALCULATION BREAKDOWN

${results.calculationSteps.map((step) => `
${step.step}. ${step.description}
   Formula: ${step.formula}
   Calculation: ${step.calculation}
   Result: ${typeof step.result === 'number' && step.result > 1000 ? formatCurrency(step.result) : step.result}
   
   ${step.explanation}
`).join('')}

═══════════════════════════════════════════════════════════════

AWS BENCHMARK COMPARISON

Your ROI Multiple: ${results.roiMultiple.toFixed(1)}x
AWS Bank Benchmark: 9.75x
Performance: ${results.roiMultiple >= 9.75 ? 'EXCEEDS AWS Benchmark ✓' : 
              results.roiMultiple >= 5 ? 'Strong ROI Performance' : 'Below AWS Benchmark'}

Your CTS-SW Improvement: ${scenario.ctsSwImprovementPercent}%
AWS Target: 15.0%
AWS Achieved: 15.9%
Performance: ${scenario.ctsSwImprovementPercent >= 15.9 ? 'EXCEEDS AWS Achievement ✓' : 
              scenario.ctsSwImprovementPercent >= 15 ? 'Meets AWS Target ✓' : 'Below AWS Target'}

${scenario.businessType === 'tech' && results.grossMarginImprovement ? `
TECH COMPANY SPECIFIC METRICS

Gross Margin Improvement: ${formatCurrency(results.grossMarginImprovement)}
Profit Impact: ${formatCurrency(results.profitImpact || 0)}
Profit Boost: ${(results.profitBoostPercentage || 0).toFixed(1)}%
` : ''}

═══════════════════════════════════════════════════════════════

METHODOLOGY

This analysis uses Amazon's Cost to Serve Software (CTS-SW) framework,
based on their published case studies and achieved 15.9% improvement.

Key Success Factors:
• Automated deployment pipelines
• Reduced manual interventions  
• Faster incident resolution
• Improved developer productivity
• Better tooling and infrastructure

Implementation Timeline:
• Planning: 2-3 months
• Implementation: 6-12 months  
• Full Realization: 12-18 months

═══════════════════════════════════════════════════════════════

${scenario.notes ? `NOTES\n\n${scenario.notes}\n\n═══════════════════════════════════════════════════════════════\n\n` : ''}

Report generated by Developer Experience ROI Calculator
Based on AWS Cost to Serve Software (CTS-SW) Framework
    `.trim();

    return summary;
  }

  /**
   * Download text content as a file
   */
  static downloadAsFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  /**
   * Copy text to clipboard
   */
  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }

  /**
   * Generate CSV export for multiple scenarios
   */
  static exportScenariosAsCsv(scenarios: Scenario[], results: CalculationResults[]): string {
    const headers = [
      'Scenario Name',
      'Business Type', 
      'Developers',
      'Cost per Developer',
      'CTS-SW Improvement %',
      'Solution Cost',
      'Revenue %',
      'Total Developer Cost',
      'Cost Avoidance',
      'ROI Multiple',
      'ROI Percentage',
      'Gross Margin Improvement',
      'Profit Impact',
      'Notes'
    ];

    const rows = scenarios.map((scenario, index) => {
      const result = results[index];
      return [
        scenario.name,
        scenario.businessType,
        scenario.developerCount,
        scenario.annualCostPerDeveloper,
        scenario.ctsSwImprovementPercent,
        scenario.solutionCost,
        scenario.revenuePercentage || '',
        result?.totalDeveloperCost || '',
        result?.costAvoidance || '',
        result?.roiMultiple || '',
        result?.roiPercentage || '',
        result?.grossMarginImprovement || '',
        result?.profitImpact || '',
        scenario.notes || ''
      ];
    });

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  }

  /**
   * Generate a simple HTML report
   */
  static generateHtmlReport(scenario: Scenario, results: CalculationResults): string {
    const formatCurrency = (value: number) => 
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ROI Analysis - ${scenario.name}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .metric { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .highlight { background: #e8f5e8; border-left: 4px solid #4caf50; }
        .calculation { background: #f8f9fa; padding: 10px; margin: 5px 0; border-radius: 3px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Developer Experience ROI Analysis</h1>
        <h2>${scenario.name}</h2>
        <p>Generated: ${new Date().toLocaleDateString()}</p>
    </div>

    <div class="metric highlight">
        <h3>Key Results</h3>
        <p><strong>ROI Multiple:</strong> ${results.roiMultiple.toFixed(1)}x</p>
        <p><strong>Annual Cost Avoidance:</strong> ${formatCurrency(results.costAvoidance)}</p>
        <p><strong>ROI Percentage:</strong> ${results.roiPercentage.toFixed(1)}%</p>
    </div>

    <div class="metric">
        <h3>Scenario Parameters</h3>
        <table>
            <tr><td>Business Type</td><td>${scenario.businessType === 'tech' ? 'Tech Company' : 'Traditional Business'}</td></tr>
            <tr><td>Number of Developers</td><td>${scenario.developerCount.toLocaleString()}</td></tr>
            <tr><td>Annual Cost per Developer</td><td>${formatCurrency(scenario.annualCostPerDeveloper)}</td></tr>
            <tr><td>Expected CTS-SW Improvement</td><td>${scenario.ctsSwImprovementPercent}%</td></tr>
            <tr><td>Solution Investment Cost</td><td>${formatCurrency(scenario.solutionCost)}</td></tr>
            ${scenario.revenuePercentage ? `<tr><td>Revenue from Software Development</td><td>${scenario.revenuePercentage}%</td></tr>` : ''}
        </table>
    </div>

    <div class="metric">
        <h3>Calculation Breakdown</h3>
        ${results.calculationSteps.map(step => `
            <div class="calculation">
                <h4>${step.step}. ${step.description}</h4>
                <p><strong>Formula:</strong> ${step.formula}</p>
                <p><strong>Calculation:</strong> ${step.calculation}</p>
                <p><strong>Result:</strong> ${typeof step.result === 'number' && step.result > 1000 ? formatCurrency(step.result) : step.result}</p>
                <p><em>${step.explanation}</em></p>
            </div>
        `).join('')}
    </div>

    <div class="metric">
        <h3>AWS Benchmark Comparison</h3>
        <table>
            <tr><td>Your ROI Multiple</td><td>${results.roiMultiple.toFixed(1)}x</td></tr>
            <tr><td>AWS Bank Benchmark</td><td>9.75x</td></tr>
            <tr><td>Performance</td><td>${results.roiMultiple >= 9.75 ? '✅ EXCEEDS AWS Benchmark' : results.roiMultiple >= 5 ? '✅ Strong ROI Performance' : '⚠️ Below AWS Benchmark'}</td></tr>
        </table>
    </div>

    <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
        <p>Report generated by Developer Experience ROI Calculator</p>
        <p>Based on AWS Cost to Serve Software (CTS-SW) Framework</p>
    </footer>
</body>
</html>
    `.trim();
  }
}