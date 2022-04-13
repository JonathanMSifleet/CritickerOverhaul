import * as endpoints from '../../../constants/endpoints';

import { ChangeEvent, FC, useEffect, useState } from 'react';

import { authModalState } from '../../../store';
import { useSetRecoilState } from 'recoil';
import Button from '../../Button/Button';
import Checkbox from '../../Checkbox/Checkbox';
import classes from './Signup.module.scss';
import CryptoES from 'crypto-es';
import extractValidationMessages from './../../../utils/extractValidationMessages';
import httpRequest from '../../../utils/httpRequest';
import Input from '../../Input/Input';
import SpinnerButton from './../../SpinnerButton/SpinnerButton';

interface IState {
  email?: string;
  password?: string;
  repeatPassword?: string;
  username?: string;
  termsChecked?: boolean;
}

const SignUp: FC = () => {
  const [emailValidationMessages, setEmailValidationMessages] = useState([] as string[]);
  const [formInfo, setFormInfo] = useState<IState>({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValidationMessages, setPasswordValidationMessages] = useState([] as string[]);
  const [shouldSignup, setShouldSignup] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [usernameValidationMessages, setUsernameValidationMessages] = useState([] as string[]);
  const setShowModal = useSetRecoilState(authModalState);

  useEffect(() => {
    setSubmitDisabled(
      !formInfo.email || !formInfo.password || !formInfo.repeatPassword || !formInfo.termsChecked || !formInfo.username
    );
  }, [formInfo]);

  // when hashing the password client-side, React does not update the
  // state until the next render-cycle, by using useEffect, a new render
  // cycle is called, updating the state to store the hashed password,
  // so that when it is POSTed to the server, the password is hashed
  useEffect(() => {
    if (shouldSignup)
      (async (): Promise<void> => {
        setIsLoading(true);
        const preHashPassword = formInfo.password;

        try {
          if (formInfo.password !== formInfo.repeatPassword) throw new Error('Passwords do not match');
          formInfo.password = CryptoES.SHA512(formInfo.password).toString();

          delete formInfo.repeatPassword;

          const result = await httpRequest(endpoints.SIGNUP, 'POST', undefined, formInfo);
          if (result.statusCode !== 201) throw new Error(result.message);

          alert('Account created successfully, please login');
          setShowModal(false);
        } catch (error) {
          handleValidationMessage(extractValidationMessages(error as string));
          setFormInfo({ ...formInfo, password: preHashPassword });
        } finally {
          setShouldSignup(false);
          setIsLoading(false);
        }
      })();
  }, [shouldSignup]);

  const checkboxHandler = (event: React.ChangeEvent<HTMLInputElement>): void =>
    setFormInfo({ ...formInfo, termsChecked: event.target.checked });

  const handleValidationMessage = (valMessages: { [key: string]: string }[]): void => {
    const replacementEmailValList: string[] = [];
    const replacementPasswordValList: string[] = [];
    const replacementUsernameValList: string[] = [];

    valMessages.forEach((message) => {
      const validationKey = Object.keys(message)[0];

      switch (validationKey) {
        case 'Username':
          replacementUsernameValList.push(`${validationKey} ${message.Username}`);
          break;
        case 'Email':
          replacementEmailValList.push(`${validationKey} ${message.Email}`);
          break;
        case 'Passwords':
          replacementPasswordValList.push(`${validationKey} ${message.Passwords}`);
          break;
        default:
          console.error('Unhandled validation key:', validationKey);
          console.error('Validation message:', message);
      }
    });

    setUsernameValidationMessages(replacementUsernameValList);
    setEmailValidationMessages(replacementEmailValList);
    setPasswordValidationMessages(replacementPasswordValList);
  };

  const inputChangedHandler = (event: React.ChangeEvent<HTMLInputElement>, inputName: string): void =>
    setFormInfo({ ...formInfo, [inputName]: event.target.value });

  return (
    <form autoComplete="off" onSubmit={(event): void => event.preventDefault()}>
      <div className={`${classes.InputWrapper} form-outline mb-4`}>
        <Input
          autoComplete="username"
          className={classes.Input}
          errors={usernameValidationMessages}
          onChange={(event: ChangeEvent<HTMLInputElement>): void => inputChangedHandler(event, 'username')}
          placeholder={'Username'}
          type={'text'}
        />

        <Input
          autoComplete="email"
          className={classes.Input}
          errors={emailValidationMessages}
          onChange={(event: ChangeEvent<HTMLInputElement>): void => inputChangedHandler(event, 'email')}
          placeholder={'Email'}
          type={'email'}
        />

        <Input
          autoComplete="new-password"
          className={classes.Input}
          onChange={(event: ChangeEvent<HTMLInputElement>): void => inputChangedHandler(event, 'password')}
          placeholder={'Password'}
          type={'password'}
        />

        <Input
          className={classes.Input}
          errors={passwordValidationMessages}
          onChange={(event: ChangeEvent<HTMLInputElement>): void => inputChangedHandler(event, 'repeatPassword')}
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
        {!isLoading ? (
          <Button
            className={`${classes.SubmitButton} btn btn-primary btn-block mb-4`}
            disabled={submitDisabled}
            onClick={(): void => setShouldSignup(true)}
            text={'Sign up'}
          />
        ) : (
          <SpinnerButton />
        )}
      </div>
    </form>
  );
};
export default SignUp;
