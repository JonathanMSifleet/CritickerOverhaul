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
              <li className="list-group-item bg-primary">Privacy Policy</li>
            </Link>
            <a href="#!" className="text-white">
              <li className="list-group-item bg-primary">Abuse Policy</li>
            </a>
            <a href="#!" className="text-white">
              <li className="list-group-item bg-primary">Contact</li>
            </a>

            <a href="#!" className="text-white">
              <li className="list-group-item bg-primary">About Us</li>
            </a>

            <a href="#!" className="text-white">
              <li className="list-group-item bg-primary">RSS</li>
            </a>

            <a href="#!" className="text-white">
              <li className="list-group-item bg-primary">Terms & Conditions</li>
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
