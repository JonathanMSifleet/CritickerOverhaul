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
import extractValidationMessages from './../../../../utils/extractValidationMessages';
import classes from './Signup.module.scss';

interface IState {
  email?: string;
  password?: string;
  repeatPassword?: string;
  username?: string;
  termsChecked?: boolean;
}

const SignUp: React.FC = () => {
  const [emailValidationMessages, setEmailValidationMessages] = useState([] as string[]);
  const [formInfo, setFormInfo] = useState<IState>({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValidationMessages, setPasswordValidationMessages] = useState([] as string[]);
  const [shouldSignup, setShouldSignup] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [usernameValidationMessages, setUsernameValidationMessages] = useState([] as string[]);
  const setShowModal = useSetRecoilState(modalState);

  useEffect(
    () =>
      setSubmitDisabled(
        !formInfo.email ||
          !formInfo.password ||
          !formInfo.repeatPassword ||
          !formInfo.username ||
          !formInfo.termsChecked
      ),
    [formInfo]
  );

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

      setIsLoading(false);
    };

    // stop POSTing unnecessary attribute
    delete formInfo!.repeatPassword;

    if (shouldSignup) attemptSignup();
  }, [shouldSignup]);

  const handleValidationMessage = (valMessages: { [key: string]: string }[]): void => {
    valMessages.forEach((message) => {
      switch (Object.keys(message)[0]) {
        case 'Username':
          const replacementUsernameValList = usernameValidationMessages;
          replacementUsernameValList.push(message.Username);
          setUsernameValidationMessages(replacementUsernameValList);
          break;
        case 'Email':
          const replacementEmailValList = emailValidationMessages;
          replacementEmailValList.push(message.Email);
          setEmailValidationMessages(replacementEmailValList);
          break;
        default:
          console.error('Unhandled validation key:', Object.keys(message)[0]);
      }
    });
  };

  const handleSignupAttempt = async (): Promise<void> => {
    if (formInfo.password !== formInfo.repeatPassword) {
      const replacementPasswordValList = passwordValidationMessages;
      replacementPasswordValList.push('Passwords do not match');
      setPasswordValidationMessages(replacementPasswordValList);
      return;
    }

    const hashedPassword = CryptoES.SHA512(formInfo.password).toString();

    setFormInfo({ ...formInfo, password: hashedPassword });
    setShouldSignup(true);
  };

  const inputChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    inputName: string
  ): void => setFormInfo({ ...formInfo, [inputName]: event.target.value });

  const checkboxHandler = (event: React.ChangeEvent<HTMLInputElement>): void =>
    setFormInfo({ ...formInfo, termsChecked: event.target.checked });

  return (
    <form autoComplete="off" onSubmit={(event): void => event.preventDefault()}>
      <div className={`${classes.InputWrapper} form-outline mb-4`}>
        <Input
          className={classes.AuthInput}
          onChange={(event: ChangeEvent<HTMLInputElement>): void =>
            inputChangedHandler(event, 'username')
          }
          placeholder={'Username'}
          type={'text'}
        />
        {usernameValidationMessages.length > 0
          ? usernameValidationMessages.map((message: string) => (
              <li key={message} className={`${classes.ValidationText} text-danger`}>
                Username {message}
              </li>
            ))
          : null}

        <Input
          autoComplete="new-password"
          onChange={(event: ChangeEvent<HTMLInputElement>): void =>
            inputChangedHandler(event, 'email')
          }
          placeholder={'Email'}
          type={'email'}
        />
        {emailValidationMessages.length > 0
          ? emailValidationMessages.map((message: string) => (
              <li key={message} className={`${classes.ValidationText} text-danger`}>
                Email {message}
              </li>
            ))
          : null}

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
        {passwordValidationMessages.length > 0
          ? passwordValidationMessages.map((message: string) => (
              <li key={message} className={`${classes.ValidationText} text-danger`}>
                {message}
              </li>
            ))
          : null}
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
