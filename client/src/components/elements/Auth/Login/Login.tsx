import CryptoES from 'crypto-es';
import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { LOGIN } from '../../../../constants/endpoints';
import { modalState, userInfoState } from '../../../../store';
import HTTPRequest from '../../../../utils/httpRequest';
import Button from '../../../elements/Button/Button';
import Input from '../../../elements/Input/Input';
import Spinner from '../../Spinner/Spinner';
import ThirdPartyLogin from '../ThirdPartyLogin/ThirdPartyLogin';
import classes from './Login.module.scss';

interface IState {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const [formInfo, setFormInfo] = useState<IState>({});
  const [shouldLogin, setShouldLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const setShowModal = useSetRecoilState(modalState);
  const setUserInfo = useSetRecoilState(userInfoState);

  useEffect(() => {
    setSubmitDisabled(!formInfo.email || !formInfo.password);
  }, [formInfo]);

  useEffect(() => {
    const attemptLogin = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const userDetails = (await HTTPRequest(LOGIN, 'POST', formInfo)) as {
          username: string;
          UID: string;
        };

        setIsLoading(false);

        setUserInfo({
          ...userDetails,
          loggedIn: true,
          expiryDate: new Date().getTime() + 4 * 60 * 60
        });

        setShowModal(false);
      } catch (error) {
        console.error(error);
      }
    };

    if (shouldLogin) attemptLogin();
  }, [shouldLogin]);

  const inputChangedHandler = (eventValue: string, inputName: string): void =>
    setFormInfo({ ...formInfo, [inputName]: eventValue });

  const handleLoginAttempt = async (): Promise<void> => {
    const hashedPassword = CryptoES.SHA512(formInfo.password).toString();

    setFormInfo({ ...formInfo, password: hashedPassword });
    setShouldLogin(true);
  };

  const handlePlaceholderText = (type: string): string => {
    // @ts-expect-error type not required
    if (formInfo[type]) {
      return '';
    } else if (type === 'email') {
      return 'Email';
    } else {
      return 'Password';
    }
  };

  return (
    <form onSubmit={(event): void => event.preventDefault()}>
      <ThirdPartyLogin />

      <div className={`${classes.InputWrapper} form-outline mb-4`}>
        <Input
          autoComplete="new-password"
          onChange={(event: { target: { value: string } }): void =>
            inputChangedHandler(event.target.value!, 'email')
          }
          placeholder={handlePlaceholderText('email')}
          type={'email'}
        />
        <Input
          autoComplete="new-password"
          onChange={(event: { target: { value: string } }): void =>
            inputChangedHandler(event.target.value!, 'password')
          }
          placeholder={handlePlaceholderText('password')}
          type={'password'}
        />
      </div>

      {/* to do */}
      <div className={`${classes.PasswordOptions}`}>
        <a href="#!">Forgot password?</a>
      </div>

      <div className={classes.SubmitButtonWrapper}>
        <Button
          className={`${classes.SubmitButton} btn btn-primary btn-block mb-4`}
          disabled={submitDisabled}
          onClick={(): Promise<void> => handleLoginAttempt()}
          text={'Sign in'}
        />
        {isLoading ? <Spinner /> : null}
      </div>
    </form>
  );
};

export default Login;
