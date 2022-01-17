interface IProps {
  className: string;
  disabled?: boolean;
  onClick?(): void;
  text?: string | JSX.Element;
}

const Button: React.FC<IProps> = ({ className, disabled, onClick, text }) => (
  <button className={className} disabled={disabled} onClick={onClick}>
    {text}
  </button>
);

export default Button;
