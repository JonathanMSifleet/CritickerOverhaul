import CryptoES from 'crypto-es';
import { ChangeEvent, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import * as endpoints from '../../../../constants/endpoints';
import { modalState } from '../../../../store';
import httpRequest from '../../../../utils/httpRequest';
import Button from '../../../elements/Button/Button';
import Checkbox from '../../../elements/Checkbox/Checkbox';
import Input from '../../../elements/Input/Input';
import Spinner from '../../Spinner/Spinner';
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
  const [isLoading, setIsLoading] = useState(false);
  const [shouldSignup, setShouldPost] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const setShowModal = useSetRecoilState(modalState);

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
    const attemptSignup = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const response = await httpRequest(endpoints.SIGNUP, 'POST', formInfo);
        console.log('🚀 ~ file: Signup.tsx ~ line 53 ~ attemptSignup ~ response', response);
        setShowModal(false);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };

    // stop POSTing unnecessary attribute
    delete formInfo!.repeatPassword;

    if (shouldSignup) attemptSignup();
  }, [shouldSignup]);

  const handleSignupAttempt = async (): Promise<void> => {
    if (formInfo.password === formInfo.repeatPassword) {
      const hashedPassword = CryptoES.SHA512(formInfo.password).toString();

      setFormInfo({ ...formInfo, password: hashedPassword });
      setShouldPost(true);
    }
  };

  const inputChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    inputName: string
  ): void => {
    setFormInfo({ ...formInfo, [inputName]: event.target.value });
  };

  const checkboxHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFormInfo({ ...formInfo, termsChecked: event.target.checked });
  };

  return (
    <form autoComplete="off" onSubmit={(event): void => event.preventDefault()}>
      <ThirdPartyLogin />

      <div className={`${classes.InputWrapper} form-outline mb-4`}>
        <Input
          onChange={(event: ChangeEvent<HTMLInputElement>): void =>
            inputChangedHandler(event, 'username')
          }
          placeholder={'Username'}
          type={'text'}
        />

        <Input
          autoComplete="new-password"
          onChange={(event: ChangeEvent<HTMLInputElement>): void =>
            inputChangedHandler(event, 'email')
          }
          placeholder={'Email'}
          type={'email'}
        />

        <Input
          autoComplete="new-password"
          onChange={(event: ChangeEvent<HTMLInputElement>): void =>
            inputChangedHandler(event, 'password')
          }
          placeholder={'Password'}
          type={'password'}
        />

        <Input
          onChange={(event: ChangeEvent<HTMLInputElement>): void =>
            inputChangedHandler(event, 'repeatPassword')
          }
          placeholder={'Repeat password'}
          type={'password'}
        />
      </div>

      <div className={classes.TermsConditionsWrapper}>
        <label className={classes.TermsConditionsLabel}>
          <Checkbox
            onChange={(event: ChangeEvent<HTMLInputElement>): void => checkboxHandler(event)}
            placeholder={'I have read and agree to the terms'}
            value={formInfo.termsChecked}
          />
        </label>
      </div>

      <div className={classes.SubmitButtonWrapper}>
        <Button
          className={`${classes.SubmitButton} btn btn-primary btn-block mb-4`}
          disabled={submitDisabled}
          onClick={(): Promise<void> => handleSignupAttempt()}
          text={'Sign up'}
        />
        {isLoading ? <Spinner /> : null}
      </div>
    </form>
  );
};
export default SignUp;
