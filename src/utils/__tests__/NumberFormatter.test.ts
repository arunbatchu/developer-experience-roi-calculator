/**
 * Unit tests for NumberFormatter utility class
 * Tests all formatting functions, scale detection, and edge cases
 */

import { describe, it, expect } from 'vitest';
import { 
  NumberFormatter, 
  formatCurrency, 
  formatMultiple, 
  formatPercentage,
  getScaleIndicator,
  shouldShowScaleWarning
} from '../NumberFormatter';

describe('NumberFormatter', () => {
  describe('formatCurrency', () => {
    describe('abbreviated format', () => {
      it('should format small amounts without abbreviation', () => {
        expect(NumberFormatter.formatCurrency(500, 'abbreviated')).toBe('$500');
        expect(NumberFormatter.formatCurrency(999, 'abbreviated')).toBe('$999');
      });

      it('should format thousands with K abbreviation', () => {
        expect(NumberFormatter.formatCurrency(1000, 'abbreviated')).toBe('$1K');
        expect(NumberFormatter.formatCurrency(1500, 'abbreviated')).toBe('$1.5K');
        expect(NumberFormatter.formatCurrency(10000, 'abbreviated')).toBe('$10K');
        expect(NumberFormatter.formatCurrency(150000, 'abbreviated')).toBe('$150K');
      });

      it('should format millions with M abbreviation', () => {
        expect(NumberFormatter.formatCurrency(1000000, 'abbreviated')).toBe('$1M');
        expect(NumberFormatter.formatCurrency(1500000, 'abbreviated')).toBe('$1.50M');
        expect(NumberFormatter.formatCurrency(10000000, 'abbreviated')).toBe('$10M');
        expect(NumberFormatter.formatCurrency(150000000, 'abbreviated')).toBe('$150M');
      });

      it('should format billions with B abbreviation', () => {
        expect(NumberFormatter.formatCurrency(1000000000, 'abbreviated')).toBe('$1B');
        expect(NumberFormatter.formatCurrency(1500000000, 'abbreviated')).toBe('$1.50B');
        expect(NumberFormatter.formatCurrency(10000000000, 'abbreviated')).toBe('$10B');
      });

      it('should handle negative amounts', () => {
        expect(NumberFormatter.formatCurrency(-1500, 'abbreviated')).toBe('-$1.5K');
        expect(NumberFormatter.formatCurrency(-1500000, 'abbreviated')).toBe('-$1.50M');
      });

      it('should handle zero', () => {
        expect(NumberFormatter.formatCurrency(0, 'abbreviated')).toBe('$0');
      });
    });

    describe('full format', () => {
      it('should format with full precision and commas', () => {
        expect(NumberFormatter.formatCurrency(1500, 'full')).toBe('$1,500');
        expect(NumberFormatter.formatCurrency(1500000, 'full')).toBe('$1,500,000');
        expect(NumberFormatter.formatCurrency(1500000000, 'full')).toBe('$1,500,000,000');
      });

      it('should handle negative amounts in full format', () => {
        expect(NumberFormatter.formatCurrency(-1500000, 'full')).toBe('-$1,500,000');
      });
    });
  });

  describe('formatMultiple', () => {
    it('should format small multiples with 2 decimal places', () => {
      expect(NumberFormatter.formatMultiple(1.23)).toBe('1.23x');
      expect(NumberFormatter.formatMultiple(9.87)).toBe('9.87x');
    });

    it('should format medium multiples with 1 decimal place', () => {
      expect(NumberFormatter.formatMultiple(10.5)).toBe('10.5x');
      expect(NumberFormatter.formatMultiple(99.9)).toBe('99.9x');
    });

    it('should format large multiples with no decimal places', () => {
      expect(NumberFormatter.formatMultiple(100)).toBe('100x');
      expect(NumberFormatter.formatMultiple(150.7)).toBe('151x');
    });

    it('should handle edge cases', () => {
      expect(NumberFormatter.formatMultiple(0)).toBe('0.00x');
      expect(NumberFormatter.formatMultiple(9.999)).toBe('10.00x');
      expect(NumberFormatter.formatMultiple(99.99)).toBe('100.0x');
    });
  });

  describe('formatPercentage', () => {
    it('should format small percentages with 2 decimal places', () => {
      expect(NumberFormatter.formatPercentage(1.23)).toBe('1.23%');
      expect(NumberFormatter.formatPercentage(9.87)).toBe('9.87%');
    });

    it('should format medium percentages with 1 decimal place', () => {
      expect(NumberFormatter.formatPercentage(10.5)).toBe('10.5%');
      expect(NumberFormatter.formatPercentage(99.9)).toBe('99.9%');
    });

    it('should format large percentages with no decimal places', () => {
      expect(NumberFormatter.formatPercentage(100)).toBe('100%');
      expect(NumberFormatter.formatPercentage(150.7)).toBe('151%');
    });
  });

  describe('getScaleIndicator', () => {
    it('should identify small scale organizations', () => {
      expect(NumberFormatter.getScaleIndicator(1000000)).toBe('small'); // $1M
      expect(NumberFormatter.getScaleIndicator(2500000)).toBe('small'); // $2.5M (boundary)
    });

    it('should identify medium scale organizations', () => {
      expect(NumberFormatter.getScaleIndicator(2500001)).toBe('medium'); // Just over small
      expect(NumberFormatter.getScaleIndicator(30000000)).toBe('medium'); // $30M
      expect(NumberFormatter.getScaleIndicator(65000000)).toBe('medium'); // $65M (boundary)
    });

    it('should identify large scale organizations', () => {
      expect(NumberFormatter.getScaleIndicator(65000001)).toBe('large'); // Just over medium
      expect(NumberFormatter.getScaleIndicator(100000000)).toBe('large'); // $100M
      expect(NumberFormatter.getScaleIndicator(140000000)).toBe('large'); // $140M (boundary)
    });

    it('should identify enterprise scale organizations', () => {
      expect(NumberFormatter.getScaleIndicator(140000001)).toBe('enterprise'); // Just over large
      expect(NumberFormatter.getScaleIndicator(500000000)).toBe('enterprise'); // $500M
    });

    it('should handle negative amounts', () => {
      expect(NumberFormatter.getScaleIndicator(-30000000)).toBe('medium');
      expect(NumberFormatter.getScaleIndicator(-200000000)).toBe('enterprise');
    });
  });

  describe('shouldShowScaleWarning', () => {
    it('should show warning for amounts over $10M', () => {
      expect(NumberFormatter.shouldShowScaleWarning(10000001)).toBe(true);
      expect(NumberFormatter.shouldShowScaleWarning(50000000)).toBe(true);
    });

    it('should not show warning for amounts under $10M', () => {
      expect(NumberFormatter.shouldShowScaleWarning(9999999)).toBe(false);
      expect(NumberFormatter.shouldShowScaleWarning(5000000)).toBe(false);
      expect(NumberFormatter.shouldShowScaleWarning(1000000)).toBe(false);
    });

    it('should handle negative amounts', () => {
      expect(NumberFormatter.shouldShowScaleWarning(-15000000)).toBe(true);
      expect(NumberFormatter.shouldShowScaleWarning(-5000000)).toBe(false);
    });

    it('should handle boundary case exactly', () => {
      expect(NumberFormatter.shouldShowScaleWarning(10000000)).toBe(false);
    });
  });

  describe('getFormattedNumber', () => {
    it('should return complete formatted number object', () => {
      const result = NumberFormatter.getFormattedNumber(1500000);
      
      expect(result.abbreviated).toBe('$1.50M');
      expect(result.full).toBe('$1,500,000');
      expect(result.scale).toBe('small');
      expect(result.shouldShowWarning).toBe(false);
    });

    it('should return warning for large amounts', () => {
      const result = NumberFormatter.getFormattedNumber(50000000);
      
      expect(result.abbreviated).toBe('$50M');
      expect(result.full).toBe('$50,000,000');
      expect(result.scale).toBe('medium');
      expect(result.shouldShowWarning).toBe(true);
    });
  });

  describe('getScaleDescription', () => {
    it('should return correct descriptions for each scale', () => {
      expect(NumberFormatter.getScaleDescription('small')).toBe('Small organization (25-100 developers)');
      expect(NumberFormatter.getScaleDescription('medium')).toBe('Medium organization (100-500 developers)');
      expect(NumberFormatter.getScaleDescription('large')).toBe('Large organization (500-1000 developers)');
      expect(NumberFormatter.getScaleDescription('enterprise')).toBe('Enterprise organization (1000+ developers)');
    });
  });

  describe('getScaleWarningMessage', () => {
    it('should return null for amounts that do not need warnings', () => {
      expect(NumberFormatter.getScaleWarningMessage(5000000)).toBeNull();
    });

    it('should return enterprise warning for enterprise-scale amounts', () => {
      const message = NumberFormatter.getScaleWarningMessage(200000000);
      expect(message).toContain('enterprise-scale results');
      expect(message).toContain('smaller-scale scenarios');
    });

    it('should return general warning for large but non-enterprise amounts', () => {
      const message = NumberFormatter.getScaleWarningMessage(15000000);
      expect(message).toContain('significant investment');
      expect(message).toContain('verify your inputs');
    });
  });

  describe('formatTooltip', () => {
    it('should format tooltip with label', () => {
      const result = NumberFormatter.formatTooltip(1500000, 'Cost Avoidance');
      expect(result).toContain('Cost Avoidance: $1,500,000');
      expect(result).toContain('Small organization');
    });

    it('should format tooltip without label', () => {
      const result = NumberFormatter.formatTooltip(1500000);
      expect(result).toBe('$1,500,000 (Small organization (25-100 developers))');
    });
  });

  describe('getDecimalPlaces', () => {
    it('should return appropriate decimal places based on amount size', () => {
      expect(NumberFormatter.getDecimalPlaces(500)).toBe(2);
      expect(NumberFormatter.getDecimalPlaces(5000)).toBe(1);
      expect(NumberFormatter.getDecimalPlaces(50000)).toBe(0);
      expect(NumberFormatter.getDecimalPlaces(5000000)).toBe(0);
    });
  });

  describe('isEnterpriseScale', () => {
    it('should return true for enterprise-scale amounts', () => {
      expect(NumberFormatter.isEnterpriseScale(15000000)).toBe(true);
      expect(NumberFormatter.isEnterpriseScale(50000000)).toBe(true);
    });

    it('should return false for smaller amounts', () => {
      expect(NumberFormatter.isEnterpriseScale(5000000)).toBe(false);
      expect(NumberFormatter.isEnterpriseScale(9999999)).toBe(false);
    });

    it('should handle boundary case', () => {
      expect(NumberFormatter.isEnterpriseScale(10000000)).toBe(false);
      expect(NumberFormatter.isEnterpriseScale(10000001)).toBe(true);
    });
  });

  describe('getROIContextMessage', () => {
    it('should return appropriate messages for different ROI levels', () => {
      expect(NumberFormatter.getROIContextMessage(25)).toContain('Exceptional ROI');
      expect(NumberFormatter.getROIContextMessage(15)).toContain('Outstanding ROI');
      expect(NumberFormatter.getROIContextMessage(7)).toContain('Strong ROI');
      expect(NumberFormatter.getROIContextMessage(3)).toContain('Moderate ROI');
      expect(NumberFormatter.getROIContextMessage(1)).toContain('Low ROI');
    });

    it('should reference AWS benchmarks for outstanding ROI', () => {
      expect(NumberFormatter.getROIContextMessage(12)).toContain('AWS enterprise case studies');
    });

    it('should provide actionable advice for low ROI', () => {
      expect(NumberFormatter.getROIContextMessage(1.5)).toContain('alternative approaches');
    });
  });

  describe('generateAlternativeScenarios', () => {
    const largeScenario = {
      developerCount: 2000,
      ctsSwImprovementPercent: 20,
      solutionCost: 8000000,
      annualCostPerDeveloper: 150000
    };

    it('should suggest smaller team size for large teams', () => {
      const alternatives = NumberFormatter.generateAlternativeScenarios(largeScenario);
      
      const teamSizeAlternative = alternatives.find(alt => 
        alt.description.includes('quarter of current team size')
      );
      
      expect(teamSizeAlternative).toBeDefined();
      expect(teamSizeAlternative?.adjustments.developerCount).toBe(500);
      expect(teamSizeAlternative?.adjustments.solutionCost).toBe(4000000);
    });

    it('should suggest conservative improvement percentage', () => {
      const alternatives = NumberFormatter.generateAlternativeScenarios(largeScenario);
      
      const conservativeAlternative = alternatives.find(alt => 
        alt.description.includes('Conservative improvement')
      );
      
      expect(conservativeAlternative).toBeDefined();
      expect(conservativeAlternative?.adjustments.ctsSwImprovementPercent).toBe(15);
    });

    it('should suggest phased implementation for high solution costs', () => {
      const alternatives = NumberFormatter.generateAlternativeScenarios(largeScenario);
      
      const phasedAlternative = alternatives.find(alt => 
        alt.description.includes('Phased implementation')
      );
      
      expect(phasedAlternative).toBeDefined();
      expect(phasedAlternative?.adjustments.solutionCost).toBe(4000000);
      expect(phasedAlternative?.adjustments.ctsSwImprovementPercent).toBeLessThan(20);
    });

    it('should suggest typical mid-size scenario for very large inputs', () => {
      const alternatives = NumberFormatter.generateAlternativeScenarios(largeScenario);
      
      const midSizeAlternative = alternatives.find(alt => 
        alt.description.includes('Typical mid-size company')
      );
      
      expect(midSizeAlternative).toBeDefined();
      expect(midSizeAlternative?.adjustments.developerCount).toBe(250);
      expect(midSizeAlternative?.adjustments.annualCostPerDeveloper).toBe(120000);
      expect(midSizeAlternative?.adjustments.ctsSwImprovementPercent).toBe(12);
      expect(midSizeAlternative?.adjustments.solutionCost).toBe(600000);
    });

    it('should return empty array for reasonable scenarios', () => {
      const reasonableScenario = {
        developerCount: 200,
        ctsSwImprovementPercent: 12,
        solutionCost: 500000,
        annualCostPerDeveloper: 120000
      };

      const alternatives = NumberFormatter.generateAlternativeScenarios(reasonableScenario);
      expect(alternatives).toHaveLength(0);
    });

    it('should handle edge cases gracefully', () => {
      const edgeScenario = {
        developerCount: 1001, // Just over 1000
        ctsSwImprovementPercent: 15.1, // Just over 15
        solutionCost: 5000001, // Just over 5M
        annualCostPerDeveloper: 140001 // Just over 140K
      };

      const alternatives = NumberFormatter.generateAlternativeScenarios(edgeScenario);
      expect(alternatives.length).toBeGreaterThan(0);
    });
  });

  // Test AWS benchmark examples
  describe('AWS benchmark examples', () => {
    it('should correctly format AWS bank example cost avoidance', () => {
      const costAvoidance = 19500000; // $19.5M from AWS example
      expect(NumberFormatter.formatCurrency(costAvoidance, 'abbreviated')).toBe('$19.5M');
      expect(NumberFormatter.getScaleIndicator(costAvoidance)).toBe('medium');
      expect(NumberFormatter.shouldShowScaleWarning(costAvoidance)).toBe(true);
    });

    it('should correctly format AWS bank example ROI multiple', () => {
      const roiMultiple = 9.75;
      expect(NumberFormatter.formatMultiple(roiMultiple)).toBe('9.75x');
    });

    it('should correctly format typical developer costs', () => {
      expect(NumberFormatter.formatCurrency(130000, 'abbreviated')).toBe('$130K');
      expect(NumberFormatter.formatCurrency(130000, 'full')).toBe('$130,000');
    });
  });
});

// Test convenience functions
describe('Convenience functions', () => {
  it('should work as aliases to NumberFormatter methods', () => {
    expect(formatCurrency(1500000)).toBe(NumberFormatter.formatCurrency(1500000));
    expect(formatMultiple(9.75)).toBe(NumberFormatter.formatMultiple(9.75));
    expect(formatPercentage(15.5)).toBe(NumberFormatter.formatPercentage(15.5));
    expect(getScaleIndicator(30000000)).toBe(NumberFormatter.getScaleIndicator(30000000));
    expect(shouldShowScaleWarning(15000000)).toBe(NumberFormatter.shouldShowScaleWarning(15000000));
  });
});