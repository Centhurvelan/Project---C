

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Button from "../../components/button/button";

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { loginUser } from '../../redux/actions/authActions';
import { ToastContainer, toast } from 'react-toastify';
import Label from "../../components/label/Label";
import { RootState } from "../../redux/store";
import { useEffect } from "react";

// Validation schema
const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(3, 'Password must be at least 6 characters').required('Password is required')
});


const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dogs');
      return;
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: any) => {

    const success = await dispatch<any>(loginUser(data));
    if (success) {

      toast.success('Logged In Successfully!!!!');
      setTimeout(() => navigate("/dogs"), 1000)
    } else {
      toast.error('Invalid username or password');
    }
  };


  return (
    <>

      <div className="login-container">
        <div className="login-box">
          <h2>Login</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* <label>Email<span className="required">*</span></label> */}
            <Label title="Email" name="" htmlFor="" star="*" className="" />
            <input {...register("email")} placeholder="Email" />
            {errors.email && <p className="error">{errors.email.message}</p>}

            <Label title="Password" name="" htmlFor="" star="*" className="" />
            <input type="password" {...register("password")} placeholder="Password" />
            {errors.password && <p className="error">{errors.password.message}</p>}


            <Button label="Login" type="submit" className="" />
            <Link to={"/register"} className="signup-link">Sign up</Link>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;