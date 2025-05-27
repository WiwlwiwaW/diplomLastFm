import React from 'react';

/**
 * Интерфейс пропсов компонента ArtistCard
 * @interface ArtistCardProps
 * @property {string} name - Имя артиста
 * @property {string} image - URL изображения артиста
 * @property {string} genres - Жанры, в которых работает артист
 */
interface ArtistCardProps {
  name: string;
  image: string;
  genres: string;
}

/**
 * Компонент карточки артиста для отображения информации об исполнителе
 * @component
 * @param {ArtistCardProps} props - Пропсы компонента
 * @param {string} props.name - Имя артиста
 * @param {string} props.image - URL изображения артиста
 * @param {string} props.genres - Жанры артиста
 * @returns {JSX.Element} Возвращает JSX элемент карточки артиста
 */
const ArtistCard: React.FC<ArtistCardProps> = ({ name, image, genres }) => {
  return (
    <div className="artist-card">
      <img 
        src={image} 
        alt={name} 
        className="artist-photo"
        /**
         * Обработчик ошибки загрузки изображения
         * @param {React.SyntheticEvent<HTMLImageElement, Event>} e - Событие ошибки
         */
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png';
        }}
      />
      <div>
        <h3 className="artist-name">{name}</h3>
        <p className="artist-genre">{genres}</p>
      </div>
    </div>
  );
};

export default ArtistCard;