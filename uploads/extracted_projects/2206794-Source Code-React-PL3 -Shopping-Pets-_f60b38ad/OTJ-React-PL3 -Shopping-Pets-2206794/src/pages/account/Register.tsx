import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/button/button";

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { API_BASE_URL } from '../../config/constants';
import Label from "../../components/label/Label";
import { ToastContainer, toast } from 'react-toastify';
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

// Validation schema
const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(3, 'Password must be at least 6 characters').required('Password is required')
});


const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dogs');
      return;
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users?email=${data.email}`);
      const existingUsers = await res.json();

      if (existingUsers.length > 0) {
        toast.error("Email is already registered.");
        return;
      }

      // Register the new user
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        toast.success("Registration successful. Please login Now!");
        setTimeout(() => {
          navigate("/login")
        }, 2000);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-box">
          <h2>Register</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Label title="First Name" name="" htmlFor="" star="*" className="" />
            <input {...register("firstName")} placeholder="First name" />
            {errors.firstName && <p className="error">{errors.firstName.message}</p>}

            <Label title="Last Name" name="" htmlFor="" star="*" className="" />
            <input {...register("lastName")} placeholder="Last name" />
            {errors.lastName && <p className="error">{errors.lastName.message}</p>}

            <Label title="Email" name="" htmlFor="" star="*" className="" />
            <input {...register("email")} placeholder="Email" />
            {errors.email && <p className="error">{errors.email.message}</p>}

            <Label title="Password" name="" htmlFor="" star="*" className="" />
            <input type="password" {...register("password")} placeholder="Password" />
            {errors.password && <p className="error">{errors.password.message}</p>}

            <Button label="Register" type="submit" className="" />
            <p className="login-link">Already have an account?<span>  <Link to={"/login"} >Sign in  </Link></span></p>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Register;