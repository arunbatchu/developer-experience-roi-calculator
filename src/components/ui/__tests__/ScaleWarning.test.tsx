import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScaleWarning } from '../ScaleWarning.js';
import type { CalculationResults, Scenario } from '../../../types/index.js';

const mockScenario: Scenario = {
  id: 'test-scenario',
  name: 'Test Scenario',
  businessType: 'traditional',
  developerCount: 1000,
  annualCostPerDeveloper: 130000,
  ctsSwImprovementPercent: 15,
  solutionCost: 2000000,
  organizationSize: 'enterprise',
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockResults: CalculationResults = {
  scenarioId: 'test-scenario',
  totalDeveloperCost: 130000000,
  costAvoidance: 19500000, // Over $10M threshold but medium scale
  roiMultiple: 9.75,
  roiPercentage: 975,
  supportingMetrics: {
    deploymentsPerBuilder: 0,
    interventionsReduction: 0,
    incidentReduction: 0
  },
  calculationSteps: []
};

const mockEnterpriseResults: CalculationResults = {
  scenarioId: 'test-scenario',
  totalDeveloperCost: 500000000,
  costAvoidance: 150000000, // Over $140M threshold - enterprise scale
  roiMultiple: 15,
  roiPercentage: 1500,
  supportingMetrics: {
    deploymentsPerBuilder: 0,
    interventionsReduction: 0,
    incidentReduction: 0
  },
  calculationSteps: []
};

describe('ScaleWarning', () => {
  it('should not render when cost avoidance is below threshold', () => {
    const smallResults = {
      ...mockResults,
      costAvoidance: 5000000, // Below $10M threshold
      totalDeveloperCost: 8000000 // Also below threshold
    };

    const { container } = render(
      <ScaleWarning results={smallResults} scenario={mockScenario} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render enterprise-scale warning for large cost avoidance', () => {
    render(
      <ScaleWarning results={mockEnterpriseResults} scenario={mockScenario} />
    );

    expect(screen.getByText('Enterprise-Scale Results')).toBeInTheDocument();
    expect(screen.getByText(/Your results show enterprise-scale impact/)).toBeInTheDocument();
    expect(screen.getByText(/150M cost avoidance/)).toBeInTheDocument();
  });

  it('should show alternative suggestions for large scenarios', () => {
    const largeScenario = {
      ...mockScenario,
      developerCount: 2000,
      ctsSwImprovementPercent: 20,
      solutionCost: 10000000
    };

    render(
      <ScaleWarning results={mockResults} scenario={largeScenario} />
    );

    expect(screen.getByText('Consider these alternatives for comparison:')).toBeInTheDocument();
    expect(screen.getByText(/Try with 500 developers/)).toBeInTheDocument();
    expect(screen.getByText(/Start with 10-15% improvement/)).toBeInTheDocument();
    expect(screen.getByText(/Consider phased implementation/)).toBeInTheDocument();
  });

  it('should call onSuggestAlternative when button is clicked', () => {
    const mockOnSuggestAlternative = vi.fn();

    render(
      <ScaleWarning 
        results={mockEnterpriseResults} 
        scenario={mockScenario}
        onSuggestAlternative={mockOnSuggestAlternative}
      />
    );

    const button = screen.getByText('Generate smaller-scale scenario');
    fireEvent.click(button);

    expect(mockOnSuggestAlternative).toHaveBeenCalledTimes(1);
  });

  it('should show large-scale warning for moderately large results', () => {
    // Use the original mockResults which should show "Large-Scale Results"
    render(
      <ScaleWarning results={mockResults} scenario={mockScenario} />
    );

    expect(screen.getByText('Large-Scale Results')).toBeInTheDocument();
    expect(screen.getByText(/Please verify your inputs are realistic/)).toBeInTheDocument();
  });

  it('should suggest alternatives for very large inputs', () => {
    const veryLargeScenario = {
      ...mockScenario,
      developerCount: 3000,
      annualCostPerDeveloper: 160000
    };

    render(
      <ScaleWarning results={mockEnterpriseResults} scenario={veryLargeScenario} />
    );

    // Should show alternatives section
    expect(screen.getByText('Consider these alternatives for comparison:')).toBeInTheDocument();
    // Should have at least one alternative suggestion
    expect(screen.getByText(/Try with 750 developers/)).toBeInTheDocument();
  });
});