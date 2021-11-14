import React from 'react';
interface IProps {
    checked?: boolean;
    className: string;
    onChange?(event: {
        target: {
            value: string;
        };
    }): void;
    placeholder?: string;
    type: string;
}
declare const Input: React.FC<IProps>;
export default Input;
