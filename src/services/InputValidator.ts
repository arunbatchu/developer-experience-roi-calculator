import type { 
  Scenario, 
  ValidationErrors
} from '../types/index.js';
import { VALIDATION_RANGES } from '../types/index.js';

/**
 * InputValidator provides comprehensive validation for all CTS-SW variables
 * with AWS-specific constraints and user-friendly error messages
 */
export class InputValidator {
  
  /**
   * Validate a complete scenario with detailed error messages
   */
  validateScenario(scenario: Scenario): ValidationErrors {
    const errors: ValidationErrors = {};

    // Validate each field individually
    const developerCountError = this.validateDeveloperCount(scenario.developerCount);
    if (developerCountError) errors.developerCount = developerCountError;

    const costError = this.validateAnnualCostPerDeveloper(scenario.annualCostPerDeveloper);
    if (costError) errors.annualCostPerDeveloper = costError;

    const improvementError = this.validateCtsSwImprovement(scenario.ctsSwImprovementPercent);
    if (improvementError) errors.ctsSwImprovementPercent = improvementError;

    const solutionCostError = this.validateSolutionCost(scenario.solutionCost);
    if (solutionCostError) errors.solutionCost = solutionCostError;

    // Tech company specific validation
    if (scenario.businessType === 'tech') {
      const revenueError = this.validateRevenuePercentage(scenario.revenuePercentage);
      if (revenueError) errors.revenuePercentage = revenueError;
    }

    // Cross-field validations
    const crossFieldErrors = this.validateCrossFieldConstraints(scenario);
    Object.assign(errors, crossFieldErrors);

    return errors;
  }

  /**
   * Validate developer count with specific constraints
   */
  validateDeveloperCount(count: number): string | null {
    if (count === null || count === undefined || isNaN(count)) {
      return 'Developer count is required and must be a number';
    }

    if (!Number.isInteger(count)) {
      return 'Developer count must be a whole number (no decimals)';
    }

    if (count < VALIDATION_RANGES.developerCount.min) {
      return `Developer count must be at least ${VALIDATION_RANGES.developerCount.min}`;
    }

    if (count > VALIDATION_RANGES.developerCount.max) {
      return `Developer count cannot exceed ${VALIDATION_RANGES.developerCount.max.toLocaleString()} (consider breaking into smaller teams)`;
    }

    return null;
  }

  /**
   * Validate annual cost per developer with AWS examples
   */
  validateAnnualCostPerDeveloper(cost: number): string | null {
    if (cost === null || cost === undefined || isNaN(cost)) {
      return 'Annual cost per developer is required and must be a number';
    }

    if (cost <= 0) {
      return 'Annual cost per developer must be greater than zero';
    }

    if (cost < VALIDATION_RANGES.annualCostPerDeveloper.min) {
      return `Annual cost per developer must be at least $${VALIDATION_RANGES.annualCostPerDeveloper.min.toLocaleString()} (includes salary, benefits, and tooling)`;
    }

    if (cost > VALIDATION_RANGES.annualCostPerDeveloper.max) {
      return `Annual cost per developer cannot exceed $${VALIDATION_RANGES.annualCostPerDeveloper.max.toLocaleString()} (AWS example: $130K)`;
    }

    // Only provide guidance for very low values that might be mistakes (below minimum range)
    // Note: Don't warn for values within the valid range, even if they're low

    return null;
  }

  /**
   * Validate CTS-SW improvement percentage with AWS benchmarks
   */
  validateCtsSwImprovement(improvement: number): string | null {
    if (improvement === null || improvement === undefined || isNaN(improvement)) {
      return 'CTS-SW improvement percentage is required and must be a number';
    }

    if (improvement <= 0) {
      return 'CTS-SW improvement percentage must be greater than zero';
    }

    if (improvement < VALIDATION_RANGES.ctsSwImprovementPercent.min) {
      return `CTS-SW improvement must be at least ${VALIDATION_RANGES.ctsSwImprovementPercent.min}%`;
    }

    if (improvement > VALIDATION_RANGES.ctsSwImprovementPercent.max) {
      return `CTS-SW improvement cannot exceed ${VALIDATION_RANGES.ctsSwImprovementPercent.max}% (be realistic about achievable gains)`;
    }

    // Only provide guidance for values that are technically valid but extremely high
    // Note: Don't warn for values within reasonable range, even if they're ambitious

    return null;
  }

  /**
   * Validate solution cost with reasonableness checks
   */
  validateSolutionCost(cost: number): string | null {
    if (cost === null || cost === undefined || isNaN(cost)) {
      return 'Solution cost is required and must be a number';
    }

    if (cost <= 0) {
      return 'Solution cost must be greater than zero';
    }

    if (cost < VALIDATION_RANGES.solutionCost.min) {
      return `Solution cost must be at least $${VALIDATION_RANGES.solutionCost.min.toLocaleString()}`;
    }

    if (cost > VALIDATION_RANGES.solutionCost.max) {
      return `Solution cost cannot exceed $${VALIDATION_RANGES.solutionCost.max.toLocaleString()}`;
    }

    return null;
  }

  /**
   * Validate revenue percentage for tech companies
   */
  validateRevenuePercentage(percentage: number | undefined): string | null {
    if (percentage === null || percentage === undefined || isNaN(percentage!)) {
      return 'Revenue percentage is required for tech companies';
    }

    if (percentage < VALIDATION_RANGES.revenuePercentage.min) {
      return `Revenue percentage must be at least ${VALIDATION_RANGES.revenuePercentage.min}%`;
    }

    if (percentage > VALIDATION_RANGES.revenuePercentage.max) {
      return `Revenue percentage cannot exceed ${VALIDATION_RANGES.revenuePercentage.max}%`;
    }

    return null;
  }

  /**
   * Validate cross-field constraints and business logic
   */
  validateCrossFieldConstraints(scenario: Scenario): ValidationErrors {
    const errors: ValidationErrors = {};

    // Check if solution cost is reasonable relative to total developer cost
    const totalDeveloperCost = scenario.developerCount * scenario.annualCostPerDeveloper;
    const costRatio = scenario.solutionCost / totalDeveloperCost;

    if (costRatio > 0.5) {
      errors.solutionCost = `Solution cost ($${scenario.solutionCost.toLocaleString()}) seems high relative to total developer cost ($${totalDeveloperCost.toLocaleString()}). Consider if this investment is realistic.`;
    }

    // Check if improvement percentage makes sense for the investment size (only for very small investments)
    if (costRatio < 0.005 && scenario.ctsSwImprovementPercent > 15) {
      errors.ctsSwImprovementPercent = `${scenario.ctsSwImprovementPercent}% improvement may be unrealistic for a relatively small investment ($${scenario.solutionCost.toLocaleString()})`;
    }

    // Warn about very small teams with high costs
    if (scenario.developerCount < 10 && scenario.solutionCost > 500000) {
      errors.general = `High solution cost for a small team. Consider if this investment makes sense for ${scenario.developerCount} developers.`;
    }

    return errors;
  }

  /**
   * Validate individual field values (for real-time validation)
   */
  validateField(fieldName: keyof Scenario, value: any, businessType?: 'traditional' | 'tech'): string | null {
    switch (fieldName) {
      case 'developerCount':
        return this.validateDeveloperCount(value);
      case 'annualCostPerDeveloper':
        return this.validateAnnualCostPerDeveloper(value);
      case 'ctsSwImprovementPercent':
        return this.validateCtsSwImprovement(value);
      case 'solutionCost':
        return this.validateSolutionCost(value);
      case 'revenuePercentage':
        if (businessType === 'tech') {
          return this.validateRevenuePercentage(value);
        }
        return null;
      default:
        return null;
    }
  }

  /**
   * Get validation ranges for UI components
   */
  getValidationRanges() {
    return VALIDATION_RANGES;
  }

  /**
   * Get user-friendly field descriptions with examples
   */
  getFieldDescriptions() {
    return {
      developerCount: {
        label: 'Number of Developers',
        description: 'Total number of software developers in your organization',
        example: 'AWS bank example: 1,000 developers',
        placeholder: '1000'
      },
      annualCostPerDeveloper: {
        label: 'Annual Cost per Developer',
        description: 'Fully-loaded annual cost including salary, benefits, and tooling',
        example: 'AWS example: $130,000 per developer',
        placeholder: '130000'
      },
      ctsSwImprovementPercent: {
        label: 'Expected CTS-SW Improvement',
        description: 'Percentage improvement in Cost to Serve Software',
        example: 'AWS achieved: 15.9% improvement',
        placeholder: '15'
      },
      solutionCost: {
        label: 'Solution Investment Cost',
        description: 'Total cost of implementing the developer experience solution',
        example: 'AWS bank example: $2,000,000',
        placeholder: '2000000'
      },
      revenuePercentage: {
        label: 'Revenue from Software Development',
        description: 'Percentage of company revenue generated by software development',
        example: 'Tech companies typically: 60-80%',
        placeholder: '60'
      }
    };
  }
}