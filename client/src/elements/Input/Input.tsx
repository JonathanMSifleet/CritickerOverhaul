import React from 'react';
import classes from './Input.module.scss';

interface IProps {
  checked?: boolean;
  onChange?(
    event: React.ChangeEvent<HTMLInputElement>
  ): string | boolean | void;
  placeholder?: string;
  type: string;
  value?: boolean;
}

const Input: React.FC<IProps> = ({ checked, onChange, placeholder, type }) => {
  return (
    <div className="form-outline mb-4">
      <input
        checked={checked}
        className={`${classes.FormInput} form-control`}
        id="formInput"
        onChange={onChange}
        type={type}
      />
      <label className="form-label" htmlFor="formInput">
        {placeholder}
      </label>
    </div>
  );
};

export default Input;
