import React from 'react';
import classes from './Input.module.scss';

interface IProps {
  checked?: boolean;
  className: string;
  id: string;
  onChange?(event: { target: { value: string } }): void;
  placeholder?: string;
  type: string;
}

const Input: React.FC<IProps> = ({
  checked,
  className,
  id,
  onChange,
  placeholder,
  type
}) => {
  return (
    <input
      checked={checked}
      className={`${classes.FormInput} ${className}`}
      id={id}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
    />
  );
};

export default Input;
