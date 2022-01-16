import { useState } from 'react';
import * as actionTypes from './actionTypes';

interface IPayload {
  showModal?: boolean | null;
  userInfo?: IUserInfo;
}

interface IUserInfo {
  username: string | null;
  loggedIn: boolean;
  UID?: string | null;
}

const StateHook = (): {
  globalState: IPayload;
  actions: any;
} => {
  const [showModal, setShowModal] = useState(null as boolean | null);
  const [userInfo, setUserInfo] = useState<IUserInfo>({
    username: null,
    loggedIn: false,
    UID: null
  });

  const actions = (action: { type: string; payload?: IPayload }): void | (() => void) => {
    const { type, payload } = action;

    switch (type) {
      case actionTypes.setShowModal:
        return setShowModal(payload!.showModal!);
      case actionTypes.setUserInfo:
        return setUserInfo(payload as IUserInfo);
      case actionTypes.logOutUser:
        return setUserInfo({ username: null, loggedIn: false, UID: null });
      case actionTypes.resetState:
        return (): void => {
          setShowModal(null);
          setUserInfo({ username: null, loggedIn: false, UID: null });
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
