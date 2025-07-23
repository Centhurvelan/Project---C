
import React, { FC } from 'react';
interface labelData {
    name: string|undefined;
    htmlFor:string|undefined,
    star:string|undefined,
    className:string|undefined,
    title:string
}
const Label:FC<labelData> = ({name,htmlFor,star,className,title}) => {
    return (
        <>
            <label className={className}>{title}{star?<span className="required">{star}</span>:""}</label>
        </>
    );
};

export default Label;