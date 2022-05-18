import * as endpoints from '../../../constants/endpoints';
import { authModalState } from '../../../store';
import { FC, useEffect, useState } from 'react';
// @ts-expect-error no declaration file
import { SHA512 } from 'crypto-es/lib/sha512.js';
import { useSetRecoilState } from 'recoil';
import { validateInput } from '../../../../../shared/functions/validationFunctions';
import Button from '../../Button/Button';
import Checkbox from '../../Checkbox/Checkbox';
import classes from './Signup.module.scss';
import extractValidationMessages from '../../../utils/extractValidationMessages';
import httpRequest from '../../../utils/httpRequest';
import Input from '../../Input/Input';
import SpinnerButton from '../../SpinnerButton/SpinnerButton';

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
  const [passwordValMessages, setPasswordValMessages] = useState([] as string[]);
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
          formInfo.password = SHA512(formInfo.password).toString();

          const result = await httpRequest(endpoints.SIGNUP, 'POST', undefined, formInfo);
          if (result.statusCode === 422) throw new Error(result.message);

          alert('Account created successfully, please check your emails to verify your account');
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

  useEffect(() => {
    (async (): Promise<void> => {
      let messages = (await validateInput(formInfo.password!, 'Password')) as string[];
      messages = messages.filter((error) => error !== null);

      if (formInfo.password !== formInfo.repeatPassword) messages.push('Passwords do not match');

      setPasswordValMessages(messages);
    })();
  }, [formInfo.password, formInfo.repeatPassword]);

  const checkboxHandler = (value: boolean): void => setFormInfo({ ...formInfo, termsChecked: value });

  const handleValidationMessage = (valMessages: { [key: string]: string }[]): void => {
    const replacementEmailValList: string[] = [];
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
        default:
          console.error('Unhandled validation key:', validationKey);
          console.error('Validation message:', message);
      }
    });

    setUsernameValidationMessages(replacementUsernameValList);
    setEmailValidationMessages(replacementEmailValList);
  };

  const inputChangedHandler = (value: string, inputName: string): void =>
    setFormInfo({ ...formInfo, [inputName]: value });

  return (
    <form autoComplete="off" onSubmit={(event): void => event.preventDefault()}>
      <div className={`${classes.InputWrapper} form-outline mb-4`}>
        <Input
          autoComplete="username"
          className={classes.Input}
          errors={usernameValidationMessages}
          onChange={(event): void => inputChangedHandler(event.target.value, 'username')}
          placeholder={'Username'}
          type={'text'}
        />

        <Input
          autoComplete="email"
          className={classes.Input}
          errors={emailValidationMessages}
          onChange={(event): void => inputChangedHandler(event.target.value, 'email')}
          placeholder={'Email'}
          type={'email'}
        />

        <Input
          autoComplete="new-password"
          className={classes.Input}
          errors={passwordValMessages}
          onChange={(event): void => {
            inputChangedHandler(event.target.value, 'password');
          }}
          placeholder={'Password'}
          type={'password'}
        />

        <Input
          className={classes.Input}
          onChange={(event): void => {
            inputChangedHandler(event.target.value, 'repeatPassword');
          }}
          placeholder={'Repeat password'}
          type={'password'}
        />
      </div>

      <div className={classes.TermsConditionsWrapper}>
        <label>
          <Checkbox
            onChange={(event): void => checkboxHandler(event.target.checked)}
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
