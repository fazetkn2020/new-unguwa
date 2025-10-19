<<<<<<< HEAD
// components/scoring/index.js
// Export all scoring components
export { default as RecentActivity } from './RecentActivity.jsx';
export { default as ScoreEntryTable } from './ScoreEntryTable.jsx';
export { default as ScoringStatistics } from './ScoringStatistics.jsx';
export { default as SubjectSelector } from './SubjectSelector.jsx';

// NEW: Export the reusable scoring components
export { default as ScoringFeature } from './ScoringFeature.jsx';
export { default as TeachingNavigation } from './TeachingNavigation.jsx';
export { default as ScoringQuickAccess } from './ScoringQuickAccess.jsx';
export { default as useTeachingAssignments } from './useTeachingAssignments.js';
=======
// src/components/scoring/index.js

// Export all scoring-related components
export { default as ScoreEntryTable } from './ScoreEntryTable';
export { default as SubjectSelector } from './SubjectSelector';
export { default as ScoringStatistics } from './ScoringStatistics';
export { default as RecentActivity } from './RecentActivity';

// Export reusable scoring features
export { default as ScoringFeature } from './ScoringFeature';
export { default as TeachingNavigation } from './TeachingNavigation';
export { default as ScoringQuickAccess } from './ScoringQuickAccess';
export { default as useTeachingAssignments } from './useTeachingAssignments';
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
