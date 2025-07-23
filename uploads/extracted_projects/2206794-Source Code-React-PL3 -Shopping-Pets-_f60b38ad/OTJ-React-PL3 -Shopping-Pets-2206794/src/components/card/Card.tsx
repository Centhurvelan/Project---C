import { useState } from "react";
import { toast } from 'react-toastify';
import Image from "../image/image";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import Button from "../button/button";

interface CardData {
  id: string,
  image: any,
  price: string,

}
const Card = (props: CardData) => {
  const { id, image, price } = props
  const [quantities, setQuantities] = useState<string>("0");
  const user = useSelector((state: RootState) => state.auth.user);

  const handleQuantityChange = (value: string) => {
    setQuantities(value);
  };

  const handleShopNow = async (id: string) => {

    if (!id || parseInt(id) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    const data = {
      "imgUrl": image,
      "price": price,
      "count": quantities,
      "userId": user.email,
      "purchased_date": new Date().toDateString(),
    };

    try {
      const response = await fetch("http://localhost:3002/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("POST Success:", result);
      toast.success('Order Placed successfully!');
    } catch (error) {
      console.error("POST Error:", error);
      toast.error('Something went worng');
    }

    // Add to cart logic can go here
  };

  return (
    <>
      <div className="col" key={id}>
        <div className="card h-100 shadow-sm">
          <Image src={image} className="card-img-top" style={{ height: '180px', objectFit: 'cover' }} />
          <div className="card-body text-center">
            <p className="card-text fw-bold">Price : ₹ {price}</p>
            <input
              type="number"
              min="0"
              className="form-control mb-2"
              value={quantities || ''}
              onChange={(e) => handleQuantityChange(e.target.value)}
            />
            <Button
              className="btn btn-success w-100"
              onClick={() => handleShopNow(quantities)}
              label="Shop Now"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Card;