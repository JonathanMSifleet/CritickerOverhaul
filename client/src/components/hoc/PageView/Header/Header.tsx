import {
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBNavbar,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarNav,
  MDBNavbarToggler
} from 'mdb-react-ui-kit';
import { Link } from 'preact-router';
import { FC, useEffect } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import Logo from '../../../../assets/svg/Logo.svg';
import { modalState, userInfoState } from '../../../../store';
import getUserAvatar from '../../../../utils/getUserAvatar';
import Auth from '../../../elements/Auth/Auth';
import Button from '../../../elements/Button/Button';
import Modal from '../../../elements/Modal/Modal';
import classes from './Header.module.scss';

const Header: FC = (): JSX.Element => {
  const resetUserState = useResetRecoilState(userInfoState);
  const [userState, setUserState] = useRecoilState(userInfoState);
  const [showModal, setShowModal] = useRecoilState(modalState);

  useEffect(() => {
    const fetchUserAvatar = async (): Promise<void> => {
      const userAvatar = await getUserAvatar(userState!.UID);
      setUserState({ ...userState, avatar: userAvatar });
    };

    if (userState!.loggedIn && userState.avatar === '') fetchUserAvatar();
  }, []);

  const logout = (): void => resetUserState();

  const displayAuthModal = (): void => setShowModal(true);

  return (
    <header>
      {/* @ts-expect-error */}
      <MDBNavbar className={classes.Header} expand="lg" light bgColor="white" fixed>
        <MDBContainer fluid>
          <img className={classes.Logo} src={Logo} alt="Criticker Logo" />

          <MDBNavbarToggler
            aria-controls="navbarExample01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <MDBIcon fas icon="bars" />
          </MDBNavbarToggler>

          <div className="collapse navbar-collapse" id="navbarExample01">
            <MDBNavbarNav right className="mb-2 mb-lg-0">
              <MDBNavbarItem active>
                <MDBNavbarLink aria-current="page" href="/">
                  Home
                </MDBNavbarLink>
              </MDBNavbarItem>
            </MDBNavbarNav>
          </div>

          <MDBInput className={`${classes.SearchInput} bg-light`} label="Search" type="text" />

          {userState!.loggedIn ? (
            <>
              <Link className={classes.UserAvatarLink} href="#profile">
                <img
                  src={userState.avatar}
                  className={`${classes.UserAvatar} rounded-circle mb-3`}
                />
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
        </MDBContainer>
      </MDBNavbar>
      {showModal ? (
        <Modal>
          <Auth />
        </Modal>
      ) : null}
    </header>
  );
};

export default Header;
