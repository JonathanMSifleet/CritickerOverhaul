import CryptoES from 'crypto-es';
import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import Button from '../../../../elements/Button/Button';
import Checkbox from '../../../../elements/Checkbox/Checkbox';
import Input from '../../../../elements/Input/Input';
import { modalState } from '../../../../store';
import { SIGNUP } from '../../../../shared/constants/endpoints';
import HTTPRequest from '../../../../shared/functions/httpRequest';
import ThirdPartyLogin from '../ThirdPartyLogin/ThirdPartyLogin';
import classes from './Signup.module.scss';

interface IState {
  email?: string;
  password?: string;
  repeatPassword?: string;
  username?: string;
  termsChecked?: boolean;
}

const SignUp: React.FC = () => {
  const [formInfo, setFormInfo] = useState<IState>({});
  const [shouldPost, setShouldPost] = useState(false);
  const setShowModal = useSetRecoilState(modalState);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  useEffect(() => {
    if (
      !formInfo.email ||
      !formInfo.password ||
      !formInfo.repeatPassword ||
      !formInfo.username ||
      !formInfo.termsChecked
    ) {
      setSubmitDisabled(true);
    } else {
      setSubmitDisabled(false);
    }
  }, [formInfo]);

  // when hashing the password client-side, React does not update the
  // state until the next render-cycle, by using useEffect, a new render
  // cycle is called, updating the state to store the hashed password,
  // so that when it is POSTed to the server, the password is hashed
  useEffect(() => {
    // trick to allows for await to be used inside a useEffect hook
    const postData = async (): Promise<void> => {
      await HTTPRequest(SIGNUP, 'POST', formInfo);

      setShowModal(false);
    };

    // stop POSTing unnecessary attribute
    delete formInfo!.repeatPassword;

    if (shouldPost) postData();
  }, [shouldPost]);

  const signup = async (): Promise<void> => {
    if (formInfo.password === formInfo.repeatPassword) {
      const hashedPassword = CryptoES.SHA512(formInfo.password).toString();

      setFormInfo({ ...formInfo, password: hashedPassword });
      setShouldPost(true);
    }
  };

  const inputChangedHandler = (event: React.ChangeEvent<HTMLInputElement>, inputName: string): void => {
    setFormInfo({ ...formInfo, [inputName]: event.target.value });
  };

  const checkboxHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFormInfo({ ...formInfo, termsChecked: event.target.checked });
  };

  return (
    <form autoComplete="off" onSubmit={(event): void => event.preventDefault()}>
      <ThirdPartyLogin />

      <div className={`${classes.InputWrapper} form-outline mb-4`}>
        {/* Username input */}
        <Input
          onChange={(event): void => inputChangedHandler(event, 'username')}
          placeholder={'Username'}
          type={'text'}
        />

        {/* Email input */}
        <Input
          autoComplete="new-password"
          onChange={(event): void => inputChangedHandler(event, 'email')}
          placeholder={'Email'}
          type={'email'}
        />

        {/* Password input */}
        <Input
          autoComplete="new-password"
          onChange={(event): void => inputChangedHandler(event, 'password')}
          placeholder={'Password'}
          type={'password'}
        />

        {/* Repeat Password input */}
        <Input
          onChange={(event): void => inputChangedHandler(event, 'repeatPassword')}
          placeholder={'Repeat password'}
          type={'password'}
        />
      </div>

      {/* Checkbox */}
      <div className={classes.TermsConditionsWrapper}>
        <label className={classes.TermsConditionsLabel}>
          <Checkbox
            onChange={(event): void => checkboxHandler(event)}
            placeholder={'I have read and agree to the terms'}
            value={formInfo.termsChecked}
          />
        </label>
      </div>

      {/* Submit button */}
      <div className={classes.SubmitButtonWrapper}>
        <Button
          className={`${classes.SubmitButton} btn btn-primary btn-block mb-4`}
          disabled={submitDisabled}
          onClick={(): Promise<void> => signup()}
          text={'Sign up'}
        />
      </div>
    </form>
  );
};
export default SignUp;
