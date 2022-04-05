import { ChangeEvent, FC } from 'react';

import { MDBRadio } from 'mdb-react-ui-kit';

interface IProps {
  checked: boolean;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

const Radio: FC<IProps> = ({ checked, name, onChange, value }) => (
  <MDBRadio onChange={onChange} checked={checked} label={value} inline name={name} value={value} />
);

export default Radio;
