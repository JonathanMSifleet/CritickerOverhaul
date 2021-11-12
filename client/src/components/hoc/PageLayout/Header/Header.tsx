import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../../../assets/svg/Logo/placeholder.svg';
import * as actionTypes from '../../../../hooks/store/actionTypes';
import Context from '../../../../hooks/store/context';
import Auth from '../../../forms/Auth/Auth';
import Modal from '../../../UI/Modal/Modal';
import classes from './Header.module.scss';

const Header: React.FC = (): JSX.Element => {
  const { globalState, actions } = useContext(Context);

  useEffect(() => {
    console.log(globalState.userInfo);
  }, [globalState]);

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
      <div className="container-fluid">
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
          </ul>
        </div>

        <section className={classes.RightContent}>
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

          {globalState.userInfo.loggedIn ? (
            <button
              className={`${classes.AuthButton} btn btn-white text-primary me-3 font-weight-bold`}
              onClick={() => logout()}
              type="button"
            >
              Log out
            </button>
          ) : (
            <button
              className={`${classes.AuthButton} btn btn-white text-primary me-3 font-weight-bold`}
              onClick={displayAuthModal}
              type="button"
            >
              Log in / sign up
            </button>
          )}
        </section>
        {globalState.showModal ? (
          <Modal>
            <Auth />
          </Modal>
        ) : null}
      </div>
    </nav>
  );
};

export default Header;
