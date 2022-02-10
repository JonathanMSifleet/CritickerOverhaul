import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import IUserState from './interfaces/IUserState';

const { persistAtom } = recoilPersist({ key: 'userState' });

export const modalState = atom({
  key: 'SHOW_MODAL',
  default: false
});

export const userInfoState = atom({
  key: 'USER_INFO',
  default: {
    UID: '',
    avatar: '',
    expiry: null as number | null,
    loggedIn: false,
    username: ''
  } as IUserState,
  effects_UNSTABLE: [persistAtom]
});
