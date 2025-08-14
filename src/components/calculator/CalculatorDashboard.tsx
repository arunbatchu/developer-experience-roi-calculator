import React, { useState, useCallback, useEffect } from 'react';
import { InputPanel } from './InputPanel.js';
import { ResultsPanel } from './ResultsPanel.js';
import { OrganizationSizeSelector } from './OrganizationSizeSelector.js';
import { PresetScenarioSelector } from './PresetScenarioSelector.js';
import { useInputValidation } from '../../hooks/useInputValidation.js';
import { BusinessModelCalculator } from '../../services/BusinessModelCalculator.js';
import { PresetScenarios } from '../../services/PresetScenarios.js';
import type { Scenario, CalculationResults, CalculatorDashboardProps, OrganizationSize } from '../../types/index.js';

// Default scenario based on organization size
const createDefaultScenario = (organizationSize: OrganizationSize = 'medium'): Scenario => {
  return PresetScenarios.getDefaultScenarioForSize(organizationSize);
};

export const CalculatorDashboard: React.FC<CalculatorDashboardProps> = ({
  initialScenario,
  initialOrganizationSize = 'medium'
}) => {
  const [organizationSize, setOrganizationSize] = useState<OrganizationSize>(initialOrganizationSize);
  const [currentScenario, setCurrentScenario] = useState<Scenario>(
    initialScenario || createDefaultScenario(initialOrganizationSize)
  );
  const [calculationResults, setCalculationResults] = useState<CalculationResults | null>(null);
  const [calculationError, setCalculationError] = useState<string | null>(null);
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(true);
  const [showPresetSelector, setShowPresetSelector] = useState(false);

  const { validationErrors, validateField, validateScenario } = useInputValidation();
  const calculator = new BusinessModelCalculator();

  // Calculate results whenever scenario changes
  const calculateResults = useCallback((scenario: Scenario) => {
    try {
      setCalculationError(null);
      
      // Validate scenario first
      const isValid = validateScenario(scenario);
      if (!isValid) {
        setCalculationResults(null);
        return;
      }

      let results: CalculationResults;
      
      if (scenario.businessType === 'tech') {
        results = calculator.calculateTechCompany(scenario);
      } else {
        results = calculator.calculateTraditionalBusiness(scenario);
      }
      
      setCalculationResults(results);
    } catch (error) {
      setCalculationError(error instanceof Error ? error.message : 'Calculation failed');
      setCalculationResults(null);
    }
  }, [validateScenario, calculator]);

  // Handle input changes with real-time calculation updates
  const handleInputChange = useCallback((field: keyof Scenario, value: number | string) => {
    setCurrentScenario(prev => {
      const updated = {
        ...prev,
        [field]: value,
        updatedAt: new Date()
      };
      
      // Clear revenue percentage when switching to traditional business
      if (field === 'businessType' && value === 'traditional') {
        delete updated.revenuePercentage;
      }
      
      // Set default revenue percentage for tech companies
      if (field === 'businessType' && value === 'tech' && !updated.revenuePercentage) {
        updated.revenuePercentage = 60;
      }
      
      return updated;
    });

    // Perform real-time field validation
    validateField(field, value);
  }, [validateField]);

  // Calculate results when scenario changes
  useEffect(() => {
    calculateResults(currentScenario);
  }, [currentScenario, calculateResults]);

  // Handle organization size changes
  const handleOrganizationSizeChange = useCallback((newSize: OrganizationSize) => {
    setOrganizationSize(newSize);
    // Load default scenario for new organization size
    const defaultScenario = createDefaultScenario(newSize);
    setCurrentScenario(defaultScenario);
  }, []);

  // Handle preset scenario selection
  const handlePresetScenarioSelect = useCallback((scenario: Scenario) => {
    setCurrentScenario({
      ...scenario,
      organizationSize: organizationSize // Ensure organization size is preserved
    });
    setShowPresetSelector(false);
  }, [organizationSize]);

  // Load preset scenarios
  const loadAwsBankExample = () => {
    const awsScenarios = PresetScenarios.getAwsBenchmarkScenarios();
    const bankScenario = awsScenarios.find(s => s.id === 'aws-bank-benchmark');
    if (bankScenario) {
      setCurrentScenario({
        ...bankScenario,
        organizationSize: organizationSize
      });
    }
  };

  const loadAwsTechExample = () => {
    const awsScenarios = PresetScenarios.getAwsBenchmarkScenarios();
    const techScenario = awsScenarios.find(s => s.id === 'aws-tech-benchmark');
    if (techScenario) {
      setCurrentScenario({
        ...techScenario,
        organizationSize: organizationSize
      });
    }
  };

  const resetToDefaults = () => {
    setCurrentScenario(createDefaultScenario(organizationSize));
  };

  const hasValidationErrors = Object.keys(validationErrors).length > 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header with Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Developer Experience ROI Calculator
            </h1>
            <p className="text-gray-600">
              Calculate ROI using AWS's Cost to Serve Software (CTS-SW) framework
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
            <button
              onClick={() => setShowPresetSelector(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
            >
              Load Preset Scenarios
            </button>
            <button
              onClick={loadAwsBankExample}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              AWS Bank Example
            </button>
            <button
              onClick={loadAwsTechExample}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              AWS Tech Example
            </button>
            <button
              onClick={resetToDefaults}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="mt-4 flex flex-wrap gap-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            hasValidationErrors 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {hasValidationErrors ? '❌ Input Validation Errors' : '✅ All Inputs Valid'}
          </div>
          
          {calculationResults && (
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              calculationResults.roiMultiple >= 5 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              📊 ROI: {calculationResults.roiMultiple.toFixed(1)}x
            </div>
          )}

          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            🏢 {currentScenario.businessType === 'tech' ? 'Tech Company' : 'Traditional Business'}
          </div>
        </div>
      </div>

      {/* Organization Size Selector */}
      <OrganizationSizeSelector
        selectedSize={organizationSize}
        onSizeChange={handleOrganizationSizeChange}
      />

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="space-y-6">
          <InputPanel
            scenario={currentScenario}
            onInputChange={handleInputChange}
            validationErrors={validationErrors}
          />
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {calculationError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-800 font-medium">Calculation Error</div>
              <div className="text-red-600 text-sm mt-1">{calculationError}</div>
            </div>
          )}

          {calculationResults && !hasValidationErrors && (
            <>
              {/* Results Panel Controls */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Results</h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showDetailedBreakdown}
                      onChange={(e) => setShowDetailedBreakdown(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Show Detailed Breakdown</span>
                  </label>
                </div>
              </div>

              <ResultsPanel
                results={calculationResults}
                scenario={currentScenario}
                showDetailedBreakdown={showDetailedBreakdown}
              />
            </>
          )}

          {hasValidationErrors && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="text-center">
                <div className="text-yellow-800 font-medium mb-2">
                  Please fix input errors to see results
                </div>
                <div className="text-yellow-600 text-sm">
                  Results will update automatically once all inputs are valid
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Scenario Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Scenario Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-700">Scenario</div>
            <div className="text-gray-600">{currentScenario.name}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Organization Size</div>
            <div className="text-gray-600 capitalize">{organizationSize}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Business Type</div>
            <div className="text-gray-600 capitalize">{currentScenario.businessType}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Developers</div>
            <div className="text-gray-600">{currentScenario.developerCount.toLocaleString()}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Cost/Developer</div>
            <div className="text-gray-600">${currentScenario.annualCostPerDeveloper.toLocaleString()}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">CTS-SW Improvement</div>
            <div className="text-gray-600">{currentScenario.ctsSwImprovementPercent}%</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Solution Cost</div>
            <div className="text-gray-600">${currentScenario.solutionCost.toLocaleString()}</div>
          </div>
        </div>
        
        {currentScenario.revenuePercentage && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm">
              <span className="font-medium text-gray-700">Revenue from Software Development: </span>
              <span className="text-gray-600">{currentScenario.revenuePercentage}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Preset Scenario Selector Modal */}
      {showPresetSelector && (
        <PresetScenarioSelector
          organizationSize={organizationSize}
          onScenarioSelect={handlePresetScenarioSelect}
          onClose={() => setShowPresetSelector(false)}
        />
      )}
    </div>
  );
};