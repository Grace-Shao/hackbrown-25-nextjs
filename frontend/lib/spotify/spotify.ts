import axios from 'axios';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

interface AccessTokenResponse {
  access_token: string;
}

interface Image {
  url: string;
  height: number;
  width: number;
}

interface ExternalUrls {
  spotify: string;
}

interface Artist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: 'artist';
  uri: string;
}

interface Album {
  album_type: 'album' | 'single' | 'compilation';
  total_tracks: number;
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions?: {
    reason: string;
  };
  type: 'album';
  uri: string;
  artists: Artist[];
}

interface TrackItem {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc?: string;
    ean?: string;
    upc?: string;
  };
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_playable: boolean;
  linked_from?: Record<string, never>;
  restrictions?: {
    reason: string;
  };
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: 'track';
  uri: string;
  is_local: boolean;
}

interface TopTracksResponse {
  items: TrackItem[];
}

interface ArtistItem {
  external_urls: ExternalUrls;
  followers: {
    href: string;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: 'artist';
  uri: string;
}

interface TopArtistsResponse {
  items: ArtistItem[];
}

interface PlaylistOwner {
  external_urls: ExternalUrls;
  followers: {
    href: string;
    total: number;
  };
  href: string;
  id: string;
  type: 'user';
  uri: string;
  display_name: string;
}

interface PlaylistResponse {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: PlaylistOwner;
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: string;
  uri: string;
}

export const getAccessToken = async (): Promise<AccessTokenResponse> => {
  try {
    if (!client_id || !client_secret || !refresh_token) {
      throw new Error('Missing required Spotify credentials');
    }

    const response = await axios.post<AccessTokenResponse>(
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

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to get access token', {
        status: error.response?.status,
      });
    }
    throw error;
  }
};

export const topTracks = async (): Promise<TrackItem[]> => {
  const { access_token } = await getAccessToken();

  const response = await axios.get<TopTracksResponse>(
    'https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term',
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );

  if (response.status !== 200) {
    throw new Error('Failed to fetch top tracks.');
  }

  return response.data.items;
};

export const topArtists = async (): Promise<ArtistItem[]> => {
  const { access_token } = await getAccessToken();

  const response = await axios.get<TopArtistsResponse>(
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

  return response.data.items;
};

export const currentlyPlayingSong = async (): Promise<TrackItem | null> => {
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
    return data.item;
  } catch (error) {
    console.error('Error fetching currently playing song:', error);
    return null;
  }
};

export const getPlaylist = async (playlistId: string): Promise<PlaylistResponse> => {
  const { access_token } = await getAccessToken();
  const response = await axios.get<PlaylistResponse>(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );
  return response.data;
};

async function validateSpotifyId(type: 'track' | 'artist', id: string, accessToken: string): Promise<boolean> {
  try {
    await axios.get(
      `https://api.spotify.com/v1/${type}s/${id}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        validateStatus: (status) => status === 200
      }
    );
    return true;
  } catch (error) {
    console.warn(`Invalid ${type} ID`, { id });
    return false;
  }
}

// export async function getValidTrackFromPlaylist(
//   playlist: PlaylistResponse,
//   accessToken: string
// ): Promise<TrackItem | null> {
//   if (!playlist.(tracks as {
//     items: { track: TrackItem }[];
//   })?.items?.length) return null; // Ensure tracks exist

//   for (const item of playlist.tracks.items) {
//     const track = item?.track;
//     if (!track || !track.id || !track.artists?.[0]?.id || track.popularity <= 50) {
//       continue;
//     }

//     try {
//       const [isValidTrack, isValidArtist] = await Promise.all([
//         validateSpotifyId('track', track.id, accessToken),
//         validateSpotifyId('artist', track.artists[0].id, accessToken),
//       ]);

//       if (isValidTrack && isValidArtist) {
//         return track;
//       }
//     } catch (error) {
//       console.error('Error validating track or artist:', error);
//     }
//   }

//   return null;
// }


export const getAvailableGenres = async (): Promise<string[]> => {
  try {
    const { access_token } = await getAccessToken();

    const response = await axios.get<{ genres: string[] }>(
      'https://api.spotify.com/v1/recommendations/available-genre-seeds',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return response.data.genres;
  } catch (error) {
    console.warn('Using fallback genres');
    return ['pop', 'rock', 'hip-hop'];
  }
};

export const getDetailedPlaylist = async (playlistId: string): Promise<PlaylistResponse> => {
  try {
    const { access_token } = await getAccessToken();

    if (!playlistId.match(/^[0-9A-Za-z]{22}$/)) {
      throw new Error('Invalid playlist ID format');
    }

    const response = await axios.get<PlaylistResponse>(
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
        console.error('Playlist not found', { playlistId });
        throw new Error(`Playlist ${playlistId} not found`);
      }
      if (error.response?.status === 401) {
        console.error('Authentication failed', {
          status: error.response.status,
          data: error.response.data
        });
        throw new Error('Authentication failed');
      }
    }
    console.error('Spotify API error', {
      error: (error as Error).message,
      playlistId
    });
    throw error;
  }
};

interface SearchTrack {
  name: string;
  artists: Artist[];
  id: string;
}

interface SearchResponse {
  tracks: {
    items: SearchTrack[];
  };
}

export async function searchSpotifyTracks(genres: string): Promise<SearchTrack[]> {
  const { access_token } = await getAccessToken();

  try {
    const searchQuery = `genre:${genres}`;
    const response = await axios.get<SearchResponse>('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      params: {
        q: searchQuery,
        type: 'track',
        limit: 10,
      },
    });

    return response.data.tracks.items;
  } catch (error) {
    console.error('Failed to search Spotify:', error);
    throw error;
  }
}