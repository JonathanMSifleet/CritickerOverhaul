import { MDBFile } from 'mdb-react-ui-kit';
import classes from './FileSelector.module.scss';

interface IProps {
  onChange: (event: { target: { files: FileList } }) => void;
}

const FileSelector: React.FC<IProps> = ({ onChange }) => (
  <div className={`${classes.FileSelectorWrapper} file-container`}>
    {/* @ts-expect-error works as intended */}
    <MDBFile onChange={onChange} id="customFile" />
  </div>
);

export default FileSelector;
