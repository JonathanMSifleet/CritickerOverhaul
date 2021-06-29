import React from 'react';
import LogoSvg from '../../../assets/svg/logo/placeholder.svg';

interface IProps {
  height: number;
}

const Logo: React.FC<IProps> = ({ height }) => (
  <img
    style={{ height: `${height}vh`, boxSizing: 'border-box' }}
    src={LogoSvg}
    alt="Logo"
  />
);

export default Logo;
