


import React, { FC } from 'react';

const Loader: FC = () => {
    return (
        <>
            <div className="text-center " style={{margin:"200px"}}>
                <div className="spinner-border" role="status">
                    <span className="sr-only"></span>
                </div>
            </div>
        </>
    );
};

export default Loader;