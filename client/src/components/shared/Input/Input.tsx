import React from 'react';
import classes from './Input.module.scss';

interface IProps {
  type: string;
  id: string;
  className: string;
  placeholder: string;
}

const Input: React.FC<IProps> = ({ type, id, className, placeholder }) => {
  return (
    <input
      type={type}
      id={id}
      className={`${classes.FormInput} ${className}`}
      placeholder={placeholder}
    />
  );
};

export default Input;
