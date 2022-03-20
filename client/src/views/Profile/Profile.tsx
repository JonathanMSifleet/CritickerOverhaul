import * as endpoints from '../../constants/endpoints';

import { FC, useEffect, useState } from 'react';
import { Suspense, lazy } from 'preact/compat';

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
import colourGradient from 'javascript-color-gradient';
import httpRequest from '../../utils/httpRequest';
import { useRecoilValue } from 'recoil';
import { userInfoState } from '../../store';

const UpdateUserDetailsForm = lazy(() => import('./UpdateUserDetailsForm/UpdateUserDetailsForm'));

interface IRecentRating {
  imdb_title_id: number;
  rating: number;
  ratingPercentile: number;
  title: string;
  year: number;
  createdAt: number;
}

const Profile: FC<IUrlParams> = ({ username }): JSX.Element => {
  const [importMessage, setImportMessage] = useState('');
  const [importingRatings, setImportingRatings] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [recentRatings, setRecentRatings] = useState(null as any);
  const [shouldLoadAvatar, setShouldLoadAvatar] = useState(false);
  const [showUpdateDetailsForm, setShowUpdateDetailsForm] = useState(false);
  const [userProfile, setUserProfile] = useState(null as null | IUserProfile);
  const userState = useRecoilValue(userInfoState);

  // @ts-expect-error property does exist
  const colourArray = colourGradient.setGradient('#FF0000', '#FBFB13', '#228A00').setMidpoint(5);

  useEffect(() => {
    (async (): Promise<void> => {
      setIsLoadingProfile(true);

      let localUsername;
      if (username) {
        localUsername = username;
      } else if (userState.username !== '') {
        localUsername = userState.username;
      }

      const userHTTPRequests = [];
      try {
        userHTTPRequests.push(await httpRequest(`${endpoints.GET_PROFILE_BY_USERNAME}/${localUsername}`, 'GET'));
        userHTTPRequests.push(await httpRequest(`${endpoints.GET_RECENT_RATINGS}/${localUsername}`, 'GET'));

        const results = await Promise.all(userHTTPRequests);

        setUserProfile(results[0]);
        setRecentRatings(chunk(results[1], 10));
        setShouldLoadAvatar(true);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingProfile(false);
      }
    })();
  }, [username]);

  const epochToDate = (epoch: number): string => new Date(epoch).toLocaleDateString('en-GB');

  const getColourGradient = (ratingPercentile: number): { color: string } => {
    let colourIndex = Math.round(ratingPercentile / 10);
    if (colourIndex <= 0) colourIndex = 1;

    return { color: colourArray.getColor(colourIndex) };
  };

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
      const imdb_title_id = rating.imdbid.toString().slice(2).replace(/^0+/, '');

      const processedRating = {
        createdAt: new Date(rating.reviewdate).getTime(),
        imdb_title_id: Number(imdb_title_id),
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

              <div className={classes.RecentRatingsWrapper}>
                <h2 className={classes.RecentRatingsHeader}>Recent Ratings</h2>
                <Link href={'/ratings'}>View all ratings</Link>

                <div className="d-flex align-items-start bg-light mb-2">
                  {recentRatings.map((column: IRecentRating[], columnIndex: number) => (
                    <MDBCol className={classes.RecentRatingColumn} key={columnIndex}>
                      {column.map((rating, cellIndex) => {
                        // if index is odd alternate background colour
                        // const ratingColour = cellIndex % 2 === 0 ? 'bg-light' : 'bg-info';

                        const ratingColour =
                          columnIndex === 0
                            ? { backgroundColor: cellIndex % 2 === 0 ? '#FBFBFB' : '#E5F3FF' }
                            : { backgroundColor: cellIndex % 2 === 0 ? '#E5F3FF' : '#FBFBFB' };

                        return (
                          <Link
                            className={classes.RatingLink}
                            style={ratingColour}
                            href={`/film/${rating.imdb_title_id}`}
                            key={rating.imdb_title_id}
                          >
                            {((): JSX.Element => {
                              const colourGradient = getColourGradient(rating.ratingPercentile);
                              return (
                                <>
                                  <span style={colourGradient}>{rating.rating}</span>
                                  <span className={classes.RatingPercentile} style={colourGradient}>
                                    {' '}
                                    {rating.ratingPercentile}%
                                  </span>
                                </>
                              );
                            })()}{' '}
                            <span>
                              <b>{rating.title}</b>
                            </span>{' '}
                            ({rating.year}){' - '}
                            {new Date(rating.createdAt).toLocaleDateString('en-GB')}
                          </Link>
                        );
                      })}
                    </MDBCol>
                  ))}
                </div>
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
