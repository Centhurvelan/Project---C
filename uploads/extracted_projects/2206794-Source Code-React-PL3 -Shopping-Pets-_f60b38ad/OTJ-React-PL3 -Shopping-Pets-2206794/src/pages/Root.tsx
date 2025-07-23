import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
const Header = React.lazy(() => { return import('./layout/Header'); });

const Root = () => {
    const location = useLocation();
    const [isFound, setIsFound] = useState(true)

    useEffect(() => {
        console.log(location);
        switch (location.pathname) {
            case '/login':
                setIsFound(false)
                break;
            case '/':
                setIsFound(false)
                break;
            case '/register':
                setIsFound(false)
                break;
            default:
                setIsFound(true)
                break;
        }

    }, [location.pathname])

    return (
        <>

            {isFound ?
                <Header />
                : ""
            }
            <div className=''>
                <Outlet />
            </div>
        </>
    );
};

export default Root;