import React from 'react';
import PageSwitch from '../../../utils/PageSwitch/PageSwitch';
import PageView from '../../hoc/PageLayout/PageView/PageView';

interface IProps {
  pageName: string;
}

const SimplePage: React.FC<IProps> = ({ pageName }) => {
  return <PageView>{PageSwitch(pageName)}</PageView>;
};

export default SimplePage;
