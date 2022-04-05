import 'react-datepicker/dist/react-datepicker.css';
import * as endpoints from '../../../constants/endpoints';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { CountryDropdown } from 'react-country-region-selector';
import Button from '../../../components/Button/Button';
import classes from './UpdateUserDetailsForm.module.scss';
import DatePicker from 'react-datepicker';
import httpRequest from '../../../utils/httpRequest';
import Input from '../../../components/Input/Input';
import IUserProfile from '../../../../../shared/interfaces/IUserProfile';
import IUserState from '../../../interfaces/IUserState';
import Radio from '../../../components/Radio/Radio';
import SpinnerButton from '../../../components/SpinnerButton/SpinnerButton';

interface IProps {
  userProfile: IUserProfile;
  userState: IUserState;
}

const UpdateUserDetailsForm: FC<IProps> = ({ userProfile, userState }) => {
  const [formInfo, setFormInfo] = useState({} as { [key: string]: string | number });
  const [isUpdating, setIsUpdating] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  /*
    Bio
    Profile options:
      display:
        location
        personal info
      Minimum films in common
  */

  useEffect(() => {
    console.log(userProfile);
    setFormInfo({
      ...formInfo,
      country: userProfile.country!,
      email: userProfile.email!,
      firstName: userProfile.firstName!,
      gender: userProfile.gender!,
      lastName: userProfile.lastName!
    });
  }, []);

  const inputChangedHandler = (value: string | number, inputName: string): void =>
    setFormInfo({ ...formInfo, [inputName]: value });

  const selectCountry = (country: string): void => setFormInfo({ ...formInfo, country });

  const updateUserProfile = async (): Promise<void> => {
    setIsUpdating(true);

    try {
      await httpRequest(
        `${endpoints.UPDATE_USER_PROFILE}/${userState.username}`,
        'PUT',
        userState.accessToken,
        formInfo
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className={classes.InputsWrapper}>
        <div className={classes.InputWrapper}>
          <Input
            onChange={(event: ChangeEvent<HTMLInputElement>): void => inputChangedHandler(event.target.value, 'email')}
            placeholder={'Email'}
            type={'email'}
            value={formInfo.email as string}
          />
        </div>

        <div className={classes.InputWrapper}>
          <Input
            onChange={(event: ChangeEvent<HTMLInputElement>): void =>
              inputChangedHandler(event.target.value, 'firstName')
            }
            placeholder={'First name'}
            type={'text'}
            value={formInfo.firstName as string}
          />
        </div>

        <div className={classes.InputWrapper}>
          <Input
            onChange={(event: ChangeEvent<HTMLInputElement>): void =>
              inputChangedHandler(event.target.value, 'lastName')
            }
            placeholder={'Last name'}
            type={'text'}
            value={formInfo.lastName as string}
          />
        </div>

        <div className={classes.InputWrapper}>
          <CountryDropdown
            classes={classes.CountrySelect}
            onChange={(country): void => selectCountry(country)}
            value={formInfo.country as string}
          />
        </div>
      </div>

      <div className={classes.BottomInputsWrapper}>
        <div className={classes.GenderWrapper}>
          <p className={classes.DetailText}>Gender:</p>
          <Radio
            checked={formInfo.gender === 'Female'}
            name={'GenderRadio'}
            onChange={(event: { target: { value: string } }): void =>
              setFormInfo({ ...formInfo, gender: event.target.value })
            }
            value={'Female'}
          />
          <Radio
            checked={formInfo.gender === 'Male'}
            name={'GenderRadio'}
            onChange={(event: { target: { value: string } }): void =>
              setFormInfo({ ...formInfo, gender: event.target.value })
            }
            value={'Male'}
          />
          <Radio
            checked={formInfo.gender === 'Other'}
            name={'GenderRadio'}
            onChange={(event: { target: { value: string } }): void =>
              setFormInfo({ ...formInfo, gender: event.target.value })
            }
            value={'Other'}
          />
        </div>

        <div className={classes.DateOfBirthWrapper}>
          <p className={classes.DetailText}>Date of birth:</p>
          <DatePicker
            className={classes.DatePicker}
            onChange={(value: Date): void => {
              inputChangedHandler(value.getTime() / 1000, 'dob');
              setTempDate(value);
            }}
            selected={tempDate}
          />
        </div>
      </div>

      <div className={classes.SubmitButtonWrapper}>
        {!isUpdating ? (
          <Button onClick={(): Promise<void> => updateUserProfile()} text={'Submit'} />
        ) : (
          <SpinnerButton />
        )}
      </div>
    </>
  );
};

export default UpdateUserDetailsForm;
