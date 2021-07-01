import { useState } from 'react';
import * as actionTypes from './actionTypes';

interface IPayload {
  showModal?: boolean | null;
}

const StateHook = (): {
  globalState: IPayload;
  actions: any;
} => {
  const [showModal, setShowModal] = useState(null as unknown as boolean | null);

  const actions = (action: { type: string; payload: IPayload }) => {
    const { type, payload } = action;

    switch (type) {
      case actionTypes.setShowModal:
        return setShowModal(payload.showModal!);
      case actionTypes.resetState:
        return () => {
          setShowModal(null);
        };
    }
  };

  const globalState = {
    showModal
  };

  return { globalState, actions };
};

export default StateHook;
