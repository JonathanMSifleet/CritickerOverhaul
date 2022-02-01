import { Link } from 'preact-router/match';
import { FC } from 'react';
import classes from './Footer.module.scss';

const Footer: FC = (): JSX.Element => {
  return (
    <footer className={`${classes.Footer} bg-primary text-center text-white text-lg-start`}>
      <ul className={`${classes.FooterLinksWrapper} list-group list-group-horizontal`}>
        <Link href="/privacy" className={`${classes.LinkComponent} text-white`}>
          <li className={`${classes.LinkText} list-group-item bg-primary`}>Privacy Policy</li>
        </Link>

        <Link href="/abuse" className={`${classes.LinkComponent} text-white`}>
          <li className={`${classes.LinkText} list-group-item bg-primary`}>Abuse Policy</li>
        </Link>

        <Link href="/contact" className={`${classes.LinkComponent} text-white`}>
          <li className={`${classes.LinkText} list-group-item bg-primary`}>Contact</li>
        </Link>

        <Link href="/about" className={`${classes.LinkComponent} text-white`}>
          <li className={`${classes.LinkText} list-group-item bg-primary`}>About us</li>
        </Link>

        <Link href="/resources" className={`${classes.LinkComponent} text-white`}>
          <li className={`${classes.LinkText} list-group-item bg-primary`}>RSS</li>
        </Link>

        <Link href="/terms" className={`${classes.LinkComponent} text-white`}>
          <li className={`${classes.LinkText} list-group-item bg-primary`}>Terms & Conditions</li>
        </Link>
      </ul>

      <div className={`${classes.Copyright} copyright text-center`}>
        <span className={classes.CopyrightText}>
          Criticker.com © 2004-2021 - All Rights Reserved
        </span>
      </div>
    </footer>
  );
};
export default Footer;
