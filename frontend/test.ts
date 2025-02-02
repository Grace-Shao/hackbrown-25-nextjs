/**
 * Spotify Integration Script
*
 * This script handles integration with Spotify API and MongoDB to:
 * 1. Verify Spotify API credentials and access token
 * 2. Fetch details from a specified playlist
 * 3. Get track recommendations based on a seed track
 * 4. Fetch currently playing song
 * 5. Save playback data to MongoDB
 *
 * @requires spotify - Custom Spotify API wrapper functions
 * @requires zod - Runtime type checking
 * @requires mongoose - MongoDB object modeling
 * @requires logger - Custom logging utility
 */

import logger from '@/utils/logger'
import mongoose, { type ConnectOptions } from 'mongoose';
import { z } from 'zod';

(async () => {
  /**
   * Zod schema for validating Spotify playback data
   * @type {z.ZodObject}
   */
  const schema = z.object({
    isPlaying: z.boolean(),
    songName: z.string().optional(),
    artistName: z.string().optional(),
    songURL: z.string().optional(),
    imageURL: z.string().optional(),
  });

  const { Schema } = mongoose;

  /**
   * MongoDB schema for storing Spotify playback data
   * @type {mongoose.Schema}
   */
  const spotifySchema = new Schema({
    isPlaying: Boolean,
    songName: String,
    artistName: String,
    songURL: String,
    imageURL: String,
    recommendations: [String],
  });

  /**
   * Mongoose model for Spotify data
   * @type {mongoose.Model}
   */
  const Spotify = mongoose.model('Spotify', spotifySchema);

  try {
    logger.info('Starting Spotify API requests');

    /**
     * Step 1: Verify credentials and access token
     * Obtains and validates Spotify API access token
     */
    try {
      const { access_token } = await getAccessToken();
      console.log(access_token);
      if (!access_token) {
        logger.error('No access token received');
        return;
      }
      logger.info('Access token verified successfully');
    } catch (error) {
      logger.error('Authentication failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return;
    }

    /**
     * Step 2: Process playlist and get recommendations
     * Uses a known working playlist ID to fetch tracks and generate recommendations
     */
    const playlistId = '1EiWOQEIOAkDe6nLQYCngR'; // Today's Top Hits
    try {
      const playlist = await getDetailedPlaylist(playlistId);
      logger.info('Playlist details fetched', {
        name: playlist.name,
        total: playlist.tracks.total,
      });

      /**
       * Find first valid track with popularity > 50
       * @type {any} Track object from Spotify API
       */
      const validTrack = playlist.tracks.items.find(
        (item: any) =>
          item?.track?.id && item?.track?.artists?.[0]?.id && item?.track?.popularity > 50,
      )?.track;

      if (!validTrack) {
        logger.warn('No suitable tracks found in playlist');
        return;
      }

      logger.info('Using seed track', {
        name: validTrack.name,
        artist: validTrack.artists[0].name,
        popularity: validTrack.popularity,
      });

      logger.info('Recommendations received', {
        seedTrack: {
          name: validTrack.name,
          artist: validTrack.artists[0].name,
          id: validTrack.id
        },
      });
    } catch (error) {
      logger.error('Failed to process playlist', {
        error: error instanceof Error ? error.message : 'Unknown error',
        playlistId,
      });
      return;
    }

    /**
     * Step 4: Get currently playing song from Spotify
     */
    const response = await currentlyPlayingSong();
    if (!response) {
      logger.info('No active playback');
      return;
    }

    /**
     * Validate response data against schema
     * @type {z.infer<typeof schema>}
     */
    const validatedData = schema.parse({
      isPlaying: response.is_playing,
      songName: response.item?.name,
      artistName: response.item?.artists?.[0]?.name,
      songURL: response.item?.external_urls?.spotify,
      imageURL: response.item?.album?.images?.[0]?.url,
    });

    /**
     * Step 5: Save validated data to MongoDB
     */
    try {
      await mongoose.connect('mongodb://localhost:27017/test', {
        bufferCommands: true,
        autoIndex: true,
      } as ConnectOptions);

      const spotifyRecord = new Spotify(validatedData);
      await spotifyRecord.save();
      logger.info('Data saved to MongoDB');
    } catch (error) {
      logger.error('MongoDB operation failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  } catch (error) {
    logger.error('General error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed');
    }
  }
})();
