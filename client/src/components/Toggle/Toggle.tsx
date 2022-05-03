import { FC } from 'preact/compat';

interface IProps {
  checked?: boolean;
  label: string;
  onClick: (event: any) => void;
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
