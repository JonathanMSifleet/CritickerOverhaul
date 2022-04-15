import { ChangeEvent, FC } from 'react';
import { MDBInput, MDBTextArea } from 'mdb-react-ui-kit';
import classes from './Input.module.scss';
import Warning from './Warning/Warning';

interface IProps {
  autoComplete?: string;
  checked?: boolean;
  className?: string;
  errors?: string[];
  label?: string;
  labelStyle?: { [key: string]: string };
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
  label,
  labelStyle,
  onChange,
  placeholder,
  textarea,
  type,
  value
}) => (
  <>
    {textarea ? (
      <MDBTextArea
        autoComplete={autoComplete}
        checked={checked}
        className={`${classes.FormInput} ${className} form-control`}
        id="formControlDefault"
        label={label}
        // @ts-expect-error
        onChange={onChange}
        type={type}
        value={value}
      />
    ) : (
      <MDBInput
        autoComplete={autoComplete}
        checked={checked}
        className={`${classes.FormInput} ${className} form-control`}
        id="formControlDefault"
        label={placeholder}
        labelStyle={labelStyle}
        onChange={onChange}
        type={type}
        value={value}
      />
    )}
    {errors && errors!.length > 0 ? errors!.map((message: string) => <Warning key={message} text={message} />) : null}
  </>
);

export default Input;
