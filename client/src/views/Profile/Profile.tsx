import chunk from 'chunk';
import { XMLParser } from 'fast-xml-parser';
import { MDBCol } from 'mdb-react-ui-kit';
import { Link } from 'preact-router/match';
import { lazy, Suspense } from 'preact/compat';
import { FC, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import IRating from '../../../../shared/interfaces/IRating';
import IUserProfile from '../../../../shared/interfaces/IUserProfile';
import FileSelector from '../../components/FileSelector/FileSelector';
import PageView from '../../components/PageView/PageView';
import Spinner from '../../components/Spinner/Spinner';
import * as endpoints from '../../constants/endpoints';
import IUrlParams from '../../interfaces/IUrlParams';
import { userInfoState } from '../../store';
import getCellColour from '../../utils/getCellColour';
import getColourGradient from '../../utils/getColourGradient';
import httpRequest from '../../utils/httpRequest';
import Avatar from './Avatar/Avatar';
import classes from './Profile.module.scss';

const UpdateUserDetailsForm = lazy(() => import('./UpdateUserDetailsForm/UpdateUserDetailsForm'));

interface IRecentRating {
  imdbID: number;
  rating: number;
  ratingPercentile: number;
  title: string;
  releaseYear: number;
  createdAt: number;
}

const Profile: FC<IUrlParams> = ({ username }): JSX.Element => {
  const [importMessage, setImportMessage] = useState('');
  const [importingRatings, setImportingRatings] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [recentRatings, setRecentRatings] = useState(null as null | IRecentRating[][]);
  const [shouldLoadAvatar, setShouldLoadAvatar] = useState(false);
  const [showUpdateDetailsForm, setShowUpdateDetailsForm] = useState(false);
  const [userProfile, setUserProfile] = useState(null as null | IUserProfile);
  const userState = useRecoilValue(userInfoState);

  useEffect(() => {
    (async (): Promise<void> => {
      setIsLoadingProfile(true);

      let localUsername;
      if (username) {
        localUsername = username;
      } else if (userState.username !== '') {
        localUsername = userState.username;
      }

      httpRequest(`${endpoints.GET_PROFILE_BY_USERNAME}/${localUsername}`, 'GET').then((results) => {
        setUserProfile(results);
        setIsLoadingProfile(false);
        setShouldLoadAvatar(true);
      });

      httpRequest(`${endpoints.GET_RECENT_RATINGS}/${localUsername}`, 'GET').then((ratings) =>
        setRecentRatings(chunk(ratings, 10))
      );
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
      setImportMessage(await httpRequest(`${endpoints.IMPORT_RATINGS}/${userState.username}`, 'POST', { ratings }));
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
          <Avatar setShouldLoadAvatar={setShouldLoadAvatar} shouldLoadAvatar={shouldLoadAvatar} username={username!} />

          {userProfile ? (
            <>
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
                <p
                  className={classes.UserProfileLink}
                  onClick={(): void => setShowUpdateDetailsForm(!showUpdateDetailsForm)}
                >
                  Update Personal Information
                </p>
                {showUpdateDetailsForm ? (
                  // @ts-expect-error
                  <Suspense fallback={<Spinner />}>
                    <UpdateUserDetailsForm userProfile={userProfile} />
                  </Suspense>
                ) : null}

                <p className={classes.ImportInstructions}>Import Criticker Ratings:</p>
                <div className={classes.FileSelectorWrapper}>
                  <FileSelector onChange={(event): void => uploadFile(event)} />

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
                  {importingRatings ? <Spinner className={classes.RatingSpinner} /> : null}
                </div>
              </div>

              {recentRatings ? (
                <div className={classes.RecentRatingsWrapper}>
                  <h2 className={classes.RecentRatingsHeader}>Recent Ratings</h2>
                  <Link href={'/ratings'}>View all ratings</Link>

                  <div className="d-flex align-items-start bg-light mb-2">
                    {recentRatings.map((column: IRecentRating[], columnIndex: number) => (
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
                                const colourGradient = getColourGradient(rating.ratingPercentile);

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
                </div>
              ) : null}
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
