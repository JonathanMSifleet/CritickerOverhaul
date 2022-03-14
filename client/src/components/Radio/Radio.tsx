import { MDBRadio } from 'mdb-react-ui-kit';
import { ChangeEvent, FC } from 'react';

interface IProps {
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

const Radio: FC<IProps> = ({ name, onChange, value }) => (
  <MDBRadio onChange={onChange} label={value} inline name={name} value={value} />
);

export default Radio;
