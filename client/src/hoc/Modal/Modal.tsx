import { FC } from 'react';
import { RecoilState } from 'recoil';
import Backdrop from './Backdrop/Backdrop';
import classes from './Modal.module.scss';

interface IProps {
  authState: RecoilState<boolean>;
  children: React.ReactNode;
}

const Modal: FC<IProps> = ({ authState, children }) => (
  <>
    <Backdrop authState={authState} />
    <div className={classes.Modal}>{children}</div>
  </>
);

export default Modal;
