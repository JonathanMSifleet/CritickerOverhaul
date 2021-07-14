import React from 'react';
import PageSwitch from './PageSwitch/PageSwitch';
import PageView from '../../hoc/PageLayout/PageView/PageView';

interface IProps {
  pageName: string;
}

const TextOnlyPage: React.FC<IProps> = ({ pageName }) => {
  return <PageView>{PageSwitch(pageName)}</PageView>;
};

export default TextOnlyPage;