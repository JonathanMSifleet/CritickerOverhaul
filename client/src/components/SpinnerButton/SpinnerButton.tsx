import { FC } from 'preact/compat';
import { MDBBtn, MDBSpinner } from 'mdb-react-ui-kit';

interface IProps {
  className?: string;
  outerClassName?: string;
}

const SpinnerButton: FC<IProps> = ({ className }) => (
  <div className="d-flex justify-content-center">
    <MDBBtn className={`${className} me-2`} disabled>
      <MDBSpinner size="sm" role="status" tag="span" />
    </MDBBtn>
  </div>
);

export default SpinnerButton;
