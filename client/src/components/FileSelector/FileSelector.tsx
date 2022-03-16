import { MDBFile } from 'mdb-react-ui-kit';

interface IProps {
  onChange: (event: { target: { files: Blob[] } }) => void;
}

const FileSelector: React.FC<IProps> = ({ onChange }) => {
  return (
    <div className="file-container">
      <MDBFile onChange={onChange} id="customFile" />
    </div>
  );
};

export default FileSelector;
