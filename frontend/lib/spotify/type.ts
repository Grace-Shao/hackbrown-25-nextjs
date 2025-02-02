/**
 * Interface for Spotify recommendation parameters
 * @interface RecommendationOptions
 */
export interface RecommendationOptions {
  /** Array of Spotify artist IDs to use as seeds */
  seed_artists?: string[];
  /** Array of Spotify track IDs to use as seeds */
  seed_tracks?: string[];
  /** Array of genre names to use as seeds */
  seed_genres?: string[];
  /** Maximum number of recommendations to return */
  limit?: number;
  /** Target market (country) for recommendations */
  market?: string;
  /** Minimum popularity value (0-100) */
  min_popularity?: number;
  /** Maximum popularity value (0-100) */
  max_popularity?: number;
  /** Target popularity value (0-100) */
  target_popularity?: number;
  /** Minimum energy value (0.0-1.0) */
  min_energy?: number;
  /** Maximum energy value (0.0-1.0) */
  max_energy?: number;
  /** Target energy value (0.0-1.0) */
  target_energy?: number;
  /** Minimum danceability value (0.0-1.0) */
  min_danceability?: number;
  /** Maximum danceability value (0.0-1.0) */
  max_danceability?: number;
  /** Target danceability value (0.0-1.0) */
  target_danceability?: number;
  /** Minimum valence value (0.0-1.0) */
  min_valence?: number;
  /** Maximum valence value (0.0-1.0) */
  max_valence?: number;
  /** Target valence value (0.0-1.0) */
  target_valence?: number;
}
