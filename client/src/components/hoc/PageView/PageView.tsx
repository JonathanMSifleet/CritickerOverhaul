import { MDBCol, MDBContainer, MDBRow } from 'mdb-react-ui-kit';
import { FC, ReactNode } from 'react';
import Footer from '../../hoc/PageView/Footer/Footer';
import Header from '../../hoc/PageView/Header/Header';
import classes from './PageView.module.scss';

interface IProps {
  children?: ReactNode;
  backgroundCSS?: string;
}

const PageView: FC<IProps> = ({ children, backgroundCSS }): JSX.Element => (
  <MDBContainer fluid className={classes.PageViewContainer}>
    <Header />
    <MDBRow className={classes.Row}>
      <MDBCol className={classes.Column} md="2" />
      <MDBCol className={`${classes.Body} ${backgroundCSS}`} md="8">
        {children}
      </MDBCol>
      <MDBCol className={classes.Column} md="2" />
    </MDBRow>
    <Footer />
  </MDBContainer>
);

export default PageView;
