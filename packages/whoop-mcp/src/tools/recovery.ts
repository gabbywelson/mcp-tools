import type { WhoopClient } from '../whoop-client.js';

/**
 * Get detailed recovery analysis for a specific date
 */
export async function getRecoveryAnalysis(client: WhoopClient, date?: string): Promise<string> {
  try {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const startOfDay = `${targetDate}T00:00:00.000Z`;
    const endOfDay = `${targetDate}T23:59:59.999Z`;

    const recoveries = await client.getRecoveryCollection(startOfDay, endOfDay);

    if (recoveries.length === 0) {
      return JSON.stringify({
        date: targetDate,
        message: 'No recovery data available for this date',
      }, null, 2);
    }

    const recovery = recoveries[0];

    // Get historical data for trends (last 30 days)
    const thirtyDaysAgo = new Date(new Date(targetDate).getTime() - 30 * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];
    const historicalRecoveries = await client.getRecoveryCollection(
      `${thirtyDaysAgo}T00:00:00.000Z`,
      endOfDay
    ).catch(() => []);

    // Calculate 30-day averages for trends
    const avgHRV = historicalRecoveries.length > 0
      ? historicalRecoveries.reduce((sum, r) => sum + r.hrv_rmssd_milli, 0) / historicalRecoveries.length
      : recovery.hrv_rmssd_milli;

    const avgRHR = historicalRecoveries.length > 0
      ? historicalRecoveries.reduce((sum, r) => sum + r.resting_heart_rate, 0) / historicalRecoveries.length
      : recovery.resting_heart_rate;

    const analysis = {
      date: targetDate,
      cycleId: recovery.cycle_id,
      sleepId: recovery.sleep_id,
      recovery: {
        score: recovery.score,
        state: recovery.score_state,
        scorePercentage: `${recovery.score}%`,
      },
      contributors: {
        heartRateVariability: {
          value: recovery.hrv_rmssd_milli,
          unit: 'ms',
          thirtyDayAverage: Math.round(avgHRV * 10) / 10,
          trend: recovery.hrv_rmssd_milli > avgHRV ? 'above' : 'below',
          percentDifference: Math.round(((recovery.hrv_rmssd_milli - avgHRV) / avgHRV) * 100),
        },
        restingHeartRate: {
          value: recovery.resting_heart_rate,
          unit: 'bpm',
          thirtyDayAverage: Math.round(avgRHR * 10) / 10,
          trend: recovery.resting_heart_rate < avgRHR ? 'below' : 'above',
          percentDifference: Math.round(((recovery.resting_heart_rate - avgRHR) / avgRHR) * 100),
        },
        spo2: {
          value: recovery.spo2_percentage,
          unit: '%',
        },
        skinTemperature: {
          value: recovery.skin_temp_celsius,
          unit: '°C',
        },
      },
      timestamps: {
        created: recovery.created_at,
        updated: recovery.updated_at,
      },
    };

    return JSON.stringify(analysis, null, 2);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get recovery analysis: ${error.message}`);
    }
    throw error;
  }
}

