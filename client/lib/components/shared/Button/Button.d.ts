import React from 'react';
interface IProps {
    className: string;
    disabled?: boolean;
    onClick?(): void;
    text?: string | JSX.Element;
}
declare const Button: React.FC<IProps>;
export default Button;
