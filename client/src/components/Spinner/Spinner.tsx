import { FC } from 'react';
import { MDBSpinner } from 'mdb-react-ui-kit';

interface IProps {
  className?: string;
  spinnerClassName?: string;
}

const Spinner: FC<IProps> = ({ className, spinnerClassName }) => (
  <div className={`${className} d-flex justify-content-center`}>
    <MDBSpinner className={spinnerClassName} role="status" color="primary" />
  </div>
);

export default Spinner;
