import React from 'react';
import AdvertPlaceholder from '../../../assets/svg/AdvertSpace/Advert.svg';
import classes from './AdvertSection.module.scss';

interface IProps {
  direction: string;
}

const AdvertSection: React.FC<IProps> = ({ direction }): JSX.Element => (
  // @ts-expect-error false-error
  <div className={classes.Advert} style={{ float: `${direction}` }}>
    <img src={AdvertPlaceholder} width={'100%'} />
  </div>
);

export default AdvertSection;
