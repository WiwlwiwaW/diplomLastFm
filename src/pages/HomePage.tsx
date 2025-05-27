/**
 * The home page component that displays top artists and tracks.
 * 
 * @component
 * @example
 * return (
 *   <HomePage />
 * )
 */
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import ArtistCard from '../components/ArtistCard';
import TrackCard from '../components/TrackCard';
import { getTopArtists, getTopTracks } from '../services/lastFmApi';

function HomePage() {
  const [artists, setArtists] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Fetches top artists and tracks data
     */
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [artistsData, tracksData] = await Promise.all([
          getTopArtists(10),
          getTopTracks(10)
        ]);
        
        setArtists(artistsData);
        setTracks(tracksData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <Header />
      <main className="main-content">
        <h1 className="section-title">Music</h1>
        
        <section className="top-section">
          <h2 className="subsection-title">Hot right now</h2>
          <div className="artists-grid">
            {artists.map((artist, index) => (
              <ArtistCard 
                key={artist.mbid || index}
                name={artist.name}
                image={artist.image}
                genres={artist.genres}
              />
            ))}
          </div>
        </section>
        
        <section className="top-section">
          <h2 className="subsection-title">Popular tracks</h2>
          <div className="tracks-grid">
            {tracks.map((track, index) => (
              <TrackCard
                key={track.mbid || index}
                name={track.name}
                artist={track.artist}
                image={track.image}
                genre={track.genres}
              />
            ))}
          </div>
        </section>
      </main>
      
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo">MusicApp</span>
            <span className="logo-sub">Powered by Last.fm</span>
          </div>
          <div className="footer-links">
            <a href="/about">About</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/contact">Contact</a>
          </div>
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} MusicApp. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}

export default HomePage;