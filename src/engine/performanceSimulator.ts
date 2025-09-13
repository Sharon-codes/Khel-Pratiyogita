import { UserProfile, TestSpec } from '@/types';

class SeededRandom {
  private seed: number;
  constructor(seed: number) { this.seed = seed; }
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  float(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
}

export class PerformanceSimulator {
  public static generateMetrics(spec: TestSpec, user: UserProfile): Record<string, number> {
    const metrics: Record<string, number> = {};
    
    // Create a deterministic seed based on user ID and current day
    const daySeed = Math.floor(new Date().getTime() / (1000 * 60 * 60 * 24));
    const random = new SeededRandom(this.hashString(user.id) + daySeed);

    // Base performance factor on user level (e.g., 0 to 1 scale)
    const levelFactor = Math.min(user.level / 50, 1); // Max benefit at level 50

    // Sport-specific bonus
    const sportBonus = user.primarySport === spec.sportId ? 0.1 : 0;

    // Daily variation for realism
    const dailyVariation = random.float(-0.05, 0.05);

    const performanceFactor = Math.max(0, Math.min(1, levelFactor + sportBonus + dailyVariation));

    spec.metrics.forEach(metricSpec => {
      let value: number;
      const range = metricSpec.max - metricSpec.min;

      // Determine if higher is better or lower is better from scoring function
      const isAscending = spec.scoring.function === 'linear_asc';

      if (isAscending) {
        // Higher is better (e.g., Technique Score)
        value = metricSpec.min + range * performanceFactor;
      } else {
        // Lower is better (e.g., Sprint Time)
        value = metricSpec.max - range * performanceFactor;
      }
      
      // Final clamp to ensure value is within spec bounds
      metrics[metricSpec.key] = Math.max(metricSpec.min, Math.min(metricSpec.max, value));
    });

    if (import.meta.env.DEV) {
      console.log('[PerformanceSimulator] Generated Metrics:', {
        level: user.level,
        primarySport: user.primarySport,
        performanceFactor,
        metrics
      });
    }

    return metrics;
  }

  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}
