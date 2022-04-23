import 'react-datepicker/dist/react-datepicker.css';
import * as endpoints from '../../../constants/endpoints';
import { CountryDropdown } from 'react-country-region-selector';
import { FC, useEffect, useState } from 'react';
import { validateValue } from '../../../../../shared/functions/validationFunctions';
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
  setShowUpdateDetailsForm: (value: boolean) => void;
  userProfile: IUserProfile;
  userState: IUserState;
}

const UpdateUserDetailsForm: FC<IProps> = ({ setShowUpdateDetailsForm, userProfile, userState }) => {
  const [bioValMessages, setBioValMessages] = useState([] as string[]);
  const [emailValMessages, setEmailValMessages] = useState([] as string[]);
  const [firstNameValMessages, setFirstNameValMessages] = useState([] as string[]);
  const [formInfo, setFormInfo] = useState({} as { [key: string]: string | number });
  const [formIsValid, setFormIsValid] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastNameValMessages, setLastNameValMessages] = useState([] as string[]);
  const [selectedDate, setSelectedDate] = useState(null as Date | null);

  useEffect(() => {
    const errorArray: string[] = [];
    errorArray.push(
      ...emailValMessages,
      ...emailValMessages,
      ...firstNameValMessages,
      ...firstNameValMessages,
      ...lastNameValMessages,
      ...lastNameValMessages
    );

    setFormIsValid(errorArray.length === 0);
  }, [
    emailValMessages,
    emailValMessages,
    firstNameValMessages,
    firstNameValMessages,
    lastNameValMessages,
    lastNameValMessages
  ]);

  useEffect(() => {
    userProfile.dob !== undefined ? setSelectedDate(new Date(userProfile.dob!)) : setSelectedDate(new Date());

    setFormInfo({
      ...formInfo,
      bio: userProfile.bio!,
      country: userProfile.country!,
      dob: userProfile.dob!,
      email: userProfile.email!,
      firstName: userProfile.firstName!,
      gender: userProfile.gender!,
      lastName: userProfile.lastName!
    });
  }, []);

  const handleValidation = async (value: string, type: string): Promise<void> => {
    let messages = (await validateValue(value, type)) as string[];
    messages = messages.filter((error) => error !== null);

    switch (type) {
      case 'Bio':
        setBioValMessages(messages);
        break;
      case 'Email':
        setEmailValMessages(messages);
        break;
      case 'FirstName':
        setFirstNameValMessages(messages);
        break;
      case 'LastName':
        setLastNameValMessages(messages);
        break;
    }
  };

  const inputChangedHandler = (value: string | number, inputName: string): void =>
    setFormInfo({ ...formInfo, [inputName]: value });

  const selectCountry = (country: string): void => setFormInfo({ ...formInfo, country });

  const updateUserProfile = async (): Promise<void> => {
    setIsUpdating(true);

    const trimmedFormInfo = formInfo;
    Object.keys(trimmedFormInfo).forEach((key) => {
      // @ts-expect-error trimmedFormInfo must be string as evaluated by if statement
      if (typeof trimmedFormInfo[key] === 'string') trimmedFormInfo[key] = trimmedFormInfo[key].trim();
    });

    try {
      await httpRequest(
        `${endpoints.UPDATE_USER_PROFILE}/${userState.username}`,
        'PUT',
        userState.accessToken,
        trimmedFormInfo
      );

      setShowUpdateDetailsForm(false);
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
            errors={emailValMessages!}
            onChange={(event): void => {
              inputChangedHandler(event.target.value, 'email');
              handleValidation(event.target.value, 'Email');
            }}
            placeholder={'Email'}
            type={'email'}
            value={formInfo.email as string}
          />
        </div>

        <div className={classes.InputWrapper}>
          <Input
            errors={firstNameValMessages!}
            onChange={(event): void => {
              inputChangedHandler(event.target.value, 'firstName');
              handleValidation(event.target.value, 'FirstName');
            }}
            placeholder={'First name'}
            type={'text'}
            value={formInfo.firstName as string}
          />
        </div>

        <div className={classes.InputWrapper}>
          <Input
            errors={lastNameValMessages!}
            onChange={(event): void => {
              inputChangedHandler(event.target.value, 'lastName');
              handleValidation(event.target.value, 'LastName');
            }}
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
            onChange={(event): void => setFormInfo({ ...formInfo, gender: event.target.value })}
            value={'Female'}
          />
          <Radio
            checked={formInfo.gender === 'Male'}
            name={'GenderRadio'}
            onChange={(event): void => setFormInfo({ ...formInfo, gender: event.target.value })}
            value={'Male'}
          />
          <Radio
            checked={formInfo.gender === 'Other'}
            name={'GenderRadio'}
            onChange={(event): void => setFormInfo({ ...formInfo, gender: event.target.value })}
            value={'Other'}
          />
        </div>

        <div className={classes.DateOfBirthWrapper}>
          <p className={classes.DetailText}>Date of birth:</p>
          <DatePicker
            className={classes.DatePicker}
            dateFormat={'dd/MM/yyyy'}
            onChange={(value: Date): void => {
              inputChangedHandler(value.getTime(), 'dob');
              setSelectedDate(value);
            }}
            selected={selectedDate}
          />
        </div>
      </div>

      <div className={classes.DescriptionWrapper}>
        <Input
          className={classes.DescriptionTextArea}
          errors={bioValMessages!}
          label={'Bio'}
          onChange={(event): void => {
            inputChangedHandler(event.target.value, 'bio');
            handleValidation(event.target.value, 'Bio');
          }}
          textarea={true}
          value={formInfo.bio as string}
        />
        <p>{1000 - (formInfo.bio ? (formInfo.bio as string).length : 0)} characters remaining</p>
      </div>

      <div className={classes.SubmitButtonWrapper}>
        {!isUpdating ? (
          <Button disabled={!formIsValid} onClick={(): Promise<void> => updateUserProfile()} text={'Submit'} />
        ) : (
          <SpinnerButton />
        )}
      </div>
    </>
  );
};

export default UpdateUserDetailsForm;
