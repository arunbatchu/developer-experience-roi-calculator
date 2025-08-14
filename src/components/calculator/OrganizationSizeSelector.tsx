import React from 'react';
import type { OrganizationSize } from '../../types/index.js';
import { ORGANIZATION_SIZE_CONFIGS } from '../../types/index.js';

interface OrganizationSizeSelectorProps {
  selectedSize: OrganizationSize;
  onSizeChange: (size: OrganizationSize) => void;
  className?: string;
}

export const OrganizationSizeSelector: React.FC<OrganizationSizeSelectorProps> = ({
  selectedSize,
  onSizeChange,
  className = ''
}) => {
  const sizes: OrganizationSize[] = ['small', 'medium', 'large', 'enterprise'];

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Organization Size
        </h3>
        <p className="text-sm text-gray-600">
          Select your organization size to load appropriate preset scenarios and examples
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sizes.map((size) => {
          const config = ORGANIZATION_SIZE_CONFIGS[size];
          const isSelected = selectedSize === size;
          
          return (
            <button
              key={size}
              onClick={() => onSizeChange(size)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-medium ${
                  isSelected ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {config.label}
                </h4>
                {isSelected && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className={`text-sm mb-3 ${
                isSelected ? 'text-blue-700' : 'text-gray-600'
              }`}>
                {config.description}
              </div>
              
              <div className="space-y-2">
                <div className={`text-xs ${
                  isSelected ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  <div>Cost: ${config.costRange[0].toLocaleString()} - ${config.costRange[1].toLocaleString()}/dev</div>
                  <div>Typical: {config.examples.slice(0, 2).join(', ')}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Help Text for Selected Size */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              {ORGANIZATION_SIZE_CONFIGS[selectedSize].label} Organizations
            </h4>
            <p className="text-sm text-gray-600">
              {ORGANIZATION_SIZE_CONFIGS[selectedSize].helpText}
            </p>
            <div className="mt-2">
              <div className="text-xs text-gray-500">
                <strong>Examples:</strong> {ORGANIZATION_SIZE_CONFIGS[selectedSize].examples.join(', ')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};