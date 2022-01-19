import { MDBSpinner } from 'mdb-react-ui-kit';

const Spinner = (): JSX.Element => {
  return (
    <div className="d-flex justify-content-center">
      <MDBSpinner role="status" color="primary" />
    </div>
  );
};

export default Spinner;
