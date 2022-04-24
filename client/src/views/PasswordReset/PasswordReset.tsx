import * as endpoints from '../../constants/endpoints';
import { FC } from 'preact/compat';
import { Link } from 'preact-router';
// @ts-expect-error no declaration file
import { SHA512 } from 'crypto-es/lib/sha512.js';
import { useEffect, useState } from 'preact/hooks';
import { validateValue } from '../../../../shared/functions/validationFunctions';
import Alert from '../../components/Alert/Alert';
import Button from '../../components/Button/Button';
import classes from './PasswordReset.module.scss';
import httpRequest from '../../utils/httpRequest';
import Input from '../../components/Input/Input';
import PageView from '../../hoc/PageView/PageView';
import SpinnerButton from '../../components/SpinnerButton/SpinnerButton';

interface IFormInfo {
  password: string;
  repeatPassword: string;
}

interface IUrlParams {
  emailAddress?: string;
  path?: string;
  token?: string;
}

const PasswordReset: FC<IUrlParams> = ({ emailAddress, token }) => {
  const [formInfo, setFormInfo] = useState<IFormInfo>();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValMessages, setPasswordValMessages] = useState<string[]>([]);
  const [updateStatus, setUpdateStatus] = useState(null as null | string);

  useEffect(() => {
    (async (): Promise<void> => {
      if (formInfo === undefined) return;

      let messages = (await validateValue(formInfo!.password!, 'Password')) as string[];
      messages = messages.filter((error) => error !== null);

      if (formInfo!.password !== formInfo!.repeatPassword) messages.push('Passwords do not match');

      setPasswordValMessages(messages);
    })();
  }, [formInfo]);

  const inputChangedHandler = (value: string, inputName: string): void =>
    setFormInfo({ ...formInfo!, [inputName]: value });

  const updatePassword = async (): Promise<void> => {
    setIsLoading(true);

    try {
      const hashedPassword = SHA512(formInfo!.password).toString();

      const result = await httpRequest(`${endpoints.UPDATE_PASSWORD}/${emailAddress}/${token}`, 'PUT', undefined, {
        password: hashedPassword
      });
      result.statusCode === 204 ? setUpdateStatus('success') : setUpdateStatus(result.message);
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = async (value: string): Promise<void> => {
    let messages = (await validateValue(value, 'Password')) as string[];
    messages = messages.filter((error) => error !== null);

    setPasswordValMessages(messages);
  };

  return (
    <PageView backgroundCSS={classes.PageWrapper}>
      <div className={classes.FormWrapper}>
        <p className={classes.Instructions}>Please enter your new password:</p>
        <div className={classes.Form}>
          <Input
            errors={passwordValMessages}
            onChange={(event): void => {
              inputChangedHandler(event.target.value, 'password');
              validatePassword(event.target.value);
            }}
            placeholder={'New password'}
            type={'password'}
          />

          <div className={classes.RepeatPasswordWrapper}>
            <Input
              onChange={(event): void => {
                inputChangedHandler(event.target.value, 'repeatPassword');
              }}
              placeholder={'Repeat password'}
              type={'password'}
            />
          </div>
        </div>

        {updateStatus === 'success' ? (
          <>
            <p className={classes.SuccessStatus}>Successfully updated password</p>
            <Link className={classes.HomeLink} href={'/'}>
              Home page
            </Link>
          </>
        ) : updateStatus ? (
          <div className={classes.EmailStatus}>
            <Alert text={updateStatus!} type={'warning'} />
            <Alert text={"Please go to login, and resubmit the 'forgot password' form"} type={'warning'} />

            <div className={classes.HomeLinkWrapper}>
              <Link href={'/'}>Home</Link>
            </div>
          </div>
        ) : null}

        {!isLoading ? (
          updateStatus && updateStatus !== 'success' ? null : (
            <Button
              disabled={passwordValMessages.length !== 0 || updateStatus === 'success'}
              onClick={updatePassword}
              text={'Submit'}
            />
          )
        ) : (
          <SpinnerButton />
        )}
      </div>
    </PageView>
  );
};

export default PasswordReset;
