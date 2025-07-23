// src/pages/pets/Birds.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../../config/constants';
import Card from '../../components/card/Card';

const Birds: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [Birds, setBirds] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to access this page');
      navigate('/login');
      return;
    }

    fetch(`${API_BASE_URL}/Birds`)
      .then(res => res.json())
      .then(data => setBirds(data))
      .catch(err => toast.error('Failed to load Birds list'));
  }, [isAuthenticated, navigate]);


  return (
    <>
      <div className="container mt-5">
        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-6 g-4">
          {Birds.map((dog) => (
            <Card 
            id={dog.id}
            image={dog.image}
            price={dog.price}
            />
          ))}
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default Birds;
