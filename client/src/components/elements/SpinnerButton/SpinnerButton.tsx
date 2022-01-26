import { MDBBtn, MDBSpinner } from 'mdb-react-ui-kit';

const SpinnerButton: React.FC = () => {
  return (
    <div className="d-flex justify-content-center">
      <MDBBtn disabled className="me-2">
        <MDBSpinner size="sm" role="status" tag="span" />
      </MDBBtn>
    </div>
  );
};

export default SpinnerButton;
