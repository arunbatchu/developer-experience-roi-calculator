// Constants and utility values for the ROI Calculator
import { AWS_BENCHMARKS, VALIDATION_RANGES } from '../types';

export { AWS_BENCHMARKS, VALIDATION_RANGES };

// Default scenario values
export const DEFAULT_SCENARIO = {
  businessType: 'traditional' as const,
  developerCount: 100,
  annualCostPerDeveloper: 130000,
  ctsSwImprovementPercent: 10,
  solutionCost: 500000,
};

// Re-export formatting utilities from NumberFormatter
export { 
  formatCurrency, 
  formatPercentage, 
  formatMultiple,
  getScaleIndicator,
  shouldShowScaleWarning,
  NumberFormatter 
} from './NumberFormatter';