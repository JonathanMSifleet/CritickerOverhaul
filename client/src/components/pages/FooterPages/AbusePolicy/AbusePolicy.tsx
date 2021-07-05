import React from 'react';
import PageView from '../../../hoc/PageLayout/PageView/PageView';
import classes from './AbusePolicy.module.scss';

const AbusePolicy: React.FC = () => {
  return (
    <PageView>
      <div className={classes.AbusePolicyWrapper}>
        <h1>
          <b>Abuse Policy</b>
        </h1>
        <br />

        <span className={classes.ParagraphWrapper}>
          <p>
            Criticker.com defines 'abuse' in mini-reviews as language which is
            mean-spirited and directed toward a group or individual. Examples of
            this include racism, homophobia and insulting language directed
            against another user.
          </p>
        </span>
        <br />

        <span className={classes.ParagraphWrapper}>
          <p>
            Should you believe to have found a mini-review that meets this
            definition of abuse, please send a notice to{' '}
            <a href="mailto:info@criticker.com">info@criticker.com</a> and we
            will deal with it. Corrective action may include removal of the
            offending mini-review, removal of all the offending user's
            mini-reviews and, in extreme cases, suspension of the offending
            user's account.
          </p>
        </span>
        <br />

        <span className={classes.ParagraphWrapper}>
          <p>
            It should be noted that foul language by itself doesn't constitute
            'abuse' as we define it. Criticker strives to foster an open
            atmosphere and users are encouraged to type whatever they please,
            regardless of how 'colorful' the language. Keep in mind that we are
            the final judges of what meets our definition of abuse, and we're
            pretty lenient.
          </p>
        </span>
        <br />
      </div>
    </PageView>
  );
};

export default AbusePolicy;
