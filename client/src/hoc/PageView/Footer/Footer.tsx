import { FC } from 'preact/compat';
import { Link } from 'preact-router/match';
import classes from './Footer.module.scss';

interface IProps {
  className: string;
}

const Footer: FC<IProps> = ({ className }): JSX.Element => (
  <footer className={`${classes.Footer} ${className} bg-primary text-center text-white text-lg-start`}>
    <ul className={`${classes.FooterLinksWrapper} list-group list-group-horizontal`}>
      <Link href="#information/privacy" className={`${classes.LinkComponent} text-white`}>
        <li className={`${classes.LinkText} list-group-item bg-primary`}>Privacy Policy</li>
      </Link>

      <Link href="#information/abuse" className={`${classes.LinkComponent} text-white`}>
        <li className={`${classes.LinkText} list-group-item bg-primary`}>Abuse Policy</li>
      </Link>

      <Link href="#information/contact" className={`${classes.LinkComponent} text-white`}>
        <li className={`${classes.LinkText} list-group-item bg-primary`}>Contact</li>
      </Link>

      <Link href="#information/about" className={`${classes.LinkComponent} text-white`}>
        <li className={`${classes.LinkText} list-group-item bg-primary`}>About us</li>
      </Link>

      <Link href="#information/terms" className={`${classes.LinkComponent} text-white`}>
        <li className={`${classes.LinkText} list-group-item bg-primary`}>Terms & Conditions</li>
      </Link>
    </ul>

    <div className={`${classes.Copyright} copyright text-center`}>
      <span className={classes.CopyrightText}>
        Criticker.com © 2004-{new Date().getFullYear()} - All Rights Reserved
      </span>
    </div>
  </footer>
);

export default Footer;
