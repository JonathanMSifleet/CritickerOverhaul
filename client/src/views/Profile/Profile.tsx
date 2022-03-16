import { XMLParser } from 'fast-xml-parser';
import { lazy, Suspense } from 'preact/compat';
import { FC, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import IReview from '../../../../shared/interfaces/IReview';
import IUserProfile from '../../../../shared/interfaces/IUserProfile';
import FileSelector from '../../components/FileSelector/FileSelector';
import PageView from '../../components/PageView/PageView';
import Spinner from '../../components/Spinner/Spinner';
import * as endpoints from '../../constants/endpoints';
import { userInfoState } from '../../store';
import httpRequest from '../../utils/httpRequest';
import Avatar from './Avatar/Avatar';
import classes from './Profile.module.scss';
const UpdateUserDetailsForm = lazy(() => import('./UpdateUserDetailsForm/UpdateUserDetailsForm'));

interface IUrlParams {
  path?: string;
  username?: string;
}

const Profile: FC<IUrlParams> = ({ username }): JSX.Element => {
  const [importMessage, setImportMessage] = useState('');
  const [importingReviews, setImportingReviews] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [shouldLoadAvatar, setShouldLoadAvatar] = useState(false);
  const [showUpdateDetailsForm, setShowUpdateDetailsForm] = useState(false);
  // todo
  const [userProfile, setUserProfile] = useState(null as null | IUserProfile);
  const userState = useRecoilValue(userInfoState);

  useEffect(() => {
    const loadUserProfile = async (username: string): Promise<void> => {
      setIsLoadingProfile(true);

      try {
        setUserProfile(
          await httpRequest(`${endpoints.GET_PROFILE_BY_USERNAME}/${username}`, 'GET')
        );
        setShouldLoadAvatar(true);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (username) {
      loadUserProfile(username);
    } else if (userState.username !== '') {
      loadUserProfile(userState.username);
    }
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

  const processReviews = (parsedJSON: [{ [key: string]: string | number }]): void => {
    const UID = userState.UID;

    const processedReviews = parsedJSON.map((review) => {
      const imdb_title_id = review.imdbid.toString().slice(2).replace(/^0+/, '');

      const processedReview = {
        imdb_title_id: Number(imdb_title_id),
        rating: review.rating,
        UID
      } as IReview;

      if (review.quote !== '') processedReview.review = review.quote as string;

      return processedReview;
    });

    uploadReviews(processedReviews);
  };

  const uploadFile = (event: { target: { files: Blob[] } }): void => {
    try {
      setImportingReviews(true);

      const fileReader = new FileReader();

      fileReader.readAsText(event.target.files[0]);
      fileReader.onload = (): void => {
        try {
          const parsedJSON = new XMLParser().parse(fileReader.result as string).recentratings.film;
          processReviews(parsedJSON);
        } catch (error) {
          setImportingReviews(false);
          setImportMessage('Error importing reviews');
        }
      };
    } catch (error) {
      setImportMessage('Error importing reviews');
    }
  };

  const uploadReviews = async (reviews: IReview[]): Promise<void> => {
    try {
      setImportMessage(
        await httpRequest(endpoints.IMPORT_REVIEWS, 'POST', { reviews, UID: userState.UID })
      );
    } catch (error) {
      setImportMessage('Error importing reviews');
    } finally {
      setImportingReviews(false);
    }
  };

  return (
    <PageView backgroundCSS={classes.PageWrapper}>
      {!isLoadingProfile ? (
        <>
          <Avatar
            setShouldLoadAvatar={setShouldLoadAvatar}
            shouldLoadAvatar={shouldLoadAvatar}
            username={username!}
          />

          {userProfile ? (
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
                onClick={(): void => setShowUpdateDetailsForm(true)}
              >
                Update Personal Information
              </p>
              <p className={classes.UserProfileLink}>Update Password</p>
              {showUpdateDetailsForm ? (
                // @ts-expect-error
                <Suspense fallback={<Spinner />}>
                  <UpdateUserDetailsForm userProfile={userProfile} />
                </Suspense>
              ) : null}
              <FileSelector
                onChange={(event): void => uploadFile(event)}
                text={'Import Criticker Ratings'}
              />
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
              {importingReviews ? <Spinner /> : null}
            </div>
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
