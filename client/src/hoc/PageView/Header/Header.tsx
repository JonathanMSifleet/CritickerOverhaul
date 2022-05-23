import { authModalState, userInfoState } from '../../../store';
import { FC } from 'preact/compat';
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
import Button from '../../../components/Button/Button';
import classes from './Header.module.scss';
import Input from '../../../components/Input/Input';
import Logo from '../../../assets/svg/Logo.svg';
import Modal from '../../Modal/Modal';
import ShrugSVG from '../../../assets/svg/Shrug.svg';
import Spinner from '../../../components/Spinner/Spinner';

const Auth = lazy(() => import('../../../components/Auth/Auth'));

const Header: FC = () => {
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
    <>
      <header>
        <MDBNavbar className={classes.Header} expand="lg" fixed={'true'}>
          <img className={classes.Logo} src={Logo} alt="Criticker Logo" />

          <MDBContainer fluid>
            <MDBNavbarToggler aria-controls="navbarExample01" aria-expanded="false" aria-label="Toggle navigation">
              <MDBIcon fas icon="bars" />
            </MDBNavbarToggler>

            <div className="collapse navbar-collapse" id="navbarExample01">
              {/* @ts-expect-error works as intended*/}
              <MDBNavbarNav right className="mb-2 mb-lg-0">
                <Link href="/" className={`${classes.LinkComponent} text-white`}>
                  <li className={`${classes.LinkText} list-group-item bg-primary`}>Home</li>
                </Link>
                <MDBNavbarItem>
                  <MDBNavbarLink>
                    <form onSubmit={handleFormSubmission}>
                      <Input
                        className={`${classes.Search} bg-light`}
                        // using scss module breaks code so in-line unavoidable
                        labelStyle={{ backgroundColor: 'white', borderRadius: '5px', padding: '0' }}
                        onChange={(event): void => setSearchInput(event.target.value)}
                        placeholder={'Search'}
                        type={'text'}
                      />
                    </form>
                  </MDBNavbarLink>
                </MDBNavbarItem>
              </MDBNavbarNav>
            </div>

            {userState!.loggedIn ? (
              <>
                <Link className={classes.UserAvatarLink} href={`#/profile/${userState.username}`}>
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
      </header>

      {showModal ? (
        <Modal authState={authModalState}>
          {/* @ts-expect-error works correctly */}
          <Suspense fallback={<Spinner spinnerClassName={classes.Spinner} />}>
            <Auth />
          </Suspense>
        </Modal>
      ) : null}
    </>
  );
};

export default Header;
