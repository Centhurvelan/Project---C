interface OrderCardData {
    id: number,
    image: any,
    price: number,
    quantity: number,
    purchasedDate: string

}
const Card = (props: OrderCardData) => {
    const { id, image, price, quantity, purchasedDate } = props

      
    return (
        <>
          <div className="col" key={id}>
            <div className="card h-100 shadow-sm">
              <img
                src={image}
                className="card-img-top"
                alt={`Order ${id}`}
                style={{ height: '180px', objectFit: 'cover' }}
              />
              <div className="card-body text-center">
                <p className="mb-1"><strong>Price :</strong> ₹ {price}</p>
                <p className="mb-1"><strong>Quantity :</strong> {quantity}</p>
                <p className="mb-1"><strong>Total :</strong> ₹ {price * quantity}</p>
                <p className="mb-0 mt-2 text-muted"><small>Purchased date</small></p>
                <p className="fw-bold text-primary">
                  {new Date(purchasedDate).toDateString()}
                </p>
              </div>
            </div>
          </div>
        </>
    );
}

export default Card;