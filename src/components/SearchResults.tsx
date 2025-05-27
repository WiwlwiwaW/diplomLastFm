/**
 * Displays search results for artists, albums, and tracks.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {Array} props.artists - Array of artist objects
 * @param {Array} props.tracks - Array of track objects
 * @param {Array} props.albums - Array of album objects
 * @param {string} props.query - The search query
 * @example
 * const results = { artists: [...], tracks: [...], albums: [...] };
 * return (
 *   <SearchResults artists={results.artists} tracks={results.tracks} albums={results.albums} query="search term" />
 * )
 */
import React from 'react';

interface Artist {
  name: string;
  mbid: string;
  image: string;
  listeners?: string;
}

interface Album {
  name: string;
  artist: string;
  mbid: string;
  image: string;
}

interface Track {
  name: string;
  artist: string;
  mbid: string;
  image: string;
  duration: string;
}

interface SearchResultsProps {
  artists: Artist[];
  tracks: Track[];
  albums: Album[];
  query: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ artists, tracks, albums, query }) => {
  if (!artists.length && !tracks.length && !albums.length) {
    return <div className="no-results">No results found for "{query}"</div>;
  }

  return (
    <div className="search-results">
      <h1 className="section-title">Search results for "{query}"</h1>
      
      {artists.length > 0 && (
        <section className="search-section">
          <h2 className="subsection-title">Artists</h2>
          <div className="search-artists-grid">
            {artists.map((artist) => (
              <div key={artist.mbid || artist.name} className="search-artist-card">
                <div className="search-artist-image-container">
                  <img 
                    src={artist.image} 
                    alt={artist.name} 
                    className="search-artist-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png';
                    }}
                  />
                </div>
                <h3 className="search-artist-name">{artist.name}</h3>
                {artist.listeners && (
                  <p className="search-artist-listeners">{artist.listeners} listeners</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {albums.length > 0 && (
        <section className="search-section">
          <h2 className="subsection-title">Albums</h2>
          <div className="search-albums-grid">
            {albums.map((album) => (
              <div key={album.mbid || `${album.name}-${album.artist}`} className="search-album-card">
                <div className="search-album-image-container">
                  <img 
                    src={album.image} 
                    alt={album.name} 
                    className="search-album-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png';
                    }}
                  />
                </div>
                <h3 className="search-album-name">{album.name}</h3>
                <p className="search-album-artist">{album.artist}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {tracks.length > 0 && (
        <section className="search-section">
          <h2 className="subsection-title">Tracks</h2>
          <div className="search-tracks-list">
            {tracks.map((track) => (
              <div key={track.mbid || `${track.name}-${track.artist}`} className="search-track-item">
                <button className="play-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 3L19 12L5 21V3Z" fill="currentColor"/>
                  </svg>
                </button>
                <div className="search-track-info">
                  <h3 className="search-track-name">{track.name}</h3>
                  <p className="search-track-artist">{track.artist}</p>
                </div>
                <p className="search-track-duration">{track.duration}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchResults;