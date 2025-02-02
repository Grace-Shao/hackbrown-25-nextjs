import axios from 'axios';
import logger from '@/utils/logger';
import type { RecommendationOptions } from './type';
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

/**
 * Makes a request to the Spotify API to obtain a new access token using a refresh token.
 * @returns {Promise<{access_token: string}>} Object containing the access token
 * @throws {Error} If required Spotify credentials are missing or if the request fails
 */
export const getAccessToken = async (): Promise<{ access_token: string }> => {
  try {
    if (!client_id || !client_secret || !refresh_token) {
      logger.error('Missing Spotify credentials', {
        hasClientId: !!client_id,
        hasClientSecret: !!client_secret,
        hasRefreshToken: !!refresh_token
      });
      throw new Error('Missing required Spotify credentials');
    }

    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
      }),
      {
        headers: {
          Authorization: `Basic ${basic}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    logger.info('Access token obtained successfully');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error('Failed to get access token', {
        status: error.response?.status,
      });
    }
    throw error;
  }
};

/**
 * Retrieves the user's top tracks from Spotify API.
 * @returns {Promise<any[]>} Array of user's top tracks from the last 4 weeks
 * @throws {Error} If the request fails or returns a non-200 status
 */
export const topTracks = async (): Promise<any[]> => {
  const { access_token }: { access_token: string } = await getAccessToken();

  const response = await axios.get(
    'https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term',
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );

  if (response.status !== 200) {
    throw new Error('Failed to fetch top artists.');
  }
  const data = response.data;
  return data.items as any[];
};

/**
 * Retrieves the user's top artists from Spotify API.
 * @returns {Promise<any[]>} Array of user's top artists from the last 4 weeks
 * @throws {Error} If the request fails or returns a non-200 status
 */
export const topArtists = async (): Promise<any[]> => {
  const { access_token } = await getAccessToken();

  const response = await axios.get(
    'https://api.spotify.com/v1/me/top/artists?limit=5&time_range=short_term',
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );

  if (response.status !== 200) {
    throw new Error('Failed to fetch top artists.');
  }

  const data = response.data;
  return data.items as any[];
};

/**
 * Retrieves the user's currently playing song from Spotify API.
 * @returns {Promise<any|null>} Currently playing song data or null if no song is playing
 */
export const currentlyPlayingSong = async () => {
  try {
    const { access_token } = await getAccessToken();

    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (response.status === 204 || response.status > 400) {
      console.error('function-currently-playing-response-error', response.status);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching currently playing song:', error);
    return null;
  }
};

/**
 * Retrieves a Spotify playlist by its ID.
 * @param {string} playlistId - The Spotify playlist ID
 * @returns {Promise<any>} Playlist data
 */
export const getPlaylist = async (playlistId: string) => {
  const accessToken = await getAccessToken();
  const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

/**
 * Validates a Spotify track or artist ID.
 * @param {('track'|'artist')} type - The type of ID to validate
 * @param {string} id - The Spotify ID to validate
 * @param {string} accessToken - Valid Spotify access token
 * @returns {Promise<boolean>} Whether the ID is valid
 */
async function validateSpotifyId(type: 'track' | 'artist', id: string, accessToken: string): Promise<boolean> {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/${type}s/${id}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        validateStatus: (status) => status === 200
      }
    );
    return true;
  } catch (error) {
    logger.warn(`Invalid ${type} ID`, { id });
    return false;
  }
}

/**
 * Gets a valid track from a playlist that meets popularity criteria.
 * @param {any} playlist - The playlist object containing tracks
 * @param {string} accessToken - Valid Spotify access token
 * @returns {Promise<any|null>} A valid track or null if none found
 */
export async function getValidTrackFromPlaylist(playlist: any, accessToken: string) {
  for (const item of playlist.tracks.items) {
    if (!item?.track?.id || !item?.track?.artists?.[0]?.id || item?.track?.popularity <= 50) {
      continue;
    }

    const [isValidTrack, isValidArtist] = await Promise.all([
      validateSpotifyId('track', item.track.id, accessToken),
      validateSpotifyId('artist', item.track.artists[0].id, accessToken)
    ]);

    if (isValidTrack && isValidArtist) {
      return item.track;
    }
  }
  return null;
}

/**
 * Fetches available genre seeds from Spotify API.
 * @deprecated Use seed_genres parameter in getRecommendations instead
 * @returns {Promise<string[]>} Array of available genre names or fallback genres
 */
export const getAvailableGenres = async (): Promise<string[]> => {
  try {
    const { access_token } = await getAccessToken();

    const response = await axios.get(
      'https://api.spotify.com/v1/recommendations/available-genre-seeds',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    logger.info('Available genres fetched', { genres: response.data.genres });
    return response.data.genres;
  } catch (error) {
    logger.warn('Using fallback genres');
    return ['pop', 'rock', 'hip-hop'];
  }
};

/**
 * Gets detailed information about a Spotify playlist including its tracks.
 * @param {string} playlistId - The Spotify playlist ID
 * @returns {Promise<any>} Detailed playlist data
 * @throws {Error} If playlist ID is invalid, playlist not found, or authentication fails
 */
export const getDetailedPlaylist = async (playlistId: string) => {
  try {
    const { access_token } = await getAccessToken();

    if (!playlistId.match(/^[0-9A-Za-z]{22}$/)) {
      throw new Error('Invalid playlist ID format');
    }

    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        logger.error('Playlist not found', { playlistId });
        throw new Error(`Playlist ${playlistId} not found`);
      }
      if (error.response?.status === 401) {
        logger.error('Authentication failed', {
          status: error.response.status,
          data: error.response.data
        });
        throw new Error('Authentication failed');
      }
    }
    logger.error('Spotify API error', {
      error: (error as Error).message,
      playlistId
    });
    throw error;
  }
};