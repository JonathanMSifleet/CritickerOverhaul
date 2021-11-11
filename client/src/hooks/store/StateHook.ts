import { useState } from 'react';
import * as actionTypes from './actionTypes';

interface IPayload {
  showModal?: boolean | null;
  userInfo?: IUserInfo;
}

interface IUserInfo {
  username: string | null;
  loggedIn: boolean;
}

const StateHook = (): {
  globalState: IPayload;
  actions: any;
} => {
  const [showModal, setShowModal] = useState(null as unknown as boolean | null);
  const [userInfo, setUserInfo] = useState<IUserInfo>({
    username: null,
    loggedIn: false
  });

  const actions = (action: { type: string; payload: IPayload }) => {
    const { type, payload } = action;

    switch (type) {
      case actionTypes.setShowModal:
        return setShowModal(payload.showModal!);
      case actionTypes.setUserInfo:
        return setUserInfo(payload.userInfo!);
      case actionTypes.resetUserInfo:
        return () => {
          setUserInfo({ username: null, loggedIn: false });
        };
      case actionTypes.resetState:
        return () => {
          setShowModal(null);
          setUserInfo({ username: null, loggedIn: false });
        };
    }
  };

  const globalState = {
    showModal,
    userInfo
  };

  return { globalState, actions };
};

export default StateHook;
