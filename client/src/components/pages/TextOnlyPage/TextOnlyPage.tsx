import PageView from '../../hoc/PageView/PageView';
import PageSwitch from './PageSwitch/PageSwitch';

interface IProps {
  pageName: string;
}

const TextOnlyPage: React.FC<IProps> = ({ pageName }) => (
  <PageView>{PageSwitch(pageName)}</PageView>
);

export default TextOnlyPage;
