import type { ValidationErrors } from '../types/index.js';

/**
 * ValidationErrorHandler provides utilities for handling and displaying validation errors
 * in a user-friendly way across the application
 */
export class ValidationErrorHandler {
  
  /**
   * Check if there are any validation errors
   */
  static hasErrors(errors: ValidationErrors): boolean {
    if (!errors) return false;
    return Object.keys(errors).length > 0;
  }

  /**
   * Get all error messages as an array
   */
  static getErrorMessages(errors: ValidationErrors): string[] {
    if (!errors) return [];
    return Object.values(errors);
  }

  /**
   * Get error message for a specific field
   */
  static getFieldError(errors: ValidationErrors, fieldName: string): string | null {
    return errors[fieldName] || null;
  }

  /**
   * Format errors for display in UI components
   */
  static formatErrorsForDisplay(errors: ValidationErrors): { field: string; message: string }[] {
    return Object.entries(errors).map(([field, message]) => ({
      field,
      message
    }));
  }

  /**
   * Get a summary error message for multiple validation errors
   */
  static getSummaryMessage(errors: ValidationErrors): string {
    const errorCount = Object.keys(errors).length;
    if (errorCount === 0) return '';
    if (errorCount === 1) return Object.values(errors)[0];
    return `${errorCount} validation errors found. Please check your inputs.`;
  }

  /**
   * Check if a specific field has an error
   */
  static hasFieldError(errors: ValidationErrors, fieldName: string): boolean {
    return fieldName in errors;
  }

  /**
   * Merge multiple validation error objects
   */
  static mergeErrors(...errorObjects: ValidationErrors[]): ValidationErrors {
    return errorObjects.reduce((merged, current) => ({
      ...merged,
      ...current
    }), {});
  }

  /**
   * Filter errors by field names
   */
  static filterErrors(errors: ValidationErrors, fieldNames: string[]): ValidationErrors {
    const filtered: ValidationErrors = {};
    fieldNames.forEach(fieldName => {
      if (errors[fieldName]) {
        filtered[fieldName] = errors[fieldName];
      }
    });
    return filtered;
  }

  /**
   * Convert validation errors to a format suitable for form libraries
   */
  static toFormErrors(errors: ValidationErrors): Record<string, { message: string }> {
    const formErrors: Record<string, { message: string }> = {};
    Object.entries(errors).forEach(([field, message]) => {
      formErrors[field] = { message };
    });
    return formErrors;
  }
}