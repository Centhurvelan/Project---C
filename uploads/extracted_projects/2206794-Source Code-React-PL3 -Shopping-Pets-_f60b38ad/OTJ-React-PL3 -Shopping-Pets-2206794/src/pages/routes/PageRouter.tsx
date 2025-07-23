import React from 'react';
import { Route, Routes } from 'react-router-dom';


const Root = React.lazy(() => { return import('../Root'); });
const Dogs = React.lazy(() => { return import('../pets/Dogs'); });
const Birds = React.lazy(() => { return import('../pets/Birds'); });
const Login = React.lazy(() => { return import('../account/Login'); });
const Register = React.lazy(() => { return import('../account/Register'); });
const Order = React.lazy(() => { return import('../orders/Order') });




const PageRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Root />}>
                <Route path="" element={<Login />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="dogs" element={<Dogs />} />
                <Route path="birds" element={<Birds />} />
                <Route path="order" element={<Order />} />
            </Route>
        </Routes>


    );
};

export default PageRouter;