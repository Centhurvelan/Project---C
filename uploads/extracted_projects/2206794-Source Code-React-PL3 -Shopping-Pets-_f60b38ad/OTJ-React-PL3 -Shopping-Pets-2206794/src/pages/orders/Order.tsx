import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../config/constants';
import OrderCard from '../../components/card/OrderCard';

interface Order {
  id: number;
  imgUrl: string;
  userId:string;
  price: number;
  count: number;
  purchased_date: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to access this page');
      navigate('/login');
      return;
    }

    fetch(`${API_BASE_URL}/orders?userId=${user.email}`)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => toast.error('Failed to load orders list'));
  }, [isAuthenticated, navigate]);

  return (
    <div className="container mt-5">
      <div className="row row-cols-1 row-cols-md-3 row-cols-lg-6 g-4">
        {orders.map((order) => (
          <OrderCard
          id={order.id}
          image={order.imgUrl}
          price={order.price}
          quantity={order.count}
          purchasedDate={order.purchased_date}
          />
        ))}
      </div>
    </div>
  );
};

export default Orders;
