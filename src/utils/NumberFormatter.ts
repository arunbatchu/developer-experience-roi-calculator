/**
 * NumberFormatter utility class for the Developer Experience ROI Calculator
 * Provides intelligent number formatting with abbreviated notation and scale detection
 */

export type NumberFormat = 'abbreviated' | 'full';
export type OrganizationScale = 'small' | 'medium' | 'large' | 'enterprise';

export interface FormattedNumber {
  abbreviated: string;
  full: string;
  scale: OrganizationScale;
  shouldShowWarning: boolean;
}

export class NumberFormatter {
  private static readonly SCALE_THRESHOLDS = {
    small: { max: 2500000 }, // Up to $2.5M total cost (25-100 devs * $100K-$120K)
    medium: { max: 65000000 }, // Up to $65M total cost (100-500 devs * $110K-$130K)
    large: { max: 140000000 }, // Up to $140M total cost (500-1000 devs * $120K-$140K)
    enterprise: { max: Infinity } // Above $140M total cost (1000+ devs * $130K-$150K)
  };

  private static readonly ENTERPRISE_WARNING_THRESHOLD = 10000000; // $10M

  /**
   * Format currency with automatic scale detection
   */
  static formatCurrency(amount: number, format: NumberFormat = 'abbreviated'): string {
    if (format === 'full') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    }

    return this.formatCurrencyAbbreviated(amount);
  }

  /**
   * Format currency with abbreviated notation (K, M, B)
   */
  private static formatCurrencyAbbreviated(amount: number): string {
    const absAmount = Math.abs(amount);
    const sign = amount < 0 ? '-' : '';

    if (absAmount >= 1000000000) {
      const billions = absAmount / 1000000000;
      const decimals = billions % 1 === 0 ? 0 : (billions >= 10 ? 1 : 2);
      return `${sign}$${billions.toFixed(decimals)}B`;
    } else if (absAmount >= 1000000) {
      const millions = absAmount / 1000000;
      const decimals = millions % 1 === 0 ? 0 : (millions >= 10 ? 1 : 2);
      return `${sign}$${millions.toFixed(decimals)}M`;
    } else if (absAmount >= 1000) {
      const thousands = absAmount / 1000;
      const decimals = thousands % 1 === 0 ? 0 : (thousands >= 10 ? 0 : 1);
      return `${sign}$${thousands.toFixed(decimals)}K`;
    } else {
      return `${sign}$${absAmount.toFixed(0)}`;
    }
  }

  /**
   * Format ROI multiple with proper precision
   */
  static formatMultiple(multiple: number): string {
    if (multiple >= 100) {
      return `${multiple.toFixed(0)}x`;
    } else if (multiple >= 10) {
      return `${multiple.toFixed(1)}x`;
    } else {
      return `${multiple.toFixed(2)}x`;
    }
  }

  /**
   * Format percentage with appropriate precision
   */
  static formatPercentage(percent: number): string {
    if (percent >= 100) {
      return `${percent.toFixed(0)}%`;
    } else if (percent >= 10) {
      return `${percent.toFixed(1)}%`;
    } else {
      return `${percent.toFixed(2)}%`;
    }
  }

  /**
   * Get organization scale based on total cost or result amount
   */
  static getScaleIndicator(amount: number): OrganizationScale {
    const absAmount = Math.abs(amount);

    if (absAmount <= this.SCALE_THRESHOLDS.small.max) {
      return 'small';
    } else if (absAmount <= this.SCALE_THRESHOLDS.medium.max) {
      return 'medium';
    } else if (absAmount <= this.SCALE_THRESHOLDS.large.max) {
      return 'large';
    } else {
      return 'enterprise';
    }
  }

  /**
   * Determine if a scale warning should be shown for very large numbers
   */
  static shouldShowScaleWarning(amount: number): boolean {
    return Math.abs(amount) > this.ENTERPRISE_WARNING_THRESHOLD;
  }

  /**
   * Get a complete formatted number object with all formatting options
   */
  static getFormattedNumber(amount: number): FormattedNumber {
    return {
      abbreviated: this.formatCurrency(amount, 'abbreviated'),
      full: this.formatCurrency(amount, 'full'),
      scale: this.getScaleIndicator(amount),
      shouldShowWarning: this.shouldShowScaleWarning(amount)
    };
  }

  /**
   * Get scale-appropriate description for organization size
   */
  static getScaleDescription(scale: OrganizationScale): string {
    switch (scale) {
      case 'small':
        return 'Small organization (25-100 developers)';
      case 'medium':
        return 'Medium organization (100-500 developers)';
      case 'large':
        return 'Large organization (500-1000 developers)';
      case 'enterprise':
        return 'Enterprise organization (1000+ developers)';
      default:
        return 'Unknown organization size';
    }
  }

  /**
   * Get warning message for enterprise-scale results
   */
  static getScaleWarningMessage(amount: number): string | null {
    if (!this.shouldShowScaleWarning(amount)) {
      return null;
    }

    const scale = this.getScaleIndicator(amount);
    if (scale === 'enterprise') {
      return 'These are enterprise-scale results. Consider reviewing your inputs or exploring smaller-scale scenarios for comparison.';
    }

    return 'This result represents a significant investment. Please verify your inputs are realistic for your organization size.';
  }

  /**
   * Format number for display in tooltips with full precision
   */
  static formatTooltip(amount: number, label?: string): string {
    const fullAmount = this.formatCurrency(amount, 'full');
    const scale = this.getScaleIndicator(amount);
    const scaleDesc = this.getScaleDescription(scale);
    
    if (label) {
      return `${label}: ${fullAmount} (${scaleDesc})`;
    }
    
    return `${fullAmount} (${scaleDesc})`;
  }

  /**
   * Get appropriate number of decimal places based on amount size
   */
  static getDecimalPlaces(amount: number): number {
    const absAmount = Math.abs(amount);
    
    if (absAmount >= 1000000) {
      return 0; // Millions and above: no decimals
    } else if (absAmount >= 10000) {
      return 0; // Ten thousands and above: no decimals
    } else if (absAmount >= 1000) {
      return 1; // Thousands: 1 decimal
    } else {
      return 2; // Under 1000: 2 decimals
    }
  }

  /**
   * Check if results represent enterprise-scale (over $10M cost avoidance)
   */
  static isEnterpriseScale(costAvoidance: number): boolean {
    return Math.abs(costAvoidance) > this.ENTERPRISE_WARNING_THRESHOLD;
  }

  /**
   * Get contextual message for ROI multiple
   */
  static getROIContextMessage(roiMultiple: number): string {
    if (roiMultiple >= 20) {
      return 'Exceptional ROI - This represents transformational business impact';
    } else if (roiMultiple >= 10) {
      return 'Outstanding ROI - Matches AWS enterprise case studies';
    } else if (roiMultiple >= 5) {
      return 'Strong ROI - Exceeds typical business investment thresholds';
    } else if (roiMultiple >= 2) {
      return 'Moderate ROI - May justify targeted investments';
    } else {
      return 'Low ROI - Consider alternative approaches or reduced scope';
    }
  }

  /**
   * Generate alternative scenario suggestions for large-scale results
   */
  static generateAlternativeScenarios(scenario: {
    developerCount: number;
    ctsSwImprovementPercent: number;
    solutionCost: number;
    annualCostPerDeveloper: number;
  }): Array<{
    description: string;
    adjustments: Partial<typeof scenario>;
  }> {
    const alternatives = [];

    // Suggest smaller team size if very large
    if (scenario.developerCount > 1000) {
      alternatives.push({
        description: 'Medium-scale scenario (quarter of current team size)',
        adjustments: {
          developerCount: Math.floor(scenario.developerCount / 4),
          solutionCost: Math.floor(scenario.solutionCost / 2) // Proportionally reduce solution cost
        }
      });
    }

    // Suggest more conservative improvement percentage
    if (scenario.ctsSwImprovementPercent > 15) {
      alternatives.push({
        description: 'Conservative improvement (AWS benchmark level)',
        adjustments: {
          ctsSwImprovementPercent: 15
        }
      });
    }

    // Suggest phased implementation with lower initial cost
    if (scenario.solutionCost > 5000000) {
      alternatives.push({
        description: 'Phased implementation (50% of solution cost)',
        adjustments: {
          solutionCost: Math.floor(scenario.solutionCost / 2),
          ctsSwImprovementPercent: Math.max(5, scenario.ctsSwImprovementPercent * 0.7) // Proportionally reduce improvement
        }
      });
    }

    // Suggest typical mid-size company scenario
    if (scenario.developerCount > 500 || scenario.annualCostPerDeveloper > 140000) {
      alternatives.push({
        description: 'Typical mid-size company scenario',
        adjustments: {
          developerCount: 250,
          annualCostPerDeveloper: 120000,
          ctsSwImprovementPercent: 12,
          solutionCost: 600000
        }
      });
    }

    return alternatives;
  }
}

// Export convenience functions for backward compatibility
export const formatCurrency = (amount: number, format: NumberFormat = 'abbreviated'): string => 
  NumberFormatter.formatCurrency(amount, format);

export const formatMultiple = (multiple: number): string => 
  NumberFormatter.formatMultiple(multiple);

export const formatPercentage = (percent: number): string => 
  NumberFormatter.formatPercentage(percent);

export const getScaleIndicator = (amount: number): OrganizationScale => 
  NumberFormatter.getScaleIndicator(amount);

export const shouldShowScaleWarning = (amount: number): boolean => 
  NumberFormatter.shouldShowScaleWarning(amount);