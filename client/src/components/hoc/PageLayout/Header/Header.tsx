import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../../../assets/svg/Logo.svg';
import Button from '../../../../elements/Button/Button';
import * as actionTypes from '../../../../hooks/store/actionTypes';
import Context from '../../../../hooks/store/context';
import { getUserAvatarURL } from '../../../../shared/endpoints';
import Auth from '../../../forms/Auth/Auth';
import Modal from '../../../UI/Modal/Modal';
import classes from './Header.module.scss';

const Header: React.FC = (): JSX.Element => {
  const { globalState, actions } = useContext(Context);
  const [userAvatar, setUserAvatar] = useState(null as unknown as any);

  useEffect(() => {
    // @ts-expect-error
    async function getUserAvatar() {
      const avatarURL = `${getUserAvatarURL}/${globalState.userInfo.UID}`;
      let response = await fetch(avatarURL, {
        method: 'get'
      });
      response = await response.json();

      setUserAvatar(response);
    }
    if (globalState.userInfo.loggedIn) {
      // getUserAvatar();
    }
  }, [globalState]);

  const logout = () => {
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
      className={`${classes.Header} navbar navbar-expand-lg bg-primary navbar-dark`}
    >
      <img className={classes.Logo} src={Logo} alt="Criticker Logo" />

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul
          className={`${classes.LeftContent} navbar-nav me-auto mb-2 mb-lg-0`}
        >
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
            <input type="search" id="form1" className={`${classes.SearchInput} form-control`}/>
            <label className="form-label" htmlFor="form1">
              Placeholder
            </label>
          </div>
          <button type="button" className="btn btn-primary">
            <i className="fas fa-search"></i>
          </button>
        </div>
        {globalState.userInfo.loggedIn ? (
          <>
            <Link to="/profile">
              <img
                src={userAvatar}
                className={`${classes.UserAvatar} rounded-circle mb-3`}
              />
            </Link>

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
