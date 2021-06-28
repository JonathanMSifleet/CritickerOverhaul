import React from 'react';

const Header: React.FC = (): JSX.Element => {
  return (
    <nav className="navbar navbar-expand-lg bg-primary navbar-light fixed-top">
      {/* Container wrapper */}
      <div className="container-fluid">
        {/* Navbar brand */}
        <a className="navbar-brand" href="#">
          Brand
        </a>

        {/* Toggle button */}
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

        {/* Collapsible wrapper */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Link */}
            <li className="nav-item">
              <a className="nav-link" href="#">
                Link
              </a>
            </li>

            {/* Dropdown */}
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
              {/* Dropdown menu */}
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

          {/* Icons */}
          <ul className="navbar-nav d-flex flex-row me-1">
            <li className="nav-item me-3 me-lg-0">
              <a className="nav-link" href="#">
                <i className="fas fa-shopping-cart"></i>
              </a>
            </li>
            <li className="nav-item me-3 me-lg-0">
              <a className="nav-link" href="#">
                <i className="fab fa-twitter"></i>
              </a>
            </li>
          </ul>

          {/* Search */}
          <form className="w-auto">
            <input
              type="search"
              className="form-control"
              placeholder="Type query"
              aria-label="Search"
            />
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Header;
