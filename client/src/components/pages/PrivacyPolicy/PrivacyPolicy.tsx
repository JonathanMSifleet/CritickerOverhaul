import React from 'react';
import PageView from '../../hoc/PageLayout/PageView/PageView';
import classes from './PrivacyPolicy.module.scss';

const PrivacyPolicy: React.FC = () => {
  return (
    <PageView>
      <div className={classes.PrivacyPolicyWrapper}>
        <h1>
          <b>Privacy Policy at Criticker</b>
        </h1>

        <br />
        <h2>
          <b>Information Gathering</b>
        </h2>
        <span className={classes.ParagraphWrapper}>
          <p>
            On registration, Criticker asks for your email address, name, age,
            and country. Your email address is the only field which is required
            information, because it is necessary in case your password is lost.
            The other personal information is for building interesting
            statistics but is not required.
          </p>
        </span>
        <br />

        <h2>
          <b>Information Sharing</b>
        </h2>
        <span className={classes.ParagraphWrapper}>
          <p>
            Criticker.com will not share your email address, user name, ip
            address or other information that could be used to identify you,
            with any third party. We will not make your email address visible to
            other users.
          </p>
        </span>
        <br />

        <h2>
          <b>Emails from Criticker</b>
        </h2>
        <span className={classes.ParagraphWrapper}>
          <p>
            If you choose not to receive emails from Criticker about
            recommendations and new features, you will not receive any.
            Criticker may still send you emails when legally required to do so
            -- such as when there is a change to this privacy policy or
            information regarding your account.
          </p>
        </span>
        <br />
        <h2>
          <b>Cookies</b>
        </h2>
        <span className={classes.ParagraphWrapper}>
          <p>
            Criticker.com may set and update cookies on your computer, which
            allow us to remember your username and preferences which you set.
            Criticker will not set cookies with the intent of marketing.
          </p>
        </span>
        <span className={classes.ParagraphWrapper}>
          <p>
            Criticker.com uses a tool which collects requests for pages and
            passes elements of them to search engines to assist them in indexing
            this site. We control the configuration of the tool and are
            responsible for any information sent to the search engines.
          </p>
        </span>
        <br />

        <h2>
          <b>Advertising</b>
        </h2>
        <span className={classes.ParagraphWrapper}>
          <p>
            We use third-party advertising companies to serve ads when you visit
            our Web site. These companies may use aggregated information (not
            including your name, address, email address or telephone number)
            about your visits to this and other Web sites in order to provide
            advertisements about goods and services of interest to you. If you
            would like more information about this practice and to know your
            choices about not having this information used by these companies,{' '}
            <a href="http://www.networkadvertising.org/managing/opt_out.asp">
              click here.
            </a>
          </p>
        </span>
        <br />

        <h2>
          <b>Changes to this Policy</b>
        </h2>
        <span className={classes.ParagraphWrapper}>
          <p>
            Criticker may update this policy. We will notify you about any
            significant changes by email.
          </p>
        </span>
        <br />

        <h2>
          <b>Questions</b>
        </h2>
        <span className={classes.ParagraphWrapper}>
          <p>
            If you have any questions about this privacy policy, please send an
            email to <a href="mailto:info@criticker.com">info@criticker.com</a>
            .We will answer your question as soon as possible.
          </p>
        </span>
      </div>
    </PageView>
  );
};

export default PrivacyPolicy;
