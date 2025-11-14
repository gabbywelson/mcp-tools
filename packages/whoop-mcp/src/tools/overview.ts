import type { WhoopClient } from "../whoop-client.js";

/**
 * Get comprehensive WHOOP overview data for a specific date
 */
export async function getOverview(client: WhoopClient, date?: string): Promise<string> {
  try {
    // Use provided date or default to today
    const targetDate = date || new Date().toISOString().split("T")[0];
    const startOfDay = `${targetDate}T00:00:00.000Z`;
    const endOfDay = `${targetDate}T23:59:59.999Z`;

    // Fetch all data in parallel
    const [profile, cycles, sleeps, workouts, recoveries] = await Promise.all([
      client.getUserProfile().catch(() => null),
      client.getCycleCollection(startOfDay, endOfDay).catch(() => []),
      client.getSleepCollection(startOfDay, endOfDay).catch(() => []),
      client.getWorkoutCollection(startOfDay, endOfDay).catch(() => []),
      client.getRecoveryCollection(startOfDay, endOfDay).catch(() => []),
    ]);

    const cycle = cycles[0];
    const sleep = sleeps[0];
    const recovery = recoveries[0];

    // Build comprehensive overview
    const overview = {
      date: targetDate,
      user: profile
        ? {
            name: `${profile.first_name} ${profile.last_name}`,
            email: profile.email,
          }
        : null,
      recovery: recovery
        ? {
            score: recovery.score,
            state: recovery.score_state,
            hrv: recovery.hrv_rmssd_milli,
            rhr: recovery.resting_heart_rate,
            spo2: recovery.spo2_percentage,
            skinTemp: recovery.skin_temp_celsius,
          }
        : null,
      strain: cycle
        ? {
            score: cycle.score.strain,
            state: cycle.score_state,
            avgHeartRate: cycle.score.average_heart_rate,
            maxHeartRate: cycle.score.max_heart_rate,
            kilojoules: cycle.score.kilojoule,
          }
        : null,
      sleep: sleep
        ? {
            score: sleep.score.sleep_performance_percentage,
            state: sleep.score_state,
            totalSleepHours:
              (sleep.score.stage_summary.total_light_sleep_time_milli +
                sleep.score.stage_summary.total_slow_wave_sleep_time_milli +
                sleep.score.stage_summary.total_rem_sleep_time_milli) /
              (1000 * 60 * 60),
            efficiency: sleep.score.sleep_efficiency_percentage,
            consistency: sleep.score.sleep_consistency_percentage,
            respiratoryRate: sleep.score.respiratory_rate,
            stages: {
              light: sleep.score.stage_summary.total_light_sleep_time_milli / (1000 * 60),
              deepSWS: sleep.score.stage_summary.total_slow_wave_sleep_time_milli / (1000 * 60),
              rem: sleep.score.stage_summary.total_rem_sleep_time_milli / (1000 * 60),
              awake: sleep.score.stage_summary.total_awake_time_milli / (1000 * 60),
            },
          }
        : null,
      activities: workouts.map((workout) => ({
        id: workout.id,
        sportId: workout.sport_id,
        start: workout.start,
        end: workout.end,
        strain: workout.score.strain,
        avgHeartRate: workout.score.average_heart_rate,
        maxHeartRate: workout.score.max_heart_rate,
        kilojoules: workout.score.kilojoule,
        distance: workout.score.distance_meter,
      })),
    };

    return JSON.stringify(overview, null, 2);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get overview: ${error.message}`);
    }
    throw error;
  }
}
