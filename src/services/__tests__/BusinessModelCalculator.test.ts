import { describe, it, expect, beforeEach } from 'vitest';
import { BusinessModelCalculator } from '../BusinessModelCalculator.js';
import { AWS_BENCHMARKS } from '../../types/index.js';
import type { Scenario } from '../../types/index.js';

describe('BusinessModelCalculator', () => {
  let calculator: BusinessModelCalculator;

  beforeEach(() => {
    calculator = new BusinessModelCalculator();
  });

  describe('Traditional Business Model Calculations', () => {
    it('should calculate AWS bank example correctly (1K developers, $130K each, 15% improvement = 10x ROI)', () => {
      const awsBankScenario: Scenario = {
        id: 'aws-bank-test',
        name: 'AWS Bank Example',
        businessType: 'traditional',
        developerCount: AWS_BENCHMARKS.BANK_EXAMPLE.developerCount,
        annualCostPerDeveloper: AWS_BENCHMARKS.BANK_EXAMPLE.annualCostPerDeveloper,
        ctsSwImprovementPercent: AWS_BENCHMARKS.BANK_EXAMPLE.ctsSwImprovementPercent,
        solutionCost: AWS_BENCHMARKS.BANK_EXAMPLE.solutionCost,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const results = calculator.calculateTraditionalBusiness(awsBankScenario);

      // Verify core calculations
      expect(results.totalDeveloperCost).toBe(130_000_000); // 1000 * $130K
      expect(results.costAvoidance).toBe(19_500_000); // $130M * 15%
      expect(results.roiMultiple).toBe(9.75); // $19.5M / $2M
      expect(results.roiPercentage).toBe(875); // (9.75 - 1) * 100

      // Verify calculation steps
      expect(results.calculationSteps).toHaveLength(3);
      
      const [step1, step2, step3] = results.calculationSteps;
      
      expect(step1.description).toBe('Calculate Total Developer Cost');
      expect(step1.result).toBe(130_000_000);
      expect(step1.formula).toBe('Developer Count × Annual Cost per Developer');
      
      expect(step2.description).toBe('Calculate Cost Avoidance');
      expect(step2.result).toBe(19_500_000);
      expect(step2.formula).toBe('Total Developer Cost × CTS-SW Improvement %');
      
      expect(step3.description).toBe('Calculate ROI Multiple');
      expect(step3.result).toBe(9.75);
      expect(step3.formula).toBe('Cost Avoidance ÷ Solution Cost');
    });

    it('should calculate cost avoidance formula correctly: Total Developer Cost × CTS-SW Improvement %', () => {
      const scenario: Scenario = {
        id: 'test-cost-avoidance',
        name: 'Cost Avoidance Test',
        businessType: 'traditional',
        developerCount: 500,
        annualCostPerDeveloper: 120_000,
        ctsSwImprovementPercent: 10,
        solutionCost: 1_000_000,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const results = calculator.calculateTraditionalBusiness(scenario);
      
      const expectedTotalCost = 500 * 120_000; // $60M
      const expectedCostAvoidance = expectedTotalCost * 0.10; // $6M
      
      expect(results.totalDeveloperCost).toBe(expectedTotalCost);
      expect(results.costAvoidance).toBe(expectedCostAvoidance);
    });

    it('should calculate ROI multiple formula correctly: Cost Avoidance ÷ Solution Cost', () => {
      const scenario: Scenario = {
        id: 'test-roi-multiple',
        name: 'ROI Multiple Test',
        businessType: 'traditional',
        developerCount: 200,
        annualCostPerDeveloper: 100_000,
        ctsSwImprovementPercent: 20,
        solutionCost: 500_000,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const results = calculator.calculateTraditionalBusiness(scenario);
      
      const expectedCostAvoidance = (200 * 100_000) * 0.20; // $4M
      const expectedRoiMultiple = expectedCostAvoidance / 500_000; // 8x
      
      expect(results.costAvoidance).toBe(expectedCostAvoidance);
      expect(results.roiMultiple).toBe(expectedRoiMultiple);
      expect(results.roiPercentage).toBe((expectedRoiMultiple - 1) * 100);
    });

    it('should handle edge cases with small numbers', () => {
      const scenario: Scenario = {
        id: 'test-small-numbers',
        name: 'Small Numbers Test',
        businessType: 'traditional',
        developerCount: 1,
        annualCostPerDeveloper: 50_000,
        ctsSwImprovementPercent: 0.1,
        solutionCost: 1_000,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const results = calculator.calculateTraditionalBusiness(scenario);
      
      expect(results.totalDeveloperCost).toBe(50_000);
      expect(results.costAvoidance).toBe(50); // $50K * 0.1%
      expect(results.roiMultiple).toBe(0.05); // $50 / $1K
    });

    it('should handle edge cases with large numbers', () => {
      const scenario: Scenario = {
        id: 'test-large-numbers',
        name: 'Large Numbers Test',
        businessType: 'traditional',
        developerCount: 10_000,
        annualCostPerDeveloper: 200_000,
        ctsSwImprovementPercent: 25,
        solutionCost: 10_000_000,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const results = calculator.calculateTraditionalBusiness(scenario);
      
      expect(results.totalDeveloperCost).toBe(2_000_000_000); // $2B
      expect(results.costAvoidance).toBe(500_000_000); // $500M
      expect(results.roiMultiple).toBe(50); // 50x ROI
    });
  });

  describe('Tech Company Model Calculations', () => {
    it('should calculate basic traditional metrics for tech companies', () => {
      const techScenario: Scenario = {
        id: 'tech-test',
        name: 'Tech Company Test',
        businessType: 'tech',
        developerCount: 400,
        annualCostPerDeveloper: 150_000,
        ctsSwImprovementPercent: 15,
        solutionCost: 1_000_000,
        revenuePercentage: 60,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const results = calculator.calculateTechCompany(techScenario);
      
      // Should include basic traditional calculations
      expect(results.totalDeveloperCost).toBe(60_000_000); // 400 * $150K
      expect(results.costAvoidance).toBe(9_000_000); // $60M * 15%
      expect(results.roiMultiple).toBe(9); // $9M / $1M
      
      // Tech-specific fields should be present (even if placeholder values)
      expect(results.grossMarginImprovement).toBeDefined();
      expect(results.profitImpact).toBeDefined();
      expect(results.profitBoostPercentage).toBeDefined();
      
      // Should have additional calculation step for tech company
      expect(results.calculationSteps.length).toBeGreaterThan(3);
    });

    it('should require revenue percentage for tech companies', () => {
      const techScenarioWithoutRevenue: Scenario = {
        id: 'tech-no-revenue',
        name: 'Tech Company Without Revenue',
        businessType: 'tech',
        developerCount: 400,
        annualCostPerDeveloper: 150_000,
        ctsSwImprovementPercent: 15,
        solutionCost: 1_000_000,
        // revenuePercentage missing
        createdAt: new Date(),
        updatedAt: new Date()
      };

      expect(() => {
        calculator.calculateTechCompany(techScenarioWithoutRevenue);
      }).toThrow('Validation failed: Revenue percentage is required for tech companies');
    });
  });

  describe('Input Validation', () => {
    it('should validate developer count range', () => {
      const invalidScenario: Scenario = {
        id: 'invalid-dev-count',
        name: 'Invalid Developer Count',
        businessType: 'traditional',
        developerCount: 0, // Invalid: below minimum
        annualCostPerDeveloper: 130_000,
        ctsSwImprovementPercent: 15,
        solutionCost: 2_000_000,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const errors = calculator.validateInputs(invalidScenario);
      expect(errors.developerCount).toContain('Developer count must be at least 1');
    });

    it('should validate annual cost per developer range', () => {
      const invalidScenario: Scenario = {
        id: 'invalid-cost',
        name: 'Invalid Cost',
        businessType: 'traditional',
        developerCount: 1000,
        annualCostPerDeveloper: 40_000, // Invalid: below minimum
        ctsSwImprovementPercent: 15,
        solutionCost: 2_000_000,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const errors = calculator.validateInputs(invalidScenario);
      expect(errors.annualCostPerDeveloper).toContain('Annual cost per developer must be at least $50,000');
    });

    it('should validate CTS-SW improvement percentage range', () => {
      const invalidScenario: Scenario = {
        id: 'invalid-improvement',
        name: 'Invalid Improvement',
        businessType: 'traditional',
        developerCount: 1000,
        annualCostPerDeveloper: 130_000,
        ctsSwImprovementPercent: 60, // Invalid: above maximum
        solutionCost: 2_000_000,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const errors = calculator.validateInputs(invalidScenario);
      expect(errors.ctsSwImprovementPercent).toContain('CTS-SW improvement cannot exceed 50%');
    });

    it('should validate solution cost range', () => {
      const invalidScenario: Scenario = {
        id: 'invalid-solution-cost',
        name: 'Invalid Solution Cost',
        businessType: 'traditional',
        developerCount: 1000,
        annualCostPerDeveloper: 130_000,
        ctsSwImprovementPercent: 15,
        solutionCost: 500, // Invalid: below minimum
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const errors = calculator.validateInputs(invalidScenario);
      expect(errors.solutionCost).toContain('Solution cost must be at least $1,000');
    });

    it('should validate revenue percentage for tech companies', () => {
      const invalidTechScenario: Scenario = {
        id: 'invalid-tech-revenue',
        name: 'Invalid Tech Revenue',
        businessType: 'tech',
        developerCount: 400,
        annualCostPerDeveloper: 150_000,
        ctsSwImprovementPercent: 15,
        solutionCost: 1_000_000,
        revenuePercentage: 150, // Invalid: above maximum
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const errors = calculator.validateInputs(invalidTechScenario);
      expect(errors.revenuePercentage).toContain('Revenue percentage cannot exceed 100%');
    });

    it('should throw error when calculating with invalid inputs', () => {
      const invalidScenario: Scenario = {
        id: 'invalid-for-calculation',
        name: 'Invalid For Calculation',
        businessType: 'traditional',
        developerCount: 0, // Invalid
        annualCostPerDeveloper: 130_000,
        ctsSwImprovementPercent: 15,
        solutionCost: 2_000_000,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      expect(() => {
        calculator.calculateTraditionalBusiness(invalidScenario);
      }).toThrow('Validation failed');
    });

    it('should pass validation for valid AWS bank example', () => {
      const validScenario: Scenario = {
        id: 'valid-aws-bank',
        name: 'Valid AWS Bank',
        businessType: 'traditional',
        developerCount: AWS_BENCHMARKS.BANK_EXAMPLE.developerCount,
        annualCostPerDeveloper: AWS_BENCHMARKS.BANK_EXAMPLE.annualCostPerDeveloper,
        ctsSwImprovementPercent: AWS_BENCHMARKS.BANK_EXAMPLE.ctsSwImprovementPercent,
        solutionCost: AWS_BENCHMARKS.BANK_EXAMPLE.solutionCost,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const errors = calculator.validateInputs(validScenario);
      expect(Object.keys(errors)).toHaveLength(0);
    });
  });

  describe('Calculation Steps Documentation', () => {
    it('should provide detailed calculation steps for transparency', () => {
      const scenario: Scenario = {
        id: 'steps-test',
        name: 'Steps Test',
        businessType: 'traditional',
        developerCount: 100,
        annualCostPerDeveloper: 100_000,
        ctsSwImprovementPercent: 10,
        solutionCost: 200_000,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const results = calculator.calculateTraditionalBusiness(scenario);
      
      expect(results.calculationSteps).toHaveLength(3);
      
      results.calculationSteps.forEach((step, index) => {
        expect(step.step).toBe(index + 1);
        expect(step.description).toBeTruthy();
        expect(step.formula).toBeTruthy();
        expect(step.calculation).toBeTruthy();
        expect(step.result).toBeTypeOf('number');
        expect(step.explanation).toBeTruthy();
      });
    });

    it('should include proper formatting in calculation strings', () => {
      const scenario: Scenario = {
        id: 'formatting-test',
        name: 'Formatting Test',
        businessType: 'traditional',
        developerCount: 1000,
        annualCostPerDeveloper: 130_000,
        ctsSwImprovementPercent: 15,
        solutionCost: 2_000_000,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const results = calculator.calculateTraditionalBusiness(scenario);
      
      // Check that numbers are properly formatted with commas
      expect(results.calculationSteps[0].calculation).toContain('1,000');
      expect(results.calculationSteps[0].calculation).toContain('$130,000');
      expect(results.calculationSteps[1].calculation).toContain('$130,000,000');
      expect(results.calculationSteps[2].calculation).toContain('$19,500,000');
    });
  });
});