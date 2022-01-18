import { atom } from 'recoil';
import IUserState from '../shared/interfaces/IUserState';
import * as stateKeys from './stateKeys';

export const modalState = atom({
  key: stateKeys.SHOW_MODAL,
  default: false
});

export const userInfoState = atom({
  key: stateKeys.USER_INFO,
  default: {
    UID: '',
    loggedIn: false,
    username: ''
  } as IUserState | null
});
