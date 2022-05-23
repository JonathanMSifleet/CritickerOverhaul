import * as endpoints from '../../../constants/endpoints';
import { authModalState } from '../../../store';
import { FC } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';
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
  const [emailValMessages, setEmailValMessages] = useState([] as string[]);
  const [formInfo, setFormInfo] = useState<IState>({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValMessages, setPasswordValMessages] = useState([] as string[]);
  const [shouldSignup, setShouldSignup] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [usernameValMessages, setUsernameValMessages] = useState([] as string[]);
  const setShowModal = useSetRecoilState(authModalState);

  useEffect(() => {
    let submittable = true;

    if (
      !formInfo.email ||
      !formInfo.password ||
      !formInfo.repeatPassword ||
      !formInfo.termsChecked ||
      !formInfo.username
    )
      submittable = false;

    if (emailValMessages.length !== 0 || passwordValMessages.length !== 0 || usernameValMessages.length !== 0)
      submittable = false;

    setSubmitDisabled(!submittable);
  }, [formInfo]);

  // when hashing the password client-side, React does not update the
  // state until the next render-cycle, by using useEffect, a new render
  // cycle is called, updating the state to store the hashed password,
  // so that when it is POSTed to the server, the password is hashed
  useEffect(() => {
    if (shouldSignup)
      (async (): Promise<void> => {
        setIsLoading(true);

        try {
          const result = await httpRequest(endpoints.SIGNUP, 'POST', undefined, {
            email: formInfo.email,
            password: SHA512(formInfo.password).toString(),
            termsChecked: formInfo.termsChecked,
            username: formInfo.username
          });
          if (result.statusCode === 422) throw new Error(result.message);

          alert('Account created successfully, please check your emails to verify your account');
          setShowModal(false);
        } catch (error) {
          handleValidationMessage(extractValidationMessages(error as string));
        } finally {
          setShouldSignup(false);
          setIsLoading(false);
        }
      })();
  }, [shouldSignup]);

  useEffect(() => {
    (async (): Promise<void> => {
      let messages = (await validateInput(formInfo.email!, 'Email')) as string[];
      messages = messages.filter((error) => error !== null);

      setEmailValMessages(messages);
    })();
  }, [formInfo.email]);

  useEffect(() => {
    (async (): Promise<void> => {
      let messages = (await validateInput(formInfo.password!, 'Password')) as string[];
      messages = messages.filter((error) => error !== null);

      if (formInfo.password !== formInfo.repeatPassword) messages.push('Passwords do not match');

      setPasswordValMessages(messages);
    })();
  }, [formInfo.password, formInfo.repeatPassword]);

  useEffect(() => {
    (async (): Promise<void> => {
      let messages = (await validateInput(formInfo.username!, 'Username')) as string[];
      messages = messages.filter((error) => error !== null);

      setUsernameValMessages(messages);
    })();
  }, [formInfo.username]);

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

    setUsernameValMessages(replacementUsernameValList);
    setEmailValMessages(replacementEmailValList);
  };

  const inputChangedHandler = (value: string, inputName: string): void =>
    setFormInfo({ ...formInfo, [inputName]: value });

  return (
    <>
      <div className={`${classes.InputWrapper} form-outline mb-4`}>
        <Input
          autoComplete="off"
          className={classes.Input}
          errors={usernameValMessages}
          onChange={(event): void => inputChangedHandler(event.target.value, 'username')}
          placeholder={'Username'}
          type={'text'}
        />

        <Input
          autoComplete="email"
          className={classes.Input}
          errors={emailValMessages}
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
          value={formInfo.repeatPassword}
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
    </>
  );
};

export default SignUp;
