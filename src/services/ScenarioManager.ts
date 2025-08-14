import type { Scenario } from '../types/index.js';

/**
 * ScenarioManager handles CRUD operations for scenarios with local storage persistence
 */
export class ScenarioManager {
  private readonly STORAGE_KEY = 'roi-calculator-scenarios';

  /**
   * Get all saved scenarios from local storage
   */
  getAllScenarios(): Scenario[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const scenarios = JSON.parse(stored) as Scenario[];
      
      // Convert date strings back to Date objects
      return scenarios.map(scenario => ({
        ...scenario,
        createdAt: new Date(scenario.createdAt),
        updatedAt: new Date(scenario.updatedAt)
      }));
    } catch (error) {
      console.error('Failed to load scenarios from storage:', error);
      return [];
    }
  }

  /**
   * Get a specific scenario by ID
   */
  getScenario(id: string): Scenario | null {
    const scenarios = this.getAllScenarios();
    return scenarios.find(scenario => scenario.id === id) || null;
  }

  /**
   * Save a scenario (create or update)
   */
  saveScenario(scenario: Scenario): void {
    try {
      const scenarios = this.getAllScenarios();
      const existingIndex = scenarios.findIndex(s => s.id === scenario.id);
      
      const updatedScenario = {
        ...scenario,
        updatedAt: new Date()
      };

      if (existingIndex >= 0) {
        // Update existing scenario
        scenarios[existingIndex] = updatedScenario;
      } else {
        // Add new scenario
        scenarios.push(updatedScenario);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(scenarios));
    } catch (error) {
      console.error('Failed to save scenario to storage:', error);
      throw new Error('Failed to save scenario');
    }
  }

  /**
   * Create a new scenario with a unique ID
   */
  createScenario(scenarioData: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>): Scenario {
    const now = new Date();
    const scenario: Scenario = {
      ...scenarioData,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now
    };

    this.saveScenario(scenario);
    return scenario;
  }

  /**
   * Delete a scenario by ID
   */
  deleteScenario(id: string): boolean {
    try {
      const scenarios = this.getAllScenarios();
      const filteredScenarios = scenarios.filter(scenario => scenario.id !== id);
      
      if (filteredScenarios.length === scenarios.length) {
        return false; // Scenario not found
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredScenarios));
      return true;
    } catch (error) {
      console.error('Failed to delete scenario from storage:', error);
      throw new Error('Failed to delete scenario');
    }
  }

  /**
   * Duplicate a scenario with a new ID and name
   */
  duplicateScenario(id: string, newName?: string): Scenario | null {
    const originalScenario = this.getScenario(id);
    if (!originalScenario) return null;

    const duplicatedScenario = this.createScenario({
      ...originalScenario,
      name: newName || `${originalScenario.name} (Copy)`,
      notes: originalScenario.notes ? `${originalScenario.notes}\n\nDuplicated from: ${originalScenario.name}` : `Duplicated from: ${originalScenario.name}`
    });

    return duplicatedScenario;
  }

  /**
   * Get scenarios sorted by most recently updated
   */
  getRecentScenarios(limit?: number): Scenario[] {
    const scenarios = this.getAllScenarios();
    const sorted = scenarios.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    return limit ? sorted.slice(0, limit) : sorted;
  }

  /**
   * Search scenarios by name or notes
   */
  searchScenarios(query: string): Scenario[] {
    const scenarios = this.getAllScenarios();
    const lowerQuery = query.toLowerCase();
    
    return scenarios.filter(scenario => 
      scenario.name.toLowerCase().includes(lowerQuery) ||
      (scenario.notes && scenario.notes.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Export scenarios as JSON
   */
  exportScenarios(): string {
    const scenarios = this.getAllScenarios();
    return JSON.stringify(scenarios, null, 2);
  }

  /**
   * Import scenarios from JSON
   */
  importScenarios(jsonData: string, overwrite: boolean = false): number {
    try {
      const importedScenarios = JSON.parse(jsonData) as Scenario[];
      
      if (!Array.isArray(importedScenarios)) {
        throw new Error('Invalid JSON format: expected array of scenarios');
      }

      let existingScenarios = overwrite ? [] : this.getAllScenarios();
      let importedCount = 0;

      for (const scenario of importedScenarios) {
        // Validate scenario structure
        if (!this.isValidScenario(scenario)) {
          console.warn('Skipping invalid scenario:', scenario);
          continue;
        }

        // Generate new ID if scenario already exists
        const existingIds = existingScenarios.map(s => s.id);
        if (existingIds.includes(scenario.id)) {
          scenario.id = this.generateId();
        }

        // Convert date strings to Date objects
        scenario.createdAt = new Date(scenario.createdAt);
        scenario.updatedAt = new Date(scenario.updatedAt);

        existingScenarios.push(scenario);
        importedCount++;
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingScenarios));
      return importedCount;
    } catch (error) {
      console.error('Failed to import scenarios:', error);
      throw new Error('Failed to import scenarios: Invalid JSON format');
    }
  }

  /**
   * Clear all scenarios from storage
   */
  clearAllScenarios(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear scenarios from storage:', error);
      throw new Error('Failed to clear scenarios');
    }
  }

  /**
   * Get storage usage statistics
   */
  getStorageStats(): { count: number; sizeKB: number } {
    const scenarios = this.getAllScenarios();
    const jsonString = JSON.stringify(scenarios);
    
    return {
      count: scenarios.length,
      sizeKB: Math.round((new Blob([jsonString]).size) / 1024 * 100) / 100
    };
  }

  /**
   * Generate a unique ID for scenarios
   */
  private generateId(): string {
    return `scenario-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate scenario structure
   */
  private isValidScenario(scenario: any): scenario is Scenario {
    return (
      typeof scenario === 'object' &&
      typeof scenario.id === 'string' &&
      typeof scenario.name === 'string' &&
      (scenario.businessType === 'traditional' || scenario.businessType === 'tech') &&
      typeof scenario.developerCount === 'number' &&
      typeof scenario.annualCostPerDeveloper === 'number' &&
      typeof scenario.ctsSwImprovementPercent === 'number' &&
      typeof scenario.solutionCost === 'number' &&
      (scenario.revenuePercentage === undefined || typeof scenario.revenuePercentage === 'number')
    );
  }
}