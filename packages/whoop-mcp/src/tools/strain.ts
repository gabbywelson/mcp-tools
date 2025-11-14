import type { WhoopClient } from '../whoop-client.js';

/**
 * Get detailed strain analysis for a specific date
 */
export async function getStrainAnalysis(client: WhoopClient, date?: string): Promise<string> {
  try {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const startOfDay = `${targetDate}T00:00:00.000Z`;
    const endOfDay = `${targetDate}T23:59:59.999Z`;

    // Fetch cycles and workouts for the day
    const [cycles, workouts] = await Promise.all([
      client.getCycleCollection(startOfDay, endOfDay),
      client.getWorkoutCollection(startOfDay, endOfDay),
    ]);

    if (cycles.length === 0) {
      return JSON.stringify({
        date: targetDate,
        message: 'No strain data available for this date',
      }, null, 2);
    }

    const cycle = cycles[0];

    // Get historical data for trends (last 30 days)
    const thirtyDaysAgo = new Date(new Date(targetDate).getTime() - 30 * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];
    const historicalCycles = await client.getCycleCollection(
      `${thirtyDaysAgo}T00:00:00.000Z`,
      endOfDay
    ).catch(() => []);

    // Calculate 30-day average strain
    const avgStrain = historicalCycles.length > 0
      ? historicalCycles.reduce((sum, c) => sum + c.score.strain, 0) / historicalCycles.length
      : cycle.score.strain;

    const analysis = {
      date: targetDate,
      cycleId: cycle.id,
      strain: {
        score: cycle.score.strain,
        state: cycle.score_state,
        thirtyDayAverage: Math.round(avgStrain * 100) / 100,
        trend: cycle.score.strain > avgStrain ? 'above' : 'below',
        percentDifference: Math.round(((cycle.score.strain - avgStrain) / avgStrain) * 100),
      },
      period: {
        start: cycle.start,
        end: cycle.end,
      },
      heartRate: {
        average: cycle.score.average_heart_rate,
        max: cycle.score.max_heart_rate,
        unit: 'bpm',
      },
      energy: {
        kilojoules: cycle.score.kilojoule,
        calories: Math.round(cycle.score.kilojoule * 0.239006), // Convert kJ to kcal
      },
      activities: workouts.map(workout => ({
        id: workout.id,
        sportId: workout.sport_id,
        start: workout.start,
        end: workout.end,
        duration: Math.round(
          (new Date(workout.end).getTime() - new Date(workout.start).getTime()) / (1000 * 60)
        ),
        strain: workout.score.strain,
        heartRate: {
          average: workout.score.average_heart_rate,
          max: workout.score.max_heart_rate,
        },
        kilojoules: workout.score.kilojoule,
        distance: workout.score.distance_meter ? {
          meters: workout.score.distance_meter,
          kilometers: Math.round(workout.score.distance_meter / 10) / 100,
          miles: Math.round(workout.score.distance_meter * 0.000621371 * 100) / 100,
        } : null,
        zones: {
          zone0Minutes: Math.round(workout.score.zone_duration.zone_zero_milli / (1000 * 60)),
          zone1Minutes: Math.round(workout.score.zone_duration.zone_one_milli / (1000 * 60)),
          zone2Minutes: Math.round(workout.score.zone_duration.zone_two_milli / (1000 * 60)),
          zone3Minutes: Math.round(workout.score.zone_duration.zone_three_milli / (1000 * 60)),
          zone4Minutes: Math.round(workout.score.zone_duration.zone_four_milli / (1000 * 60)),
          zone5Minutes: Math.round(workout.score.zone_duration.zone_five_milli / (1000 * 60)),
        },
      })),
      activityCount: workouts.length,
      totalActivityStrain: workouts.reduce((sum, w) => sum + w.score.strain, 0),
    };

    return JSON.stringify(analysis, null, 2);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get strain analysis: ${error.message}`);
    }
    throw error;
  }
}

