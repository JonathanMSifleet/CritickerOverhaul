import { FC } from 'react';
import { MDBBtn } from 'mdb-react-ui-kit';

interface IProps {
  className?: string;
  disabled?: boolean;
  onClick(): void;
  text: string | JSX.Element;
}

const Button: FC<IProps> = ({ className, disabled, onClick, text }) => (
  <MDBBtn className={className} disabled={disabled} onClick={onClick}>
    {text}
  </MDBBtn>
);

export default Button;
