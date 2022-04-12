import * as endpoints from '../../constants/endpoints';
import { deleteAccountModalState, userInfoState } from '../../store';
import { FC, useEffect, useState } from 'react';
import { lazy, Suspense } from 'preact/compat';
import { Link } from 'preact-router/match';
import { MDBCol } from 'mdb-react-ui-kit';
import { route } from 'preact-router';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { XMLParser } from 'fast-xml-parser';
import Avatar from './Avatar/Avatar';
import Button from '../../components/Button/Button';
import chunk from 'chunk';
import classes from './Profile.module.scss';
import FileSelector from '../../components/FileSelector/FileSelector';
import getCellColour from '../../utils/getCellColour';
import getColourGradient from '../../utils/getColourGradient';
import httpRequest from '../../utils/httpRequest';
import IRating from '../../../../shared/interfaces/IRating';
import IUrlParams from '../../interfaces/IUrlParams';
import IUserProfile from '../../../../shared/interfaces/IUserProfile';
import PageView from '../../components/PageView/PageView';
import Spinner from '../../components/Spinner/Spinner';
import SpinnerButton from '../../components/SpinnerButton/SpinnerButton';

const UpdateUserDetailsForm = lazy(() => import('./UpdateUserDetailsForm/UpdateUserDetailsForm'));
const Modal = lazy(() => import('../../components/Modal/Modal'));

interface IRecentRating {
  createdAt: number;
  imdbID: number;
  rating: number;
  ratingPercentile: number;
  releaseYear: number;
  title: string;
}

const Profile: FC<IUrlParams> = ({ username }): JSX.Element => {
  const [importMessage, setImportMessage] = useState('');
  const [importingRatings, setImportingRatings] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingRecentRatings, setIsLoadingRecentRatings] = useState(false);
  const [recentRatings, setRecentRatings] = useState(null as null | IRecentRating[][]);
  const [showModal, setShowModal] = useRecoilState(deleteAccountModalState);
  const [showUpdateDetailsForm, setShowUpdateDetailsForm] = useState(false);
  const [userProfile, setUserProfile] = useState(null as null | IUserProfile);
  const resetUserState = useResetRecoilState(userInfoState);
  const setUserInfo = useSetRecoilState(userInfoState);
  const userState = useRecoilValue(userInfoState);

  useEffect(() => {
    (async (): Promise<void> => {
      setIsLoadingProfile(true);
      setIsLoadingRecentRatings(true);

      let localUsername;
      if (username) localUsername = username;
      else if (userState.username !== '') localUsername = userState.username;

      if (localUsername === undefined) {
        setIsLoadingProfile(false);
        return;
      }

      httpRequest(`${endpoints.GET_PROFILE_BY_USERNAME}/${localUsername}`, 'GET').then((results) => {
        if (results.statusCode === 404) {
          setIsLoadingProfile(false);
          return;
        }

        setUserProfile(results);
        setIsLoadingProfile(false);
      });

      httpRequest(`${endpoints.GET_RECENT_RATINGS}/${localUsername}`, 'GET')
        .then((ratings) => setRecentRatings(chunk(ratings, Math.ceil(ratings.length / 2))))
        .finally(() => setIsLoadingRecentRatings(false));
    })();
  }, [username]);

  const deleteAccount = async (): Promise<void> => {
    setIsDeletingAccount(true);
    try {
      const result = await httpRequest(
        `${endpoints.DELETE_ACCOUNT}/${userState.username}`,
        'DELETE',
        userState.accessToken
      );

      if (result.statusCode === 204) {
        resetUserState();
        alert('Account deleted successfully');
        route('/');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const determineColourGradient = (ratingPercentile: number): string =>
    ratingPercentile !== undefined ? getColourGradient(ratingPercentile) : '#000000';

  const displayDeleteAccountModal = (): void => setShowModal(true);

  const epochToDate = (epoch: number): string => new Date(epoch).toLocaleDateString('en-GB');

  const getRatingRank = (numRatings: number): string => {
    switch (true) {
      case numRatings < 10:
        return 'newbie';
      case numRatings < 100:
        return 'flick fan';
      case numRatings < 500:
        return 'movie buff';
      case numRatings < 1000:
        return 'film freak';
      case numRatings < 2500:
        return 'cinema addict';
      case numRatings < 5000:
        return 'celluloid junkie';
      case numRatings >= 5000:
        return 'criticker zealot';
      default:
        return 'Error determining rank';
    }
  };

  const processRatings = (parsedJSON: [{ [key: string]: string | number }]): void => {
    const processedRatings = parsedJSON.map((rating) => {
      const imdbID = rating.imdbid.toString().slice(2).replace(/^0+/, '');

      const processedRating = {
        createdAt: new Date(rating.reviewdate).getTime(),
        imdbID: Number(imdbID),
        rating: rating.rating
      } as IRating;

      if (rating.quote !== '') processedRating.review = rating.quote as string;

      return processedRating;
    });

    uploadRatings(processedRatings);
  };

  const handleRatingsFile = (event: { target: { files: FileList } }): void => {
    try {
      setImportingRatings(true);

      const fileReader = new FileReader();

      fileReader.readAsText(event.target.files[0]);
      fileReader.onload = (): void => {
        try {
          const parsedJSON = new XMLParser().parse(fileReader.result as string).recentratings.film;
          processRatings(parsedJSON);
        } catch (error) {
          setImportingRatings(false);
          setImportMessage('Error importing ratings');
        }
      };
    } catch (error) {
      setImportMessage('Error importing ratings');
    }
  };

  const uploadRatings = async (ratings: IRating[]): Promise<void> => {
    try {
      setImportMessage(
        await httpRequest(`${endpoints.IMPORT_RATINGS}/${userState.username}`, 'POST', userState.accessToken, {
          ratings
        })
      );
    } catch (error) {
      setImportMessage('Error importing ratings');
    } finally {
      setImportingRatings(false);
    }
  };

  return (
    <PageView backgroundCSS={classes.PageWrapper}>
      {!isLoadingProfile ? (
        <>
          {userProfile ? (
            <>
              <Avatar
                avatar={userProfile.avatar!}
                setUserInfo={setUserInfo}
                username={username!}
                userState={userState}
              />

              <div className={classes.UserDetails}>
                <h1 className={classes.UsernameHeader}>
                  {userProfile.username}
                  <span className={classes.UserRank}> {getRatingRank(userProfile.numRatings!)}</span>
                </h1>

                <div className={classes.UserDetailsColumnWrapper}>
                  <MDBCol className={classes.UserDetailsColumn}>
                    <p className={classes.UserProfileText}>
                      {userProfile.numRatings} Film Rating{userProfile.numRatings !== 0 ? 's' : null}
                    </p>
                    <p className={classes.UserProfileText}>
                      <b>Member since:</b> {epochToDate(userProfile.memberSince!)}
                    </p>
                  </MDBCol>

                  <MDBCol className={classes.UserDetailsColumn}>
                    {userProfile.firstName ? (
                      <p className={classes.UserProfileText}>
                        <b>First name:</b> {userProfile.firstName}
                      </p>
                    ) : null}
                    {userProfile.lastName ? (
                      <p className={classes.UserProfileText}>
                        <b>Last name:</b> {userProfile.lastName}
                      </p>
                    ) : null}
                    {userProfile.gender ? (
                      <p className={classes.UserProfileText}>
                        <b>Gender:</b> {userProfile.gender}
                      </p>
                    ) : null}
                    {userProfile.country ? (
                      <p className={classes.UserProfileText}>
                        <b>Country:</b> {userProfile.country}
                      </p>
                    ) : null}
                  </MDBCol>

                  <MDBCol className={`${classes.UserDetailsColumn} ${classes.UserDetailsColumnRight}`}>
                    <div className={classes.FileUploadWrapper}>
                      <p className={classes.ImportInstructions}>Import Criticker Ratings:</p>
                      <div className={classes.FileSelectorWrapper}>
                        <FileSelector onChange={(event): void => handleRatingsFile(event)} />
                        {importingRatings ? <Spinner className={classes.RatingSpinner} /> : null}

                        {importMessage !== '' ? (
                          <p
                            className={
                              importMessage.split(' ')[0] !== 'Error'
                                ? classes.SuccessImportMessage
                                : classes.ErrorImportMessage
                            }
                          >
                            {importMessage}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {userState.username === username || username === '' ? (
                      <div className={classes.DeleteAccountButtonWrapper}>
                        <Button className="bg-danger" onClick={displayDeleteAccountModal} text={'Delete account'} />
                      </div>
                    ) : null}
                  </MDBCol>
                </div>
              </div>

              {userProfile.bio ? (
                <div className={classes.BioWrapper}>
                  <p className={classes.BioHeading}>Bio:</p>
                  <p className={classes.BioText}>{userProfile.bio}</p>
                </div>
              ) : null}

              <div>
                {userState.username === username || username === '' ? (
                  <>
                    <p
                      className={classes.UpdateInfoText}
                      onClick={(): void => setShowUpdateDetailsForm(!showUpdateDetailsForm)}
                    >
                      Update Personal Information
                    </p>
                    {showUpdateDetailsForm ? (
                      // @ts-expect-error
                      <Suspense fallback={<Spinner />}>
                        <UpdateUserDetailsForm userProfile={userProfile} userState={userState} />
                      </Suspense>
                    ) : null}
                  </>
                ) : null}
              </div>

              <div className={classes.RecentRatingsWrapper}>
                {!isLoadingRecentRatings ? (
                  <>
                    {recentRatings!.length !== 0 ? (
                      <>
                        <h2 className={classes.RecentRatingsHeader}>Recent Ratings</h2>
                        <Link href={'/ratings'}>View all ratings</Link>

                        <div className="d-flex align-items-start bg-light mb-2">
                          {recentRatings!.map((column: IRecentRating[], columnIndex: number) => (
                            <MDBCol className={classes.RecentRatingColumn} key={columnIndex}>
                              {column.map((rating, cellIndex) => (
                                <Link
                                  className={classes.RatingLink}
                                  style={getCellColour(columnIndex, cellIndex)}
                                  href={`/film/${rating.imdbID}`}
                                  key={rating.imdbID}
                                >
                                  <span style={{ color: determineColourGradient(rating.ratingPercentile) }}>
                                    {rating.rating}
                                  </span>
                                  <span
                                    className={classes.RatingPercentile}
                                    style={{ color: determineColourGradient(rating.ratingPercentile) }}
                                  >
                                    {' '}
                                    {rating.ratingPercentile}%
                                  </span>{' '}
                                  <span>
                                    <b>{rating.title}</b>
                                  </span>{' '}
                                  ({rating.releaseYear}){' - '}
                                  {new Date(rating.createdAt).toLocaleDateString('en-GB')}
                                </Link>
                              ))}
                            </MDBCol>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p>No ratings yet</p>
                    )}
                  </>
                ) : (
                  <Spinner />
                )}
              </div>
            </>
          ) : (
            'User not found'
          )}
        </>
      ) : (
        <Spinner />
      )}

      {showModal ? (
        <Modal authState={deleteAccountModalState}>
          <div className={classes.ModalContentWrapper}>
            <p>Are you sure you wish to delete your account? Deletion is permanent and CANNOT be undone: </p>
            <div className={classes.ModalButtonWrapper}>
              {!isDeletingAccount ? (
                <Button
                  className={`${classes.ModalButton} bg-danger`}
                  text={'Delete account'}
                  onClick={deleteAccount}
                />
              ) : (
                <SpinnerButton className="bg-danger" />
              )}

              <Button
                className={`${classes.ModalButton} bg-success`}
                text={'Cancel'}
                onClick={(): void => setShowModal(false)}
              />
            </div>
          </div>
        </Modal>
      ) : null}
    </PageView>
  );
};

export default Profile;
