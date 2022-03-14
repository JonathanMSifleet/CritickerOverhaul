import { ChangeEvent, FC, useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CountryDropdown } from 'react-country-region-selector';
import Input from '../../../components/Input/Input';
import Radio from '../../../components/Radio/Radio';
import classes from './UpdateUserDetailsForm.module.scss';

interface IProps {
  // to do
  userProfile: any;
}

const UpdateUserDetailsForm: FC<IProps> = ({ userProfile }) => {
  const [country, setCountry] = useState('');
  const [formInfo, setFormInfo] = useState({} as { [key: string]: string | number });
  const [gender, setGender] = useState('');

  // const userState = useRecoilValue(userInfoState);

  /*
  email
  first name
  last name
  country
  state
  city
  gender
  date of birth
  Bio
  Profile options:
    display:
      location
      personal info
    Minimum films in common
  */

  useEffect(() => {
    console.log(userProfile);
    setFormInfo({ ...formInfo, username: userProfile.username, email: userProfile.email });
  }, []);

  const inputChangedHandler = (value: string | number, inputName: string): void =>
    setFormInfo({ ...formInfo, [inputName]: value });

  const selectCountry = (country: string): void => setCountry(country);

  return (
    <>
      <Input
        onChange={(event: ChangeEvent<HTMLInputElement>): void =>
          inputChangedHandler(event.target.value, 'username')
        }
        placeholder={'Username'}
        type={'text'}
        value={formInfo.username as string}
      />

      <Input
        onChange={(event: ChangeEvent<HTMLInputElement>): void =>
          inputChangedHandler(event.target.value, 'email')
        }
        placeholder={'Email'}
        type={'email'}
        value={formInfo.email as string}
      />

      <Input
        onChange={(event: ChangeEvent<HTMLInputElement>): void =>
          inputChangedHandler(event.target.value, 'firstName')
        }
        placeholder={'First name'}
        type={'text'}
      />

      <Input
        onChange={(event: ChangeEvent<HTMLInputElement>): void =>
          inputChangedHandler(event.target.value, 'lastName')
        }
        placeholder={'Last name'}
        type={'text'}
      />

      <CountryDropdown
        classes={classes.CountrySelect}
        onChange={(country): void => selectCountry(country)}
        value={country}
      />

      <p>Gender</p>
      <>
        <Radio
          name={'GenderRadio'}
          onChange={(event: { target: { value: string } }): void => setGender(event.target.value)}
          value={'Female'}
        />
        <Radio
          name={'GenderRadio'}
          onChange={(event: { target: { value: string } }): void => setGender(event.target.value)}
          value={'Male'}
        />
        <Radio
          name={'GenderRadio'}
          onChange={(event: { target: { value: string } }): void => setGender(event.target.value)}
          value={'Other'}
        />
      </>

      <p>Country:</p>
      <Calendar
        onChange={(value: Date): void => inputChangedHandler(value.getTime() / 1000, 'dob')}
        value={null}
      />
    </>
  );
};

export default UpdateUserDetailsForm;
