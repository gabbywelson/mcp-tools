import type { WhoopClient } from '../whoop-client.js';

/**
 * Get healthspan/biological age data
 * Note: This endpoint may not be available in all WHOOP API versions
 */
export async function getHealthspanAnalysis(client: WhoopClient, date?: string): Promise<string> {
  try {
    const targetDate = date || new Date().toISOString().split('T')[0];

    // Note: The WHOOP API v1 documentation doesn't explicitly list a healthspan endpoint
    // This is a placeholder implementation that could be updated when/if the endpoint becomes available
    
    // For now, we'll return a message indicating the feature availability
    const response = {
      date: targetDate,
      message: 'Healthspan/biological age data is not currently available via the WHOOP API v1.',
      note: 'This feature may require WHOOP 4.0+ and may not be exposed in the public API yet.',
      suggestion: 'Use the recovery, sleep, and strain tools to get comprehensive health metrics.',
    };

    return JSON.stringify(response, null, 2);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get healthspan analysis: ${error.message}`);
    }
    throw error;
  }
}

