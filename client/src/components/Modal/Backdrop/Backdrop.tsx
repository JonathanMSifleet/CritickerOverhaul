import { FC } from 'react';
import { useRecoilState } from 'recoil';
import classes from './Backdrop.module.scss';

interface IProps {
  authState: any;
}

const Backdrop: FC<IProps> = ({ authState }): JSX.Element | null => {
  const [showModal, setShowModal] = useRecoilState(authState);

  const hideBackdrop = (): void => setShowModal(false);

  return showModal ? <div className={classes.Backdrop} onClick={hideBackdrop} /> : null;
};

export default Backdrop;
