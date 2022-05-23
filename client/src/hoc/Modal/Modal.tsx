import { ComponentChildren } from 'preact';
import { FC } from 'preact/compat';
import { RecoilState } from 'recoil';
import Backdrop from './Backdrop/Backdrop';
import classes from './Modal.module.scss';

interface IProps {
  authState: RecoilState<boolean>;
  children: ComponentChildren;
}

const Modal: FC<IProps> = ({ authState, children }) => (
  <>
    <Backdrop authState={authState} />
    <div className={classes.Modal}>{children}</div>
  </>
);

export default Modal;
