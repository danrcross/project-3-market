import { Link } from "react-router-dom";
export default function OrderSummaryPage() {
  const sampProduct = {
    name: "Parsnips (1 Bushel)",
    price: 40,
    condition: "Fresh",
    seller: {
      name: "John Doe",
      rating: 4.7,
    },
  };
  const { name, price, condition, seller } = sampProduct;
  return (
    <>
      <header>
        <Link to="/home">Back</Link>
      </header>
      <h1>Order Summary</h1>
      <ul>
        {console.log(sampProduct.seller.name)}
        <li>Product: {name}</li>
        <li>Price: ${price}</li>
        <li>Condition: {condition}</li>
        <li>
          Seller: {seller.name} {`(${seller.rating})`}
        </li>
      </ul>
      <button>Place Order</button>
    </>
  );
}