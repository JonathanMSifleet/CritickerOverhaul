import { useRecoilState } from 'recoil';
import { modalState } from '../../../store';
import classes from './Backdrop.module.scss';

const Backdrop: React.FC = (): JSX.Element | null => {
  const [showModal, setShowModal] = useRecoilState(modalState);

  const hideBackdrop = (): void => setShowModal(false);

  return showModal ? <div className={classes.Backdrop} onClick={hideBackdrop} /> : null;
};

export default Backdrop;
