import React, { Suspense, useEffect } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useDispatch } from 'react-redux';
import { loginUser } from './redux/actions/authActions';
import Loader from './components/loader/Loader';

const Router = React.lazy(() => import('./pages/routes/PageRouter'))

function App() {

    const dispatch = useDispatch();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      let user = JSON.parse(storedUser);
       dispatch<any>(loginUser({email:user.email, password:user.password}));
    }
  }, []);

  return (
    <>
      <Suspense fallback={<Loader />}>
        <Router />
      </Suspense>
    </>
  );
}

export default App;
