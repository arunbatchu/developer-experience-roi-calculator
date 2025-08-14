import React from 'react';
import { NumberFormatter } from '../../utils/NumberFormatter.js';
import type { CalculationResults, Scenario } from '../../types/index.js';

interface ScaleWarningProps {
  results: CalculationResults;
  scenario: Scenario;
  onSuggestAlternative?: () => void;
}

export const ScaleWarning: React.FC<ScaleWarningProps> = ({
  results,
  scenario,
  onSuggestAlternative
}) => {
  const costAvoidanceWarning = NumberFormatter.shouldShowScaleWarning(results.costAvoidance);
  const totalCostWarning = NumberFormatter.shouldShowScaleWarning(results.totalDeveloperCost);
  
  if (!costAvoidanceWarning && !totalCostWarning) {
    return null;
  }

  const scale = NumberFormatter.getScaleIndicator(results.costAvoidance);
  const isEnterpriseScale = NumberFormatter.isEnterpriseScale(results.costAvoidance) && scale === 'enterprise';

  const getWarningIcon = () => (
    <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );

  const getSuggestedAlternatives = () => {
    const alternatives = [];
    
    if (scenario.developerCount > 1000) {
      alternatives.push(`Try with ${Math.floor(scenario.developerCount / 4)} developers (quarter of current size)`);
    }
    
    if (scenario.ctsSwImprovementPercent > 15) {
      alternatives.push(`Start with 10-15% improvement (AWS benchmark range)`);
    }
    
    if (scenario.solutionCost > 5000000) {
      alternatives.push(`Consider phased implementation with lower initial investment`);
    }

    return alternatives;
  };

  const alternatives = getSuggestedAlternatives();

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        {getWarningIcon()}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-amber-800 mb-2">
            {isEnterpriseScale ? 'Enterprise-Scale Results' : 'Large-Scale Results'}
          </h3>
          
          <div className="text-sm text-amber-700 space-y-2">
            <p>
              {isEnterpriseScale 
                ? `Your results show enterprise-scale impact (${NumberFormatter.formatCurrency(results.costAvoidance)} cost avoidance). This matches AWS's large enterprise case studies.`
                : `Your results show significant scale (${NumberFormatter.formatCurrency(results.costAvoidance)} cost avoidance). Please verify your inputs are realistic for your organization.`
              }
            </p>
            
            {alternatives.length > 0 && (
              <div>
                <p className="font-medium mb-1">Consider these alternatives for comparison:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  {alternatives.map((alternative, index) => (
                    <li key={index} className="text-xs">{alternative}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {onSuggestAlternative && (
            <button
              onClick={onSuggestAlternative}
              className="mt-3 text-xs font-medium text-amber-800 hover:text-amber-900 underline"
            >
              Generate smaller-scale scenario
            </button>
          )}
        </div>
      </div>
    </div>
  );
};