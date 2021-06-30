import React from 'react';

interface IProps {
  className: string;
  text?: string | JSX.Element;
}

const Button: React.FC<IProps> = ({ className, text }) => (
  <button className={className}>{text}</button>
);

export default Button;
