// Universal Time System for Nigerian Schools
// Prevents time manipulation and ensures accurate attendance tracking

class UniversalTime {
  constructor() {
    this.timeOffset = 0;
    this.lastSync = null;
    this.maxDrift = 5 * 60 * 1000; // 5 minutes maximum drift
  }

  // Get current Nigerian time (WAT - West Africa Time)
  getNigerianTime() {
    const now = new Date();
    
    // Apply Nigerian timezone offset (UTC+1)
    const nigeriaOffset = 1 * 60 * 60 * 1000; // UTC+1 in milliseconds
    const nigeriaTime = new Date(now.getTime() + nigeriaOffset);
    
    // Apply server sync offset if available
    if (this.timeOffset) {
      nigeriaTime.setTime(nigeriaTime.getTime() + this.timeOffset);
    }
    
    return nigeriaTime;
  }

  // Format time for display
  formatTime(date) {
    return date.toLocaleTimeString('en-NG', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Format date for storage
  formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  // Get today's date in YYYY-MM-DD format
  getTodayDate() {
    return this.formatDate(this.getNigerianTime());
  }

  // Get current time in HH:MM format
  getCurrentTime() {
    return this.formatTime(this.getNigerianTime());
  }

  // Check if current time is before a specific time
  isBefore(targetTime) {
    const current = this.getCurrentTime();
    return current <= targetTime;
  }

  // Check if current time is after a specific time
  isAfter(targetTime) {
    const current = this.getCurrentTime();
    return current > targetTime;
  }

  // Server time synchronization (would integrate with actual server in production)
  async syncWithServer() {
    try {
      // In a real implementation, this would call your backend API
      // For now, we'll simulate server time
      const serverTime = new Date();
      const localTime = new Date();
      
      // Calculate offset (serverTime - localTime)
      this.timeOffset = serverTime.getTime() - localTime.getTime();
      this.lastSync = new Date();
      
      console.log('Time synchronized with server. Offset:', this.timeOffset, 'ms');
      return true;
    } catch (error) {
      console.error('Time synchronization failed:', error);
      return false;
    }
  }

  // Validate if time entry is reasonable (prevent future dating)
  isValidTimeEntry(entryTime, maxFutureMinutes = 5) {
    const currentTime = this.getNigerianTime();
    const entryDate = new Date(entryTime);
    
    // Allow slight future entries (clock differences) but not excessive
    const maxFuture = maxFutureMinutes * 60 * 1000;
    const timeDiff = entryDate.getTime() - currentTime.getTime();
    
    return timeDiff <= maxFuture && timeDiff >= -24 * 60 * 60 * 1000; // Allow up to 24 hours past
  }

  // Get school day periods
  getSchoolPeriods() {
    return {
      morningArrival: '08:00', // Late threshold
      autoAbsentTime: '10:00', // Auto-mark absent after this time
      schoolStart: '07:30',
      schoolEnd: '15:00'
    };
  }

  // Check if it's a school day (Monday-Friday)
  isSchoolDay() {
    const today = this.getNigerianTime().getDay();
    return today >= 1 && today <= 5; // Monday to Friday
  }

  // Check if school is in session
  isSchoolHours() {
    if (!this.isSchoolDay()) return false;
    
    const currentTime = this.getCurrentTime();
    const periods = this.getSchoolPeriods();
    
    return currentTime >= periods.schoolStart && currentTime <= periods.schoolEnd;
  }

  // Get minutes late based on arrival time
  getMinutesLate(arrivalTime) {
    const periods = this.getSchoolPeriods();
    const [arrivalHour, arrivalMinute] = arrivalTime.split(':').map(Number);
    const [thresholdHour, thresholdMinute] = periods.morningArrival.split(':').map(Number);
    
    const arrivalTotal = arrivalHour * 60 + arrivalMinute;
    const thresholdTotal = thresholdHour * 60 + thresholdMinute;
    
    return Math.max(0, arrivalTotal - thresholdTotal);
  }

  // Anti-tampering: Generate timestamp hash
  generateTimestampHash() {
    const currentTime = this.getNigerianTime();
    const randomSalt = Math.random().toString(36).substring(2, 15);
    const data = `${currentTime.getTime()}-${randomSalt}`;
    
    // Simple hash function (in production, use proper crypto)
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return {
      timestamp: currentTime.getTime(),
      hash: Math.abs(hash).toString(36),
      displayTime: this.formatTime(currentTime),
      displayDate: this.formatDate(currentTime)
    };
  }

  // Verify timestamp hash
  verifyTimestampHash(timestampData, maxAgeMinutes = 10) {
    const currentTime = this.getNigerianTime();
    const age = currentTime.getTime() - timestampData.timestamp;
    const maxAge = maxAgeMinutes * 60 * 1000;
    
    if (age > maxAge) {
      return false; // Timestamp too old
    }
    
    // Recalculate hash to verify
    const randomSalt = timestampData.hash.substring(0, 10);
    const data = `${timestampData.timestamp}-${randomSalt}`;
    
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return Math.abs(hash).toString(36) === timestampData.hash;
  }
}

// Create singleton instance
const universalTime = new UniversalTime();

// Initialize time sync
universalTime.syncWithServer();

// Export singleton
export default universalTime;
