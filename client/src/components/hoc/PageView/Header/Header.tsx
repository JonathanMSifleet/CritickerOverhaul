import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import Logo from '../../../../assets/svg/Logo.svg';
import { modalState, userInfoState } from '../../../../store';
import getUserAvatar from '../../../../utils/getUserAvatar';
import Auth from '../../../elements/Auth/Auth';
import Button from '../../../elements/Button/Button';
import Modal from '../../../elements/Modal/Modal';
import classes from './Header.module.scss';

const Header: React.FC = (): JSX.Element => {
  const resetUserState = useResetRecoilState(userInfoState);
  const userState = useRecoilValue(userInfoState);
  const [userAvatar, setUserAvatar] = useState(null as string | null);
  const [showModal, setShowModal] = useRecoilState(modalState);

  useEffect(() => {
    const fetchUserAvatar = async (): Promise<void> =>
      setUserAvatar(await getUserAvatar(userState!.UID));

    if (userState!.loggedIn) fetchUserAvatar();
  }, [userState]);

  const logout = (): void => resetUserState();

  const displayAuthModal = (): void => setShowModal(true);

  return (
    <nav className={`${classes.Header} navbar navbar-expand-lg bg-primary navbar-dark`}>
      <img className={classes.Logo} src={Logo} alt="Criticker Logo" />

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className={`${classes.LeftContent} navbar-nav me-auto mb-2 mb-lg-0`}>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/">
              Home
            </Link>
          </li>
        </ul>
      </div>

      <section className={classes.RightContent}>
        <div className="input-group rounded">
          <div className={`${classes.SearchWrapper} form-outline`}>
            <input type="search" id="form1" className={`${classes.SearchInput} form-control`} />
            <label className="form-label" htmlFor="form1">
              Placeholder
            </label>
          </div>
          <button type="button" className="btn btn-primary">
            <i className="fas fa-search" />
          </button>
        </div>
        {userState!.loggedIn ? (
          <>
            <Link to="/profile">
              <img src={userAvatar!} className={`${classes.UserAvatar} rounded-circle mb-3`} />
            </Link>

            <Button
              className={`${classes.AuthButton} btn btn-white text-primary me-3 font-weight-bold`}
              onClick={(): void => logout()}
              text={'Log out'}
            />
          </>
        ) : (
          <Button
            className={`${classes.AuthButton} btn btn-white text-primary me-3 font-weight-bold`}
            onClick={displayAuthModal}
            text={'Log in / sign up'}
          />
        )}
      </section>
      {showModal ? (
        <Modal>
          <Auth />
        </Modal>
      ) : null}
    </nav>
  );
};

export default Header;
