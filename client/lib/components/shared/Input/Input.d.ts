import React from 'react';
interface IProps {
    className: string;
    id: string;
    onChange?(event: {
        target: {
            value: string;
        };
    }): void;
    type: string;
    placeholder: string;
}
declare const Input: React.FC<IProps>;
export default Input;
