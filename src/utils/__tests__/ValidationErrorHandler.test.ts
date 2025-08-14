import { describe, it, expect } from 'vitest';
import { ValidationErrorHandler } from '../ValidationErrorHandler.js';
import type { ValidationErrors } from '../../types/index.js';

describe('ValidationErrorHandler', () => {
  const sampleErrors: ValidationErrors = {
    developerCount: 'Developer count must be at least 1',
    annualCostPerDeveloper: 'Annual cost per developer must be at least $50,000',
    ctsSwImprovementPercent: 'CTS-SW improvement cannot exceed 50%'
  };

  const emptyErrors: ValidationErrors = {};

  describe('hasErrors', () => {
    it('should return true when there are errors', () => {
      expect(ValidationErrorHandler.hasErrors(sampleErrors)).toBe(true);
    });

    it('should return false when there are no errors', () => {
      expect(ValidationErrorHandler.hasErrors(emptyErrors)).toBe(false);
    });
  });

  describe('getErrorMessages', () => {
    it('should return all error messages as an array', () => {
      const messages = ValidationErrorHandler.getErrorMessages(sampleErrors);
      expect(messages).toHaveLength(3);
      expect(messages).toContain('Developer count must be at least 1');
      expect(messages).toContain('Annual cost per developer must be at least $50,000');
      expect(messages).toContain('CTS-SW improvement cannot exceed 50%');
    });

    it('should return empty array for no errors', () => {
      const messages = ValidationErrorHandler.getErrorMessages(emptyErrors);
      expect(messages).toHaveLength(0);
    });
  });

  describe('getFieldError', () => {
    it('should return error message for existing field', () => {
      const error = ValidationErrorHandler.getFieldError(sampleErrors, 'developerCount');
      expect(error).toBe('Developer count must be at least 1');
    });

    it('should return null for non-existing field', () => {
      const error = ValidationErrorHandler.getFieldError(sampleErrors, 'nonExistentField');
      expect(error).toBeNull();
    });

    it('should return null for empty errors', () => {
      const error = ValidationErrorHandler.getFieldError(emptyErrors, 'developerCount');
      expect(error).toBeNull();
    });
  });

  describe('formatErrorsForDisplay', () => {
    it('should format errors for UI display', () => {
      const formatted = ValidationErrorHandler.formatErrorsForDisplay(sampleErrors);
      expect(formatted).toHaveLength(3);
      expect(formatted[0]).toEqual({
        field: 'developerCount',
        message: 'Developer count must be at least 1'
      });
    });

    it('should return empty array for no errors', () => {
      const formatted = ValidationErrorHandler.formatErrorsForDisplay(emptyErrors);
      expect(formatted).toHaveLength(0);
    });
  });

  describe('getSummaryMessage', () => {
    it('should return empty string for no errors', () => {
      const summary = ValidationErrorHandler.getSummaryMessage(emptyErrors);
      expect(summary).toBe('');
    });

    it('should return the error message for single error', () => {
      const singleError = { developerCount: 'Developer count must be at least 1' };
      const summary = ValidationErrorHandler.getSummaryMessage(singleError);
      expect(summary).toBe('Developer count must be at least 1');
    });

    it('should return count message for multiple errors', () => {
      const summary = ValidationErrorHandler.getSummaryMessage(sampleErrors);
      expect(summary).toBe('3 validation errors found. Please check your inputs.');
    });
  });

  describe('hasFieldError', () => {
    it('should return true for existing field error', () => {
      expect(ValidationErrorHandler.hasFieldError(sampleErrors, 'developerCount')).toBe(true);
    });

    it('should return false for non-existing field error', () => {
      expect(ValidationErrorHandler.hasFieldError(sampleErrors, 'nonExistentField')).toBe(false);
    });

    it('should return false for empty errors', () => {
      expect(ValidationErrorHandler.hasFieldError(emptyErrors, 'developerCount')).toBe(false);
    });
  });

  describe('mergeErrors', () => {
    it('should merge multiple error objects', () => {
      const errors1 = { field1: 'Error 1' };
      const errors2 = { field2: 'Error 2' };
      const errors3 = { field3: 'Error 3' };

      const merged = ValidationErrorHandler.mergeErrors(errors1, errors2, errors3);
      expect(merged).toEqual({
        field1: 'Error 1',
        field2: 'Error 2',
        field3: 'Error 3'
      });
    });

    it('should handle overlapping fields (later values win)', () => {
      const errors1 = { field1: 'Error 1 Original' };
      const errors2 = { field1: 'Error 1 Updated', field2: 'Error 2' };

      const merged = ValidationErrorHandler.mergeErrors(errors1, errors2);
      expect(merged).toEqual({
        field1: 'Error 1 Updated',
        field2: 'Error 2'
      });
    });

    it('should handle empty error objects', () => {
      const merged = ValidationErrorHandler.mergeErrors({}, sampleErrors, {});
      expect(merged).toEqual(sampleErrors);
    });
  });

  describe('filterErrors', () => {
    it('should filter errors by field names', () => {
      const filtered = ValidationErrorHandler.filterErrors(sampleErrors, ['developerCount', 'nonExistentField']);
      expect(filtered).toEqual({
        developerCount: 'Developer count must be at least 1'
      });
    });

    it('should return empty object when no fields match', () => {
      const filtered = ValidationErrorHandler.filterErrors(sampleErrors, ['nonExistentField']);
      expect(filtered).toEqual({});
    });

    it('should return empty object for empty field list', () => {
      const filtered = ValidationErrorHandler.filterErrors(sampleErrors, []);
      expect(filtered).toEqual({});
    });
  });

  describe('toFormErrors', () => {
    it('should convert to form library format', () => {
      const formErrors = ValidationErrorHandler.toFormErrors(sampleErrors);
      expect(formErrors).toEqual({
        developerCount: { message: 'Developer count must be at least 1' },
        annualCostPerDeveloper: { message: 'Annual cost per developer must be at least $50,000' },
        ctsSwImprovementPercent: { message: 'CTS-SW improvement cannot exceed 50%' }
      });
    });

    it('should return empty object for no errors', () => {
      const formErrors = ValidationErrorHandler.toFormErrors(emptyErrors);
      expect(formErrors).toEqual({});
    });
  });

  describe('edge cases', () => {
    it('should handle undefined errors gracefully', () => {
      expect(ValidationErrorHandler.hasErrors(undefined as any)).toBe(false);
      expect(ValidationErrorHandler.getErrorMessages(undefined as any)).toEqual([]);
    });

    it('should handle null errors gracefully', () => {
      expect(ValidationErrorHandler.hasErrors(null as any)).toBe(false);
      expect(ValidationErrorHandler.getErrorMessages(null as any)).toEqual([]);
    });
  });
});