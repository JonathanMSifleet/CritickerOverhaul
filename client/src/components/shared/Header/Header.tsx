import React, { useEffect } from 'react';
import Logo from '../Logo/Logo';

const Header: React.FC = (): JSX.Element => {
  useEffect(() => {
    console.log('header has loaded');
  }, []);

  return (
    <div className="header">
      <Logo height={10} />
    </div>
  );
};

export default Header;
