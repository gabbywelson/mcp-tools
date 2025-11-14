import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  WhoopConfig,
  TokenResponse,
  WhoopUser,
  RecoveryScore,
  SleepActivity,
  Cycle,
  Workout,
  PaginatedResponse,
} from './types.js';

/**
 * WHOOP API Client with automatic OAuth token management
 */
export class WhoopClient {
  private config: WhoopConfig;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;
  private axiosInstance: AxiosInstance;
  private readonly baseURL = 'https://api.whoop.com/developer';
  private readonly authURL = 'https://api.whoop.com/oauth/token';

  constructor(config: WhoopConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to ensure valid token
    this.axiosInstance.interceptors.request.use(async (config) => {
      await this.ensureValidToken();
      config.headers.Authorization = `Bearer ${this.accessToken}`;
      return config;
    });

    // Add response interceptor to handle token expiration
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401 && error.config) {
          // Token expired, refresh and retry
          await this.refreshAccessToken();
          error.config.headers.Authorization = `Bearer ${this.accessToken}`;
          return this.axiosInstance.request(error.config);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Ensure we have a valid access token
   */
  private async ensureValidToken(): Promise<void> {
    const now = Date.now();
    // Refresh if token doesn't exist or expires in less than 5 minutes
    if (!this.accessToken || now >= this.tokenExpiresAt - 5 * 60 * 1000) {
      await this.refreshAccessToken();
    }
  }

  /**
   * Refresh the access token using the refresh token
   */
  private async refreshAccessToken(): Promise<void> {
    try {
      const response = await axios.post<TokenResponse>(
        this.authURL,
        {
          grant_type: 'refresh_token',
          refresh_token: this.config.refreshToken,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      this.accessToken = response.data.access_token;
      // WHOOP tokens typically expire in 1 hour (3600 seconds)
      this.tokenExpiresAt = Date.now() + response.data.expires_in * 1000;

      // Update refresh token if a new one is provided
      if (response.data.refresh_token) {
        this.config.refreshToken = response.data.refresh_token;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to refresh access token: ${error.response?.data?.error || error.message}`
        );
      }
      throw error;
    }
  }

  /**
   * Get user profile information
   */
  async getUserProfile(): Promise<WhoopUser> {
    const response = await this.axiosInstance.get<WhoopUser>('/v1/user/profile/basic');
    return response.data;
  }

  /**
   * Get recovery data for a specific cycle
   */
  async getRecovery(cycleId: number): Promise<RecoveryScore> {
    const response = await this.axiosInstance.get<RecoveryScore>(`/v1/recovery/${cycleId}`);
    return response.data;
  }

  /**
   * Get recovery data for a date range
   */
  async getRecoveryCollection(start: string, end: string): Promise<RecoveryScore[]> {
    const response = await this.axiosInstance.get<PaginatedResponse<RecoveryScore>>(
      '/v1/recovery',
      {
        params: { start, end },
      }
    );
    return response.data.records;
  }

  /**
   * Get sleep activity by ID
   */
  async getSleep(sleepId: number): Promise<SleepActivity> {
    const response = await this.axiosInstance.get<SleepActivity>(`/v1/activity/sleep/${sleepId}`);
    return response.data;
  }

  /**
   * Get sleep activities for a date range
   */
  async getSleepCollection(start: string, end: string): Promise<SleepActivity[]> {
    const response = await this.axiosInstance.get<PaginatedResponse<SleepActivity>>(
      '/v1/activity/sleep',
      {
        params: { start, end },
      }
    );
    return response.data.records;
  }

  /**
   * Get cycle (strain) data by ID
   */
  async getCycle(cycleId: number): Promise<Cycle> {
    const response = await this.axiosInstance.get<Cycle>(`/v1/cycle/${cycleId}`);
    return response.data;
  }

  /**
   * Get cycles for a date range
   */
  async getCycleCollection(start: string, end: string): Promise<Cycle[]> {
    const response = await this.axiosInstance.get<PaginatedResponse<Cycle>>('/v1/cycle', {
      params: { start, end },
    });
    return response.data.records;
  }

  /**
   * Get workout by ID
   */
  async getWorkout(workoutId: number): Promise<Workout> {
    const response = await this.axiosInstance.get<Workout>(`/v1/activity/workout/${workoutId}`);
    return response.data;
  }

  /**
   * Get workouts for a date range
   */
  async getWorkoutCollection(start: string, end: string): Promise<Workout[]> {
    const response = await this.axiosInstance.get<PaginatedResponse<Workout>>(
      '/v1/activity/workout',
      {
        params: { start, end },
      }
    );
    return response.data.records;
  }

  /**
   * Get body measurements
   */
  async getBodyMeasurement(): Promise<any> {
    const response = await this.axiosInstance.get('/v1/user/measurement/body');
    return response.data;
  }
}

