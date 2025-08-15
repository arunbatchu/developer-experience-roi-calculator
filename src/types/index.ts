// Core data models for the Developer Experience ROI Calculator
// Based on AWS's Cost to Serve Software (CTS-SW) framework

export interface Scenario {
  id: string;
  name: string;
  businessType: 'traditional' | 'tech';
  developerCount: number;
  annualCostPerDeveloper: number;
  ctsSwImprovementPercent: number;
  solutionCost: number;
  revenuePercentage?: number; // For tech companies only
  organizationSize?: 'small' | 'medium' | 'large' | 'enterprise';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalculationResults {
  scenarioId: string;
  totalDeveloperCost: number;
  costAvoidance: number;
  roiMultiple: number;
  roiPercentage: number;
  
  // Tech company specific
  grossMarginImprovement?: number;
  profitImpact?: number;
  profitBoostPercentage?: number;
  
  // Supporting metrics
  supportingMetrics: {
    deploymentsPerBuilder: number;
    interventionsReduction: number;
    incidentReduction: number;
  };
  
  calculationSteps: CalculationStep[];
}

export interface CalculationStep {
  step: number;
  description: string;
  formula: string;
  calculation: string;
  result: number;
  explanation: string;
}

export interface ValidationErrors {
  [field: string]: string;
}

export interface ComparisonRow {
  metric: string;
  scenarios: { [scenarioId: string]: string | number };
  bestValue: string | number;
}

// Component Props Interfaces
export interface CalculatorDashboardProps {
  initialScenario?: Scenario;
  initialOrganizationSize?: 'small' | 'medium' | 'large' | 'enterprise';
}

export interface InputPanelProps {
  scenario: Scenario;
  onInputChange: (field: keyof Scenario, value: number | string) => void;
  validationErrors: ValidationErrors;
}

export interface ResultsPanelProps {
  results: CalculationResults;
  scenario: Scenario;
}

export interface ScenarioComparisonProps {
  scenarios: Scenario[];
  results: CalculationResults[];
  onScenarioSelect: (scenarioId: string) => void;
}

export interface VisualizationPanelProps {
  results: CalculationResults;
  scenarios: Scenario[];
  chartType: 'roi-progression' | 'cost-breakdown' | 'scenario-comparison';
}

// Business Model Calculator Interface
export interface BusinessModelCalculator {
  calculateTraditionalBusiness(scenario: Scenario): CalculationResults;
  calculateTechCompany(scenario: Scenario): CalculationResults;
  validateInputs(scenario: Scenario): ValidationErrors;
}

// Error Handling
export interface ErrorState {
  type: 'validation' | 'calculation' | 'storage' | 'export';
  message: string;
  field?: string;
  recoverable: boolean;
}

// Chart Configuration
export interface ChartConfig {
  type: string;
  data: any;
  options: any;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  }>;
}

// AWS Benchmark Constants
export const AWS_BENCHMARKS = {
  BANK_EXAMPLE: {
    developerCount: 1000,
    annualCostPerDeveloper: 130000,
    ctsSwImprovementPercent: 15,
    solutionCost: 2000000,
    expectedCostAvoidance: 19500000,
    expectedRoiMultiple: 9.75
  },
  TECH_EXAMPLE: {
    developerCount: 400,
    annualCostPerDeveloper: 150000,
    ctsSwImprovementPercent: 15,
    solutionCost: 1000000,
    revenuePercentage: 60,
    expectedGrossMarginImprovement: 9
  },
  ACHIEVED_IMPROVEMENT: 15.9 // AWS's actual achieved improvement percentage
} as const;

// Input Validation Ranges
export const VALIDATION_RANGES = {
  developerCount: { min: 1, max: 50000 },
  annualCostPerDeveloper: { min: 50000, max: 300000 },
  ctsSwImprovementPercent: { min: 0.1, max: 50 },
  solutionCost: { min: 1000, max: 100000000 },
  revenuePercentage: { min: 0, max: 100 }
} as const;

// Organization Size Definitions
export type OrganizationSize = 'small' | 'medium' | 'large' | 'enterprise';

export interface OrganizationSizeConfig {
  label: string;
  description: string;
  developerRange: [number, number];
  costRange: [number, number];
  solutionCostMultiplier: number;
  examples: string[];
  helpText: string;
}

export const ORGANIZATION_SIZE_CONFIGS: Record<OrganizationSize, OrganizationSizeConfig> = {
  small: {
    label: 'Small Team',
    description: '25-100 developers',
    developerRange: [25, 100],
    costRange: [100000, 120000],
    solutionCostMultiplier: 2.0,
    examples: ['Startup', 'Small SaaS company', 'Department team'],
    helpText: 'Small teams often see faster implementation and higher relative impact from developer experience improvements.'
  },
  medium: {
    label: 'Medium Team',
    description: '100-500 developers',
    developerRange: [100, 500],
    costRange: [110000, 130000],
    solutionCostMultiplier: 2.5,
    examples: ['Growing tech company', 'Mid-size enterprise', 'Multiple product teams'],
    helpText: 'Medium teams balance implementation complexity with significant ROI potential, similar to many AWS case studies.'
  },
  large: {
    label: 'Large Team',
    description: '500-1000 developers',
    developerRange: [500, 1000],
    costRange: [120000, 140000],
    solutionCostMultiplier: 3.0,
    examples: ['Large enterprise', 'Major tech company', 'Multiple business units'],
    helpText: 'Large teams can achieve substantial cost savings but require more sophisticated tooling and change management.'
  },
  enterprise: {
    label: 'Enterprise',
    description: '1000+ developers',
    developerRange: [1000, 5000],
    costRange: [130000, 150000],
    solutionCostMultiplier: 3.5,
    examples: ['Fortune 500 company', 'Global tech giant', 'AWS bank example scale'],
    helpText: 'Enterprise scale matches AWS\'s published case studies and can achieve the highest absolute cost savings.'
  }
} as const;