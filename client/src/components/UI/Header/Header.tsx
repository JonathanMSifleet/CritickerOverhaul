import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import Logo from '../../../assets/svg/Logo.svg';
import Button from '../../../elements/Button/Button';
import { modalState, userInfoState } from '../../../recoilStore/store';
import { GET_USER_AVATAR } from '../../../shared/constants/endpoints';
import HTTPRequest from '../../../shared/functions/HTTPRequest';
import Auth from '../../forms/Auth/Auth';
import Modal from '../Modal/Modal';
import classes from './Header.module.scss';

const Header: React.FC = (): JSX.Element => {
  const [userState, setUserState] = useRecoilState(userInfoState);
  const [userAvatar, setUserAvatar] = useState(null as string | null);
  const [showModal, setShowModal] = useRecoilState(modalState);

  useEffect(() => {
    const getUserAvatar = async (): Promise<void> => {
      setUserAvatar((await HTTPRequest(`${GET_USER_AVATAR}/${userState!.UID}`, 'GET')) as string);
    };

    if (userState!.loggedIn) getUserAvatar();
  }, [userState]);

  const logout = (): void => {
    setUserState(null);
  };

  const displayAuthModal = (): void => {
    setShowModal(true);
  };

  return (
    <nav className={`${classes.Header} navbar navbar-expand-lg bg-primary navbar-dark`}>
      <img className={classes.Logo} src={Logo} alt="Criticker Logo" />

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className={`${classes.LeftContent} navbar-nav me-auto mb-2 mb-lg-0`}>
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>
        </ul>
      </div>

      <section className={classes.RightContent}>
        <div className="input-group rounded">
          <div className={`${classes.SearchWrapper} form-outline`}>
            <input type="search" id="form1" className={`${classes.SearchInput} form-control`} />
            <label className="form-label" htmlFor="form1">
              Placeholder
            </label>
          </div>
          <button type="button" className="btn btn-primary">
            <i className="fas fa-search"></i>
          </button>
        </div>
        {console.log('userState', userState)}
        {userState!.loggedIn ? (
          <>
            <Link to="/profile">
              <img src={userAvatar!} className={`${classes.UserAvatar} rounded-circle mb-3`} />
            </Link>

            <Button
              className={`${classes.AuthButton} btn btn-white text-primary me-3 font-weight-bold`}
              onClick={(): void => logout()}
              text={'Log out'}
            />
          </>
        ) : (
          <Button
            className={`${classes.AuthButton} btn btn-white text-primary me-3 font-weight-bold`}
            onClick={displayAuthModal}
            text={'Log in / sign up'}
          />
        )}
      </section>
      {showModal ? (
        <Modal>
          <Auth />
        </Modal>
      ) : null}
    </nav>
  );
};

export default Header;
