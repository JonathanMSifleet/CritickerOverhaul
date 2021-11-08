import React from 'react';
import classes from './Input.module.scss';

interface IProps {
  className: string;
  id: string;
  onChange?(event: { target: { value: string } }): void;
  type: string;
  placeholder: string;
}

const Input: React.FC<IProps> = ({
  className,
  id,
  onChange,
  placeholder,
  type
}) => {
  return (
    <input
      className={`${classes.FormInput} ${className}`}
      id={id}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
    />
  );
};

export default Input;
