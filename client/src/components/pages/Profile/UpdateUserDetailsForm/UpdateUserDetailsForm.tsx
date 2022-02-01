import { MDBRadio } from 'mdb-react-ui-kit';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CountryDropdown } from 'react-country-region-selector';
import Input from '../../../elements/Input/Input';
import classes from './UpdateUserDetailsForm.module.scss';

const UpdateUserDetailsForm: FC = () => {
  const [country, setCountry] = useState('');
  const [formInfo, setFormInfo] = useState({});
  // Date of Birth
  // Bio

  useEffect(() => {
    console.log(formInfo);
  }, [formInfo]);

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
      />

      <Input
        onChange={(event: ChangeEvent<HTMLInputElement>): void =>
          inputChangedHandler(event.target.value, 'email')
        }
        placeholder={'Email'}
        type={'email'}
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

      <>
        <MDBRadio name="inlineRadio" id="inlineRadio1" value="option1" label="Female" inline />
        <MDBRadio name="inlineRadio" id="inlineRadio2" value="option2" label="Male" inline />
        <MDBRadio name="inlineRadio" id="inlineRadio3" value="option3" label="Other" inline />
      </>

      <Calendar
        onChange={(value: Date): void => inputChangedHandler(value.getTime() / 1000, 'dob')}
        value={null}
      />
    </>
  );
};

export default UpdateUserDetailsForm;
