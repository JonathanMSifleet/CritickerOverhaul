import React from 'react';
import classes from './Input.module.scss';

interface IProps {
  checked?: boolean;
  className: string;
  onChange?(
    event: React.ChangeEvent<HTMLInputElement>
  ): string | boolean | void;
  placeholder?: string;
  type: string;
  value?: boolean;
}

const Input: React.FC<IProps> = ({
  checked,
  className,
  onChange,
  placeholder,
  type
}) => {
  return (
    <input
      checked={checked}
      className={`${classes.FormInput} ${className}`}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
    />
  );
};

export default Input;
