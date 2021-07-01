import React, { useContext } from 'react';
import * as actionTypes from '../../../hooks/store/actionTypes';
import Context from '../../../hooks/store/context';
import classes from './Backdrop.module.scss';

const Backdrop: React.FC = (): JSX.Element | null => {
  const { globalState, actions } = useContext(Context);

  const hideBackdrop = () => {
    actions({
      type: actionTypes.setShowModal,
      payload: { showModal: false }
    });
  };

  let toRender;

  globalState.showModal
    ? (toRender = <div className={classes.Backdrop} onClick={hideBackdrop} />)
    : (toRender = null);

  return toRender;
};

export default Backdrop;
