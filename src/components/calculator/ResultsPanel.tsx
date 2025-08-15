import React, { useState } from 'react';
import type { ResultsPanelProps } from '../../types/index.js';
import { ScaleWarning } from '../ui/ScaleWarning.js';
import { ROIContextExplanation } from '../ui/ROIContextExplanation.js';
import { NumberFormatter } from '../../utils/NumberFormatter.js';
// Using NumberFormatter directly with title tooltips for better performance

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  results,
  scenario,
  showDetailedBreakdown
}) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [showAlternatives, setShowAlternatives] = useState(false);

  // Debug log to check if prop is being received
  console.log('ResultsPanel showDetailedBreakdown:', showDetailedBreakdown);

  // Use NumberFormatter methods directly for consistency

  const handleSuggestAlternative = () => {
    setShowAlternatives(!showAlternatives);
  };

  const isEnterpriseScale = NumberFormatter.isEnterpriseScale(results.costAvoidance);
  const alternatives = NumberFormatter.generateAlternativeScenarios({
    developerCount: scenario.developerCount,
    ctsSwImprovementPercent: scenario.ctsSwImprovementPercent,
    solutionCost: scenario.solutionCost,
    annualCostPerDeveloper: scenario.annualCostPerDeveloper
  });

  const getRoiColor = (roiMultiple: number): string => {
    if (roiMultiple >= 10) return 'text-green-600';
    if (roiMultiple >= 5) return 'text-blue-600';
    if (roiMultiple >= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRoiBgColor = (roiMultiple: number): string => {
    if (roiMultiple >= 10) return 'bg-green-50 border-green-200';
    if (roiMultiple >= 5) return 'bg-blue-50 border-blue-200';
    if (roiMultiple >= 2) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const toggleStepExpansion = (stepNumber: number) => {
    setExpandedStep(expandedStep === stepNumber ? null : stepNumber);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">ROI Results</h2>
      
      {/* Scale Warning */}
      <ScaleWarning 
        results={results}
        scenario={scenario}
        onSuggestAlternative={handleSuggestAlternative}
      />

      {/* Alternative Scenarios */}
      {showAlternatives && alternatives.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-blue-800 mb-3">Alternative Scenario Suggestions</h3>
          <div className="space-y-2">
            {alternatives.map((alternative, index) => (
              <div key={index} className="text-sm text-blue-700 bg-white rounded p-2">
                <div className="font-medium">{alternative.description}</div>
                <div className="text-xs text-blue-600 mt-1">
                  {Object.entries(alternative.adjustments).map(([key, value]) => (
                    <span key={key} className="mr-3">
                      {key === 'developerCount' && `${value} developers`}
                      {key === 'ctsSwImprovementPercent' && `${value}% improvement`}
                      {key === 'solutionCost' && `${NumberFormatter.formatCurrency(value as number)} solution cost`}
                      {key === 'annualCostPerDeveloper' && `${NumberFormatter.formatCurrency(value as number)} per developer`}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowAlternatives(false)}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Hide alternatives
          </button>
        </div>
      )}
      
      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* ROI Multiple */}
        <div className={`p-6 rounded-lg border-2 ${getRoiBgColor(results.roiMultiple)}`}>
          <div className="text-center">
            <div 
              className={`text-4xl font-bold ${getRoiColor(results.roiMultiple)} mb-2 cursor-help`}
              title={`ROI Calculation: ${NumberFormatter.formatCurrency(results.costAvoidance, 'full')} ÷ ${NumberFormatter.formatCurrency(scenario.solutionCost, 'full')} = ${NumberFormatter.formatMultiple(results.roiMultiple)}`}
            >
              {NumberFormatter.formatMultiple(results.roiMultiple)}
            </div>
            <div className="text-sm font-medium text-gray-700">ROI Multiple</div>
            <div className="text-xs text-gray-500 mt-1">
              {NumberFormatter.formatPercentage(results.roiPercentage)} return
            </div>
            {isEnterpriseScale && (
              <div className="text-xs text-amber-600 mt-1 font-medium">
                Enterprise Scale
              </div>
            )}
          </div>
        </div>

        {/* Cost Avoidance */}
        <div className="p-6 rounded-lg border-2 bg-blue-50 border-blue-200">
          <div className="text-center">
            <div 
              className="text-2xl lg:text-3xl font-bold text-blue-600 mb-2 break-words cursor-help"
              title={NumberFormatter.formatTooltip(results.costAvoidance, "Annual Cost Avoidance")}
            >
              {NumberFormatter.formatCurrency(results.costAvoidance)}
            </div>
            <div className="text-sm font-medium text-gray-700">Annual Cost Avoidance</div>
            <div className="text-xs text-gray-500 mt-1">
              {NumberFormatter.formatPercentage(scenario.ctsSwImprovementPercent)} CTS-SW improvement
            </div>
            {isEnterpriseScale && (
              <div className="text-xs text-amber-600 mt-1 font-medium">
                {NumberFormatter.getScaleDescription(NumberFormatter.getScaleIndicator(results.costAvoidance))}
              </div>
            )}
          </div>
        </div>

        {/* Total Developer Cost */}
        <div className="p-6 rounded-lg border-2 bg-gray-50 border-gray-200">
          <div className="text-center">
            <div 
              className="text-2xl lg:text-3xl font-bold text-gray-600 mb-2 break-words cursor-help"
              title={NumberFormatter.formatTooltip(results.totalDeveloperCost, "Total Developer Cost")}
            >
              {NumberFormatter.formatCurrency(results.totalDeveloperCost)}
            </div>
            <div className="text-sm font-medium text-gray-700">Total Developer Cost</div>
            <div className="text-xs text-gray-500 mt-1">
              {scenario.developerCount.toLocaleString()} developers
            </div>
          </div>
        </div>
      </div>

      {/* ROI Context Explanation */}
      <ROIContextExplanation
        roiMultiple={results.roiMultiple}
        costAvoidance={results.costAvoidance}
        solutionCost={scenario.solutionCost}
        className="mb-8"
      />

      {/* Tech Company Specific Metrics */}
      {scenario.businessType === 'tech' && results.grossMarginImprovement !== undefined && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 rounded-lg border-2 bg-green-50 border-green-200">
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-green-600 mb-2 break-words">
                {NumberFormatter.formatPercentage(results.grossMarginImprovement || 0)}
              </div>
              <div className="text-sm font-medium text-gray-700">Gross Margin Improvement</div>
              <div className="text-xs text-gray-500 mt-1">
                Additional margin from productivity gains
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border-2 bg-purple-50 border-purple-200">
            <div className="text-center">
              <div 
                className="text-2xl lg:text-3xl font-bold text-purple-600 mb-2 break-words cursor-help"
                title={NumberFormatter.formatTooltip(results.profitImpact || 0, "Profit Impact")}
              >
                {NumberFormatter.formatCurrency(results.profitImpact || 0)}
              </div>
              <div className="text-sm font-medium text-gray-700">Profit Impact</div>
              <div className="text-xs text-gray-500 mt-1">
                {NumberFormatter.formatPercentage(results.profitBoostPercentage || 0)} profit boost
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step-by-Step Calculation Breakdown */}
      {showDetailedBreakdown && (
        <div className="mb-8 border-2 border-dashed border-green-300 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Calculation Breakdown
            <span className="text-sm font-normal text-gray-500 ml-2">
              (AWS CTS-SW Framework)
            </span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded ml-2">
              DETAILED VIEW
            </span>
          </h3>
        
        <div className="space-y-4">
          {results.calculationSteps.map((step) => (
            <div
              key={step.step}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleStepExpansion(step.step)}
                className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {step.step}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{step.description}</div>
                      <div className="text-sm text-gray-600 mt-1">{step.formula}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      {typeof step.result === 'number' && step.result > 1000 ? (
                        <div 
                          className="font-bold text-lg text-gray-900 cursor-help"
                          title={NumberFormatter.formatTooltip(step.result, step.description)}
                        >
                          {NumberFormatter.formatCurrency(step.result)}
                        </div>
                      ) : (
                        <div className="font-bold text-lg text-gray-900">
                          {typeof step.result === 'number' 
                            ? step.result.toLocaleString('en-US', { 
                                minimumFractionDigits: 1, 
                                maximumFractionDigits: 2 
                              })
                            : step.result
                          }
                        </div>
                      )}
                    </div>
                    <div className="text-gray-400">
                      {expandedStep === step.step ? '−' : '+'}
                    </div>
                  </div>
                </div>
              </button>
              
              {expandedStep === step.step && (
                <div className="px-6 py-4 bg-white border-t border-gray-200">
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Calculation:</div>
                      <div className="text-lg font-mono text-gray-900 bg-gray-50 px-3 py-2 rounded">
                        {step.calculation}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Explanation:</div>
                      <div className="text-sm text-gray-600">{step.explanation}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        </div>
      )}

      {/* Message when detailed breakdown is hidden */}
      {!showDetailedBreakdown && (
        <div className="mb-8 p-4 bg-gray-100 border border-gray-300 rounded-lg text-center">
          <div className="text-gray-600">
            <span className="text-sm">📊 Detailed calculation breakdown is hidden.</span>
            <br />
            <span className="text-xs text-gray-500">Check "Show Detailed Breakdown" above to see step-by-step calculations.</span>
          </div>
        </div>
      )}

      {/* AWS Benchmark Comparison */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          AWS Benchmark Comparison
          {isEnterpriseScale && (
            <span className="text-sm font-normal text-blue-700 ml-2">
              (Enterprise Scale)
            </span>
          )}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Your Results</h4>
            <div className="space-y-1 text-sm text-blue-700">
              <div>• ROI Multiple: {NumberFormatter.formatMultiple(results.roiMultiple)}</div>
              <div>• CTS-SW Improvement: {NumberFormatter.formatPercentage(scenario.ctsSwImprovementPercent)}</div>
              <div>• Cost Avoidance: {NumberFormatter.formatCurrency(results.costAvoidance)}</div>
              {isEnterpriseScale && (
                <div className="text-amber-700 font-medium">
                  • Scale: {NumberFormatter.getScaleDescription(NumberFormatter.getScaleIndicator(results.costAvoidance))}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-blue-800 mb-2">AWS Benchmarks</h4>
            <div className="space-y-1 text-sm text-blue-700">
              <div>• Bank Example: 9.75x ROI</div>
              <div>• AWS Achieved: 15.9% improvement</div>
              <div>• Tech Example: 9 point margin boost</div>
              {isEnterpriseScale && (
                <div className="text-blue-600 font-medium">
                  • Your scale matches AWS enterprise examples
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Performance Indicator */}
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">
              Performance vs AWS Benchmark:
            </span>
            <span className={`text-sm font-bold ${
              results.roiMultiple >= 9.75 ? 'text-green-600' : 
              results.roiMultiple >= 5 ? 'text-blue-600' : 'text-yellow-600'
            }`}>
              {results.roiMultiple >= 9.75 ? 'Exceeds AWS Benchmark' :
               results.roiMultiple >= 5 ? 'Strong ROI' : 'Moderate ROI'}
            </span>
          </div>
          
          {isEnterpriseScale && (
            <div className="mt-2 text-xs text-blue-600">
              {NumberFormatter.getROIContextMessage(results.roiMultiple)}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Breakdown Toggle */}
      {showDetailedBreakdown && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Supporting Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-gray-700">Deployments per Builder</div>
              <div className="text-gray-600">{results.supportingMetrics.deploymentsPerBuilder || 'Not calculated'}</div>
            </div>
            <div>
              <div className="font-medium text-gray-700">Interventions Reduction</div>
              <div className="text-gray-600">{results.supportingMetrics.interventionsReduction || 'Not calculated'}</div>
            </div>
            <div>
              <div className="font-medium text-gray-700">Incident Reduction</div>
              <div className="text-gray-600">{results.supportingMetrics.incidentReduction || 'Not calculated'}</div>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            * Supporting metrics will be implemented in future tasks
          </div>
        </div>
      )}
    </div>
  );
};