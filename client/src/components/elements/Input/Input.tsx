import { MDBInput } from 'mdb-react-ui-kit';
import classes from './Input.module.scss';

interface IProps {
  autoComplete?: string;
  checked?: boolean;
  className?: string;
  errors?: string[];
  onChange?(event: React.ChangeEvent<HTMLInputElement>): string | boolean | void;
  placeholder?: string;
  textarea?: boolean;
  type: string;
  value?: boolean;
}

const Input: React.FC<IProps> = ({
  autoComplete,
  checked,
  className,
  errors,
  onChange,
  placeholder,
  textarea,
  type
}) => {
  return (
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
      />
      {errors && errors!.length > 0
        ? errors!.map((message: string) => (
            <li key={message} className={`${classes.ValidationText} text-danger`}>
              {message}
            </li>
          ))
        : null}
    </>
  );
};

export default Input;
