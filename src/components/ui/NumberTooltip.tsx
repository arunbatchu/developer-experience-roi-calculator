/**
 * NumberTooltip component for displaying full precision values on hover
 * Used throughout the Development Productivity Calculator to show detailed number information
 */

import React, { useState } from 'react';
import { NumberFormatter } from '../../utils/NumberFormatter';
import type { FormattedNumber } from '../../utils/NumberFormatter';

interface NumberTooltipProps {
  amount: number;
  label?: string;
  children: React.ReactNode;
  className?: string;
  showScale?: boolean;
  showWarning?: boolean;
}

export const NumberTooltip: React.FC<NumberTooltipProps> = ({
  amount,
  label,
  children,
  className = '',
  showScale = true,
  showWarning = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const formattedNumber: FormattedNumber = NumberFormatter.getFormattedNumber(amount);

  const tooltipContent = () => {
    const parts = [];
    
    if (label) {
      parts.push(`${label}: ${formattedNumber.full}`);
    } else {
      parts.push(formattedNumber.full);
    }

    if (showScale) {
      parts.push(NumberFormatter.getScaleDescription(formattedNumber.scale));
    }

    if (showWarning && formattedNumber.shouldShowWarning) {
      const warningMsg = NumberFormatter.getScaleWarningMessage(amount);
      if (warningMsg) {
        parts.push(`⚠️ ${warningMsg}`);
      }
    }

    return parts.join('\n');
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      
      {isVisible && (
        <div className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-pre-line max-w-xs -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full">
          {tooltipContent()}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

/**
 * Convenience component for currency tooltips
 */
interface CurrencyTooltipProps extends Omit<NumberTooltipProps, 'children'> {
  amount: number;
  format?: 'abbreviated' | 'full';
  className?: string;
}

export const CurrencyTooltip: React.FC<CurrencyTooltipProps> = ({
  amount,
  format = 'abbreviated',
  className = '',
  ...props
}) => {
  const displayValue = NumberFormatter.formatCurrency(amount, format);
  
  return (
    <NumberTooltip amount={amount} className={className} {...props}>
      <span className="border-b border-dotted border-gray-400">
        {displayValue}
      </span>
    </NumberTooltip>
  );
};

/**
 * Convenience component for ROI multiple tooltips
 */
interface MultipleTooltipProps extends Omit<NumberTooltipProps, 'children' | 'amount'> {
  multiple: number;
  costAvoidance: number;
  solutionCost: number;
  className?: string;
}

export const MultipleTooltip: React.FC<MultipleTooltipProps> = ({
  multiple,
  costAvoidance,
  solutionCost,
  className = '',
  ...props
}) => {
  const displayValue = NumberFormatter.formatMultiple(multiple);
  const tooltipLabel = `ROI Calculation: ${NumberFormatter.formatCurrency(costAvoidance, 'full')} ÷ ${NumberFormatter.formatCurrency(solutionCost, 'full')}`;
  
  return (
    <NumberTooltip 
      amount={costAvoidance} 
      label={tooltipLabel}
      className={className} 
      {...props}
    >
      <span className="border-b border-dotted border-gray-400">
        {displayValue}
      </span>
    </NumberTooltip>
  );
};

export default NumberTooltip;