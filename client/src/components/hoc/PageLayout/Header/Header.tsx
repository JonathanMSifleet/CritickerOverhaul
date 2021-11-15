import React, { useContext, useEffect, useState } from 'react';
// @ts-expect-error no types file
import FileBase64 from 'react-file-base64';
import { Link } from 'react-router-dom';
import Logo from '../../../../assets/svg/Logo/placeholder.svg';
import Button from '../../../../elements/Button/Button';
import { getUserAvatarURL, uploadUserAvatarURL } from '../../../../endpoints';
import * as actionTypes from '../../../../hooks/store/actionTypes';
import Context from '../../../../hooks/store/context';
import Auth from '../../../forms/Auth/Auth';
import Modal from '../../../UI/Modal/Modal';
import classes from './Header.module.scss';

const Header: React.FC = (): JSX.Element => {
  const { globalState, actions } = useContext(Context);
  const [userAvatar, setUserAvatar] = useState(null as unknown as any);

  useEffect(() => {
    async function getUserAvatar() {
      const avatarURL = `${getUserAvatarURL}/${globalState.userInfo.UID}`;

      let response = await fetch(avatarURL, {
        method: 'get'
      });

      response = await response.json();
      console.log(
        '🚀 ~ file: Header.tsx ~ line 26 ~ useEffect ~ response',
        response
      );
      setUserAvatar(response);
    }
    if (globalState.userInfo.loggedIn) {
      getUserAvatar();
    }
  }, [globalState]);

  const handleFile = async (event: any) => {
    const { base64 } = event;
    const uploadURL = `${uploadUserAvatarURL}/${globalState.userInfo.UID}`;

    let response = (await fetch(uploadURL, {
      method: 'post',
      body: JSON.stringify(base64)
    })) as any;
    response = await response.json();
    console.log('response', response);
  };

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
        {globalState.userInfo.loggedIn ? (
          <>
            <FileBase64
              className={'btn btn-white text-primary me-3 font-weight-bold'}
              onDone={(event: { target: any }) => handleFile(event)}
              type={'file'}
            />
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
