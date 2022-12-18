import { FC } from 'preact/compat';

interface IProps {
  checked?: boolean;
  label: string;
  // @ts-expect-error Preact doesn't have a type for this
  onClick: React.MouseEventHandler<HTMLInputElement>;
}

const Toggle: FC<IProps> = ({ checked, label, onClick }) => (
  <div onClick={onClick} className="form-check form-switch">
    <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={checked} />
    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
      {label}
    </label>
  </div>
);

export default Toggle;
