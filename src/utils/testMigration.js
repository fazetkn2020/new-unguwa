// Test script to verify function migration
import { migrateUsersToFunctions } from './migrateToFunctions';

export const testMigration = () => {
  console.log('🧪 Testing function migration...');
  
  // Create a test user without functions
  const testUsers = [
    {
      id: 'test-001',
      name: 'Test Teacher',
      email: 'test@school.edu',
      role: 'Subject Teacher',
      status: 'active'
    }
  ];
  
  localStorage.setItem('users', JSON.stringify(testUsers));
  
  const migratedCount = migrateUsersToFunctions();
  console.log(`✅ Migration test completed: ${migratedCount} users migrated`);
  
  const migratedUsers = JSON.parse(localStorage.getItem('users'));
  console.log('📊 Migrated users:', migratedUsers);
  
  return migratedCount > 0;
};
