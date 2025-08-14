import type { Scenario, OrganizationSize } from '../types/index.js';
import { ORGANIZATION_SIZE_CONFIGS } from '../types/index.js';

/**
 * PresetScenarios provides AWS benchmark scenarios and common improvement levels
 * Based on Amazon's Cost to Serve Software (CTS-SW) framework examples
 */
export class PresetScenarios {
  
  /**
   * Get AWS benchmark scenarios based on their published case studies
   */
  static getAwsBenchmarkScenarios(): Scenario[] {
    const now = new Date();
    
    return [
      {
        id: 'aws-bank-benchmark',
        name: 'AWS Bank Example (Benchmark)',
        businessType: 'traditional',
        developerCount: 1000,
        annualCostPerDeveloper: 130000,
        ctsSwImprovementPercent: 15,
        solutionCost: 2000000,
        organizationSize: 'enterprise',
        notes: 'Based on AWS bank case study. Expected: $19.5M cost avoidance, 9.75x ROI',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'aws-tech-benchmark',
        name: 'AWS Tech Company Example (Benchmark)',
        businessType: 'tech',
        developerCount: 400,
        annualCostPerDeveloper: 150000,
        ctsSwImprovementPercent: 15,
        solutionCost: 1000000,
        revenuePercentage: 60,
        organizationSize: 'medium',
        notes: 'Based on AWS tech company case study. Expected: 9 percentage point gross margin improvement',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'aws-achieved-benchmark',
        name: 'AWS Achieved Results (15.9%)',
        businessType: 'traditional',
        developerCount: 1000,
        annualCostPerDeveloper: 130000,
        ctsSwImprovementPercent: 15.9, // AWS's actual achieved improvement
        solutionCost: 2000000,
        organizationSize: 'enterprise',
        notes: 'AWS actually achieved 15.9% CTS-SW improvement, exceeding their 15% target',
        createdAt: now,
        updatedAt: now
      }
    ];
  }

  /**
   * Get preset scenarios with different CTS-SW improvement levels
   */
  static getImprovementLevelPresets(baseScenario?: Partial<Scenario>): Scenario[] {
    const now = new Date();
    const base = {
      businessType: 'traditional' as const,
      developerCount: 500,
      annualCostPerDeveloper: 120000,
      solutionCost: 1000000,
      organizationSize: 'medium' as OrganizationSize,
      notes: '',
      ...baseScenario
    };

    const improvementLevels = [
      { percent: 5, label: 'Conservative' },
      { percent: 10, label: 'Moderate' },
      { percent: 15, label: 'AWS Target' },
      { percent: 20, label: 'Aggressive' }
    ];

    return improvementLevels.map(level => ({
      id: `preset-${level.percent}pct-improvement`,
      name: `${level.label} Improvement (${level.percent}%)`,
      businessType: base.businessType,
      developerCount: base.developerCount,
      annualCostPerDeveloper: base.annualCostPerDeveloper,
      ctsSwImprovementPercent: level.percent,
      solutionCost: base.solutionCost,
      organizationSize: base.organizationSize,
      revenuePercentage: base.businessType === 'tech' ? (base as any).revenuePercentage : undefined,
      notes: `${level.label} CTS-SW improvement scenario (${level.percent}% productivity gain)`,
      createdAt: now,
      updatedAt: now
    }));
  }

  /**
   * Get common team size scenarios
   */
  static getTeamSizePresets(): Scenario[] {
    const now = new Date();
    
    const teamSizes = [
      { size: 25, label: 'Small Team', cost: 110000 },
      { size: 100, label: 'Medium Team', cost: 120000 },
      { size: 500, label: 'Large Team', cost: 130000 },
      { size: 1000, label: 'Enterprise', cost: 135000 },
      { size: 2500, label: 'Large Enterprise', cost: 140000 }
    ];

    return teamSizes.map(team => {
      let orgSize: OrganizationSize;
      if (team.size <= 100) orgSize = 'small';
      else if (team.size <= 500) orgSize = 'medium';
      else if (team.size <= 1000) orgSize = 'large';
      else orgSize = 'enterprise';

      return {
        id: `preset-team-${team.size}`,
        name: `${team.label} (${team.size} developers)`,
        businessType: 'traditional' as const,
        developerCount: team.size,
        annualCostPerDeveloper: team.cost,
        ctsSwImprovementPercent: 15, // AWS target
        solutionCost: Math.max(100000, team.size * 2000), // Scale solution cost with team size
        organizationSize: orgSize,
        notes: `${team.label} scenario with ${team.size} developers`,
        createdAt: now,
        updatedAt: now
      };
    });
  }

  /**
   * Get industry-specific scenarios
   */
  static getIndustryPresets(): Scenario[] {
    const now = new Date();
    
    return [
      {
        id: 'preset-fintech',
        name: 'FinTech Company',
        businessType: 'tech' as const,
        developerCount: 200,
        annualCostPerDeveloper: 160000,
        ctsSwImprovementPercent: 12,
        solutionCost: 800000,
        revenuePercentage: 80,
        organizationSize: 'medium',
        notes: 'FinTech company where software is the primary product',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'preset-ecommerce',
        name: 'E-commerce Platform',
        businessType: 'tech' as const,
        developerCount: 300,
        annualCostPerDeveloper: 140000,
        ctsSwImprovementPercent: 15,
        solutionCost: 1200000,
        revenuePercentage: 70,
        organizationSize: 'medium',
        notes: 'E-commerce platform with significant software development focus',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'preset-bank',
        name: 'Traditional Bank',
        businessType: 'traditional' as const,
        developerCount: 800,
        annualCostPerDeveloper: 125000,
        ctsSwImprovementPercent: 15,
        solutionCost: 1800000,
        organizationSize: 'large',
        notes: 'Traditional bank with software supporting business operations',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'preset-retail',
        name: 'Retail Chain',
        businessType: 'traditional' as const,
        developerCount: 150,
        annualCostPerDeveloper: 115000,
        ctsSwImprovementPercent: 10,
        solutionCost: 500000,
        organizationSize: 'medium',
        notes: 'Retail chain with moderate software development needs',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'preset-manufacturing',
        name: 'Manufacturing Company',
        businessType: 'traditional' as const,
        developerCount: 100,
        annualCostPerDeveloper: 110000,
        ctsSwImprovementPercent: 8,
        solutionCost: 400000,
        organizationSize: 'small',
        notes: 'Manufacturing company with software supporting operations',
        createdAt: now,
        updatedAt: now
      }
    ];
  }

  /**
   * Get organization size-appropriate preset scenarios
   */
  static getOrganizationSizePresets(organizationSize: OrganizationSize): Scenario[] {
    const now = new Date();
    const config = ORGANIZATION_SIZE_CONFIGS[organizationSize];
    
    // Calculate typical values for this organization size
    const typicalDeveloperCount = Math.round((config.developerRange[0] + config.developerRange[1]) / 2);
    const typicalCostPerDeveloper = Math.round((config.costRange[0] + config.costRange[1]) / 2);
    const typicalSolutionCost = Math.round(typicalDeveloperCount * config.solutionCostMultiplier * 1000);

    const scenarios: Scenario[] = [];

    // Traditional business scenarios
    scenarios.push({
      id: `${organizationSize}-traditional-conservative`,
      name: `${config.label} - Conservative (Traditional)`,
      businessType: 'traditional',
      developerCount: typicalDeveloperCount,
      annualCostPerDeveloper: typicalCostPerDeveloper,
      ctsSwImprovementPercent: organizationSize === 'small' ? 8 : organizationSize === 'medium' ? 10 : 12,
      solutionCost: typicalSolutionCost,
      organizationSize,
      notes: `Conservative improvement scenario for ${config.label.toLowerCase()} traditional business`,
      createdAt: now,
      updatedAt: now
    });

    scenarios.push({
      id: `${organizationSize}-traditional-target`,
      name: `${config.label} - AWS Target (Traditional)`,
      businessType: 'traditional',
      developerCount: typicalDeveloperCount,
      annualCostPerDeveloper: typicalCostPerDeveloper,
      ctsSwImprovementPercent: 15,
      solutionCost: typicalSolutionCost,
      organizationSize,
      notes: `AWS target 15% improvement for ${config.label.toLowerCase()} traditional business`,
      createdAt: now,
      updatedAt: now
    });

    scenarios.push({
      id: `${organizationSize}-traditional-aggressive`,
      name: `${config.label} - Aggressive (Traditional)`,
      businessType: 'traditional',
      developerCount: typicalDeveloperCount,
      annualCostPerDeveloper: typicalCostPerDeveloper,
      ctsSwImprovementPercent: organizationSize === 'small' ? 18 : organizationSize === 'medium' ? 20 : 22,
      solutionCost: typicalSolutionCost,
      organizationSize,
      notes: `Aggressive improvement scenario for ${config.label.toLowerCase()} traditional business`,
      createdAt: now,
      updatedAt: now
    });

    // Tech company scenarios
    const techRevenuePercentage = organizationSize === 'small' ? 70 : organizationSize === 'medium' ? 65 : 60;
    
    scenarios.push({
      id: `${organizationSize}-tech-conservative`,
      name: `${config.label} - Conservative (Tech)`,
      businessType: 'tech',
      developerCount: typicalDeveloperCount,
      annualCostPerDeveloper: typicalCostPerDeveloper + 10000, // Tech companies typically pay more
      ctsSwImprovementPercent: organizationSize === 'small' ? 8 : organizationSize === 'medium' ? 10 : 12,
      solutionCost: typicalSolutionCost,
      revenuePercentage: techRevenuePercentage,
      organizationSize,
      notes: `Conservative improvement scenario for ${config.label.toLowerCase()} tech company`,
      createdAt: now,
      updatedAt: now
    });

    scenarios.push({
      id: `${organizationSize}-tech-target`,
      name: `${config.label} - AWS Target (Tech)`,
      businessType: 'tech',
      developerCount: typicalDeveloperCount,
      annualCostPerDeveloper: typicalCostPerDeveloper + 10000,
      ctsSwImprovementPercent: 15,
      solutionCost: typicalSolutionCost,
      revenuePercentage: techRevenuePercentage,
      organizationSize,
      notes: `AWS target 15% improvement for ${config.label.toLowerCase()} tech company`,
      createdAt: now,
      updatedAt: now
    });

    return scenarios;
  }

  /**
   * Get default scenario for organization size
   */
  static getDefaultScenarioForSize(organizationSize: OrganizationSize): Scenario {
    const presets = this.getOrganizationSizePresets(organizationSize);
    // Return the AWS target traditional business scenario as default
    return presets.find(s => s.id.includes('traditional-target')) || presets[0];
  }

  /**
   * Get all preset scenarios organized by category
   */
  static getAllPresets(): {
    awsBenchmarks: Scenario[];
    improvementLevels: Scenario[];
    teamSizes: Scenario[];
    industries: Scenario[];
  } {
    return {
      awsBenchmarks: this.getAwsBenchmarkScenarios(),
      improvementLevels: this.getImprovementLevelPresets(),
      teamSizes: this.getTeamSizePresets(),
      industries: this.getIndustryPresets()
    };
  }

  /**
   * Get all preset scenarios organized by category for a specific organization size
   */
  static getAllPresetsForSize(organizationSize: OrganizationSize): {
    organizationSize: Scenario[];
    awsBenchmarks: Scenario[];
    improvementLevels: Scenario[];
    teamSizes: Scenario[];
    industries: Scenario[];
  } {
    return {
      organizationSize: this.getOrganizationSizePresets(organizationSize),
      awsBenchmarks: this.getAwsBenchmarkScenarios(),
      improvementLevels: this.getImprovementLevelPresets(),
      teamSizes: this.getTeamSizePresets(),
      industries: this.getIndustryPresets()
    };
  }

  /**
   * Get AWS benchmark indicators for comparison
   */
  static getAwsBenchmarkIndicators() {
    return {
      achievedImprovement: 15.9, // AWS's actual achieved improvement
      targetImprovement: 15.0,   // AWS's original target
      bankRoiMultiple: 9.75,     // Bank example ROI
      techMarginImprovement: 9,  // Tech company margin improvement (percentage points)
      
      // Supporting metrics from AWS
      deploymentsPerBuilder: {
        before: 'Baseline',
        after: 'Improved',
        improvement: '15.9% reduction in cost to serve'
      },
      
      // Key success factors
      successFactors: [
        'Automated deployment pipelines',
        'Reduced manual interventions',
        'Faster incident resolution',
        'Improved developer productivity',
        'Better tooling and infrastructure'
      ],
      
      // Timeline
      implementationTimeline: {
        planning: '2-3 months',
        implementation: '6-12 months',
        fullRealization: '12-18 months'
      }
    };
  }

  /**
   * Compare a scenario against AWS benchmarks
   */
  static compareToAwsBenchmarks(scenario: Scenario, results: { roiMultiple: number; costAvoidance: number }) {
    const benchmarks = this.getAwsBenchmarkIndicators();
    
    const comparison = {
      improvementVsAws: {
        scenario: scenario.ctsSwImprovementPercent,
        awsTarget: benchmarks.targetImprovement,
        awsAchieved: benchmarks.achievedImprovement,
        status: scenario.ctsSwImprovementPercent >= benchmarks.achievedImprovement ? 'exceeds' :
                scenario.ctsSwImprovementPercent >= benchmarks.targetImprovement ? 'meets' : 'below'
      },
      
      roiVsAws: {
        scenario: results.roiMultiple,
        awsBenchmark: benchmarks.bankRoiMultiple,
        status: results.roiMultiple >= benchmarks.bankRoiMultiple ? 'exceeds' :
                results.roiMultiple >= benchmarks.bankRoiMultiple * 0.8 ? 'competitive' : 'below'
      },
      
      recommendations: [] as string[]
    };

    // Generate recommendations
    if (comparison.improvementVsAws.status === 'below') {
      comparison.recommendations.push(`Consider targeting ${benchmarks.targetImprovement}% improvement to match AWS's original target`);
    }
    
    if (comparison.roiVsAws.status === 'below') {
      comparison.recommendations.push('ROI is below AWS benchmark - consider optimizing solution cost or improvement percentage');
    }
    
    if (scenario.businessType === 'traditional' && scenario.developerCount < 500) {
      comparison.recommendations.push('Small teams may see different ROI patterns than AWS\'s large-scale examples');
    }

    return comparison;
  }
}