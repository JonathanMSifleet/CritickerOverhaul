import CryptoES from 'crypto-es';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import * as endpoints from '../../../constants/endpoints';
import { modalState } from '../../../store';
import httpRequest from '../../../utils/httpRequest';
import Button from '../../Button/Button';
import Checkbox from '../../Checkbox/Checkbox';
import Input from '../../Input/Input';
import extractValidationMessages from './../../../utils/extractValidationMessages';
import SpinnerButton from './../../SpinnerButton/SpinnerButton';
import classes from './Signup.module.scss';

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
  const setShowModal = useSetRecoilState(modalState);

  useEffect(() => {
    setSubmitDisabled(
      !formInfo.email ||
        !formInfo.password ||
        !formInfo.repeatPassword ||
        !formInfo.termsChecked ||
        !formInfo.username
    );
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
        if (!response.statusCode.toString().startsWith('2')) throw new Error(response.message);

        setShowModal(false);
      } catch (error) {
        handleValidationMessage(extractValidationMessages(error as string));
      }

      setShouldSignup(false);
      setIsLoading(false);
    };

    // stop POSTing unnecessary attribute
    delete formInfo!.repeatPassword;

    if (shouldSignup) attemptSignup();
  }, [shouldSignup]);

  const checkboxHandler = (event: React.ChangeEvent<HTMLInputElement>): void =>
    setFormInfo({ ...formInfo, termsChecked: event.target.checked });

  const handleValidationMessage = (valMessages: { [key: string]: string }[]): void => {
    const replacementEmailValList = [] as string[];
    const replacementPasswordValList = [] as string[];
    const replacementUsernameValList = [] as string[];

    valMessages.forEach((message) => {
      switch (Object.keys(message)[0]) {
        case 'Username':
          replacementUsernameValList.push(`${Object.keys(message)[0]} ${message.Username}`);
          break;
        case 'Email':
          replacementEmailValList.push(`${Object.keys(message)[0]} ${message.Email}`);
          break;
        case 'Passwords':
          replacementPasswordValList.push(`${Object.keys(message)[0]} ${message.Passwords}`);
          break;
        default:
          console.error('Unhandled validation key:', Object.keys(message)[0]);
      }
    });

    setUsernameValidationMessages(replacementUsernameValList);
    setEmailValidationMessages(replacementEmailValList);
    setPasswordValidationMessages(replacementPasswordValList);
  };

  const hashPasswords = async (): Promise<void> => {
    const hashedPassword = CryptoES.SHA512(formInfo.password).toString();
    const hashedRepeatPassword = CryptoES.SHA512(formInfo.repeatPassword).toString();
    setFormInfo({ ...formInfo, password: hashedPassword, repeatPassword: hashedRepeatPassword });
  };

  const inputChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    inputName: string
  ): void => setFormInfo({ ...formInfo, [inputName]: event.target.value });

  return (
    <form autoComplete="off" onSubmit={(event): void => event.preventDefault()}>
      <div className={`${classes.InputWrapper} form-outline mb-4`}>
        <Input
          className={classes.AuthInput}
          onChange={(event: ChangeEvent<HTMLInputElement>): void =>
            inputChangedHandler(event, 'username')
          }
          errors={usernameValidationMessages}
          placeholder={'Username'}
          type={'text'}
        />

        <Input
          onChange={(event: ChangeEvent<HTMLInputElement>): void =>
            inputChangedHandler(event, 'email')
          }
          autoComplete="new-password"
          errors={emailValidationMessages}
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
          errors={passwordValidationMessages}
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
            onClick={(): void => {
              hashPasswords();
              setShouldSignup(true);
            }}
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
