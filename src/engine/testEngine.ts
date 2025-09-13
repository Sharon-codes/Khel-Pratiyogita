import { TestAttempt, TestSpec, TestState } from '@/types';
import { storage } from '@/services/storage';
import { PerformanceSimulator } from './performanceSimulator';
import { UserProfile } from '@/types';

export type TestEngineEvent = 
  | { type: 'START'; testId: string; userId: string }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'SIMULATE_AND_COMPLETE'; user: UserProfile }
  | { type: 'CONFIRM' }
  | { type: 'CANCEL' };

export class TestEngine {
  private attempt: TestAttempt | null = null;
  private testSpec: TestSpec | null = null;
  private intervalId: number | null = null;
  private listeners: Array<(attempt: TestAttempt | null) => void> = [];

  subscribe(listener: (attempt: TestAttempt | null) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(listener => listener(this.attempt));
  }

  private generateAttemptId(): string {
    return `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getCurrentAttempt(): TestAttempt | null {
    return this.attempt;
  }

  getElapsedTime(): number {
    if (!this.attempt || !this.attempt.startTime) return 0;
    const now = Date.now();
    const elapsed = now - this.attempt.startTime - (this.attempt.pausedDuration || 0);
    return Math.max(0, elapsed);
  }

  getRemainingTime(): number {
    if (!this.testSpec || !this.attempt) return 0;
    const elapsed = this.getElapsedTime();
    const remaining = (this.testSpec.duration * 1000) - elapsed;
    return Math.max(0, remaining);
  }

  dispatch(event: TestEngineEvent, testSpec?: TestSpec): void {
    if (import.meta.env.DEV) {
      console.log('[TestEngine] Event:', event.type, event);
    }

    switch (event.type) {
      case 'START':
        this.handleStart(event.testId, event.userId, testSpec!);
        break;
      case 'PAUSE':
        this.handlePause();
        break;
      case 'RESUME':
        this.handleResume();
        break;
      case 'SIMULATE_AND_COMPLETE':
        this.handleSimulateAndComplete(event.user);
        break;
      case 'CONFIRM':
        this.handleConfirm();
        break;
      case 'CANCEL':
        this.handleCancel();
        break;
    }
  }

  private handleStart(testId: string, userId: string, testSpec: TestSpec): void {
    if (this.attempt && this.attempt.state === 'running') {
      throw new Error('Test already in progress');
    }

    this.testSpec = testSpec;
    this.attempt = {
      id: this.generateAttemptId(),
      testId,
      userId,
      state: 'running',
      startTime: Date.now(),
      pausedDuration: 0,
      metrics: {},
      timestamp: new Date().toISOString()
    };

    storage.saveTestAttempt(this.attempt);
    this.startTimer();
    this.notify();
  }

  private handlePause(): void {
    if (!this.attempt || this.attempt.state !== 'running') return;

    this.attempt.state = 'paused';
    this.attempt.pausedStart = Date.now();
    this.stopTimer();
    storage.saveTestAttempt(this.attempt);
    this.notify();
  }

  private handleResume(): void {
    if (!this.attempt || this.attempt.state !== 'paused') return;

    if (this.attempt.pausedStart) {
      this.attempt.pausedDuration = (this.attempt.pausedDuration || 0) + (Date.now() - this.attempt.pausedStart);
      delete this.attempt.pausedStart;
    }

    this.attempt.state = 'running';
    this.startTimer();
    storage.saveTestAttempt(this.attempt);
    this.notify();
  }

  private handleSimulateAndComplete(user: UserProfile): void {
    if (!this.attempt || !this.testSpec) return;

    this.attempt.state = 'completed';
    this.attempt.endTime = Date.now();
    this.stopTimer();

    // Generate realistic metrics based on user profile
    this.attempt.metrics = PerformanceSimulator.generateMetrics(this.testSpec, user);

    // Calculate score based on generated metrics
    this.attempt.score = this.calculateScore();
    this.attempt.xpEarned = Math.floor(this.attempt.score * this.testSpec.scoring.xpPerPoint);
    this.attempt.coinsEarned = this.testSpec.scoring.coinBonus;

    // Add bonus coins based on score thresholds
    if (this.attempt.score >= this.testSpec.scoring.thresholds.excellent) {
      this.attempt.coinsEarned += 50;
    } else if (this.attempt.score >= this.testSpec.scoring.thresholds.good) {
      this.attempt.coinsEarned += 20;
    } else if (this.attempt.score >= this.testSpec.scoring.thresholds.pass) {
      this.attempt.coinsEarned += 10;
    }

    storage.saveTestAttempt(this.attempt);
    this.notify();
  }

  private handleConfirm(): void {
    if (!this.attempt || this.attempt.state !== 'completed') return;

    this.attempt.state = 'confirmed';
    storage.saveTestAttempt(this.attempt);
    
    this.updateUserProfile();
    
    this.notify();
    this.cleanup();
  }

  private handleCancel(): void {
    if (this.attempt) {
      storage.removeTestAttempt(this.attempt.id);
    }
    this.cleanup();
    this.notify(); // Notify listeners that attempt is now null
  }

  private calculateScore(): number {
    if (!this.testSpec || !this.attempt) return 0;

    let totalScore = 0;
    const requiredMetrics = this.testSpec.metrics.filter(m => m.required);
    if (requiredMetrics.length === 0) return 0;

    for (const metric of requiredMetrics) {
      const value = this.attempt.metrics[metric.key];
      if (value === undefined) continue;

      let metricScore = 0;
      const { min, max } = metric;
      const range = max - min;
      if (range === 0) continue;

      const normalizedValue = (value - min) / range;

      if (this.testSpec.scoring.function === 'linear_asc') {
        metricScore = normalizedValue * 100;
      } else { // linear_desc
        metricScore = (1 - normalizedValue) * 100;
      }
      
      totalScore += metricScore;
    }

    return Math.round(totalScore / requiredMetrics.length);
  }

  private updateUserProfile(): void {
    if (!this.attempt || !this.testSpec) return;

    const user = storage.getUserProfile();
    if (!user) return;

    user.xp += this.attempt.xpEarned || 0;
    const newLevel = Math.floor(user.xp / 100) + 1;
    if (newLevel > user.level) {
      user.level = newLevel;
      user.coins += newLevel * 10;
    }

    user.coins += this.attempt.coinsEarned || 0;

    const currentBest = user.personalBests[this.testSpec.id] || 0;
    if ((this.attempt.score || 0) > currentBest) {
      user.personalBests[this.testSpec.id] = this.attempt.score || 0;
    }

    user.totalAssessments += 1;
    user.lastActiveDate = new Date().toISOString();

    storage.saveUserProfile(user);
  }

  private startTimer(): void {
    if (!this.testSpec) return;

    this.intervalId = window.setInterval(() => {
      if (this.getRemainingTime() <= 0 && this.attempt?.state === 'running') {
        const user = storage.getUserProfile();
        if (user) {
          this.dispatch({ type: 'SIMULATE_AND_COMPLETE', user });
        }
      }
    }, 250);
  }

  private stopTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private cleanup(): void {
    this.stopTimer();
    this.attempt = null;
    this.testSpec = null;
  }
}

export const testEngine = new TestEngine();
