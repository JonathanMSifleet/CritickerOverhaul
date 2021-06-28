import React from 'react';
import Logo from '../../../assets/svg/logo/placeholder.svg';

const Header: React.FC = (): JSX.Element => {
  return (
    <nav className="navbar navbar-expand-lg bg-primary navbar-dark ">
      <div className="container-fluid">
        <img src={Logo} />

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
              <a className="nav-link" href="#">
                Link
              </a>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-mdb-toggle="dropdown"
                aria-expanded="false"
              >
                Dropdown
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </li>
              </ul>
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
