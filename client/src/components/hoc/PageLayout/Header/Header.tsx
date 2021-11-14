import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../../../assets/svg/Logo/placeholder.svg';
import { setUserAvatarURL } from '../../../../endpoints';
import * as actionTypes from '../../../../hooks/store/actionTypes';
import Context from '../../../../hooks/store/context';
import Auth from '../../../forms/Auth/Auth';
import Button from '../../../shared/Button/Button';
import Modal from '../../../UI/Modal/Modal';
import classes from './Header.module.scss';

const Header: React.FC = (): JSX.Element => {
  const { globalState, actions } = useContext(Context);

  useEffect(() => {
    console.log(globalState.userInfo);
  }, [globalState]);

  const uploadImage = () => {
    const uploadURL = setUserAvatarURL.replace(
      '{UID}',
      globalState.userInfo.UID
    );
    console.log(
      '🚀 ~ file: Header.tsx ~ line 24 ~ uploadImage ~ uploadURL',
      uploadURL
    );
  };

  const logout = () => {
    console.log(globalState);
    console.log('logout clicked');
    actions({
      type: actionTypes.logOutUser
    });
  };

  const displayAuthModal = () => {
    actions({
      type: actionTypes.setShowModal,
      payload: { showModal: true }
    });
  };

  return (
    <nav
      className={`${classes.Header} navbar navbar-expand-lg bg-primary navbar-dark `}
    >
      <Link to="/">
        <img src={Logo} alt="Criticker Logo" />
      </Link>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <div className={`${classes.SearchWrapper} input-group rounded`}>
              <input
                aria-describedby="search-addon"
                aria-label="Search"
                className={`${classes.Search} form-control rounded`}
                placeholder="[Placeholder] search"
                type="search"
              />
              <span className="input-group-text border-0" id="search-addon">
                <i className="fas fa-search"></i>
              </span>
            </div>
          </li>
        </ul>
      </div>

      <section className={classes.RightContent}>
        <Button
          className={'btn btn-white text-primary me-3 font-weight-bold'}
          onClick={uploadImage}
          text={'Test upload'}
        />
        {globalState.userInfo.loggedIn ? (
          <>
            <img
              src="https://mdbootstrap.com/img/new/avatars/8.jpg"
              className={`${classes.UserAvatar} rounded-circle mb-3`}
            />

            <Button
              className={`${classes.AuthButton} btn btn-white text-primary me-3 font-weight-bold`}
              onClick={() => logout()}
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
      {globalState.showModal ? (
        <Modal>
          <Auth />
        </Modal>
      ) : null}
    </nav>
  );
};

export default Header;
