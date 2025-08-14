import React, { useMemo } from 'react';
import { BusinessModelCalculator } from '../../services/BusinessModelCalculator.js';
import { NumberFormatter } from '../../utils/NumberFormatter.js';
import type { ScenarioComparisonProps, Scenario, CalculationResults, ComparisonRow } from '../../types/index.js';

export const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({
  scenarios,
  results,
  onScenarioSelect
}) => {
  const calculator = new BusinessModelCalculator();

  // Calculate results for all scenarios if not provided
  const allResults = useMemo(() => {
    if (results && results.length === scenarios.length) {
      return results;
    }

    return scenarios.map(scenario => {
      try {
        if (scenario.businessType === 'tech') {
          return calculator.calculateTechCompany(scenario);
        } else {
          return calculator.calculateTraditionalBusiness(scenario);
        }
      } catch (error) {
        // Return a placeholder result for invalid scenarios
        return {
          scenarioId: scenario.id,
          totalDeveloperCost: 0,
          costAvoidance: 0,
          roiMultiple: 0,
          roiPercentage: 0,
          supportingMetrics: {
            deploymentsPerBuilder: 0,
            interventionsReduction: 0,
            incidentReduction: 0
          },
          calculationSteps: []
        } as CalculationResults;
      }
    });
  }, [scenarios, results, calculator]);

  // Create comparison data
  const comparisonData = useMemo((): ComparisonRow[] => {
    if (scenarios.length === 0) return [];

    const rows: ComparisonRow[] = [
      {
        metric: 'Business Type',
        scenarios: scenarios.reduce((acc, scenario) => {
          acc[scenario.id] = scenario.businessType === 'tech' ? 'Tech Company' : 'Traditional Business';
          return acc;
        }, {} as { [key: string]: string | number }),
        bestValue: 'N/A'
      },
      {
        metric: 'Developers',
        scenarios: scenarios.reduce((acc, scenario) => {
          acc[scenario.id] = scenario.developerCount.toLocaleString();
          return acc;
        }, {} as { [key: string]: string | number }),
        bestValue: Math.max(...scenarios.map(s => s.developerCount)).toLocaleString()
      },
      {
        metric: 'Cost per Developer',
        scenarios: scenarios.reduce((acc, scenario) => {
          acc[scenario.id] = NumberFormatter.formatCurrency(scenario.annualCostPerDeveloper);
          return acc;
        }, {} as { [key: string]: string | number }),
        bestValue: NumberFormatter.formatCurrency(Math.min(...scenarios.map(s => s.annualCostPerDeveloper)))
      },
      {
        metric: 'CTS-SW Improvement',
        scenarios: scenarios.reduce((acc, scenario) => {
          acc[scenario.id] = NumberFormatter.formatPercentage(scenario.ctsSwImprovementPercent);
          return acc;
        }, {} as { [key: string]: string | number }),
        bestValue: NumberFormatter.formatPercentage(Math.max(...scenarios.map(s => s.ctsSwImprovementPercent)))
      },
      {
        metric: 'Solution Cost',
        scenarios: scenarios.reduce((acc, scenario) => {
          acc[scenario.id] = NumberFormatter.formatCurrency(scenario.solutionCost);
          return acc;
        }, {} as { [key: string]: string | number }),
        bestValue: NumberFormatter.formatCurrency(Math.min(...scenarios.map(s => s.solutionCost)))
      },
      {
        metric: 'Total Developer Cost',
        scenarios: allResults.reduce((acc, result) => {
          acc[result.scenarioId] = NumberFormatter.formatCurrency(result.totalDeveloperCost);
          return acc;
        }, {} as { [key: string]: string | number }),
        bestValue: NumberFormatter.formatCurrency(Math.max(...allResults.map(r => r.totalDeveloperCost)))
      },
      {
        metric: 'Cost Avoidance',
        scenarios: allResults.reduce((acc, result) => {
          acc[result.scenarioId] = NumberFormatter.formatCurrency(result.costAvoidance);
          return acc;
        }, {} as { [key: string]: string | number }),
        bestValue: NumberFormatter.formatCurrency(Math.max(...allResults.map(r => r.costAvoidance)))
      },
      {
        metric: 'ROI Multiple',
        scenarios: allResults.reduce((acc, result) => {
          acc[result.scenarioId] = NumberFormatter.formatMultiple(result.roiMultiple);
          return acc;
        }, {} as { [key: string]: string | number }),
        bestValue: NumberFormatter.formatMultiple(Math.max(...allResults.map(r => r.roiMultiple)))
      },
      {
        metric: 'ROI Percentage',
        scenarios: allResults.reduce((acc, result) => {
          acc[result.scenarioId] = NumberFormatter.formatPercentage(result.roiPercentage);
          return acc;
        }, {} as { [key: string]: string | number }),
        bestValue: NumberFormatter.formatPercentage(Math.max(...allResults.map(r => r.roiPercentage)))
      }
    ];

    // Add tech company specific metrics if any tech companies exist
    const hasTechCompanies = scenarios.some(s => s.businessType === 'tech');
    if (hasTechCompanies) {
      const techResults = allResults.filter(r => {
        const scenario = scenarios.find(s => s.id === r.scenarioId);
        return scenario?.businessType === 'tech';
      });

      if (techResults.length > 0) {
        rows.push(
          {
            metric: 'Gross Margin Improvement',
            scenarios: allResults.reduce((acc, result) => {
              const scenario = scenarios.find(s => s.id === result.scenarioId);
              if (scenario?.businessType === 'tech' && result.grossMarginImprovement !== undefined) {
                acc[result.scenarioId] = NumberFormatter.formatPercentage(result.grossMarginImprovement);
              } else {
                acc[result.scenarioId] = 'N/A';
              }
              return acc;
            }, {} as { [key: string]: string | number }),
            bestValue: techResults.length > 0 
              ? NumberFormatter.formatPercentage(Math.max(...techResults.map(r => r.grossMarginImprovement || 0)))
              : 'N/A'
          },
          {
            metric: 'Profit Impact',
            scenarios: allResults.reduce((acc, result) => {
              const scenario = scenarios.find(s => s.id === result.scenarioId);
              if (scenario?.businessType === 'tech' && result.profitImpact !== undefined) {
                acc[result.scenarioId] = NumberFormatter.formatCurrency(result.profitImpact);
              } else {
                acc[result.scenarioId] = 'N/A';
              }
              return acc;
            }, {} as { [key: string]: string | number }),
            bestValue: techResults.length > 0 
              ? NumberFormatter.formatCurrency(Math.max(...techResults.map(r => r.profitImpact || 0)))
              : 'N/A'
          }
        );
      }
    }

    return rows;
  }, [scenarios, allResults]);

  // Find best performing scenario
  const bestScenario = useMemo(() => {
    if (allResults.length === 0) return null;
    
    const bestResult = allResults.reduce((best, current) => 
      current.roiMultiple > best.roiMultiple ? current : best
    );
    
    return scenarios.find(s => s.id === bestResult.scenarioId) || null;
  }, [scenarios, allResults]);

  const getCellClassName = (row: ComparisonRow, scenarioId: string): string => {
    const value = row.scenarios[scenarioId];
    const isBest = value === row.bestValue;
    
    let baseClass = 'px-4 py-3 text-sm';
    
    if (isBest && row.bestValue !== 'N/A') {
      baseClass += ' bg-green-50 text-green-900 font-semibold';
    } else {
      baseClass += ' text-gray-900';
    }
    
    return baseClass;
  };

  const getScenarioHeaderClassName = (scenario: Scenario): string => {
    const isBest = bestScenario?.id === scenario.id;
    
    let baseClass = 'px-4 py-3 text-sm font-medium cursor-pointer transition-colors';
    
    if (isBest) {
      baseClass += ' bg-green-100 text-green-900 hover:bg-green-200';
    } else {
      baseClass += ' bg-gray-50 text-gray-900 hover:bg-gray-100';
    }
    
    return baseClass;
  };

  if (scenarios.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-500">
          <div className="text-lg font-medium mb-2">No Scenarios to Compare</div>
          <div className="text-sm">Create multiple scenarios to see a side-by-side comparison</div>
        </div>
      </div>
    );
  }

  if (scenarios.length === 1) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-500">
          <div className="text-lg font-medium mb-2">Single Scenario</div>
          <div className="text-sm">Add more scenarios to enable comparison view</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900">Scenario Comparison</h2>
        <p className="text-sm text-gray-600 mt-1">
          Compare ROI metrics across different scenarios
        </p>
      </div>

      {/* Best Scenario Highlight */}
      {bestScenario && (
        <div className="px-6 py-4 bg-green-50 border-b border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-green-800">
                🏆 Best Performing Scenario
              </div>
              <div className="text-lg font-semibold text-green-900">
                {bestScenario.name}
              </div>
            </div>
            <div className="text-right">
              <div 
                className="text-2xl font-bold text-green-900 cursor-help"
                title={`ROI Calculation: ${NumberFormatter.formatCurrency(allResults.find(r => r.scenarioId === bestScenario.id)?.costAvoidance || 0, 'full')} ÷ ${NumberFormatter.formatCurrency(bestScenario.solutionCost, 'full')}`}
              >
                {NumberFormatter.formatMultiple(allResults.find(r => r.scenarioId === bestScenario.id)?.roiMultiple || 0)}
              </div>
              <div className="text-sm text-green-700">ROI Multiple</div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Metric
              </th>
              {scenarios.map((scenario) => (
                <th
                  key={scenario.id}
                  className={getScenarioHeaderClassName(scenario)}
                  onClick={() => onScenarioSelect(scenario.id)}
                >
                  <div className="text-left">
                    <div className="font-semibold">{scenario.name}</div>
                    <div className="text-xs text-gray-600 font-normal">
                      {scenario.businessType === 'tech' ? 'Tech Company' : 'Traditional Business'}
                    </div>
                    {bestScenario?.id === scenario.id && (
                      <div className="text-xs text-green-600 font-medium mt-1">
                        🏆 Best ROI
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {comparisonData.map((row, index) => (
              <tr key={row.metric} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {row.metric}
                </td>
                {scenarios.map((scenario) => (
                  <td
                    key={scenario.id}
                    className={getCellClassName(row, scenario.id)}
                  >
                    {/* Add tooltips for monetary values */}
                    {(row.metric.includes('Cost') || row.metric.includes('Impact')) && 
                     typeof row.scenarios[scenario.id] === 'string' && 
                     row.scenarios[scenario.id] !== 'N/A' ? (
                      <span 
                        className="cursor-help border-b border-dotted border-gray-400"
                        title={NumberFormatter.formatTooltip(
                          row.metric === 'Cost per Developer' ? scenario.annualCostPerDeveloper :
                          row.metric === 'Solution Cost' ? scenario.solutionCost :
                          row.metric === 'Total Developer Cost' ? allResults.find(r => r.scenarioId === scenario.id)?.totalDeveloperCost || 0 :
                          row.metric === 'Cost Avoidance' ? allResults.find(r => r.scenarioId === scenario.id)?.costAvoidance || 0 :
                          row.metric === 'Profit Impact' ? allResults.find(r => r.scenarioId === scenario.id)?.profitImpact || 0 :
                          0,
                          row.metric
                        )}
                      >
                        {row.scenarios[scenario.id]}
                      </span>
                    ) : row.metric === 'ROI Multiple' && typeof row.scenarios[scenario.id] === 'string' ? (
                      <span 
                        className="cursor-help border-b border-dotted border-gray-400"
                        title={`ROI Calculation: ${NumberFormatter.formatCurrency(allResults.find(r => r.scenarioId === scenario.id)?.costAvoidance || 0, 'full')} ÷ ${NumberFormatter.formatCurrency(scenario.solutionCost, 'full')}`}
                      >
                        {row.scenarios[scenario.id]}
                      </span>
                    ) : (
                      row.scenarios[scenario.id]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Performance Summary */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-700">Scenarios Compared</div>
            <div className="text-gray-600">{scenarios.length} scenarios</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">ROI Range</div>
            <div className="text-gray-600">
              {NumberFormatter.formatMultiple(Math.min(...allResults.map(r => r.roiMultiple)))} - {NumberFormatter.formatMultiple(Math.max(...allResults.map(r => r.roiMultiple)))}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Total Cost Avoidance</div>
            <div 
              className="text-gray-600 cursor-help border-b border-dotted border-gray-400"
              title={NumberFormatter.formatTooltip(allResults.reduce((sum, r) => sum + r.costAvoidance, 0), "Combined Cost Avoidance")}
            >
              {NumberFormatter.formatCurrency(allResults.reduce((sum, r) => sum + r.costAvoidance, 0))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};