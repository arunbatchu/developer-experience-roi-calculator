import { useState, useCallback, useMemo } from 'react';
import type { Scenario, ValidationErrors } from '../types/index.js';
import { InputValidator } from '../services/InputValidator.js';

interface UseInputValidationReturn {
  validationErrors: ValidationErrors;
  validateField: (field: keyof Scenario, value: any) => void;
  validateScenario: (scenario: Scenario) => boolean;
  clearErrors: () => void;
  hasErrors: boolean;
}

export const useInputValidation = (): UseInputValidationReturn => {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const inputValidator = useMemo(() => new InputValidator(), []);

  const validateField = useCallback((field: keyof Scenario, value: any) => {
    const error = inputValidator.validateField(field, value);
    
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[field] = error;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  }, [inputValidator]);

  const validateScenario = useCallback((scenario: Scenario): boolean => {
    const errors = inputValidator.validateScenario(scenario);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [inputValidator]);

  const clearErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  const hasErrors = useMemo(() => {
    return Object.keys(validationErrors).length > 0;
  }, [validationErrors]);

  return {
    validationErrors,
    validateField,
    validateScenario,
    clearErrors,
    hasErrors
  };
};