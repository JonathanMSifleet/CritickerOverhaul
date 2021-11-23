import React from 'react';
import classes from './Input.module.scss';

interface IProps {
  autoComplete?: string;
  checked?: boolean;
  onChange?(
    event: React.ChangeEvent<HTMLInputElement>
  ): string | boolean | void;
  placeholder?: string;
  type: string;
  value?: boolean;
}

const Input: React.FC<IProps> = ({
  autoComplete,
  checked,
  onChange,
  placeholder,
  type
}) => {
  return (
    <div className={`${classes.InputWrapper} form-outline mb-4`}>
      <input
        autoComplete={autoComplete}
        checked={checked}
        className="form-control"
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
