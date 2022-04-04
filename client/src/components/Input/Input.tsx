import { ChangeEvent, FC } from 'react';
import { MDBInput } from 'mdb-react-ui-kit';
import classes from './Input.module.scss';
import Warning from './Warning/Warning';

interface IProps {
  autoComplete?: string;
  checked?: boolean;
  className?: string;
  errors?: string[];
  onChange?(event: ChangeEvent<HTMLInputElement>): string | boolean | void;
  placeholder?: string;
  textarea?: boolean;
  type?: string;
  value?: string;
}

const Input: FC<IProps> = ({
  autoComplete,
  checked,
  className,
  errors,
  onChange,
  placeholder,
  textarea,
  type,
  value
}) => (
  <>
    <MDBInput
      autoComplete={autoComplete}
      checked={checked}
      className={`${classes.FormInput} ${className} form-control`}
      id="formControlDefault"
      label={placeholder}
      onChange={onChange}
      textarea={textarea}
      type={type}
      value={value}
    />
    {errors && errors!.length > 0 ? errors!.map((message: string) => <Warning key={message} text={message} />) : null}
  </>
);

export default Input;
