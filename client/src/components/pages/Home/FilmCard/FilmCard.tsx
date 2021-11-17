import React from 'react';
import IFilm from '../../../../interfaces/IFilm';
import classes from './FilmCard.module.scss';

interface IProps {
  film: IFilm;
}

const FilmCard: React.FC<IProps> = ({ film }): JSX.Element => {
  return (
    <div className={`${classes.CardWrapper} card mb-3`}>
      <div className="row g-0">
        <div className="col-md-4">
          <img
            src="https://mdbootstrap.com/wp-content/uploads/2020/06/vertical.jpg"
            className="img-fluid rounded-start"
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{film.title}</h5>
            <p className="card-text">{film.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilmCard;
