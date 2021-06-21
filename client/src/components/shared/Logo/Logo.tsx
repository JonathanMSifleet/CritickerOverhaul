import React from 'react';
import LogoSvg from '../../../assets/svg/logo/placeholder.svg';

interface IProps {
  width: number;
}

const Logo: React.FC<IProps> = ({ width }) => (
  <img
    style={{ width: `${width}vw`, boxSizing: 'border-box' }}
    src={LogoSvg}
    alt="Logo"
  />
);

export default Logo;
