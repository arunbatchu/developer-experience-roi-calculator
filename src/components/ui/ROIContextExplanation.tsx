import React from 'react';
import { NumberFormatter } from '../../utils/NumberFormatter.js';

interface ROIContextExplanationProps {
  roiMultiple: number;
  costAvoidance: number;
  solutionCost: number;
  className?: string;
}

export const ROIContextExplanation: React.FC<ROIContextExplanationProps> = ({
  roiMultiple,
  costAvoidance,
  solutionCost,
  className = ''
}) => {
  const getROIExplanation = (roi: number) => {
    if (roi >= 20) {
      return {
        level: 'Exceptional',
        description: 'This represents exceptional ROI that significantly exceeds typical business investments.',
        context: 'ROI this high suggests transformational impact on developer productivity.',
        color: 'text-green-700',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    } else if (roi >= 10) {
      return {
        level: 'Outstanding',
        description: 'This matches AWS\'s bank example (9.75x) and represents outstanding business value.',
        context: 'ROI above 10x indicates a compelling business case that should be prioritized.',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    } else if (roi >= 5) {
      return {
        level: 'Strong',
        description: 'This represents strong ROI that exceeds most business investment thresholds.',
        context: 'ROI of 5-10x typically justifies significant platform investments.',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      };
    } else if (roi >= 2) {
      return {
        level: 'Moderate',
        description: 'This represents moderate ROI that may justify targeted investments.',
        context: 'ROI of 2-5x suggests selective implementation of high-impact improvements.',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      };
    } else {
      return {
        level: 'Low',
        description: 'This represents low ROI that may not justify the investment.',
        context: 'Consider focusing on higher-impact improvements or reducing solution costs.',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    }
  };

  const explanation = getROIExplanation(roiMultiple);

  const getPaybackPeriod = () => {
    // Assuming annual cost avoidance, payback period = solution cost / annual cost avoidance
    const paybackYears = solutionCost / costAvoidance;
    
    if (paybackYears < 0.25) {
      return 'less than 3 months';
    } else if (paybackYears < 0.5) {
      return 'about 6 months';
    } else if (paybackYears < 1) {
      return `about ${Math.round(paybackYears * 12)} months`;
    } else if (paybackYears < 2) {
      return `about ${paybackYears.toFixed(1)} years`;
    } else {
      return `${Math.round(paybackYears)} years`;
    }
  };

  const getBusinessContext = () => {
    const contexts = [];
    
    if (roiMultiple >= 10) {
      contexts.push('Typically approved at executive level without extensive justification');
      contexts.push('Comparable to AWS\'s published enterprise case studies');
    } else if (roiMultiple >= 5) {
      contexts.push('Strong business case for platform team funding');
      contexts.push('Exceeds most corporate investment hurdle rates');
    } else if (roiMultiple >= 2) {
      contexts.push('May require additional justification for large investments');
      contexts.push('Consider phased implementation approach');
    } else {
      contexts.push('Review assumptions and focus on highest-impact improvements');
      contexts.push('Consider alternative approaches or reduced scope');
    }

    return contexts;
  };

  return (
    <div className={`${explanation.bgColor} border ${explanation.borderColor} rounded-lg p-4 ${className}`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className={`font-semibold ${explanation.color}`}>
            {explanation.level} ROI ({NumberFormatter.formatMultiple(roiMultiple)})
          </h4>
          <span className="text-xs text-gray-500">
            Payback: {getPaybackPeriod()}
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <p className={explanation.color}>
            <strong>What this means:</strong> {explanation.description}
          </p>
          
          <p className="text-gray-600">
            <strong>Context:</strong> {explanation.context}
          </p>

          <div className="text-gray-600">
            <strong>Business implications:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1 text-xs ml-2">
              {getBusinessContext().map((context, index) => (
                <li key={index}>{context}</li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-gray-200 text-xs text-gray-500">
            <strong>Calculation:</strong> {NumberFormatter.formatCurrency(costAvoidance)} annual savings ÷ {NumberFormatter.formatCurrency(solutionCost)} investment = {NumberFormatter.formatMultiple(roiMultiple)} return
          </div>
        </div>
      </div>
    </div>
  );
};