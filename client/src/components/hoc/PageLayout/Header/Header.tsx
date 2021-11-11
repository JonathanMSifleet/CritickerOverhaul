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

        <button
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          className="navbar-toggler"
          data-mdb-target="#navbarSupportedContent"
          data-mdb-toggle="collapse"
          type="button"
        >
          <i className="fas fa-bars"></i>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
          </ul>
        </div>

        <form className="w-auto">
          <input
            aria-label="Search"
            className="form-control"
            placeholder="[Placeholder] Search Criticker"
            type="search"
          />
        </form>

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
      </div>
      {globalState.showModal ? (
        <Modal>
          <Auth />
        </Modal>
      ) : null}
    </nav>
  );
};

export default Header;
