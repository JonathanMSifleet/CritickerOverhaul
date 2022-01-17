import { MDBInput } from 'mdb-react-ui-kit';
import classes from './Input.module.scss';

interface IProps {
  autoComplete?: string;
  checked?: boolean;
  className?: string;
  onChange?(event: React.ChangeEvent<HTMLInputElement>): string | boolean | void;
  placeholder?: string;
  type: string;
  value?: boolean;
}

const Input: React.FC<IProps> = ({ autoComplete, checked, className, onChange, placeholder, type }) => {
  return (
    <MDBInput
      autoComplete={autoComplete}
      checked={checked}
      className={`${classes.FormInput} ${className} form-control`}
      id="formControlDefault"
      label={placeholder}
      onChange={onChange}
      type={type}
    />
  );
};

export default Input;
