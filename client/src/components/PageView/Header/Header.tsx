import { authModalState, userInfoState } from '../../../store';
import { FC } from 'react';
import { lazy, Suspense, useState } from 'preact/compat';
import { Link, route } from 'preact-router';
import {
  MDBContainer,
  MDBIcon,
  MDBNavbar,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarNav,
  MDBNavbarToggler
} from 'mdb-react-ui-kit';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import Button from '../../Button/Button';
import classes from './Header.module.scss';
// import FileSelector from '../../FileSelector/FileSelector';
import Input from '../../Input/Input';
import Logo from '../../../assets/svg/Logo.svg';
import Modal from '../../Modal/Modal';
import ShrugSVG from '../../../assets/svg/Shrug.svg';
import Spinner from '../../Spinner/Spinner';
// import uploadFile from '../../../utils/uploadFile';

const Auth = lazy(() => import('../../Auth/Auth'));

const Header: FC = (): JSX.Element => {
  const [searchInput, setSearchInput] = useState('');
  const [showModal, setShowModal] = useRecoilState(authModalState);
  const resetUserState = useResetRecoilState(userInfoState);
  const userState = useRecoilValue(userInfoState);

  const displayAuthModal = (): void => setShowModal(true);

  const handleFormSubmission = (): boolean => route(`/search/${searchInput}`);

  const logout = (): void => {
    resetUserState();
    route('/');
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

          <form onSubmit={handleFormSubmission}>
            <Input
              onChange={(event): void => setSearchInput(event.target.value)}
              className={'bg-light'}
              placeholder={'Search'}
              type={'text'}
            />
          </form>

          {/* <FileSelector onChange={(event: { target: { files: FileList } }): void => uploadFile(event)} /> */}

          {userState!.loggedIn ? (
            <>
              <Link className={classes.UserAvatarLink} href="#profile">
                <img
                  src={userState.avatar !== undefined ? userState.avatar : ShrugSVG}
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
        <Modal authState={authModalState}>
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
