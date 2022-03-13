import { MDBBtn, MDBSpinner } from 'mdb-react-ui-kit';
import { FC } from 'react';

const SpinnerButton: FC = () => {
  return (
    <div className="d-flex justify-content-center">
      <MDBBtn disabled className="me-2">
        <MDBSpinner size="sm" role="status" tag="span" />
      </MDBBtn>
    </div>
  );
};

export default SpinnerButton;
