"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { searchSpotifyTracks, getTopGenres } from '@/lib'

interface Artist {
  name: string;
}

interface SearchTrack {
  name: string;
  artists: Artist[];
  id: string;
}

interface Track {
  name: string;
  artists: string[];
  id: string;  
}

interface GenreData {
  genre: string;
  tracks: Track[];
}

interface GenreTracksDisplayProps {
  keywords: string;
}

const GenreTracksDisplay: React.FC<GenreTracksDisplayProps> = ({ keywords }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [genreData, setGenreData] = useState<GenreData[]>([]);
  const itemsPerPage = 1;

  useEffect(() => {
    if (keywords) {
      fetchGenreData();
    }
  }, [keywords]);

  const fetchGenreData = async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const topGenres = await getTopGenres([], keywords);
      const tracksPromises = topGenres.map(async (genre) => {
        const searchTracks = await searchSpotifyTracks(genre);
        const tracks: Track[] = searchTracks.slice(0, 10).map(track => ({
          name: track.name,
          artists: track.artists.map(artist => artist.name),
          id: track.id
        }));
        return {
          genre,
          tracks
        };
      });
      const results = await Promise.all(tracksPromises);
      setGenreData(results);
    } catch (err) {
      setError('Failed to fetch genre data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(genreData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentGenres = genreData.slice(startIndex, startIndex + itemsPerPage);

  if (!keywords) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {loading ? (
        <div className="text-center py-8">Loading genre data...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : (
        <>
          {currentGenres.map((genreItem, index) => (
            <Card key={`${genreItem.genre}-${index}`} className="mb-6">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Genre: {genreItem.genre}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {genreItem.tracks.map((track) => (
                    <div
                      key={track.id}
                      className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <div className="font-medium">{track.name}</div>
                      <div className="text-sm text-gray-600">
                        {track.artists.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {genreData.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                variant="outline"
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GenreTracksDisplay;