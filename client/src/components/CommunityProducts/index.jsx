import { Link } from "react-router-dom";
import { useState } from "react";
import { PlusCircledIcon } from "@radix-ui/react-icons";
function CommunityProducts({ commProductData }) {
  const [moreBtn, setMoreBtn] = useState(false);

  const moreBtnOpen = () => {
    setMoreBtn(!moreBtn);
  };
  return (
    <div className="communityProductsList">
      {commProductData.map((item, i) => {
        // ensures that, if the moreBtn value is false (initial, closed value),
        // the .map() function will only return the first item.
        // conversely, if the moreBtn is true, .map() will iterate through whole array (it is OK if i>0) (show all items)
        if (!moreBtn && i > 0) {
          return null;
        }
        return (
          <div key={item.id} className="prodSection">
            <Link to={`/products/${item.id}`}>
              <div className="prodCard">
                <div className="prodData">
                  <h4>{item.product}</h4>
                  <ul className="prodDataList">
                    <li>Price: ${item.price}</li>
                    <li>Condition: {item.condition}</li>
                    <li>
                      Seller: {item.seller.name} {`(${item.seller.rating})`}
                    </li>
                  </ul>
                </div>
                <div className="prodImgDiv">
                  <img alt={`item-${item.id}-img`} src={item.image} />
                </div>
              </div>
            </Link>
            <div className="prodOptions">
              <a>
                <PlusCircledIcon className="editIcon greenIcon" />
              </a>
            </div>
          </div>
        );
      })}
      <div className="btnsDiv">
        <div className="underListBtns">
          <button onClick={moreBtnOpen}>
            {!moreBtn ? `Show more...` : `Show less...`}
          </button>
          <button>+ Add New Product</button>
        </div>
        <span className="listBtnSpacer"></span>
      </div>
    </div>
  );
}

export default CommunityProducts;
