
import React, { FC, useState } from 'react';
// import { InputText } from 'primereact/inputtext';
// import { classNames } from 'primereact/utils';

interface inputData {
    id: string;
    name:string;
    onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
    onBlur ?: React.FocusEventHandler<HTMLInputElement> | undefined;
    type:string;
    value?:string;
    placeholder:string;
    min:string|undefined
}

const Inputs: FC<inputData> = ({id,name,onChange,type,value,placeholder,onBlur,min})=> {
    return ( 
       <>
        <input 
        name={name}
        id={id}
        onChange={onChange}
        type={type}
        value={value}
        placeholder={placeholder}
        onBlur={onBlur}
        min={min}
         />
        
       </>
     );
};
 
export default Inputs;