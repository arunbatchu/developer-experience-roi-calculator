import React, { useState, useCallback } from 'react';
import { InputPanel } from './InputPanel.js';
import { useInputValidation } from '../../hooks/useInputValidation.js';
import type { Scenario } from '../../types/index.js';

// Default scenario based on AWS bank example
const createDefaultScenario = (): Scenario => ({
  id: 'demo-scenario',
  name: 'Demo Scenario',
  businessType: 'traditional',
  developerCount: 1000,
  annualCostPerDeveloper: 130000,
  ctsSwImprovementPercent: 15,
  solutionCost: 2000000,
  notes: '',
  createdAt: new Date(),
  updatedAt: new Date()
});

export const InputPanelDemo: React.FC = () => {
  const [scenario, setScenario] = useState<Scenario>(createDefaultScenario());
  const { validationErrors, validateField, validateScenario, hasErrors } = useInputValidation();

  const handleInputChange = useCallback((field: keyof Scenario, value: number | string) => {
    setScenario(prev => {
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

    // Perform real-time validation
    validateField(field, value);
  }, [validateField]);

  const handleValidateAll = () => {
    const isValid = validateScenario(scenario);
    console.log('Scenario validation:', isValid ? 'Valid' : 'Invalid');
    console.log('Validation errors:', validationErrors);
  };

  const resetToDefaults = () => {
    setScenario(createDefaultScenario());
  };

  const loadTechExample = () => {
    setScenario({
      id: 'tech-example',
      name: 'Tech Company Example',
      businessType: 'tech',
      developerCount: 400,
      annualCostPerDeveloper: 150000,
      ctsSwImprovementPercent: 15,
      solutionCost: 1000000,
      revenuePercentage: 60,
      notes: 'Based on AWS tech company example',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Demo Controls */}
      <div className="bg-gray-100 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Demo Controls</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Load Bank Example
          </button>
          <button
            onClick={loadTechExample}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Load Tech Example
          </button>
          <button
            onClick={handleValidateAll}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Validate All
          </button>
        </div>
        
        {/* Validation Status */}
        <div className="mt-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            hasErrors 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {hasErrors ? '❌ Has Validation Errors' : '✅ All Inputs Valid'}
          </div>
        </div>
      </div>

      {/* Input Panel */}
      <InputPanel
        scenario={scenario}
        onInputChange={handleInputChange}
        validationErrors={validationErrors}
      />

      {/* Current Scenario Debug Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Current Scenario</h3>
        <pre className="text-sm text-gray-600 overflow-x-auto">
          {JSON.stringify(scenario, null, 2)}
        </pre>
      </div>
    </div>
  );
};