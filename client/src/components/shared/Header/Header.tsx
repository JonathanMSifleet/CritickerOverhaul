import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import Logo from '../../../assets/svg/logo/placeholder.svg';

const Header: React.FC = (): JSX.Element => {
  const history = useHistory();

  const goToAuth = () => {
    console.log('click');
    history.push('/auth');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-primary navbar-dark ">
      <div className="container-fluid">
        <Link to="/">
          <img src={Logo} />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-mdb-toggle="collapse"
          data-mdb-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
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
            type="search"
            className="form-control"
            placeholder="Search Criticker"
            aria-label="Search"
          />
        </form>

        <button
          type="button"
          className="btn btn-white text-primary me-3 font-weight-bold"
          onClick={goToAuth}
        >
          Log in / sign up
        </button>

        {/* <div className="d-flex align-items-center">
          <i className="fas fa-bell"></i>
          <span className="badge rounded-pill badge-notification bg-danger">
            1
          </span>
          <img
            src="https://mdbootstrap.com/img/new/avatars/2.jpg"
            className="rounded-circle"
            height="25"
            alt=""
            loading="lazy"
          />
        </div> */}
      </div>
    </nav>
  );
};

export default Header;
