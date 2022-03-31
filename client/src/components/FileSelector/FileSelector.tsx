import { MDBFile } from 'mdb-react-ui-kit';
import classes from './FileSelector.module.scss';

interface IProps {
  onChange: (event: { target: { files: Blob[] } }) => void;
}

const FileSelector: React.FC<IProps> = ({ onChange }) => {
  return (
    <div className={`${classes.FileSelectorWrapper} file-container`}>
      <MDBFile onChange={onChange} id="customFile" />
    </div>
  );
};

export default FileSelector;
