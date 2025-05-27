/**
 * Search page component that displays search results based on the query parameter.
 * 
 * @component
 * @example
 * return (
 *   <SearchPage />
 * )
 */
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import SearchResults from '../components/SearchResults';
import { search } from '../services/lastFmApi';

function SearchPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || '';
  
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches search results based on the query
   */
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await search(query, 12);
        setResults(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setResults(null);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  return (
    <>
      <Header />
      <main className="main-content">
        {loading ? (
          <div className="loader">Loading...</div>
        ) : error ? (
          <div className="error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        ) : results ? (
          <SearchResults 
            artists={results.artists} 
            tracks={results.tracks} 
            albums={results.albums} 
            query={query}
          />
        ) : (
          <div className="no-results">No search query provided</div>
        )}
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

export default SearchPage;