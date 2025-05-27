/**
 * Displays a card with track information.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {string} props.name - The track name
 * @param {string} props.artist - The artist name
 * @param {string} props.image - URL of the track image
 * @param {string} props.genre - The track genre
 * @example
 * return (
 *   <TrackCard name="Track Name" artist="Artist" image="url" genre="Rock" />
 * )
 */
import React from 'react';

interface TrackCardProps {
  name: string;
  artist: string;
  image: string;
  genre: string;
}

const TrackCard: React.FC<TrackCardProps> = ({ name, artist, image, genre }) => {
  return (
    <div className="track-card">
      <div className="track-info">
        <h3 className="track-title">{name}</h3>
        <p className="track-artist">{artist}</p>
        <p className="artist-genre">{genre}</p>
      </div>
    </div>
  );
};

export default TrackCard;