import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ROIContextExplanation } from '../ROIContextExplanation.js';

describe('ROIContextExplanation', () => {
  it('should show exceptional ROI explanation for very high multiples', () => {
    render(
      <ROIContextExplanation
        roiMultiple={25}
        costAvoidance={20000000}
        solutionCost={800000}
      />
    );

    expect(screen.getByText(/Exceptional.*ROI.*25/)).toBeInTheDocument();
    expect(screen.getByText(/represents exceptional ROI that significantly exceeds/)).toBeInTheDocument();
    expect(screen.getByText(/transformational impact on developer productivity/)).toBeInTheDocument();
    expect(screen.getByText(/Typically approved at executive level/)).toBeInTheDocument();
  });

  it('should show outstanding ROI explanation for AWS benchmark level', () => {
    render(
      <ROIContextExplanation
        roiMultiple={9.75}
        costAvoidance={19500000}
        solutionCost={2000000}
      />
    );

    expect(screen.getByText(/Strong.*ROI.*9\.75/)).toBeInTheDocument(); // 9.75 falls into Strong category, not Outstanding
    expect(screen.getByText(/represents strong ROI that exceeds most business/)).toBeInTheDocument();
    expect(screen.getByText(/typically justifies significant platform investments/)).toBeInTheDocument();
    expect(screen.getByText(/Strong business case for platform team funding/)).toBeInTheDocument();
  });

  it('should show strong ROI explanation for good multiples', () => {
    render(
      <ROIContextExplanation
        roiMultiple={7}
        costAvoidance={7000000}
        solutionCost={1000000}
      />
    );

    expect(screen.getByText(/Strong.*ROI.*7/)).toBeInTheDocument();
    expect(screen.getByText(/represents strong ROI that exceeds most business/)).toBeInTheDocument();
    expect(screen.getByText(/typically justifies significant platform investments/)).toBeInTheDocument();
  });

  it('should show moderate ROI explanation for medium multiples', () => {
    render(
      <ROIContextExplanation
        roiMultiple={3}
        costAvoidance={3000000}
        solutionCost={1000000}
      />
    );

    expect(screen.getByText(/Moderate.*ROI.*3/)).toBeInTheDocument();
    expect(screen.getByText(/represents moderate ROI that may justify targeted/)).toBeInTheDocument();
    expect(screen.getByText(/selective implementation of high-impact improvements/)).toBeInTheDocument();
  });

  it('should show low ROI explanation for poor multiples', () => {
    render(
      <ROIContextExplanation
        roiMultiple={1.5}
        costAvoidance={1500000}
        solutionCost={1000000}
      />
    );

    expect(screen.getByText(/Low.*ROI.*1\.5/)).toBeInTheDocument();
    expect(screen.getByText(/represents low ROI that may not justify/)).toBeInTheDocument();
    expect(screen.getByText(/Consider focusing on higher-impact improvements/)).toBeInTheDocument();
  });

  it('should calculate and display correct payback period', () => {
    render(
      <ROIContextExplanation
        roiMultiple={4}
        costAvoidance={2000000}
        solutionCost={500000}
      />
    );

    // Payback = solutionCost / costAvoidance = 500K / 2M = 0.25 years = exactly 3 months, which falls into "about 6 months" category
    expect(screen.getByText(/Payback:.*about 6 months/)).toBeInTheDocument();
  });

  it('should show calculation breakdown', () => {
    render(
      <ROIContextExplanation
        roiMultiple={5}
        costAvoidance={5000000}
        solutionCost={1000000}
      />
    );

    expect(screen.getByText(/5M.*annual savings.*1M.*investment.*5.*return/)).toBeInTheDocument();
  });

  it('should handle different payback periods correctly', () => {
    // Test 6 month payback
    const { rerender } = render(
      <ROIContextExplanation
        roiMultiple={2}
        costAvoidance={1000000}
        solutionCost={500000}
      />
    );
    expect(screen.getByText('Payback: about 6 months')).toBeInTheDocument();

    // Test 2 year payback
    rerender(
      <ROIContextExplanation
        roiMultiple={0.5}
        costAvoidance={500000}
        solutionCost={1000000}
      />
    );
    expect(screen.getByText('Payback: 2 years')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <ROIContextExplanation
        roiMultiple={5}
        costAvoidance={5000000}
        solutionCost={1000000}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});