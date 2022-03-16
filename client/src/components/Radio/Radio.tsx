import { ChangeEvent, FC } from 'react';

import { MDBRadio } from 'mdb-react-ui-kit';

interface IProps {
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

const Radio: FC<IProps> = ({ name, onChange, value }) => (
  <MDBRadio onChange={onChange} label={value} inline name={name} value={value} />
);

export default Radio;
