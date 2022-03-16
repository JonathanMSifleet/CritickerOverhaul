import { FC } from 'react';
import classes from './Backdrop.module.scss';
import { modalState } from '../../../store';
import { useRecoilState } from 'recoil';

const Backdrop: FC = (): JSX.Element | null => {
  const [showModal, setShowModal] = useRecoilState(modalState);

  const hideBackdrop = (): void => setShowModal(false);

  return showModal ? <div className={classes.Backdrop} onClick={hideBackdrop} /> : null;
};

export default Backdrop;
