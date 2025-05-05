import axios from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import useCartStore from "./useCartStore";
// import CartSidebar from "./CartSidebar";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import { TestContext } from "../../../State/Function/Main";
import CartStrip from "./CartSidebar";
import { Box } from "@mui/material";


function RestaurantMenu() {
  const authToken = useAuthToken();
  const user = UserProfile().getCurrentUser();
  const { _id } = useParams();
  const [menudata, setMenudata] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({ veg: true, nonVeg: true });
  const [errorMessage, setErrorMessage] = useState("");
  const [favorites, setFavorites] = useState({});
  const [likedItems, setLikedItems] = useState([]);
  const [showLiked, setShowLiked] = useState(false);
  const userId = user._id;
  const [frequentlyOrderedItems, setFrequentlyOrderedItems] = useState([]);
  const { cart, addToCart, increment, decrement } = useCartStore();

  const { handleAlert } = useContext(TestContext);

  const fetchList = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/menu/items/${_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        }
      );

      if (response.data.success) {
        setMenudata(response.data.data);
        setErrorMessage("");
      } else {
        setErrorMessage("Vendor Not Added Any Items.");
        setMenudata([]);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch menu items";
      setErrorMessage(message);
      console.error(error);
    }
  }, [_id, authToken]);

  const fetchLikedItems = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/likedItem`,
        {
          params: {
            userId,
            vendorId: _id,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        }
      );

      if (response.data.success) {
        const likedItems = response.data.data.map((item) => item.itemName);
        setFavorites((prev) =>
          likedItems.reduce((acc, item) => ({ ...acc, [item]: true }), prev)
        );
        setLikedItems(likedItems);
      }
    } catch (error) {
      console.error("Error fetching liked items:", error);
      toast.error("Failed to fetch liked items.");
    }
  }, [userId, _id, authToken]);

  useEffect(() => {
    fetchList();
    fetchLikedItems();
  }, [fetchList, fetchLikedItems]);

  const fetchFrequentlyOrderedItems = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/frequentlyordered/${userId}/${_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        }
      );

      if (response.data.success) {
        setFrequentlyOrderedItems(response.data.data);
        console.log("FrequentlyOrdered", response.data.data);
      } else {
        setFrequentlyOrderedItems([]);
        toast.error("No frequently ordered items found.");
      }
    } catch (error) {
      console.error("Error fetching frequently ordered items:", error);
    }
  }, [userId, _id, authToken]);

  useEffect(() => {
    fetchFrequentlyOrderedItems();
  }, [fetchFrequentlyOrderedItems]);

  const toggleFavorite = async (itemName, isFavorite) => {
    try {
      if (isFavorite) {
        const response = await axios.delete(
          `${process.env.REACT_APP_API}/route/likedItem/unlike`,
          {
            data: { userId, itemName, vendorId: _id },
            headers: {
              "Content-Type": "application/json",
              Authorization: authToken,
            },
          }
        );

        if (response.data.success) {
          setFavorites((prev) => ({ ...prev, [itemName]: false }));
          toast.success("Item unliked successfully!");
          fetchLikedItems();
        } else {
          toast.error("Failed to update favorite: " + response.data.message);
        }
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_API}/route/likedItem/like`,
          {
            userId,
            itemName,
            vendorId: _id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: authToken,
            },
          }
        );

        if (response.data.success) {
          setFavorites((prev) => ({ ...prev, [itemName]: true }));
          toast.success("Item liked successfully!");
          fetchLikedItems();
        } else {
          toast.error("Failed to update favorite: " + response.data.message);
        }
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Error while updating favorite status.";
      toast.error(message);
    }
  };

  const filteredMenu = menudata.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      (item.isVeg && filter.veg) || (!item.isVeg && filter.nonVeg);
    return matchesSearch && matchesFilter;
  });

  return (
<BoxComponent>
 
<div className="flex flex-wrap justify-between items-center ">
  {/* Heading and Subheading */}
  <div className="flex flex-col">
    <h1 className="lg:text-2xl sm:text-lg text-base font-sans leading-none text-gray-700 font-semibold">
      Restaurant Menu
    </h1>
    <p className="text-gray-500 tracking-tight">Explore Our Delicious Offerings</p>
  </div>

  {/* Search Box and Filters */}
  <div className="flex flex-wrap items-center space-x-6">
    {/* Search Box */}
    <div className="relative w-40 sm:w-56">
      <input
        type="text"
        placeholder="Search menu..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-3 pl-10 pr-4 text-sm border border-gray-300 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
      />
      <div className="absolute left-4 top-3 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx={10} cy={10} r={7} />
          <line x1={21} y1={21} x2={15} y2={15} />
        </svg>
      </div>
    </div>

    {/* Filters */}
    <div className="flex items-center space-x-4">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={filter.veg}
          onChange={() => setFilter((prev) => ({ ...prev, veg: !prev.veg }))}
          className="w-5 h-5 border-2 border-gray-300 rounded-full checked:bg-green-500 transition duration-200"
        />
        <span className="text-md text-gray-700 font-medium">Veg</span>
      </label>
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={filter.nonVeg}
          onChange={() => setFilter((prev) => ({ ...prev, nonVeg: !prev.nonVeg }))}
          className="w-5 h-5 border-2 border-gray-300 rounded-full checked:bg-red-500 transition duration-200"
        />
        <span className="text-md text-gray-700 font-medium">Non-Veg</span>
      </label>
    </div>

    {/* Show Favorites */}
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setShowLiked((prev) => !prev)}
        className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full text-red-600 hover:bg-red-200 transition-all duration-300 transform hover:scale-110"
      >
        {showLiked ? "❤️" : "🤍"}
      </button>
      <span className="text-md text-gray-700 font-medium">
        {showLiked ? "Hide Favorites" : "Show Favorites"}
      </span>
    </div>
  </div>
</div>
 
 
 
  {/* Liked Items Section */}
  {showLiked && (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Liked Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {likedItems.length > 0 ? (
          likedItems.map((itemName) => {
            const item = menudata.find((i) => i.name === itemName);
            return item ? (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-lg p-4 flex flex-col transition-transform transform hover:scale-105 relative"
              >
                <div className="absolute top-2 left-2 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-1 px-3 rounded-lg shadow-md">
                  ₹{item?.price}
                </div>
                <img
                  src={item?.image}
                  alt={item?.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h2 className="font-bold text-xl mb-2 text-gray-800">{item?.name}</h2>
                <p className="text-gray-500 mb-4">
                  Preparation Time: {item.preparationTime} min
                </p>
                <div className="flex justify-around pb-3 items-center mb-2">
                  <button
                    onClick={() => toggleFavorite(item.name, true)}
                    className="text-red-600"
                  >
                    ❤️
                  </button>
                  <div className="flex items-center">
                    <button
                     onClick={() => decrement(item._id)}
                      className="bg-red-600 text-white rounded-l-lg px-3"
                    >
                      -
                    </button>
                    <span className="px-4">{cart[item._id]?.count || 0}</span>
                    <button
                      onClick={() => increment(item._id, item.maxQuantity, handleAlert)}
                      className="bg-blue-600 text-white rounded-r-lg px-3"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => addToCart(item)}
                  className="mt-auto bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition duration-200"
                >
                  Add to Cart
                </button>
              </div>
            ) : null;
          })
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No liked items available.
          </div>
        )}
      </div>
    </div>
  )}

  {/* Menu Items Section */}
  <div className="mt-8">
    {/* <h2 className="text-2xl font-bold mb-4">Menu Items</h2> */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {filteredMenu.length > 0 ? (
        filteredMenu.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-lg shadow-lg p-4 flex flex-col transition-transform transform hover:scale-105 relative"
          >
            <div className="absolute top-2 left-2 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-1 px-3 rounded-lg shadow-md">
              ₹{item.price.toFixed(2)}
            </div>
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
            <p className="text-gray-600 mb-2">
              Preparation Time: {item.preparationTime} min
            </p>
            <div className="flex justify-around pb-3 items-center mb-2">
              <button
                onClick={() =>
                  toggleFavorite(item.name, favorites[item.name])
                }
                className="text-red-600"
              >
                {favorites[item.name] ? "❤️" : "🤍"}
              </button>
              <div className="flex items-center">
                <button
                  onClick={() => decrement(item._id)}
                  className="bg-red-600 text-white rounded-l-lg px-3"
                >
                  -
                </button>
                <span className="px-4">{cart[item._id]?.count || 0}</span>
                <button
                  onClick={() =>  increment(item, item.maxQuantity, handleAlert)}

                  className="bg-blue-600 text-white rounded-r-lg px-3"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() => addToCart(item, handleAlert)}
              className="mt-auto bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition duration-200"
            >
              Add to Cart
            </button>
          </div>
        ))
      ) : (
        <div className="col-span-1 text-center py-4 text-gray-500">
          {errorMessage || "No menu items available."}
        </div>
      )}
    </div>
  </div>

  {/* Frequently Ordered Items Section */}
  {frequentlyOrderedItems.length > 0 && (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Frequently Ordered Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {frequentlyOrderedItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-lg shadow-lg p-4 flex flex-col transition-transform transform hover:scale-105 relative"
          >
            <div className="absolute top-2 left-2 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-1 px-3 rounded-lg shadow-md">
              ₹{item.price}
            </div>
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h3 className="font-bold text-xl mb-2 text-gray-800">{item.name}</h3>
            <p className="text-gray-500 mb-4">
              Preparation Time: {item.preparationTime} min
            </p>
            <button
              onClick={() => addToCart(item)}
              className="mt-auto bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition duration-200"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )}
  
  <Box sx={{ mt: cart && Object.keys(cart).length > 0 ? "5%" : "0" }}>
    <CartStrip />
  </Box>

</BoxComponent>

  );
}

export default RestaurantMenu;
