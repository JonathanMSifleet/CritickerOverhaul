import React from 'react';
import classes from './Checkbox.module.scss';

interface IProps {
  checked?: boolean;
  onChange?(
    event: React.ChangeEvent<HTMLInputElement>
  ): string | boolean | void;
  placeholder?: string;
  value?: boolean;
}

const Checkbox: React.FC<IProps> = ({ checked, onChange, placeholder }) => {
  return (
    <div
      className={`${classes.InputWrapper} form-check d-flex justify-content-center mb-4`}
    >
      <input
        checked={checked}
        className="form-check-input me-2"
        id="formInput"
        onChange={onChange}
        type="checkbox"
      />
      <label className={`form-check-label`} htmlFor="formInput">
        {placeholder}
      </label>
    </div>
  );
};

export default Checkbox;
