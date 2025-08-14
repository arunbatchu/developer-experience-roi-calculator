import React, { useState } from 'react';
import { PresetScenarios } from '../../services/PresetScenarios.js';
import type { Scenario, OrganizationSize } from '../../types/index.js';

interface PresetScenarioSelectorProps {
  onScenarioSelect: (scenario: Scenario) => void;
  onClose: () => void;
  organizationSize?: OrganizationSize;
}

export const PresetScenarioSelector: React.FC<PresetScenarioSelectorProps> = ({
  onScenarioSelect,
  onClose,
  organizationSize = 'medium'
}) => {
  const [activeCategory, setActiveCategory] = useState<'organizationSize' | 'awsBenchmarks' | 'improvementLevels' | 'teamSizes' | 'industries'>('organizationSize');
  
  const allPresets = PresetScenarios.getAllPresetsForSize(organizationSize);
  const benchmarkIndicators = PresetScenarios.getAwsBenchmarkIndicators();

  const categories = [
    { key: 'organizationSize' as const, label: 'Your Organization Size', icon: '🎯' },
    { key: 'awsBenchmarks' as const, label: 'AWS Benchmarks', icon: '🏆' },
    { key: 'improvementLevels' as const, label: 'Improvement Levels', icon: '📈' },
    { key: 'teamSizes' as const, label: 'Team Sizes', icon: '👥' },
    { key: 'industries' as const, label: 'Industries', icon: '🏢' }
  ];

  const handleScenarioSelect = (scenario: Scenario) => {
    onScenarioSelect(scenario);
    onClose();
  };

  const getScenarioDescription = (scenario: Scenario): string => {
    const totalCost = scenario.developerCount * scenario.annualCostPerDeveloper;
    const costAvoidance = totalCost * (scenario.ctsSwImprovementPercent / 100);
    const roiMultiple = costAvoidance / scenario.solutionCost;
    
    return `${scenario.developerCount.toLocaleString()} devs • ${scenario.ctsSwImprovementPercent}% improvement • ${roiMultiple.toFixed(1)}x ROI`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Preset Scenarios</h2>
            <p className="text-sm text-gray-600 mt-1">
              Load AWS benchmarks and common scenarios to get started quickly
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Category Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
              <nav className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.key}
                    onClick={() => setActiveCategory(category.key)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      activeCategory === category.key
                        ? 'bg-blue-100 text-blue-900 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Organization Size Info */}
            {activeCategory === 'organizationSize' && (
              <div className="p-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Your Organization</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>• Size: {organizationSize} organization</div>
                  <div>• Scenarios tailored to your scale</div>
                  <div>• Conservative to aggressive options</div>
                  <div>• Both traditional & tech models</div>
                </div>
              </div>
            )}

            {/* AWS Benchmark Info */}
            {activeCategory === 'awsBenchmarks' && (
              <div className="p-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">AWS Achievements</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>• Target: {benchmarkIndicators.targetImprovement}% improvement</div>
                  <div>• Achieved: {benchmarkIndicators.achievedImprovement}% improvement</div>
                  <div>• Bank ROI: {benchmarkIndicators.bankRoiMultiple}x multiple</div>
                  <div>• Tech Margin: +{benchmarkIndicators.techMarginImprovement} points</div>
                </div>
              </div>
            )}
          </div>

          {/* Scenarios List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="grid gap-4">
                {allPresets[activeCategory].map((scenario) => (
                  <div
                    key={scenario.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleScenarioSelect(scenario)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {scenario.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {getScenarioDescription(scenario)}
                        </p>
                        {scenario.notes && (
                          <p className="text-xs text-gray-500 mb-3">
                            {scenario.notes}
                          </p>
                        )}
                        
                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          <div>
                            <div className="font-medium text-gray-700">Business Type</div>
                            <div className="text-gray-600 capitalize">{scenario.businessType}</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-700">Developers</div>
                            <div className="text-gray-600">{scenario.developerCount.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-700">Cost/Dev</div>
                            <div className="text-gray-600">${scenario.annualCostPerDeveloper.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-700">Solution Cost</div>
                            <div className="text-gray-600">${scenario.solutionCost.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4 text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {scenario.ctsSwImprovementPercent}%
                        </div>
                        <div className="text-xs text-gray-500">CTS-SW Improvement</div>
                        
                        {/* Category Badges */}
                        <div className="mt-2">
                          {activeCategory === 'organizationSize' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Your Size
                            </span>
                          )}
                          {activeCategory === 'awsBenchmarks' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              AWS Benchmark
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              Click any scenario to load it into the calculator
            </div>
            <div>
              {allPresets[activeCategory].length} scenarios available
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};