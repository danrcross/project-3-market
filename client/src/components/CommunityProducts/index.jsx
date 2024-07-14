import { Link } from "react-router-dom";
function CommunityProducts({ commProductData }) {
  return (
    <div className="communityProductsList">
      {commProductData.map((item) => (
        <div key={item.id}>
          <Link to={`/products/${item.id}`}>
            <div>
              <h4>{item.product}</h4>
              <ul>
                <li>Price: ${item.price}</li>
                <li>Condition: {item.condition}</li>
                <li>
                  Seller: {item.seller.name} {`(${item.seller.rating})`}
                </li>
              </ul>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default CommunityProducts;