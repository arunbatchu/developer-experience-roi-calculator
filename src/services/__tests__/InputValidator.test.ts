import { describe, it, expect, beforeEach } from 'vitest';
import { InputValidator } from '../InputValidator.js';
import { VALIDATION_RANGES } from '../../types/index.js';
import type { Scenario } from '../../types/index.js';

describe('InputValidator', () => {
  let validator: InputValidator;
  let validScenario: Scenario;

  beforeEach(() => {
    validator = new InputValidator();
    validScenario = {
      id: 'test-scenario',
      name: 'Test Scenario',
      businessType: 'traditional',
      developerCount: 1000,
      annualCostPerDeveloper: 130000,
      ctsSwImprovementPercent: 15,
      solutionCost: 2000000,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });

  describe('validateDeveloperCount', () => {
    it('should accept valid developer counts', () => {
      expect(validator.validateDeveloperCount(1)).toBeNull();
      expect(validator.validateDeveloperCount(1000)).toBeNull();
      expect(validator.validateDeveloperCount(50000)).toBeNull();
    });

    it('should reject null or undefined values', () => {
      expect(validator.validateDeveloperCount(null as any)).toContain('required');
      expect(validator.validateDeveloperCount(undefined as any)).toContain('required');
      expect(validator.validateDeveloperCount(NaN)).toContain('required');
    });

    it('should reject non-integer values', () => {
      expect(validator.validateDeveloperCount(10.5)).toContain('whole number');
      expect(validator.validateDeveloperCount(999.99)).toContain('whole number');
    });

    it('should reject values below minimum', () => {
      expect(validator.validateDeveloperCount(0)).toContain('at least 1');
      expect(validator.validateDeveloperCount(-5)).toContain('at least 1');
    });

    it('should reject values above maximum', () => {
      expect(validator.validateDeveloperCount(50001)).toContain('cannot exceed 50,000');
      expect(validator.validateDeveloperCount(100000)).toContain('cannot exceed 50,000');
    });
  });

  describe('validateAnnualCostPerDeveloper', () => {
    it('should accept valid cost ranges', () => {
      expect(validator.validateAnnualCostPerDeveloper(50000)).toBeNull();
      expect(validator.validateAnnualCostPerDeveloper(130000)).toBeNull();
      expect(validator.validateAnnualCostPerDeveloper(300000)).toBeNull();
    });

    it('should reject null or undefined values', () => {
      expect(validator.validateAnnualCostPerDeveloper(null as any)).toContain('required');
      expect(validator.validateAnnualCostPerDeveloper(undefined as any)).toContain('required');
      expect(validator.validateAnnualCostPerDeveloper(NaN)).toContain('required');
    });

    it('should reject zero or negative values', () => {
      expect(validator.validateAnnualCostPerDeveloper(0)).toContain('greater than zero');
      expect(validator.validateAnnualCostPerDeveloper(-1000)).toContain('greater than zero');
    });

    it('should reject values below minimum with helpful message', () => {
      expect(validator.validateAnnualCostPerDeveloper(49999)).toContain('at least $50,000');
      expect(validator.validateAnnualCostPerDeveloper(30000)).toContain('includes salary, benefits, and tooling');
    });

    it('should reject values above maximum with AWS reference', () => {
      expect(validator.validateAnnualCostPerDeveloper(300001)).toContain('cannot exceed $300,000');
      expect(validator.validateAnnualCostPerDeveloper(500000)).toContain('AWS example: $130K');
    });

    it('should not provide warnings for valid values', () => {
      // Values within the valid range should not trigger warnings
      expect(validator.validateAnnualCostPerDeveloper(50000)).toBeNull();
      expect(validator.validateAnnualCostPerDeveloper(80000)).toBeNull();
    });
  });

  describe('validateCtsSwImprovement', () => {
    it('should accept valid improvement percentages', () => {
      expect(validator.validateCtsSwImprovement(0.1)).toBeNull();
      expect(validator.validateCtsSwImprovement(15)).toBeNull();
      expect(validator.validateCtsSwImprovement(50)).toBeNull();
    });

    it('should reject null or undefined values', () => {
      expect(validator.validateCtsSwImprovement(null as any)).toContain('required');
      expect(validator.validateCtsSwImprovement(undefined as any)).toContain('required');
      expect(validator.validateCtsSwImprovement(NaN)).toContain('required');
    });

    it('should reject zero or negative values', () => {
      expect(validator.validateCtsSwImprovement(0)).toContain('greater than zero');
      expect(validator.validateCtsSwImprovement(-5)).toContain('greater than zero');
    });

    it('should reject values below minimum', () => {
      expect(validator.validateCtsSwImprovement(0.05)).toContain('at least 0.1%');
    });

    it('should reject values above maximum', () => {
      expect(validator.validateCtsSwImprovement(51)).toContain('cannot exceed 50%');
      expect(validator.validateCtsSwImprovement(100)).toContain('be realistic');
    });

    it('should not provide warnings for valid values', () => {
      // Values within the valid range should not trigger warnings
      expect(validator.validateCtsSwImprovement(25)).toBeNull();
      expect(validator.validateCtsSwImprovement(50)).toBeNull();
    });
  });

  describe('validateSolutionCost', () => {
    it('should accept valid solution costs', () => {
      expect(validator.validateSolutionCost(1000)).toBeNull();
      expect(validator.validateSolutionCost(2000000)).toBeNull();
      expect(validator.validateSolutionCost(100000000)).toBeNull();
    });

    it('should reject null or undefined values', () => {
      expect(validator.validateSolutionCost(null as any)).toContain('required');
      expect(validator.validateSolutionCost(undefined as any)).toContain('required');
      expect(validator.validateSolutionCost(NaN)).toContain('required');
    });

    it('should reject zero or negative values', () => {
      expect(validator.validateSolutionCost(0)).toContain('greater than zero');
      expect(validator.validateSolutionCost(-1000)).toContain('greater than zero');
    });

    it('should reject values below minimum', () => {
      expect(validator.validateSolutionCost(999)).toContain('at least $1,000');
    });

    it('should reject values above maximum', () => {
      expect(validator.validateSolutionCost(100000001)).toContain('cannot exceed $100,000,000');
    });
  });

  describe('validateRevenuePercentage', () => {
    it('should accept valid revenue percentages', () => {
      expect(validator.validateRevenuePercentage(0)).toBeNull();
      expect(validator.validateRevenuePercentage(60)).toBeNull();
      expect(validator.validateRevenuePercentage(100)).toBeNull();
    });

    it('should reject null or undefined values', () => {
      expect(validator.validateRevenuePercentage(null as any)).toContain('required for tech companies');
      expect(validator.validateRevenuePercentage(undefined)).toContain('required for tech companies');
      expect(validator.validateRevenuePercentage(NaN)).toContain('required for tech companies');
    });

    it('should reject values below minimum', () => {
      expect(validator.validateRevenuePercentage(-1)).toContain('at least 0%');
    });

    it('should reject values above maximum', () => {
      expect(validator.validateRevenuePercentage(101)).toContain('cannot exceed 100%');
    });
  });

  describe('validateScenario', () => {
    it('should return no errors for valid traditional business scenario', () => {
      const errors = validator.validateScenario(validScenario);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('should return no errors for valid tech company scenario', () => {
      const techScenario: Scenario = {
        ...validScenario,
        businessType: 'tech',
        revenuePercentage: 60
      };
      const errors = validator.validateScenario(techScenario);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('should validate all fields and return multiple errors', () => {
      const invalidScenario: Scenario = {
        ...validScenario,
        developerCount: -1,
        annualCostPerDeveloper: 0,
        ctsSwImprovementPercent: 100,
        solutionCost: -1000
      };
      
      const errors = validator.validateScenario(invalidScenario);
      expect(errors.developerCount).toBeDefined();
      expect(errors.annualCostPerDeveloper).toBeDefined();
      expect(errors.ctsSwImprovementPercent).toBeDefined();
      expect(errors.solutionCost).toBeDefined();
    });

    it('should require revenue percentage for tech companies', () => {
      const techScenario: Scenario = {
        ...validScenario,
        businessType: 'tech'
        // revenuePercentage is undefined
      };
      
      const errors = validator.validateScenario(techScenario);
      expect(errors.revenuePercentage).toContain('required for tech companies');
    });
  });

  describe('validateCrossFieldConstraints', () => {
    it('should warn when solution cost is too high relative to developer cost', () => {
      const expensiveScenario: Scenario = {
        ...validScenario,
        developerCount: 10,
        annualCostPerDeveloper: 100000,
        solutionCost: 600000 // 60% of total developer cost
      };
      
      const errors = validator.validateCrossFieldConstraints(expensiveScenario);
      expect(errors.solutionCost).toContain('seems high relative to total developer cost');
    });

    it('should warn about unrealistic improvement for small investments', () => {
      const unrealisticScenario: Scenario = {
        ...validScenario,
        developerCount: 1000,
        annualCostPerDeveloper: 130000,
        solutionCost: 1000, // Very small investment
        ctsSwImprovementPercent: 20 // High improvement
      };
      
      const errors = validator.validateCrossFieldConstraints(unrealisticScenario);
      expect(errors.ctsSwImprovementPercent).toContain('may be unrealistic for a relatively small investment');
    });

    it('should warn about high costs for small teams', () => {
      const smallTeamScenario: Scenario = {
        ...validScenario,
        developerCount: 5,
        solutionCost: 600000
      };
      
      const errors = validator.validateCrossFieldConstraints(smallTeamScenario);
      expect(errors.general).toContain('High solution cost for a small team');
    });

    it('should return no errors for reasonable scenarios', () => {
      const errors = validator.validateCrossFieldConstraints(validScenario);
      expect(Object.keys(errors)).toHaveLength(0);
    });
  });

  describe('validateField', () => {
    it('should validate individual fields correctly', () => {
      expect(validator.validateField('developerCount', 1000)).toBeNull();
      expect(validator.validateField('developerCount', -1)).toContain('at least 1');
      
      expect(validator.validateField('annualCostPerDeveloper', 130000)).toBeNull();
      expect(validator.validateField('annualCostPerDeveloper', 0)).toContain('greater than zero');
      
      expect(validator.validateField('ctsSwImprovementPercent', 15)).toBeNull();
      expect(validator.validateField('ctsSwImprovementPercent', 100)).toContain('cannot exceed 50%');
      
      expect(validator.validateField('solutionCost', 2000000)).toBeNull();
      expect(validator.validateField('solutionCost', -1000)).toContain('greater than zero');
    });

    it('should validate revenue percentage only for tech companies', () => {
      expect(validator.validateField('revenuePercentage', undefined, 'traditional')).toBeNull();
      expect(validator.validateField('revenuePercentage', undefined, 'tech')).toContain('required for tech companies');
      expect(validator.validateField('revenuePercentage', 60, 'tech')).toBeNull();
    });

    it('should return null for unknown fields', () => {
      expect(validator.validateField('unknownField' as any, 'value')).toBeNull();
    });
  });

  describe('boundary conditions', () => {
    it('should handle exact boundary values correctly', () => {
      // Test exact minimum values
      expect(validator.validateDeveloperCount(VALIDATION_RANGES.developerCount.min)).toBeNull();
      expect(validator.validateAnnualCostPerDeveloper(VALIDATION_RANGES.annualCostPerDeveloper.min)).toBeNull();
      expect(validator.validateCtsSwImprovement(VALIDATION_RANGES.ctsSwImprovementPercent.min)).toBeNull();
      expect(validator.validateSolutionCost(VALIDATION_RANGES.solutionCost.min)).toBeNull();
      expect(validator.validateRevenuePercentage(VALIDATION_RANGES.revenuePercentage.min)).toBeNull();

      // Test exact maximum values
      expect(validator.validateDeveloperCount(VALIDATION_RANGES.developerCount.max)).toBeNull();
      expect(validator.validateAnnualCostPerDeveloper(VALIDATION_RANGES.annualCostPerDeveloper.max)).toBeNull();
      expect(validator.validateCtsSwImprovement(VALIDATION_RANGES.ctsSwImprovementPercent.max)).toBeNull();
      expect(validator.validateSolutionCost(VALIDATION_RANGES.solutionCost.max)).toBeNull();
      expect(validator.validateRevenuePercentage(VALIDATION_RANGES.revenuePercentage.max)).toBeNull();
    });

    it('should reject values just outside boundaries', () => {
      // Test just below minimum
      expect(validator.validateDeveloperCount(VALIDATION_RANGES.developerCount.min - 1)).not.toBeNull();
      expect(validator.validateAnnualCostPerDeveloper(VALIDATION_RANGES.annualCostPerDeveloper.min - 1)).not.toBeNull();
      expect(validator.validateCtsSwImprovement(VALIDATION_RANGES.ctsSwImprovementPercent.min - 0.01)).not.toBeNull();
      expect(validator.validateSolutionCost(VALIDATION_RANGES.solutionCost.min - 1)).not.toBeNull();
      expect(validator.validateRevenuePercentage(VALIDATION_RANGES.revenuePercentage.min - 1)).not.toBeNull();

      // Test just above maximum
      expect(validator.validateDeveloperCount(VALIDATION_RANGES.developerCount.max + 1)).not.toBeNull();
      expect(validator.validateAnnualCostPerDeveloper(VALIDATION_RANGES.annualCostPerDeveloper.max + 1)).not.toBeNull();
      expect(validator.validateCtsSwImprovement(VALIDATION_RANGES.ctsSwImprovementPercent.max + 0.01)).not.toBeNull();
      expect(validator.validateSolutionCost(VALIDATION_RANGES.solutionCost.max + 1)).not.toBeNull();
      expect(validator.validateRevenuePercentage(VALIDATION_RANGES.revenuePercentage.max + 1)).not.toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle floating point precision issues', () => {
      expect(validator.validateCtsSwImprovement(0.1)).toBeNull();
      expect(validator.validateCtsSwImprovement(0.09999999)).not.toBeNull();
      expect(validator.validateCtsSwImprovement(50.00000001)).not.toBeNull();
    });

    it('should handle very large numbers', () => {
      expect(validator.validateDeveloperCount(Number.MAX_SAFE_INTEGER)).not.toBeNull();
      expect(validator.validateAnnualCostPerDeveloper(Number.MAX_SAFE_INTEGER)).not.toBeNull();
      expect(validator.validateSolutionCost(Number.MAX_SAFE_INTEGER)).not.toBeNull();
    });

    it('should handle special numeric values', () => {
      expect(validator.validateDeveloperCount(Infinity)).not.toBeNull();
      expect(validator.validateDeveloperCount(-Infinity)).not.toBeNull();
      expect(validator.validateAnnualCostPerDeveloper(Infinity)).not.toBeNull();
      expect(validator.validateCtsSwImprovement(Infinity)).not.toBeNull();
    });
  });

  describe('getValidationRanges', () => {
    it('should return validation ranges', () => {
      const ranges = validator.getValidationRanges();
      expect(ranges).toEqual(VALIDATION_RANGES);
    });
  });

  describe('getFieldDescriptions', () => {
    it('should return field descriptions with examples', () => {
      const descriptions = validator.getFieldDescriptions();
      expect(descriptions.developerCount.label).toBe('Number of Developers');
      expect(descriptions.developerCount.example).toContain('AWS');
      expect(descriptions.annualCostPerDeveloper.example).toContain('$130,000');
      expect(descriptions.ctsSwImprovementPercent.example).toContain('15.9%');
      expect(descriptions.solutionCost.example).toContain('$2,000,000');
      expect(descriptions.revenuePercentage.example).toContain('60-80%');
    });
  });
});