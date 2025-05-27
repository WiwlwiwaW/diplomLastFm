/**
 * API service for interacting with Last.fm API
 * @module services/lastFmApi
 */
const API_KEY = '94cf290d94d5f0b0908ee9c3f7dd2986';
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';
const DEFAULT_ARTIST_IMAGE = 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png';
const DEFAULT_TRACK_IMAGE = 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png';

/**
 * Gets artist information including genres
 * @param {string} artistName - The artist name to look up
 * @returns {Promise<Array<string>>} Array of genre names
 */
const getArtistInfo = async (artistName: string) => {
  const url = `${BASE_URL}?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${API_KEY}&format=json`;
  const response = await fetch(url);
  if (!response.ok) return null;
  const data = await response.json();
  return data.artist?.tags?.tag?.map((tag: any) => tag.name) || [];
};

/**
 * Gets top artists from Last.fm charts
 * @param {number} [limit=10] - Number of artists to return
 * @returns {Promise<Array<Object>>} Array of artist objects with name, mbid, image, and genres
 * @throws {Error} When the request fails or no artists are found
 */
export const getTopArtists = async (limit: number = 10) => {
  const url = `${BASE_URL}?method=chart.gettopartists&api_key=${API_KEY}&format=json&limit=${limit}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch top artists');
  
  const data = await response.json();
  if (!data.artists?.artist) throw new Error('No artists found');

  return await Promise.all(data.artists.artist.map(async (artist: any) => {
    const genres = await getArtistInfo(artist.name);
    return {
      name: artist.name,
      mbid: artist.mbid,
      image: artist.image.find((img: any) => img.size === 'large')?.['#text'] || DEFAULT_ARTIST_IMAGE,
      genres: genres.slice(0, 3).join(', ') || 'Various genres'
    };
  }));
};

/**
 * Gets top tracks from Last.fm charts
 * @param {number} [limit=10] - Number of tracks to return
 * @returns {Promise<Array<Object>>} Array of track objects with name, artist, mbid, image, and genres
 * @throws {Error} When the request fails or no tracks are found
 */
export const getTopTracks = async (limit: number = 10) => {
  const url = `${BASE_URL}?method=chart.gettoptracks&api_key=${API_KEY}&format=json&limit=${limit}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to fetch top tracks: ${errorData.message || 'Unknown error'}`);
  }
  
  const data = await response.json();
  
  if (!data.tracks?.track) {
    throw new Error('No tracks found in response');
  }

  const basicTracks = data.tracks.track.map((track: any) => ({
    name: track.name,
    artist: track.artist.name,
    mbid: track.mbid,
    image: track.image.find((img: any) => img.size === 'large')?.['#text'] ||
           track.image.find((img: any) => img.size === 'medium')?.['#text'] ||
           DEFAULT_TRACK_IMAGE,
    genres: 'Loading...'
  }));

  const tracksWithGenres = await Promise.all(
    basicTracks.map(async (track: any) => {
      try {
        const genres = await getArtistInfo(track.artist);
        return {
          ...track,
          genres: genres.slice(0, 3).join(', ') || 'Various genres'
        };
      } catch (error) {
        console.error(`Failed to get genres for ${track.artist}:`, error);
        return {
          ...track,
          genres: 'Various genres'
        };
      }
    })
  );

  return tracksWithGenres;
};

/**
 * Searches for artists, tracks, and albums on Last.fm
 * @param {string} query - The search query
 * @param {number} [limit=10] - Number of results to return per category
 * @returns {Promise<Object>} Object containing arrays of artists, tracks, and albums
 * @throws {Error} When the search request fails
 */
export const search = async (query: string, limit: number = 10) => {
  const artistsUrl = `${BASE_URL}?method=artist.search&artist=${encodeURIComponent(query)}&api_key=${API_KEY}&format=json&limit=${limit}`;
  const tracksUrl = `${BASE_URL}?method=track.search&track=${encodeURIComponent(query)}&api_key=${API_KEY}&format=json&limit=${limit}`;
  const albumsUrl = `${BASE_URL}?method=album.search&album=${encodeURIComponent(query)}&api_key=${API_KEY}&format=json&limit=${limit}`;

  const [artistsRes, tracksRes, albumsRes] = await Promise.all([
    fetch(artistsUrl),
    fetch(tracksUrl),
    fetch(albumsUrl)
  ]);

  if (!artistsRes.ok || !tracksRes.ok || !albumsRes.ok) {
    const errorData = await (artistsRes.ok ? tracksRes.ok ? albumsRes : tracksRes : artistsRes).json();
    throw new Error(`Search failed: ${errorData.error || 'Unknown error'} (Code: ${errorData.error?.code || 'N/A'})`);
  }

  const artistsData = await artistsRes.json();
  const tracksData = await tracksRes.json();
  const albumsData = await albumsRes.json();

  const artists = await Promise.all(
    artistsData.results.artistmatches.artist.map(async (artist: any) => {
      let image =
        artist.image.find((img: any) => img.size === 'large')?.['#text'] ||
        artist.image.find((img: any) => img.size === 'medium')?.['#text'] ||
        DEFAULT_ARTIST_IMAGE;

      return {
        name: artist.name,
        mbid: artist.mbid,
        image,
        listeners: artist.listeners || '0'
      };
    })
  );

  const tracks = await Promise.all(
    tracksData.results.trackmatches.track.map(async (track: any) => {
      let image =
        track.image?.find((img: any) => img.size === 'large')?.['#text'] ||
        track.image?.find((img: any) => img.size === 'medium')?.['#text'] ||
        DEFAULT_TRACK_IMAGE;

      let duration = '0';
      try {
        const trackInfoRes = await fetch(
          `${BASE_URL}?method=track.getInfo&artist=${encodeURIComponent(track.artist)}&track=${encodeURIComponent(track.name)}&api_key=${API_KEY}&format=json`
        );
        const trackInfo = await trackInfoRes.json();
        duration = trackInfo.track?.duration ? Math.floor(trackInfo.track.duration / 1000).toString() : '0';
      } catch {
        duration = '0';
      }

      return {
        name: track.name,
        artist: track.artist,
        mbid: track.mbid,
        image,
        duration
      };
    })
  );

  const albums = albumsData.results.albummatches.album.map((album: any) => {
    let image =
      album.image.find((img: any) => img.size === 'large')?.['#text'] ||
      album.image.find((img: any) => img.size === 'medium')?.['#text'] ||
      DEFAULT_ARTIST_IMAGE;

    return {
      name: album.name,
      artist: album.artist,
      mbid: album.mbid,
      image
    };
  });

  return { artists, tracks, albums };
};