import { MDBFile } from 'mdb-react-ui-kit';
import classes from './FileSelector.module.scss';

interface IProps {
  // to do
  onChange: (event: any) => void;
  text: string;
}

const FileSelector: React.FC<IProps> = ({ onChange, text }) => {
  return (
    <div className="file-container">
      <MDBFile onChange={onChange} label={text} id="customFile" labelClass={classes.Label} />
    </div>
  );
};

export default FileSelector;
