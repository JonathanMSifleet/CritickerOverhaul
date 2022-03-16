import { FC } from 'react';
import { MDBSpinner } from 'mdb-react-ui-kit';

interface IProps {
  className?: string;
}

const Spinner: FC<IProps> = ({ className }) => (
  <div className={`${className} d-flex justify-content-center`}>
    <MDBSpinner role="status" color="primary" />
  </div>
);

export default Spinner;
