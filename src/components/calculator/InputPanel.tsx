import React from 'react';
import type { InputPanelProps, Scenario } from '../../types/index.js';
import { InputValidator } from '../../services/InputValidator.js';
import { ORGANIZATION_SIZE_CONFIGS } from '../../types/index.js';
import { NumberFormatter } from '../../utils/NumberFormatter.js';
const inputValidator = new InputValidator();
const fieldDescriptions = inputValidator.getFieldDescriptions();

export const InputPanel: React.FC<InputPanelProps> = ({
  scenario,
  onInputChange,
  validationErrors
}) => {
  const handleInputChange = (field: keyof Scenario, value: string) => {
    // Convert string to number for numeric fields
    const numericFields = ['developerCount', 'annualCostPerDeveloper', 'ctsSwImprovementPercent', 'solutionCost', 'revenuePercentage'];
    
    if (numericFields.includes(field)) {
      const numericValue = parseFloat(value) || 0;
      onInputChange(field, numericValue);
    } else {
      onInputChange(field, value);
    }
  };



  // Get contextual help text based on organization size
  const getContextualHelpText = () => {
    const orgSize = scenario.organizationSize || 'medium';
    const config = ORGANIZATION_SIZE_CONFIGS[orgSize];
    
    return {
      developerCount: `Typical for ${config.label.toLowerCase()}: ${config.developerRange[0].toLocaleString()} - ${config.developerRange[1].toLocaleString()} developers`,
      costPerDeveloper: `Typical for ${config.label.toLowerCase()}: $${config.costRange[0].toLocaleString()} - $${config.costRange[1].toLocaleString()} per developer`,
      solutionCost: `Typical for ${config.label.toLowerCase()}: ${config.solutionCostMultiplier}x multiplier of developer count (e.g., ${NumberFormatter.formatCurrency(Math.round(config.developerRange[1] * config.solutionCostMultiplier * 1000))} for ${config.developerRange[1]} developers)`
    };
  };

  const contextualHelp = getContextualHelpText();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Input Parameters</h2>
      
      {/* Business Type Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onInputChange('businessType', 'traditional')}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              scenario.businessType === 'traditional'
                ? 'border-blue-500 bg-blue-50 text-blue-900'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="font-medium">Traditional Business</div>
            <div className="text-sm text-gray-600 mt-1">
              Software supports the business
            </div>
          </button>
          <button
            type="button"
            onClick={() => onInputChange('businessType', 'tech')}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              scenario.businessType === 'tech'
                ? 'border-blue-500 bg-blue-50 text-blue-900'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="font-medium">Tech Company</div>
            <div className="text-sm text-gray-600 mt-1">
              Developers create the product
            </div>
          </button>
        </div>
      </div>

      {/* Developer Count */}
      <div className="mb-6">
        <label htmlFor="developerCount" className="block text-sm font-medium text-gray-700 mb-2">
          {fieldDescriptions.developerCount.label}
        </label>
        <input
          type="number"
          id="developerCount"
          value={scenario.developerCount || ''}
          onChange={(e) => handleInputChange('developerCount', e.target.value)}
          placeholder={fieldDescriptions.developerCount.placeholder}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            validationErrors.developerCount ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        <p className="mt-1 text-sm text-gray-600">
          {fieldDescriptions.developerCount.description}
        </p>
        <p className="mt-1 text-sm text-blue-600">
          {fieldDescriptions.developerCount.example}
        </p>
        <p className="mt-1 text-sm text-green-600">
          {contextualHelp.developerCount}
        </p>
        {validationErrors.developerCount && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.developerCount}</p>
        )}
      </div>

      {/* Annual Cost per Developer */}
      <div className="mb-6">
        <label htmlFor="annualCostPerDeveloper" className="block text-sm font-medium text-gray-700 mb-2">
          {fieldDescriptions.annualCostPerDeveloper.label}
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            type="number"
            id="annualCostPerDeveloper"
            value={scenario.annualCostPerDeveloper || ''}
            onChange={(e) => handleInputChange('annualCostPerDeveloper', e.target.value)}
            placeholder={fieldDescriptions.annualCostPerDeveloper.placeholder}
            className={`w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.annualCostPerDeveloper ? 'border-red-300' : 'border-gray-300'
            }`}
          />
        </div>
        <p className="mt-1 text-sm text-gray-600">
          {fieldDescriptions.annualCostPerDeveloper.description}
        </p>
        <p className="mt-1 text-sm text-blue-600">
          {fieldDescriptions.annualCostPerDeveloper.example}
        </p>
        <p className="mt-1 text-sm text-green-600">
          {contextualHelp.costPerDeveloper}
        </p>
        {scenario.annualCostPerDeveloper > 0 && (
          <p className="mt-1 text-sm text-gray-500">
            Total developer cost: {NumberFormatter.formatCurrency(scenario.developerCount * scenario.annualCostPerDeveloper)}
          </p>
        )}
        {validationErrors.annualCostPerDeveloper && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.annualCostPerDeveloper}</p>
        )}
      </div>

      {/* CTS-SW Improvement Percentage */}
      <div className="mb-6">
        <label htmlFor="ctsSwImprovementPercent" className="block text-sm font-medium text-gray-700 mb-2">
          {fieldDescriptions.ctsSwImprovementPercent.label}
        </label>
        <div className="relative">
          <input
            type="number"
            id="ctsSwImprovementPercent"
            value={scenario.ctsSwImprovementPercent || ''}
            onChange={(e) => handleInputChange('ctsSwImprovementPercent', e.target.value)}
            placeholder={fieldDescriptions.ctsSwImprovementPercent.placeholder}
            step="0.1"
            min="0"
            max="50"
            className={`w-full pr-8 pl-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.ctsSwImprovementPercent ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          <span className="absolute right-3 top-2 text-gray-500">%</span>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          {fieldDescriptions.ctsSwImprovementPercent.description}
        </p>
        <p className="mt-1 text-sm text-blue-600">
          {fieldDescriptions.ctsSwImprovementPercent.example}
        </p>
        {validationErrors.ctsSwImprovementPercent && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.ctsSwImprovementPercent}</p>
        )}
      </div>

      {/* Solution Cost */}
      <div className="mb-6">
        <label htmlFor="solutionCost" className="block text-sm font-medium text-gray-700 mb-2">
          {fieldDescriptions.solutionCost.label}
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            type="number"
            id="solutionCost"
            value={scenario.solutionCost || ''}
            onChange={(e) => handleInputChange('solutionCost', e.target.value)}
            placeholder={fieldDescriptions.solutionCost.placeholder}
            className={`w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.solutionCost ? 'border-red-300' : 'border-gray-300'
            }`}
          />
        </div>
        <p className="mt-1 text-sm text-gray-600">
          {fieldDescriptions.solutionCost.description}
        </p>
        <p className="mt-1 text-sm text-blue-600">
          {fieldDescriptions.solutionCost.example}
        </p>
        <p className="mt-1 text-sm text-green-600">
          {contextualHelp.solutionCost}
        </p>
        {validationErrors.solutionCost && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.solutionCost}</p>
        )}
      </div>

      {/* Revenue Percentage (Tech Companies Only) */}
      {scenario.businessType === 'tech' && (
        <div className="mb-6">
          <label htmlFor="revenuePercentage" className="block text-sm font-medium text-gray-700 mb-2">
            {fieldDescriptions.revenuePercentage.label}
          </label>
          <div className="relative">
            <input
              type="number"
              id="revenuePercentage"
              value={scenario.revenuePercentage || ''}
              onChange={(e) => handleInputChange('revenuePercentage', e.target.value)}
              placeholder={fieldDescriptions.revenuePercentage.placeholder}
              step="1"
              min="0"
              max="100"
              className={`w-full pr-8 pl-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                validationErrors.revenuePercentage ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <span className="absolute right-3 top-2 text-gray-500">%</span>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            {fieldDescriptions.revenuePercentage.description}
          </p>
          <p className="mt-1 text-sm text-blue-600">
            {fieldDescriptions.revenuePercentage.example}
          </p>
          {validationErrors.revenuePercentage && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.revenuePercentage}</p>
          )}
        </div>
      )}

      {/* General validation errors */}
      {validationErrors.general && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">{validationErrors.general}</p>
        </div>
      )}

      {/* AWS Benchmark Information */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="text-sm font-medium text-blue-900 mb-2">AWS Benchmark Reference</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• Bank example: 1,000 developers × $130K = $130M total cost</p>
          <p>• 15% CTS-SW improvement = $19.5M cost avoidance</p>
          <p>• $2M solution cost = 9.75x ROI multiple</p>
          <p>• AWS achieved: 15.9% actual improvement</p>
        </div>
      </div>
    </div>
  );
};