import type { WhoopClient } from "../whoop-client.js";

/**
 * Get detailed sleep analysis for a specific date
 */
export async function getSleepAnalysis(client: WhoopClient, date?: string): Promise<string> {
  try {
    const targetDate = date || new Date().toISOString().split("T")[0];
    const startOfDay = `${targetDate}T00:00:00.000Z`;
    const endOfDay = `${targetDate}T23:59:59.999Z`;

    const sleeps = await client.getSleepCollection(startOfDay, endOfDay);

    if (sleeps.length === 0) {
      return JSON.stringify(
        {
          date: targetDate,
          message: "No sleep data available for this date",
        },
        null,
        2
      );
    }

    const sleep = sleeps[0];
    const stageSummary = sleep.score.stage_summary;
    const sleepNeeded = sleep.score.sleep_needed;

    // Calculate total sleep time in hours
    const totalSleepMinutes =
      (stageSummary.total_light_sleep_time_milli +
        stageSummary.total_slow_wave_sleep_time_milli +
        stageSummary.total_rem_sleep_time_milli) /
      (1000 * 60);

    const totalSleepHours = totalSleepMinutes / 60;
    const totalNeededHours = sleepNeeded.baseline_milli / (1000 * 60 * 60);

    const analysis = {
      date: targetDate,
      sleepId: sleep.id,
      isNap: sleep.nap,
      period: {
        start: sleep.start,
        end: sleep.end,
      },
      performance: {
        score: sleep.score.sleep_performance_percentage,
        state: sleep.score_state,
      },
      duration: {
        totalSleepHours: Math.round(totalSleepHours * 100) / 100,
        totalNeededHours: Math.round(totalNeededHours * 100) / 100,
        deficit: Math.round((totalNeededHours - totalSleepHours) * 100) / 100,
      },
      quality: {
        efficiency: sleep.score.sleep_efficiency_percentage,
        consistency: sleep.score.sleep_consistency_percentage,
        respiratoryRate: sleep.score.respiratory_rate,
        disturbanceCount: stageSummary.disturbance_count,
        sleepCycles: stageSummary.sleep_cycle_count,
      },
      stages: {
        lightSleepMinutes: Math.round(stageSummary.total_light_sleep_time_milli / (1000 * 60)),
        deepSleepMinutes: Math.round(stageSummary.total_slow_wave_sleep_time_milli / (1000 * 60)),
        remSleepMinutes: Math.round(stageSummary.total_rem_sleep_time_milli / (1000 * 60)),
        awakeMinutes: Math.round(stageSummary.total_awake_time_milli / (1000 * 60)),
        inBedMinutes: Math.round(stageSummary.total_in_bed_time_milli / (1000 * 60)),
      },
      sleepNeeded: {
        baselineHours: Math.round((sleepNeeded.baseline_milli / (1000 * 60 * 60)) * 100) / 100,
        fromSleepDebt:
          Math.round((sleepNeeded.need_from_sleep_debt_milli / (1000 * 60 * 60)) * 100) / 100,
        fromStrain:
          Math.round((sleepNeeded.need_from_recent_strain_milli / (1000 * 60 * 60)) * 100) / 100,
        fromNaps:
          Math.round((sleepNeeded.need_from_recent_nap_milli / (1000 * 60 * 60)) * 100) / 100,
      },
    };

    return JSON.stringify(analysis, null, 2);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get sleep analysis: ${error.message}`);
    }
    throw error;
  }
}
