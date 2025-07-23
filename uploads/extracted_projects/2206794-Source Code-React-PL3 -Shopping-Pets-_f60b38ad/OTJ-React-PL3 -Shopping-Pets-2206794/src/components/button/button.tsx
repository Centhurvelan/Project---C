import React, { FC } from 'react';

interface ButtonData {
    label: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
    type?: 'submit' | 'button' | 'reset' | undefined;
    className: string
}
const Button: FC<ButtonData> = (props) => {
    const { label, onClick, type, className } = props
    return (
        <button onClick={onClick} type={type} className={className} >{label}</button>
    );
};

export default Button;