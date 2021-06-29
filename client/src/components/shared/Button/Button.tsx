import React from 'react';

interface IProps {
  onClick(buttonPressed: string): void;
}

const Button: React.FC<IProps> = ({ onClick }) => <Button onClick={onClick} />;

export default Button;
