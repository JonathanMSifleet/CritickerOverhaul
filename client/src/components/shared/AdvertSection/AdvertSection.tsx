import React from 'react';
import classes from './AdvertSection.module.scss';

interface IProps {
  direction: string;
}

const AdvertSection: React.FC<IProps> = ({ direction }): JSX.Element => (
  // @ts-expect-error false-error
  <div className={classes.Advert} style={{ float: `${direction}` }} />
);

export default AdvertSection;
