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
import { Suspense, lazy } from 'preact/compat';
import { modalState, userInfoState } from '../../../store';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';

import Button from '../../Button/Button';
import { FC } from 'react';
import FileSelector from '../../FileSelector/FileSelector';
import { Link } from 'preact-router';
import Logo from '../../../assets/svg/Logo.svg';
import Modal from '../../Modal/Modal';
import Spinner from '../../Spinner/Spinner';
import classes from './Header.module.scss';
import migrateFilms from '../../../utils/migrateFilms';

const Auth = lazy(() => import('../../Auth/Auth'));

const Header: FC = (): JSX.Element => {
  const resetUserState = useResetRecoilState(userInfoState);
  const userState = useRecoilValue(userInfoState);
  const [showModal, setShowModal] = useRecoilState(modalState);

  const displayAuthModal = (): void => setShowModal(true);

  const logout = (): void => resetUserState();

  const uploadFile = (event: { target: { files: Blob[] } }): void => {
    try {
      const fileReader = new FileReader();

      fileReader.readAsText(event.target.files[0]);
      fileReader.onload = (): void => {
        try {
          migrateFilms(JSON.parse(fileReader.result as string));
        } catch (error) {
          console.error(error);
        }
      };
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header>
      {/* @ts-expect-error */}
      <MDBNavbar className={classes.Header} expand="lg" light bgColor="white" fixed>
        <MDBContainer fluid>
          <img className={classes.Logo} src={Logo} alt="Criticker Logo" />

          <MDBNavbarToggler aria-controls="navbarExample01" aria-expanded="false" aria-label="Toggle navigation">
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

          <FileSelector onChange={(event): void => uploadFile(event)} />

          <MDBInput className={`${classes.SearchInput} bg-light`} label="Search" type="text" />

          {userState!.loggedIn ? (
            <>
              <Link className={classes.UserAvatarLink} href="#profile">
                <img src={userState.avatar} className={`${classes.UserAvatar} rounded-circle mb-3`} />
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
          {/* @ts-expect-error works correctly */}
          <Suspense fallback={<Spinner />}>
            <Auth />
          </Suspense>
        </Modal>
      ) : null}
    </header>
  );
};

export default Header;
