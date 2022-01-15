import React from 'react';
interface IProps {
    checked?: boolean;
    className: string;
    onChange?(event: React.ChangeEvent<HTMLInputElement>): string | boolean | void;
    placeholder?: string;
    type: string;
    value?: boolean;
}
declare const Input: React.FC<IProps>;
export default Input;
