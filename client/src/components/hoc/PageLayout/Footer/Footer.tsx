import React from 'react';
import { Link } from 'react-router-dom';
import classes from './Footer.module.scss';

const Footer: React.FC = (): JSX.Element => {
  return (
    <div className={classes.FooterWrapper}>
      <footer className="footer bg-primary text-center text-white fixed-bottom">
        <div className={classes.FooterLinksWrapper}>
          <ul className="FooterLinks list-group list-group-horizontal">
            <Link to="/privacy" className="text-white">
              <li className="list-group-item bg-primary">
                [Incomplete] Privacy Policy
              </li>
            </Link>

            <a href="#!" className="text-white">
              <li className="list-group-item bg-primary">
                [Placeholder] Abuse Policy
              </li>
            </a>
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

        <div className="copyright text-center">
          Criticker.com © 2004-2021 - All Rights Reserved
        </div>
      </footer>
    </div>
  );
};
export default Footer;
