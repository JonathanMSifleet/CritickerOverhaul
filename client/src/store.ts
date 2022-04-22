import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import IAccessToken from '../../shared/interfaces/IAccessToken';
import ITCI from '../../shared/interfaces/ITCI';
import IUserState from './interfaces/IUserState';

const { persistAtom } = recoilPersist({ key: 'userState' });

export const authModalState = atom({
  key: 'SHOW_AUTH_MODAL',
  default: false
});

export const deleteAccountModalState = atom({
  key: 'SHOW_DELETE_ACCOUNT_MODAL',
  default: false
});

export const userInfoState = atom({
  key: 'USER_INFO',
  default: {
    accessToken: null as null | IAccessToken,
    avatar: '',
    loggedIn: false,
    TCIs: [] as ITCI[],
    username: ''
  } as IUserState,
  effects_UNSTABLE: [persistAtom]
});
