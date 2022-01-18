import { Link } from 'react-router-dom';
import classes from './PageSwitch.module.scss';

const PageSwitch = (pageName: string): JSX.Element | null => {
  switch (pageName) {
    case 'privacy':
      return (
        <div className={classes.ContentWrapper}>
          <h1>
            <b>Privacy Policy at Criticker</b>
          </h1>

          <br />
          <h2>
            <b>Information Gathering</b>
          </h2>
          <span className={classes.ParagraphWrapper}>
            <p>
              On registration, Criticker asks for your email address, name, age, and country. Your email address is the
              only field which is required information, because it is necessary in case your password is lost. The other
              personal information is for building interesting statistics but is not required.
            </p>
          </span>
          <br />

          <h2>
            <b>Information Sharing</b>
          </h2>
          <span className={classes.ParagraphWrapper}>
            <p>
              Criticker.com will not share your email address, user name, ip address or other information that could be
              used to identify you, with any third party. We will not make your email address visible to other users.
            </p>
          </span>
          <br />

          <h2>
            <b>Emails from Criticker</b>
          </h2>
          <span className={classes.ParagraphWrapper}>
            <p>
              If you choose not to receive emails from Criticker about recommendations and new features, you will not
              receive any. Criticker may still send you emails when legally required to do so -- such as when there is a
              change to this privacy policy or information regarding your account.
            </p>
          </span>
          <br />
          <h2>
            <b>Cookies</b>
          </h2>
          <span className={classes.ParagraphWrapper}>
            <p>
              Criticker.com may set and update cookies on your computer, which allow us to remember your username and
              preferences which you set. Criticker will not set cookies with the intent of marketing.
            </p>
          </span>
          <span className={classes.ParagraphWrapper}>
            <p>
              Criticker.com uses a tool which collects requests for pages and passes elements of them to search engines
              to assist them in indexing this site. We control the configuration of the tool and are responsible for any
              information sent to the search engines.
            </p>
          </span>
          <br />

          <h2>
            <b>Advertising</b>
          </h2>
          <span className={classes.ParagraphWrapper}>
            <p>
              We use third-party advertising companies to serve ads when you visit our Web site. These companies may use
              aggregated information (not including your name, address, email address or telephone number) about your
              visits to this and other Web sites in order to provide advertisements about goods and services of interest
              to you. If you would like more information about this practice and to know your choices about not having
              this information used by these companies,{' '}
              <a href="http://www.networkadvertising.org/managing/opt_out.asp">click here.</a>
            </p>
          </span>
          <br />

          <h2>
            <b>Changes to this Policy</b>
          </h2>
          <span className={classes.ParagraphWrapper}>
            <p>Criticker may update this policy. We will notify you about any significant changes by email.</p>
          </span>
          <br />

          <h2>
            <b>Questions</b>
          </h2>
          <span className={classes.ParagraphWrapper}>
            <p>
              If you have any questions about this privacy policy, please send an email to{' '}
              <a href="mailto:info@criticker.com">info@criticker.com</a>. We will answer your question as soon as
              possible.
            </p>
          </span>
          <br />
        </div>
      );
    case 'abuse':
      return (
        <div className={classes.ContentWrapper}>
          <h1>
            <b>Abuse Policy</b>
          </h1>
          <br />

          <span className={classes.ParagraphWrapper}>
            <p>
              Criticker.com defines 'abuse' in mini-reviews as language which is mean-spirited and directed toward a
              group or individual. Examples of this include racism, homophobia and insulting language directed against
              another user.
            </p>
          </span>
          <br />

          <span className={classes.ParagraphWrapper}>
            <p>
              Should you believe to have found a mini-review that meets this definition of abuse, please send a notice
              to <a href="mailto:info@criticker.com">info@criticker.com</a> and we will deal with it. Corrective action
              may include removal of the offending mini-review, removal of all the offending user's mini-reviews and, in
              extreme cases, suspension of the offending user's account.
            </p>
          </span>
          <br />

          <span className={classes.ParagraphWrapper}>
            <p>
              It should be noted that foul language by itself doesn't constitute 'abuse' as we define it. Criticker
              strives to foster an open atmosphere and users are encouraged to type whatever they please, regardless of
              how 'colorful' the language. Keep in mind that we are the final judges of what meets our definition of
              abuse, and we're pretty lenient.
            </p>
          </span>
          <br />
        </div>
      );
    case 'contact':
      return (
        <div className={classes.ContentWrapper}>
          <h1>
            <b>Contact Us</b>
          </h1>
          <br />
          <h2>
            <b>General Information</b>
          </h2>
          <span className={classes.ParagraphWrapper}>
            <p>
              Do you have a question about the site, or a suggestion as to how we can improve it? Our ears are open!
              Please send an email to <a href="mailto:info@criticker.com">info@criticker.com</a> and we'll respond as
              quickly as possible.
            </p>
          </span>
          <br />
          <h2>
            <b>Are You a Critic?</b>
          </h2>
          <span className={classes.ParagraphWrapper}>
            <p>
              If your job is writing reviews, you can ask us to mark your account as 'Critic' -- this means you'll be
              able to supply links to full reviews on the website you represent, and receive extra traffic and exposure.
              If you're interested, send an email to <a href="mailto:info@criticker.com">info@criticker.com</a>.
            </p>
          </span>
          <br />
          <h2>
            <b>Support</b>
          </h2>
          <span className={classes.ParagraphWrapper}>
            <p>
              Please send any problems you encounter with Criticker to{' '}
              <a href="mailto:support@criticker.com">support@criticker.com</a>.
            </p>
          </span>
          <br />
          <h2>
            <b>Marketing</b>
          </h2>
          <span className={classes.ParagraphWrapper}>
            <p>
              Interesting in advertising with Criticker? Email us at
              <a href="mailto:marketing@criticker.com">marketing@criticker.com</a> to inquire about rates and
              opportunities.
            </p>
          </span>
          <br />
        </div>
      );
    case 'about':
      return (
        <div className={classes.ContentWrapper}>
          <h1>
            <b>About Criticker</b>
          </h1>
          <br />
          <h2>
            <b>Why We Exist</b>
          </h2>
          <span className={classes.ParagraphWrapper}>
            <p>
              We hated Shrek 2 and were shocked that nobody agreed with us. In vain, we searched for friends who shared
              our opinion: Shrek 2 was nothing more than unfunny puns strung together by slick and soulless animation.
              And that donkey is the most annoying character in cinema history.
            </p>
            <br />
            <p>
              But no! Shrek 2 was universally loved! Only with much hard work did we discover others who shared our
              vehemenence. They exist, those rare people with tastes similar to ours, and nowadays we listen closely to
              their opinions. The experience taught us that it's not enough to read reviews and talk with friends -- you
              get the best recommendations from the people whose tastes best match yours. The idea of Criticker and the
              TCI (Taste Compatibility Index) was born.
            </p>
          </span>
          <br />
          <h2>
            <b>Our Mission</b>
          </h2>
          <span className={classes.ParagraphWrapper}>
            <p>
              Criticker aims to match you with the people who share your taste most exactly. By using the Taste
              Compatibility Index (TCI), you can identify with whom you most agree, out of thousands. It's more than
              just recommendations: you're paired with the people whose tastes are most compatible with your own, and
              thus get the most accurate advice possible.
            </p>
          </span>
          <br />
          <span className={classes.ParagraphWrapper}>
            <p>
              We strive to make Criticker an open system. Although the calculations behind the TCI might only be
              interesting to a small group of geeks people, we make it available. You can see exactly why a certain user
              is in your top 10, or why a particular title was recommended. If you want, you can sit there with a pen
              and paper and do the math yourself (geek heaven!) Also, we're honest: Criticker will never push anything
              upon you -- if the math predicts that you'll hate a new blockbuster, that's what we'll tell you!
            </p>
          </span>
          <h2>
            <b>About the Creators</b>
          </h2>
          <span className={classes.ParagraphWrapper}>
            <p>
              Mike Powell and Juergen Horn are based in sunny Valencia, Spain (although neither of them is Spanish).
              They are also the creators of the Ebay-bargain site Lastminute-Auction.com, the entertainment blog Random
              Good Stuff.com and the travel blog For 91 Days. Want to know anything else about us, or the site? Please
              feel free to send us a message, and we'll answer as soon as we can.
            </p>
          </span>
          <br />
        </div>
      );
    case 'resources':
      return (
        <div className={classes.ContentWrapper}>
          <h1>
            <b>Resources & Tools</b>
          </h1>

          <br />
          <h2>
            <b>Submit a New Title</b>
          </h2>
          <span className={classes.ParagraphWrapper}>
            <p>
              Something missing from our database? Submit it using this form. Please note that new submissions usually
              take a few days to be approved.
            </p>
          </span>
          <Link to="/submissions">[Placeholder] Go to the Submission Form </Link>
          <br />
          <h2>
            <b>Import Your Scores</b>
          </h2>
          <span className={classes.ParagraphWrapper}>
            <p>
              Import ratings directly from IMDb into Criticker. With this simple upload tool, you can upload your
              ratings to Criticker. Tiers are kept intact, and imported ratings are added to a collection so that you
              can tweak and fine-tune the new ratings at your leisure.
            </p>
          </span>
          <Link to="/submissions">[Placeholder] Go to the Import Tool</Link>
          <br />
          <h2>
            <b>General Feeds</b>
          </h2>
          <p>
            <b>New Films at Criticker</b>
          </p>
          <span className={classes.ParagraphWrapper}>
            <p>[RSS goes here] The latest films which have been added to our database</p>
          </span>
          <p>
            <b>Criticker's Forums</b>
          </p>
          <span className={classes.ParagraphWrapper}>
            <p>
              Each of Criticker's forum topics has its own RSS feed. <Link to="/forum">Browse the forums now</Link> and
              subscribe to whichever ones you want!
            </p>
          </span>
          <br />
        </div>
      );
    case 'terms':
      return (
        <div className={classes.ContentWrapper}>
          <h1>
            <b>Terms & Conditions</b>
          </h1>
          <br />

          <h2>
            <b>General Terms</b>
          </h2>

          <span className={classes.ParagraphWrapper}>
            <p>
              Welcome to Criticker. If you continue to browse and use this website, you are agreeing to comply with and
              be bound by the following terms and conditions of use, which together with our privacy policy govern
              Criticker's relationship with you in relation to this website. If you disagree with any part of these
              terms and conditions, please do not use our website or register an account.
            </p>
          </span>
          <br />
          <span className={classes.ParagraphWrapper}>
            <p>
              The term 'Criticker' or 'us' or 'we' refers to the owner of the website. The term 'you' refers to the user
              or viewer of our website.
            </p>
          </span>
          <br />

          <span className={classes.ParagraphWrapper}>
            <p>The use of this website is subject to the following terms of use:</p>
          </span>
          <ul>
            <li>
              The content of Criticker is for your information and use only. It is subject to change without notice.
            </li>
            <li>
              We don't guarantee the absolute accuracy, performance, or completeness of the information found on
              Criticker. You acknowledge that the information, such as lists of actors and/or genres, may contain
              inaccuracies or errors.
            </li>
            <li>
              Criticker uses cookies to monitor browsing preferences. We do not sell or share information stored by
              cookies to any third parties. The type of information stored by cookies includes information about your
              usage of Criticker, and helps us present a better browsing experience. No sensitive personal information
              is stored in cookies.
            </li>
            <li>
              This website contains material which is owned by or licensed to us. This material includes, but is not
              limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited.
            </li>
            <li>Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offence.</li>
            <li>
              Unauthorized scraping or spidering of Criticker.com is strictly prohibited, as is any other automated
              method of gathering information or data-mining.
            </li>
            <li>
              Criticker includes links to other websites. These links are provided for advertising purposes, or to
              provide further information. They do not signify that we endorse the website(s). We have no responsibility
              for the content of the linked website(s).
            </li>
          </ul>
          <h2>Copyright and Data Usage</h2>
          <ul>
            <li>
              You own the mini-reviews and profile photos you post on Criticker. But by posting content on Criticker,
              you grant us a non-exclusive, transferable, sublicensable royalty-free, worldwide license to use that
              content (IP License). This IP License ends when you delete your content or your account.
            </li>
            <li>
              When you delete content, it is deleted in a manner similar to emptying the recycle bin on a computer.
              However, you understand that removed content may persist in backup copies for a reasonable period of time,
              but will not be available to others.
            </li>
            <li>
              When you publish a mini-review on Criticker, you are allowing everyone, including non-registered users of
              Criticker, to access and view that information, and to associate it with you (i.e., your profile name &
              picture).
            </li>
            <li>
              We appreciate your feedback or other suggestions about Criticker, but you understand that we may use them
              without any obligation to compensate you for them.
            </li>
          </ul>
          <h2>Questions</h2>
          <p>
            If you have any questions about these terms & conditions, please send an email to{' '}
            <a href="mailto:info@criticker.com">info@criticker.com</a>. We will answer your question as soon as
            possible.
          </p>
          <br />
        </div>
      );
    default:
      // eslint-disable-next-line no-throw-literal
      throw 'Invalid route';
  }
};

export default PageSwitch;
