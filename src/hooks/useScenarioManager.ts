import { useState, useCallback, useEffect, useMemo } from 'react';
import { ScenarioManager } from '../services/ScenarioManager.js';
import type { Scenario } from '../types/index.js';

interface UseScenarioManagerReturn {
  scenarios: Scenario[];
  currentScenario: Scenario | null;
  loading: boolean;
  error: string | null;
  
  // CRUD operations
  createScenario: (scenarioData: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>) => Scenario;
  saveScenario: (scenario: Scenario) => void;
  loadScenario: (id: string) => void;
  deleteScenario: (id: string) => boolean;
  duplicateScenario: (id: string, newName?: string) => Scenario | null;
  
  // Utility operations
  searchScenarios: (query: string) => Scenario[];
  getRecentScenarios: (limit?: number) => Scenario[];
  clearAllScenarios: () => void;
  
  // Import/Export
  exportScenarios: () => string;
  importScenarios: (jsonData: string, overwrite?: boolean) => number;
  
  // Storage stats
  storageStats: { count: number; sizeKB: number };
  
  // Refresh data
  refreshScenarios: () => void;
}

export const useScenarioManager = (initialScenarioId?: string): UseScenarioManagerReturn => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scenarioManager = useMemo(() => new ScenarioManager(), []);

  // Load scenarios from storage
  const loadScenarios = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      
      const loadedScenarios = scenarioManager.getAllScenarios();
      setScenarios(loadedScenarios);
      
      // Load initial scenario if specified
      if (initialScenarioId) {
        const initialScenario = scenarioManager.getScenario(initialScenarioId);
        setCurrentScenario(initialScenario);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load scenarios');
    } finally {
      setLoading(false);
    }
  }, [scenarioManager, initialScenarioId]);

  // Load scenarios on mount
  useEffect(() => {
    loadScenarios();
  }, [loadScenarios]);

  // Create a new scenario
  const createScenario = useCallback((scenarioData: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>): Scenario => {
    try {
      setError(null);
      const newScenario = scenarioManager.createScenario(scenarioData);
      setScenarios(prev => [...prev, newScenario]);
      return newScenario;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create scenario';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [scenarioManager]);

  // Save an existing scenario
  const saveScenario = useCallback((scenario: Scenario): void => {
    try {
      setError(null);
      scenarioManager.saveScenario(scenario);
      
      setScenarios(prev => {
        const existingIndex = prev.findIndex(s => s.id === scenario.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = scenario;
          return updated;
        } else {
          return [...prev, scenario];
        }
      });

      // Update current scenario if it's the same one
      if (currentScenario?.id === scenario.id) {
        setCurrentScenario(scenario);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save scenario';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [scenarioManager, currentScenario]);

  // Load a specific scenario
  const loadScenario = useCallback((id: string): void => {
    try {
      setError(null);
      const scenario = scenarioManager.getScenario(id);
      setCurrentScenario(scenario);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load scenario';
      setError(errorMessage);
    }
  }, [scenarioManager]);

  // Delete a scenario
  const deleteScenario = useCallback((id: string): boolean => {
    try {
      setError(null);
      const success = scenarioManager.deleteScenario(id);
      
      if (success) {
        setScenarios(prev => prev.filter(s => s.id !== id));
        
        // Clear current scenario if it was deleted
        if (currentScenario?.id === id) {
          setCurrentScenario(null);
        }
      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete scenario';
      setError(errorMessage);
      return false;
    }
  }, [scenarioManager, currentScenario]);

  // Duplicate a scenario
  const duplicateScenario = useCallback((id: string, newName?: string): Scenario | null => {
    try {
      setError(null);
      const duplicated = scenarioManager.duplicateScenario(id, newName);
      
      if (duplicated) {
        setScenarios(prev => [...prev, duplicated]);
      }
      
      return duplicated;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to duplicate scenario';
      setError(errorMessage);
      return null;
    }
  }, [scenarioManager]);

  // Search scenarios
  const searchScenarios = useCallback((query: string): Scenario[] => {
    return scenarioManager.searchScenarios(query);
  }, [scenarioManager]);

  // Get recent scenarios
  const getRecentScenarios = useCallback((limit?: number): Scenario[] => {
    return scenarioManager.getRecentScenarios(limit);
  }, [scenarioManager]);

  // Clear all scenarios
  const clearAllScenarios = useCallback((): void => {
    try {
      setError(null);
      scenarioManager.clearAllScenarios();
      setScenarios([]);
      setCurrentScenario(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear scenarios';
      setError(errorMessage);
    }
  }, [scenarioManager]);

  // Export scenarios
  const exportScenarios = useCallback((): string => {
    return scenarioManager.exportScenarios();
  }, [scenarioManager]);

  // Import scenarios
  const importScenarios = useCallback((jsonData: string, overwrite: boolean = false): number => {
    try {
      setError(null);
      const importedCount = scenarioManager.importScenarios(jsonData, overwrite);
      
      // Refresh scenarios list
      loadScenarios();
      
      return importedCount;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import scenarios';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [scenarioManager, loadScenarios]);

  // Get storage stats
  const storageStats = useMemo(() => {
    return scenarioManager.getStorageStats();
  }, [scenarioManager, scenarios]);

  // Refresh scenarios
  const refreshScenarios = useCallback(() => {
    loadScenarios();
  }, [loadScenarios]);

  return {
    scenarios,
    currentScenario,
    loading,
    error,
    createScenario,
    saveScenario,
    loadScenario,
    deleteScenario,
    duplicateScenario,
    searchScenarios,
    getRecentScenarios,
    clearAllScenarios,
    exportScenarios,
    importScenarios,
    storageStats,
    refreshScenarios
  };
};