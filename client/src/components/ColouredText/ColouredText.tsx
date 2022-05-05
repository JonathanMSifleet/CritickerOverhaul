import { FC } from 'preact/compat';
import classes from './ColouredText.module.scss';

interface IProps {
  className?: string;
  colourGradient: string;
  text: string | number;
}

const ColouredText: FC<IProps> = ({ className, colourGradient, text }) => (
  <p className={`${classes.Text} ${className}`} style={{ backgroundColor: colourGradient }}>
    {text}
  </p>
);

export default ColouredText;
