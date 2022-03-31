import * as endpoints from '../../constants/endpoints';

import { FC, useEffect, useState } from 'react';
import { Suspense, lazy } from 'preact/compat';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import Avatar from './Avatar/Avatar';
import FileSelector from '../../components/FileSelector/FileSelector';
import IRating from '../../../../shared/interfaces/IRating';
import IUrlParams from '../../interfaces/IUrlParams';
import IUserProfile from '../../../../shared/interfaces/IUserProfile';
import { Link } from 'preact-router/match';
import { MDBCol } from 'mdb-react-ui-kit';
import PageView from '../../components/PageView/PageView';
import Spinner from '../../components/Spinner/Spinner';
import { XMLParser } from 'fast-xml-parser';
import chunk from 'chunk';
import classes from './Profile.module.scss';
import getCellColour from '../../utils/getCellColour';
import getColourGradient from '../../utils/getColourGradient';
import httpRequest from '../../utils/httpRequest';
import { userInfoState } from '../../store';

const UpdateUserDetailsForm = lazy(() => import('./UpdateUserDetailsForm/UpdateUserDetailsForm'));

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
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingRecentRatings, setIsLoadingRecentRatings] = useState(false);
  const [recentRatings, setRecentRatings] = useState(null as null | IRecentRating[][]);
  const [shouldLoadAvatar, setShouldLoadAvatar] = useState(false);
  const [showUpdateDetailsForm, setShowUpdateDetailsForm] = useState(false);
  const [userProfile, setUserProfile] = useState(null as null | IUserProfile);
  const userState = useRecoilValue(userInfoState);
  const setUserInfo = useSetRecoilState(userInfoState);

  useEffect(() => {
    (async (): Promise<void> => {
      setIsLoadingProfile(true);
      setIsLoadingRecentRatings(true);

      let localUsername;
      if (username) {
        localUsername = username;
      } else if (userState.username !== '') {
        localUsername = userState.username;
      }

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
        setShouldLoadAvatar(true);
      });

      httpRequest(`${endpoints.GET_RECENT_RATINGS}/${localUsername}`, 'GET').then((ratings) => {
        setRecentRatings(chunk(ratings, 10));
        setIsLoadingRecentRatings(false);
      });
    })();
  }, [username]);

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

  const uploadFile = (event: { target: { files: Blob[] } }): void => {
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
                setShouldLoadAvatar={setShouldLoadAvatar}
                setUserInfo={setUserInfo}
                shouldLoadAvatar={shouldLoadAvatar}
                username={username!}
                userState={userState}
              />

              <div className={classes.UserDetails}>
                <h1 className={classes.UsernameHeader}>
                  {userProfile.username}
                  <span className={classes.UserRank}> {getRatingRank(userProfile.numRatings!)}</span>
                </h1>
                <p className={classes.UserProfileText}>
                  {userProfile.numRatings} Film Rating{userProfile.numRatings === 0 ? 's' : null}
                </p>
                <p className={classes.UserProfileText}>
                  <b>Member since:</b> {epochToDate(userProfile.memberSince!)}
                </p>

                {userState.username === username || username === '' ? (
                  <>
                    <p
                      className={classes.UserProfileLink}
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

                    <p className={classes.ImportInstructions}>Import Criticker Ratings:</p>
                    <div className={classes.FileSelectorWrapper}>
                      <FileSelector onChange={(event): void => uploadFile(event)} />
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
                              {column.map((rating, cellIndex) => {
                                const cellColour = getCellColour(columnIndex, cellIndex);

                                return (
                                  <Link
                                    className={classes.RatingLink}
                                    style={cellColour}
                                    href={`/film/${rating.imdbID}`}
                                    key={rating.imdbID}
                                  >
                                    {((): JSX.Element => {
                                      let colourGradient;
                                      try {
                                        colourGradient = getColourGradient(rating.ratingPercentile);
                                      } catch (error) {
                                        colourGradient = '#000000';
                                      }

                                      return (
                                        <>
                                          {/* @ts-expect-error works as intended */}
                                          <span style={{ color: colourGradient }}>{rating.rating}</span>
                                          {/* @ts-expect-error works as intended */}
                                          <span className={classes.RatingPercentile} style={{ color: colourGradient }}>
                                            {' '}
                                            {rating.ratingPercentile}%
                                          </span>
                                        </>
                                      );
                                    })()}{' '}
                                    <span>
                                      <b>{rating.title}</b>
                                    </span>{' '}
                                    ({rating.releaseYear}){' - '}
                                    {new Date(rating.createdAt).toLocaleDateString('en-GB')}
                                  </Link>
                                );
                              })}
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
    </PageView>
  );
};

export default Profile;
