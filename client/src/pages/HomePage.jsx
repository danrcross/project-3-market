import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
// import { useNavigate } from "react-router-dom";
import {
  GET_USER_PRODUCTS,
  GET_CURRENT_USER,
  GET_USER_WATCHLIST,
  GET_USER_COMMUNITIES,
  GET_OTHER_COMMUNITIES,
} from "../utils/queries";
import {
  UNWATCH_WATCHLIST_ITEM,
  LEAVE_COMMUNITY,
  DELETE_PRODUCT,
} from "../utils/mutations";
import DataBar from "../components/DataBar";
import ListButton from "../components/ListButton";
import MyProducts from "../components/MyProducts";
import MyCommunities from "../components/MyCommunities";
import Watchlist from "../components/Watchlist";
import Header from "../components/Header";
import Footer from "../components/Footer";
import OtherCommunities from "../components/OtherCommunities";

import sampPic from "../assets/images/profile-pic-sample.png";
// import {PRODUCTS} from '../utils/queries';


export default function HomePage() {
  // const navigate = useNavigate();
  const [openLists, setOpenLists] = useState({
    myproducts: false,
    mycommunities: false,
    watchlist: false,
  });
  const [profileImage, setProfileImage] = useState(""); 

  const { data: userData, loading: userLoading } = useQuery(GET_CURRENT_USER);
  console.log(userData);
  const [userID, setUserID] = useState("");

  const { data: productsData, loading: productsLoading } = useQuery(GET_USER_PRODUCTS, {
    variables: { userID },
    skip: !userID,
  });
  const { data: watchlistData, loading: watchlistLoading } = useQuery(GET_USER_WATCHLIST, {
    variables: { userID },
    skip: !userID,
  });
  const { data: communitiesData, loading: communitiesLoading } = useQuery(GET_USER_COMMUNITIES, {
    variables: { userID },
    skip: !userID,
  });
  const { data: otherCommunitiesData, loading: otherCommunitiesLoading } = useQuery(GET_OTHER_COMMUNITIES, {
    skip: !userID,
  });

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [{ query: GET_USER_PRODUCTS, variables: { userID } }],
  });
  const [UnwatchWatchlistItem] = useMutation(UNWATCH_WATCHLIST_ITEM, {
    refetchQueries: [{ query: GET_USER_WATCHLIST, variables: { userID } }],
  });
  const [leaveCommunity] = useMutation(LEAVE_COMMUNITY, {
    refetchQueries: [{ query: GET_USER_COMMUNITIES, variables: { userID } }],
  });

  useEffect(() => {
    if (userData && userData.currentUser) {
      setUserID(userData.currentUser._id);
      setProfileImage(userData.currentUser.image);
    }
  }, [userData]);

  
  if (userLoading || productsLoading || watchlistLoading || communitiesLoading || otherCommunitiesLoading)
    return <p>Loading...</p>;
  if (!userData || !userData.currentUser) return <p>Error loading user data</p>;
  
  const { currentUser } = userData;
  
  const handleDelete = async (id, type) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmation) {
      return;
    }
    try {
      if (type === "product") {
        await deleteProduct({ variables: { id } });
      } else if (type === "watchlist") {
        await UnwatchWatchlistItem({ variables: { id } });
      } else if (type === "community") {
        await leaveCommunity({ variables: { userId: currentUser._id, communityId: id } });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = (e) => {
    const { id } = e.target;
    setOpenLists((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  
  const productCount = productsData ? productsData.getUserProducts.length : 0;
  const watchlistCount = watchlistData
  ? watchlistData.getUserWatchlist.length
  : 0;
  const communityCount = communitiesData
  ? communitiesData.getUserCommunities.length
  : 0;
  
  const barData = [
    { id: "1", name: "Watchlist", value: watchlistCount },
    { id: "2", name: "My Products", value: productCount },
    { id: "3", name: "Communities", value: communityCount },
  ];
  
  return (
    <div className="homePage">
      <Header pageName="home" />
      <h1 className="pageTitle">{`${currentUser.firstName} ${currentUser.lastName}'s Home`}</h1>
      <div className="topBox">
        <DataBar barData={barData} />
        <img
          alt="profile-pic-home"
          className="profilePicHome"
          src={profileImage || sampPic}
          ></img>
      </div>
      <h3 className="lbContainer">
        <ListButton
          onClick={handleClick}
          openLists={openLists}
          id="myproducts"
        />
      </h3>
      {openLists.myproducts && (
        <MyProducts
          myProductData={productsData.getUserProducts}
          onDelete={(id) => handleDelete(id, "product")}
        />
      )}
      <h3 className="lbContainer">
        <ListButton
          onClick={handleClick}
          openLists={openLists}
          id="watchlist"
        />
      </h3>
      {openLists.watchlist && (
        <Watchlist
          watchlistData={watchlistData.getUserWatchlist}
          onDelete={(id) => handleDelete(id, "watchlist")}
        />
      )}
      <h3 className="lbContainer">
        <ListButton
          onClick={handleClick}
          openLists={openLists}
          id="mycommunities"
        />
      </h3>
      {openLists.mycommunities && (
        <div>
          <MyCommunities
            myCommunityData={communitiesData.getUserCommunities}
            onDelete={(id) => handleDelete(id, "community")}
          />
          <OtherCommunities
            otherCommunityData={otherCommunitiesData.getOtherCommunities}
            onDelete={(id) => handleDelete(id, "community")}
          />
        </div>
      )}
      <Footer />
    </div>
  );
}
