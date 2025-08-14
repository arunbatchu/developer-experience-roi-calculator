import React, { useState } from 'react';
import { ResultsPanel } from './ResultsPanel.js';
import { BusinessModelCalculator } from '../../services/BusinessModelCalculator.js';
import type { Scenario, CalculationResults } from '../../types/index.js';

// Sample scenarios based on AWS examples
const awsBankScenario: Scenario = {
  id: 'aws-bank-example',
  name: 'AWS Bank Example',
  businessType: 'traditional',
  developerCount: 1000,
  annualCostPerDeveloper: 130000,
  ctsSwImprovementPercent: 15,
  solutionCost: 2000000,
  notes: 'Based on AWS bank case study',
  createdAt: new Date(),
  updatedAt: new Date()
};

const awsTechScenario: Scenario = {
  id: 'aws-tech-example',
  name: 'AWS Tech Company Example',
  businessType: 'tech',
  developerCount: 400,
  annualCostPerDeveloper: 150000,
  ctsSwImprovementPercent: 15,
  solutionCost: 1000000,
  revenuePercentage: 60,
  notes: 'Based on AWS tech company case study',
  createdAt: new Date(),
  updatedAt: new Date()
};

const smallTeamScenario: Scenario = {
  id: 'small-team-example',
  name: 'Small Team Example',
  businessType: 'traditional',
  developerCount: 50,
  annualCostPerDeveloper: 120000,
  ctsSwImprovementPercent: 10,
  solutionCost: 200000,
  notes: 'Small team scenario',
  createdAt: new Date(),
  updatedAt: new Date()
};

export const ResultsPanelDemo: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState<Scenario>(awsBankScenario);
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(true);
  const [calculationResults, setCalculationResults] = useState<CalculationResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculator = new BusinessModelCalculator();

  const calculateResults = (scenario: Scenario) => {
    try {
      setError(null);
      let results: CalculationResults;
      
      if (scenario.businessType === 'tech') {
        results = calculator.calculateTechCompany(scenario);
      } else {
        results = calculator.calculateTraditionalBusiness(scenario);
      }
      
      setCalculationResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed');
      setCalculationResults(null);
    }
  };

  // Calculate results when scenario changes
  React.useEffect(() => {
    calculateResults(currentScenario);
  }, [currentScenario]);

  const scenarios = [
    { scenario: awsBankScenario, label: 'AWS Bank Example (1K devs)' },
    { scenario: awsTechScenario, label: 'AWS Tech Example (400 devs)' },
    { scenario: smallTeamScenario, label: 'Small Team (50 devs)' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Demo Controls */}
      <div className="bg-gray-100 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">ResultsPanel Demo</h3>
        
        <div className="flex flex-wrap gap-3 mb-4">
          {scenarios.map(({ scenario, label }) => (
            <button
              key={scenario.id}
              onClick={() => setCurrentScenario(scenario)}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentScenario.id === scenario.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
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

      {/* Current Scenario Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Scenario</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-700">Business Type</div>
            <div className="text-gray-600 capitalize">{currentScenario.businessType}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Developers</div>
            <div className="text-gray-600">{currentScenario.developerCount.toLocaleString()}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Cost per Developer</div>
            <div className="text-gray-600">${currentScenario.annualCostPerDeveloper.toLocaleString()}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">CTS-SW Improvement</div>
            <div className="text-gray-600">{currentScenario.ctsSwImprovementPercent}%</div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
          <div>
            <div className="font-medium text-gray-700">Solution Cost</div>
            <div className="text-gray-600">${currentScenario.solutionCost.toLocaleString()}</div>
          </div>
          {currentScenario.revenuePercentage && (
            <div>
              <div className="font-medium text-gray-700">Revenue %</div>
              <div className="text-gray-600">{currentScenario.revenuePercentage}%</div>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800 font-medium">Calculation Error</div>
          <div className="text-red-600 text-sm mt-1">{error}</div>
        </div>
      )}

      {/* Results Panel */}
      {calculationResults && (
        <ResultsPanel
          results={calculationResults}
          scenario={currentScenario}
          showDetailedBreakdown={showDetailedBreakdown}
        />
      )}

      {/* Raw Results Debug */}
      {calculationResults && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Raw Calculation Results</h3>
          <pre className="text-xs text-gray-600 overflow-x-auto">
            {JSON.stringify(calculationResults, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};