import type { 
  Scenario, 
  CalculationResults, 
  CalculationStep, 
  ValidationErrors, 
  BusinessModelCalculator as IBusinessModelCalculator
} from '../types/index.js';
import { InputValidator } from './InputValidator.js';

/**
 * BusinessModelCalculator implements AWS's Cost to Serve Software (CTS-SW) framework
 * for calculating ROI on developer experience investments.
 * 
 * Based on Amazon's proven methodology that achieved 15.9% cost reduction.
 */
export class BusinessModelCalculator implements IBusinessModelCalculator {
  private validator: InputValidator;

  constructor() {
    this.validator = new InputValidator();
  }
  
  /**
   * Calculate ROI for traditional business model where software supports the business
   * Formula: Cost Avoidance = Total Developer Cost × CTS-SW Improvement %
   * ROI Multiple = Cost Avoidance ÷ Solution Cost
   */
  calculateTraditionalBusiness(scenario: Scenario): CalculationResults {
    const validationErrors = this.validateInputs(scenario);
    if (Object.keys(validationErrors).length > 0) {
      throw new Error(`Validation failed: ${Object.values(validationErrors).join(', ')}`);
    }

    const totalDeveloperCost = scenario.developerCount * scenario.annualCostPerDeveloper;
    const costAvoidance = totalDeveloperCost * (scenario.ctsSwImprovementPercent / 100);
    const roiMultiple = costAvoidance / scenario.solutionCost;
    const roiPercentage = (roiMultiple - 1) * 100;

    const calculationSteps: CalculationStep[] = [
      {
        step: 1,
        description: "Calculate Total Developer Cost",
        formula: "Developer Count × Annual Cost per Developer",
        calculation: `${scenario.developerCount.toLocaleString()} × $${scenario.annualCostPerDeveloper.toLocaleString()}`,
        result: totalDeveloperCost,
        explanation: "Total annual cost of all developers including salaries, benefits, and tooling"
      },
      {
        step: 2,
        description: "Calculate Cost Avoidance",
        formula: "Total Developer Cost × CTS-SW Improvement %",
        calculation: `$${totalDeveloperCost.toLocaleString()} × ${scenario.ctsSwImprovementPercent}%`,
        result: costAvoidance,
        explanation: "Annual cost savings from improved developer productivity using CTS-SW framework"
      },
      {
        step: 3,
        description: "Calculate ROI Multiple",
        formula: "Cost Avoidance ÷ Solution Cost",
        calculation: `$${costAvoidance.toLocaleString()} ÷ $${scenario.solutionCost.toLocaleString()}`,
        result: roiMultiple,
        explanation: "Return on investment multiple - how many times the investment is returned annually"
      }
    ];

    return {
      scenarioId: scenario.id,
      totalDeveloperCost,
      costAvoidance,
      roiMultiple,
      roiPercentage,
      supportingMetrics: {
        deploymentsPerBuilder: 0, // Will be implemented in later tasks
        interventionsReduction: 0,
        incidentReduction: 0
      },
      calculationSteps
    };
  }

  /**
   * Calculate ROI for tech company model where developers create the product
   * Includes gross margin improvement and profit impact calculations
   * 
   * Tech Company Formula:
   * - Gross Margin Improvement = (Total Developer Cost × CTS-SW Improvement %) × Revenue %
   * - Profit Impact = Gross Margin Improvement (assuming current profit margin baseline)
   * - Profit Boost % = (Profit Impact ÷ Current Profit) × 100
   */
  calculateTechCompany(scenario: Scenario): CalculationResults {
    const validationErrors = this.validateInputs(scenario);
    if (Object.keys(validationErrors).length > 0) {
      throw new Error(`Validation failed: ${Object.values(validationErrors).join(', ')}`);
    }

    if (!scenario.revenuePercentage) {
      throw new Error('Revenue percentage is required for tech company calculations');
    }

    // Basic traditional calculation first
    const basicResults = this.calculateTraditionalBusiness(scenario);
    
    // Tech company specific calculations
    const totalDeveloperCost = scenario.developerCount * scenario.annualCostPerDeveloper;
    const costAvoidance = totalDeveloperCost * (scenario.ctsSwImprovementPercent / 100);
    
    // For tech companies, the cost avoidance translates to gross margin improvement
    // based on the percentage of revenue that comes from software development
    const grossMarginImprovement = costAvoidance * (scenario.revenuePercentage / 100);
    
    // Profit impact is the gross margin improvement (assuming it flows to profit)
    const profitImpact = grossMarginImprovement;
    
    // Profit boost percentage - using a conservative 10% baseline profit margin
    // This means the profit boost is significant relative to typical profit margins
    const baselineProfitMargin = 0.10; // 10% baseline
    const estimatedCurrentProfit = totalDeveloperCost * baselineProfitMargin;
    const profitBoostPercentage = estimatedCurrentProfit > 0 
      ? (profitImpact / estimatedCurrentProfit) * 100 
      : 0;

    const techCalculationSteps: CalculationStep[] = [
      ...basicResults.calculationSteps,
      {
        step: 4,
        description: "Calculate Gross Margin Improvement (Tech Company)",
        formula: "Cost Avoidance × Revenue from Software Development %",
        calculation: `${costAvoidance.toLocaleString()} × ${scenario.revenuePercentage}%`,
        result: grossMarginImprovement,
        explanation: "For tech companies, developer productivity improvements directly impact gross margins on software revenue"
      },
      {
        step: 5,
        description: "Calculate Profit Impact",
        formula: "Gross Margin Improvement (flows to profit)",
        calculation: `${grossMarginImprovement.toLocaleString()}`,
        result: profitImpact,
        explanation: "Gross margin improvements from developer productivity typically flow directly to profit"
      },
      {
        step: 6,
        description: "Calculate Profit Boost Percentage",
        formula: "Profit Impact ÷ Estimated Current Profit × 100",
        calculation: `${profitImpact.toLocaleString()} ÷ ${estimatedCurrentProfit.toLocaleString()} × 100`,
        result: profitBoostPercentage,
        explanation: "Percentage increase in profit relative to baseline (assuming 10% current profit margin)"
      }
    ];

    return {
      ...basicResults,
      grossMarginImprovement,
      profitImpact,
      profitBoostPercentage,
      calculationSteps: techCalculationSteps
    };
  }

  /**
   * Validate all inputs according to AWS framework constraints
   * Delegates to the comprehensive InputValidator for detailed validation
   */
  validateInputs(scenario: Scenario): ValidationErrors {
    return this.validator.validateScenario(scenario);
  }
}