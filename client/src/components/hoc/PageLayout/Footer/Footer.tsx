import React from 'react';
import { Link } from 'react-router-dom';
import classes from './Footer.module.scss';

const Footer: React.FC = (): JSX.Element => {
  return (
    <footer
      className={`${classes.Footer} page-footer bg-primary text-center text-white`}
    >
      <div className={classes.FooterLinksWrapper}>
        <ul className="FooterLinks list-group list-group-horizontal">
          <Link to="/privacy" className="text-white">
            <li className="list-group-item bg-primary">Privacy Policy</li>
          </Link>

          <Link to="/abuse" className="text-white">
            <li className="list-group-item bg-primary">Abuse Policy</li>
          </Link>

          <a href="#!" className="text-white">
            <li className="list-group-item bg-primary">
              [Placeholder] Contact
            </li>
          </a>

          <a href="#!" className="text-white">
            <li className="list-group-item bg-primary">
              [Placeholder] About Us
            </li>
          </a>

          <a href="#!" className="text-white">
            <li className="list-group-item bg-primary">[Placeholder] RSS</li>
          </a>

          <a href="#!" className="text-white">
            <li className="list-group-item bg-primary">
              [Placeholder] Terms & Conditions
            </li>
          </a>
        </ul>
      </div>

      <div className={`${classes.Copyright} copyright text-center`}>
        <span className={classes.CopyrightText}>
          Criticker.com © 2004-2021 - All Rights Reserved
        </span>
      </div>
    </footer>
  );
};
export default Footer;
