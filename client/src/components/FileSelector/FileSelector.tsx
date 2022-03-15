import { MDBFile } from 'mdb-react-ui-kit';
import classes from './FileSelector.module.scss';

interface IProps {
  text: string;
}

const FileSelector: React.FC<IProps> = ({ text }) => {
  return (
    <div className="file-container">
      <MDBFile label={text} id="customFile" labelClass={classes.Label} />
    </div>
  );
};

export default FileSelector;
