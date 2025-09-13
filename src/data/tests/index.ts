import { TestSpec } from '@/types';
import { cricketTests } from './cricket';
import { athleticsTests } from './athletics';

export const allTestSpecs: TestSpec[] = [
  ...cricketTests,
  ...athleticsTests
];

export const getTestSpec = (testId: string): TestSpec | undefined => {
  return allTestSpecs.find(test => test.id === testId);
};

export const getTestsForSport = (sportId: string): TestSpec[] => {
  return allTestSpecs.filter(test => test.sportId === sportId);
};
