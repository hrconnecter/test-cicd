// import React, { useCallback, useEffect, useState } from "react";
// import axios from "axios";
// import UserProfile from "../../../hooks/UserData/useUser";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

// const CouponManager = () => {
 
//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();
//   const authToken = useAuthToken();
//   const vendorId = user._id;
//   const [coupons, setCoupons] = useState([]);
//   const [selectedCoupon, setSelectedCoupon] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     code: "",
//     discountType: "",
//     discountValue: "",
//     expirationDate: "",
//     termsAndConditions: "",
//     description: "",
//   });

//   // Define fetchCoupons using useCallback to memoize the function
//   const fetchCoupons = useCallback(async () => {
//     if (!vendorId) return; // Prevent fetching if vendorId is not available
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/coupon/vendor/${vendorId}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       setCoupons(response.data.data);
//     } catch (error) {
//       console.error("Failed to fetch coupons:", error);
//     }
//   }, [vendorId, authToken]); // Include vendorId and authToken in dependencies

//   // Fetch coupons when vendorId changes
//   useEffect(() => {
//     fetchCoupons();
//   }, [fetchCoupons]); // Include fetchCoupons in dependency array

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleUpdate = async (id) => {
//     try {
//       await axios.put(
//         `${process.env.REACT_APP_API}/route/coupon/${id}`,
//         { ...formData, vendorId },
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       fetchCoupons();
//       setSelectedCoupon(null);
//     } catch (error) {
//       console.error("Failed to update coupon:", error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${process.env.REACT_APP_API}/route/coupon/${id}`, {
//         headers: {
//           Authorization: authToken,
//         },
//       });
//       fetchCoupons();
//     } catch (error) {
//       console.error("Failed to delete coupon:", error);
//     }
//   };

//   const handleSelectCoupon = (coupon) => {
//     setSelectedCoupon(coupon);
//     setFormData({
//       name: coupon.name,
//       code: coupon.code,
//       discountType: coupon.discountType,
//       discountValue: coupon.discountValue,
//       expirationDate: coupon.expirationDate.split("T")[0],
//       termsAndConditions: coupon.termsAndConditions,
//       description: coupon.description,
//     });
//   };

//   const handleCancel = () => {
//     setSelectedCoupon(null);
//     setFormData({
//       name: "",
//       code: "",
//       discountType: "",
//       discountValue: "",
//       expirationDate: "",
//       termsAndConditions: "",
//       description: "",
//     });
//   };

//   return (


// <BoxComponent>
// <HeadingOneLineInfo heading={"Coupon List"}  info={"Manage your coupons for your vendor here."}/>


// <div className="max-w-2xl mx-auto p-4">
 
//   {coupons.length === 0 ? (
//    <div className="text-gray-500 text-center mt-4 p-4 bg-gray-100 rounded-md shadow-md">
//    <p className="text-lg font-semibold">🎉 No Coupons Available</p>
//    <p className="text-sm text-gray-400 mt-1">
//      Start adding amazing offers for your customers today!
//    </p>
//  </div>
 
//   ) : (
//     <ul className="bg-white rounded-lg shadow-md mt-4 divide-y divide-gray-200">
//        {/* <h2 className="mt-6 text-xl font-semibold">Available Coupons</h2> */}
//       {coupons.map((coupon) => (
//         <li
//           key={coupon._id}
//           className="flex justify-between items-center p-4 hover:bg-gray-100 transition duration-200"
//         >
//           <div className="flex flex-col">
//             <span className="font-semibold text-lg text-gray-800">{coupon.name}</span>
//             <span className="text-gray-500">{coupon.code}</span>
//           </div>
//           <div className="flex space-x-2">
//             <button
//               onClick={() => handleSelectCoupon(coupon)}
//               className="text-blue-600 hover:bg-blue-100 rounded-md px-2 py-1 transition duration-150"
//             >
//               Edit
//             </button>
//             <button
//               onClick={() => handleDelete(coupon._id)}
//               className="text-red-600 hover:bg-red-100 rounded-md px-2 py-1 transition duration-150"
//             >
//               Delete
//             </button>
//           </div>
//         </li>
//       ))}
//     </ul>
//   )}
// </div>


// {selectedCoupon && (
//   <div className="mt-6 bg-white rounded-lg shadow-md p-4">
//     <h3 className="text-lg font-semibold mb-4">Edit Coupon</h3>
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         handleUpdate(selectedCoupon._id);
//       }}
//     >
//       <div className="grid grid-cols-1 gap-4">
//         <input
//           type="text"
//           name="name"
//           value={formData.name}
//           onChange={handleInputChange}
//           placeholder="Coupon Name"
//           className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//           required
//         />
//         <input
//           type="text"
//           name="code"
//           value={formData.code}
//           onChange={handleInputChange}
//           placeholder="Coupon Code"
//           className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//           required
//         />
//         <select
//           name="discountType"
//           value={formData.discountType}
//           onChange={handleInputChange}
//           className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//           required
//         >
//           <option value="">Select Discount Type</option>
//           <option value="percentage">Percentage</option>
//           <option value="fixed">Fixed Amount</option>
//           <option value="free_shipping">Free Shipping</option>
//         </select>
//         <input
//           type="number"
//           name="discountValue"
//           value={formData.discountValue}
//           onChange={handleInputChange}
//           placeholder="Discount Value"
//           className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//           required
//         />
//         <input
//           type="date"
//           name="expirationDate"
//           value={formData.expirationDate}
//           onChange={handleInputChange}
//           className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//           required
//         />
//         <textarea
//           name="termsAndConditions"
//           value={formData.termsAndConditions}
//           onChange={handleInputChange}
//           placeholder="Terms and Conditions"
//           className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//         />
//         <textarea
//           name="description"
//           value={formData.description}
//           onChange={handleInputChange}
//           placeholder="Description"
//           className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//         />
//       </div>
//       <div className="flex justify-center space-x-4 mt-6">
//         <button
//           type="submit"
//           className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
//         >
//           Update Coupon
//         </button>
//         <button
//           type="button"
//           onClick={handleCancel}
//           className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   </div>
// )}

// </BoxComponent>
//   );
// };

// export default CouponManager;






// import React, { useCallback, useEffect, useState } from "react";
// import axios from "axios";
// import UserProfile from "../../../hooks/UserData/useUser";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

// const CouponManager = () => {
 
//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();
//   const authToken = useAuthToken();
//   const vendorId = user._id;
//   const [coupons, setCoupons] = useState([]);
//   const [selectedCoupon, setSelectedCoupon] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     code: "",
//     discountType: "",
//     discountValue: "",
//     expirationDate: "",
//     termsAndConditions: "",
//     description: "",
//   });

//   // Define fetchCoupons using useCallback to memoize the function
//   const fetchCoupons = useCallback(async () => {
//     if (!vendorId) return; // Prevent fetching if vendorId is not available
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/coupon/vendor/${vendorId}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       setCoupons(response.data.data);
//     } catch (error) {
//       console.error("Failed to fetch coupons:", error);
//     }
//   }, [vendorId, authToken]); // Include vendorId and authToken in dependencies

//   // Fetch coupons when vendorId changes
//   useEffect(() => {
//     fetchCoupons();
//   }, [fetchCoupons]); // Include fetchCoupons in dependency array

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleUpdate = async (id) => {
//     try {
//       await axios.put(
//         `${process.env.REACT_APP_API}/route/coupon/${id}`,
//         { ...formData, vendorId },
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       fetchCoupons();
//       setSelectedCoupon(null);
//     } catch (error) {
//       console.error("Failed to update coupon:", error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${process.env.REACT_APP_API}/route/coupon/${id}`, {
//         headers: {
//           Authorization: authToken,
//         },
//       });
//       fetchCoupons();
//     } catch (error) {
//       console.error("Failed to delete coupon:", error);
//     }
//   };

//   const handleSelectCoupon = (coupon) => {
//     setSelectedCoupon(coupon);
//     setFormData({
//       name: coupon.name,
//       code: coupon.code,
//       discountType: coupon.discountType,
//       discountValue: coupon.discountValue,
//       expirationDate: coupon.expirationDate.split("T")[0],
//       termsAndConditions: coupon.termsAndConditions,
//       description: coupon.description,
//     });
//   };

//   const handleCancel = () => {
//     setSelectedCoupon(null);
//     setFormData({
//       name: "",
//       code: "",
//       discountType: "",
//       discountValue: "",
//       expirationDate: "",
//       termsAndConditions: "",
//       description: "",
//     });
//   };

//   return (


// <BoxComponent>
//   <HeadingOneLineInfo heading="Coupon List" info="Manage your coupons for your vendor here." />

//   <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
//     {coupons.length === 0 ? (
//       <div className="text-center bg-gradient-to-r from-blue-100 to-blue-50 p-6 rounded-lg shadow-sm">
//         <p className="text-2xl font-bold text-blue-600">🎉 No Coupons Available</p>
//         <p className="text-sm text-blue-500 mt-2">Start adding amazing offers for your customers today!</p>
//       </div>
//     ) : (
//       <div className="mt-4">
//         <h2 className="text-xl font-bold text-gray-800 mb-4">Available Coupons</h2>
//         <ul className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
//           {coupons.map((coupon) => (
//             <li
//               key={coupon._id}
//               className="flex justify-between items-center p-4 hover:bg-gray-100 transition duration-200"
//             >
//               <div className="flex flex-col">
//                 <span className="text-lg font-semibold text-gray-800">{coupon.name}</span>
//                 <span className="text-sm text-gray-500">{coupon.code}</span>
//               </div>
//               <div className="flex space-x-3">
//                 <button
//                   onClick={() => handleSelectCoupon(coupon)}
//                   className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md transition"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(coupon._id)}
//                   className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md transition"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     )}

//     {selectedCoupon && (
//       <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
//         <h3 className="text-lg font-bold text-gray-800 mb-4">Edit Coupon</h3>
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleUpdate(selectedCoupon._id);
//           }}
//         >
//           <div className="grid grid-cols-1 gap-4">
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               placeholder="Coupon Name"
//               className="border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-400 transition"
//               required
//             />
//             <input
//               type="text"
//               name="code"
//               value={formData.code}
//               onChange={handleInputChange}
//               placeholder="Coupon Code"
//               className="border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-400 transition"
//               required
//             />
//             <select
//               name="discountType"
//               value={formData.discountType}
//               onChange={handleInputChange}
//               className="border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-400 transition"
//               required
//             >
//               <option value="">Select Discount Type</option>
//               <option value="percentage">Percentage</option>
//               <option value="fixed">Fixed Amount</option>
//               <option value="free_shipping">Free Shipping</option>
//             </select>
//             <input
//               type="number"
//               name="discountValue"
//               value={formData.discountValue}
//               onChange={handleInputChange}
//               placeholder="Discount Value"
//               className="border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-400 transition"
//               required
//             />
//             <input
//               type="date"
//               name="expirationDate"
//               value={formData.expirationDate}
//               onChange={handleInputChange}
//               className="border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-400 transition"
//               required
//             />
//             <textarea
//               name="termsAndConditions"
//               value={formData.termsAndConditions}
//               onChange={handleInputChange}
//               placeholder="Terms and Conditions"
//               className="border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-400 transition"
//             />
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               placeholder="Description"
//               className="border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-400 transition"
//             />
//           </div>
//           <div className="flex justify-between space-x-4 mt-6">
//             <button
//               type="submit"
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
//             >
//               Update Coupon
//             </button>
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     )}
//   </div>
// </BoxComponent>

//   );
// };

// export default CouponManager;




// import React, { useCallback, useEffect, useState } from "react";
// import axios from "axios";
// import UserProfile from "../../../hooks/UserData/useUser";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import ReusableModal from "../../../components/Modal/component";


// const CouponManager = () => {
//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();
//   const authToken = useAuthToken();
//   const vendorId = user._id;
//   const [coupons, setCoupons] = useState([]);
//   const [selectedCoupon, setSelectedCoupon] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     code: "",
//     discountType: "",
//     discountValue: "",
//     expirationDate: "",
//     termsAndConditions: "",
//     description: "",
//   });

//   const fetchCoupons = useCallback(async () => {
//     if (!vendorId) return;
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/coupon/vendor/${vendorId}`,
//         {
//           headers: { Authorization: authToken },
//         }
//       );
//       setCoupons(response.data.data);
//     } catch (error) {
//       console.error("Failed to fetch coupons:", error);
//     }
//   }, [vendorId, authToken]);

//   useEffect(() => {
//     fetchCoupons();
//   }, [fetchCoupons]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleUpdate = async (id) => {
//     try {
//       await axios.put(
//         `${process.env.REACT_APP_API}/route/coupon/${id}`,
//         { ...formData, vendorId },
//         {
//           headers: { Authorization: authToken },
//         }
//       );
//       fetchCoupons();
//       handleCloseModal();
//     } catch (error) {
//       console.error("Failed to update coupon:", error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${process.env.REACT_APP_API}/route/coupon/${id}`, {
//         headers: { Authorization: authToken },
//       });
//       fetchCoupons();
//     } catch (error) {
//       console.error("Failed to delete coupon:", error);
//     }
//   };

//   const handleSelectCoupon = (coupon) => {
//     setSelectedCoupon(coupon);
//     setFormData({
//       name: coupon.name,
//       code: coupon.code,
//       discountType: coupon.discountType,
//       discountValue: coupon.discountValue,
//       expirationDate: coupon.expirationDate.split("T")[0],
//       termsAndConditions: coupon.termsAndConditions,
//       description: coupon.description,
//     });
//     setModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setSelectedCoupon(null);
//     setFormData({
//       name: "",
//       code: "",
//       discountType: "",
//       discountValue: "",
//       expirationDate: "",
//       termsAndConditions: "",
//       description: "",
//     });
//   };

//   return (
//     <BoxComponent>
//       <HeadingOneLineInfo heading="Coupon List" info="Manage your coupons for your vendor here." />
//       <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
//         {coupons.length === 0 ? (
//           <div className="text-center bg-gradient-to-r from-blue-100 to-blue-50 p-6 rounded-lg shadow-sm">
//             <p className="text-2xl font-bold text-blue-600">🎉 No Coupons Available</p>
//             <p className="text-sm text-blue-500 mt-2">Start adding amazing offers for your customers today!</p>
//           </div>
//         ) : (
//           <div className="mt-4">
//             <h2 className="text-xl font-bold text-gray-800 mb-4">Available Coupons</h2>
//             <ul className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
//               {coupons.map((coupon) => (
//                 <li
//                   key={coupon._id}
//                   className="flex justify-between items-center p-4 hover:bg-gray-100 transition duration-200"
//                 >
//                   <div className="flex flex-col">
//                     <span className="text-lg font-semibold text-gray-800">{coupon.name}</span>
//                     <span className="text-sm text-gray-500">{coupon.code}</span>
//                   </div>
//                   <div className="flex space-x-3">
//                     <button
//                       onClick={() => handleSelectCoupon(coupon)}
//                       className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md transition"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(coupon._id)}
//                       className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md transition"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>

//       <ReusableModal
//         open={modalOpen}
//         onClose={handleCloseModal}
//         heading="Edit Coupon"
//         subHeading={selectedCoupon && `Editing: ${selectedCoupon.name}`}
//       >
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleUpdate(selectedCoupon._id);
//           }}
//         >
//           <div className="grid grid-cols-1 gap-4">
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               placeholder="Coupon Name"
//               className="border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-400 transition"
//               required
//             />
//             <input
//               type="text"
//               name="code"
//               value={formData.code}
//               onChange={handleInputChange}
//               placeholder="Coupon Code"
//               className="border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-400 transition"
//               required
//             />
//             <select
//               name="discountType"
//               value={formData.discountType}
//               onChange={handleInputChange}
//               className="border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-400 transition"
//               required
//             >
//               <option value="">Select Discount Type</option>
//               <option value="percentage">Percentage</option>
//               <option value="fixed">Fixed Amount</option>
//               <option value="free_shipping">Free Shipping</option>
//             </select>
//             <input
//               type="number"
//               name="discountValue"
//               value={formData.discountValue}
//               onChange={handleInputChange}
//               placeholder="Discount Value"
//               className="border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-400 transition"
//               required
//             />
//             <input
//               type="date"
//               name="expirationDate"
//               value={formData.expirationDate}
//               onChange={handleInputChange}
//               className="border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-400 transition"
//               required
//             />
//             <textarea
//               name="termsAndConditions"
//               value={formData.termsAndConditions}
//               onChange={handleInputChange}
//               placeholder="Terms and Conditions"
//               className="border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-400 transition"
//             />
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               placeholder="Description"
//               className="border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-400 transition"
//             />
//           </div>
//           <div className="flex justify-between space-x-4 mt-6">
//             <button
//               type="submit"
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
//             >
//               Update Coupon
//             </button>
//             <button
//               type="button"
//               onClick={handleCloseModal}
//               className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </ReusableModal>
//     </BoxComponent>
//   );
// };

// export default CouponManager;



// import React, { useCallback, useEffect, useState } from "react";
// import axios from "axios";
// import UserProfile from "../../../hooks/UserData/useUser";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import ReusableModal from "../../../components/Modal/component";


// const CouponManager = () => {
//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();
//   const authToken = useAuthToken();
//   const vendorId = user._id;
//   const [coupons, setCoupons] = useState([]);
//   const [selectedCoupon, setSelectedCoupon] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     code: "",
//     discountType: "",
//     discountValue: "",
//     expirationDate: "",
//     termsAndConditions: "",
//     description: "",
//   });

//   const fetchCoupons = useCallback(async () => {
//     if (!vendorId) return;
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/coupon/vendor/${vendorId}`,
//         {
//           headers: { Authorization: authToken },
//         }
//       );
//       setCoupons(response.data.data);
//     } catch (error) {
//       console.error("Failed to fetch coupons:", error);
//     }
//   }, [vendorId, authToken]);

//   useEffect(() => {
//     fetchCoupons();
//   }, [fetchCoupons]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleUpdate = async (id) => {
//     try {
//       await axios.put(
//         `${process.env.REACT_APP_API}/route/coupon/${id}`,
//         { ...formData, vendorId },
//         {
//           headers: { Authorization: authToken },
//         }
//       );
//       fetchCoupons();
//       handleCloseModal();
//     } catch (error) {
//       console.error("Failed to update coupon:", error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${process.env.REACT_APP_API}/route/coupon/${id}`, {
//         headers: { Authorization: authToken },
//       });
//       fetchCoupons();
//     } catch (error) {
//       console.error("Failed to delete coupon:", error);
//     }
//   };

//   const handleSelectCoupon = (coupon) => {
//     setSelectedCoupon(coupon);
//     setFormData({
//       name: coupon.name,
//       code: coupon.code,
//       discountType: coupon.discountType,
//       discountValue: coupon.discountValue,
//       expirationDate: coupon.expirationDate.split("T")[0],
//       termsAndConditions: coupon.termsAndConditions,
//       description: coupon.description,
//     });
//     setModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setSelectedCoupon(null);
//     setFormData({
//       name: "",
//       code: "",
//       discountType: "",
//       discountValue: "",
//       expirationDate: "",
//       termsAndConditions: "",
//       description: "",
//     });
//   };

//   return (
//     <BoxComponent>
//       <HeadingOneLineInfo heading="Coupon List" info="Manage your coupons for your vendor here." />
//       <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
//         {coupons.length === 0 ? (
//           <div className="text-center bg-gradient-to-r from-blue-100 to-blue-50 p-6 rounded-lg shadow-sm">
//             <p className="text-2xl font-bold text-blue-600">🎉 No Coupons Available</p>
//             <p className="text-sm text-blue-500 mt-2">Start adding amazing offers for your customers today!</p>
//           </div>
//         ) : (
//           <div className="mt-4">
//             <h2 className="text-xl font-bold text-gray-800 mb-4">Available Coupons</h2>
//             <ul className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
//               {coupons.map((coupon) => (
//                 <li
//                   key={coupon._id}
//                   className="flex justify-between items-center p-4 hover:bg-gray-50 transition duration-200"
//                 >
//                   <div className="flex flex-col">
//                     <span className="text-lg font-semibold text-gray-800">{coupon.name}</span>
//                     <span className="text-sm text-gray-500">{coupon.code}</span>
//                   </div>
//                   <div className="flex space-x-3">
//                     <button
//                       onClick={() => handleSelectCoupon(coupon)}
//                       className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md shadow transition"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(coupon._id)}
//                       className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md shadow transition"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>

//       <ReusableModal
//         open={modalOpen}
//         onClose={handleCloseModal}
//         heading="Edit Coupon"
//         subHeading={selectedCoupon && `Editing: ${selectedCoupon.name}`}
//       >
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleUpdate(selectedCoupon._id);
//           }}
//         >
//           <div className="grid grid-cols-1 gap-4">
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               placeholder="Coupon Name"
//               className="border-gray-300 rounded-lg w-full p-3 shadow-sm focus:ring-2 focus:ring-blue-400 transition"
//               required
//             />
//             <input
//               type="text"
//               name="code"
//               value={formData.code}
//               onChange={handleInputChange}
//               placeholder="Coupon Code"
//               className="border-gray-300 rounded-lg w-full p-3 shadow-sm focus:ring-2 focus:ring-blue-400 transition"
//               required
//             />
//             <select
//               name="discountType"
//               value={formData.discountType}
//               onChange={handleInputChange}
//               className="border-gray-300 rounded-lg w-full p-3 shadow-sm focus:ring-2 focus:ring-blue-400 transition"
//               required
//             >
//               <option value="">Select Discount Type</option>
//               <option value="percentage">Percentage</option>
//               <option value="fixed">Fixed Amount</option>
//               <option value="free_shipping">Free Shipping</option>
//             </select>
//             <input
//               type="number"
//               name="discountValue"
//               value={formData.discountValue}
//               onChange={handleInputChange}
//               placeholder="Discount Value"
//               className="border-gray-300 rounded-lg w-full p-3 shadow-sm focus:ring-2 focus:ring-blue-400 transition"
//               required
//             />
//             <input
//               type="date"
//               name="expirationDate"
//               value={formData.expirationDate}
//               onChange={handleInputChange}
//               className="border-gray-300 rounded-lg w-full p-3 shadow-sm focus:ring-2 focus:ring-blue-400 transition"
//               required
//             />
//             <textarea
//               name="termsAndConditions"
//               value={formData.termsAndConditions}
//               onChange={handleInputChange}
//               placeholder="Terms and Conditions"
//               className="border-gray-300 rounded-lg w-full p-3 shadow-sm focus:ring-2 focus:ring-blue-400 transition"
//             />
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               placeholder="Description"
//               className="border-gray-300 rounded-lg w-full p-3 shadow-sm focus:ring-2 focus:ring-blue-400 transition"
//             />
//           </div>
//           <div className="flex justify-end space-x-4 mt-6">
//             <button
//               type="submit"
//               className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
//             >
//               Save
//             </button>
//             <button
//               type="button"
//               onClick={handleCloseModal}
//               className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg shadow hover:bg-gray-400 transition"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </ReusableModal>
//     </BoxComponent>
//   );
// };

// export default CouponManager;



import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthInputField from "../../../components/InputFileds/AuthInputFiled";

import UserProfile from "../../../hooks/UserData/useUser";
import useAuthToken from "../../../hooks/Token/useAuth";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import ReusableModal from "../../../components/Modal/component";

const CouponManager = () => {
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const authToken = useAuthToken();
  const vendorId = user._id;

  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const CouponSchema = z.object({
    name: z.string().min(1, { message: "Coupon name is required" }),
    code: z.string().min(1, { message: "Coupon code is required" }),
    discountType: z.object(
      {
        label: z.string(),
        value: z.string(),
      },
      "selected value"
    ),
    discountValue: z.string().min(1, { message: "Discount value is required" }),
    expirationDate: z.string().min(1, { message: "Expiration date is required" }),
    termsAndConditions: z.string().optional(),
    description: z.string().optional(),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: "",
      code: "",
      discountType: { label: "Percentage", value: "percentage" },
      discountValue: "",
      expirationDate: "",
      termsAndConditions: "",
      description: "",
    },
    resolver: zodResolver(CouponSchema),
  });

  const fetchCoupons = useCallback(async () => {
    if (!vendorId) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/coupon/vendor/${vendorId}`,
        { headers: { Authorization: authToken } }
      );
      setCoupons(response.data.data);
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
    }
  }, [vendorId, authToken]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleUpdate = async (data) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API}/route/coupon/${selectedCoupon._id}`,
        { ...data, discountType: data.discountType.value, vendorId },
        { headers: { Authorization: authToken } }
      );
      fetchCoupons();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to update coupon:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API}/route/coupon/${id}`, {
        headers: { Authorization: authToken },
      });
      fetchCoupons();
    } catch (error) {
      console.error("Failed to delete coupon:", error);
    }
  };

  const handleSelectCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    reset({
      name: coupon.name,
      code: coupon.code,
      discountType: { label: coupon.discountType, value: coupon.discountType },
      discountValue: coupon.discountValue.toString(),
      expirationDate: coupon.expirationDate.split("T")[0],
      termsAndConditions: coupon.termsAndConditions,
      description: coupon.description,
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCoupon(null);
    reset();
  };

  return (
    <BoxComponent>
      <HeadingOneLineInfo heading="Coupon List" info="Manage your coupons for your vendor here." />
      <div className="max-w-4xl mx-auto">
        {coupons.length === 0 ? (
          <div className="text-center bg-gradient-to-r from-blue-100 to-blue-50 p-6 rounded-lg shadow-sm">
            <p className="text-2xl font-bold text-blue-600">🎉 No Coupons Available</p>
            <p className="text-sm text-blue-500 mt-2">Start adding amazing offers for your customers today!</p>
          </div>
        ) : (
         
      //    <div className="mt-4">
      //       {/* <h2 className="text-xl font-bold text-gray-800 mb-4">Available Coupons</h2> */}
      //       <ul className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
      //         {coupons.map((coupon) => (
      //           <li
      //             key={coupon._id}
      //             className="flex justify-between items-center p-4 hover:bg-gray-50 transition duration-200"
      //           >
      //             <div className="flex flex-col">
      //               <span className="text-lg font-semibold text-gray-800">{coupon.name}</span>
      //               <span className="text-sm text-gray-500">{coupon.code}</span>
      //             </div>
      //             <div className="flex space-x-3">
      //               <button
      //                 onClick={() => handleSelectCoupon(coupon)}
      //                 className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md shadow transition"
      //               >
      //                 Edit
      //               </button>
      //               <button
      //                 onClick={() => handleDelete(coupon._id)}
      //                 className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md shadow transition"
      //               >
      //                 Delete
      //               </button>
      //             </div>
      //           </li>
      //         ))}
      //       </ul>
      //     </div>
      //   )}
      // </div>

      <div className="mt-6">
  <ul className="bg-white rounded-lg shadow-lg divide-y divide-gray-100 overflow-hidden">
    {coupons.map((coupon) => (
      <li
        key={coupon._id}
        className="flex justify-between items-center p-5 hover:bg-gradient-to-r from-blue-50 to-blue-100 transition duration-300"
      >
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-800">{coupon.name}</span>
            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              {coupon.discountType.charAt(0).toUpperCase() + coupon.discountType.slice(1)}
            </span>
          </div>
          <span className="text-sm text-gray-500">Code: {coupon.code}</span>
          <span className="text-sm text-gray-500">
            Expires:{" "}
            <span className="font-medium text-red-500">
              {new Date(coupon.expirationDate).toLocaleDateString()}
            </span>
          </span>
        </div>
        <div className="flex space-x-4">
        <button
  onClick={() => handleSelectCoupon(coupon)}
  className="flex items-center justify-center text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg shadow-lg transform transition duration-200 hover:scale-105"
>
  Edit
</button>

          <button
            onClick={() => handleDelete(coupon._id)}
            className="flex items-center justify-center text-sm font-medium text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg shadow-lg transform transition duration-200 hover:scale-105"
          >
        
           Delete
          </button>
                       </div>
                 </li>
               ))}
             </ul>
           </div>
         )}
       </div>

      
      <ReusableModal
        open={modalOpen}
        onClose={handleCloseModal}
        heading="Edit Coupon"
        subHeading={selectedCoupon && `Editing: ${selectedCoupon.name}`}
      >
        <form
          onSubmit={handleSubmit(handleUpdate)}
          className="flex flex-col space-y-0"
          noValidate
          autoComplete="off"
        >
          <AuthInputField
            name="name"
            control={control}
            label="Coupon Name *"
            errors={errors}
            placeholder="e.g. Discount on Pizza"
          />
          <AuthInputField
            name="code"
            control={control}
            label="Coupon Code *"
            errors={errors}
            placeholder="e.g. PIZZA2024"
          />
          <AuthInputField
            name="discountType"
            control={control}
            label="Discount Type *"
            type="select"
            options={[
              { label: "Percentage", value: "percentage" },
              { label: "Fixed Amount", value: "fixed" },
              { label: "Free Shipping", value: "free_shipping" },
            ]}
            errors={errors}
          />
          <AuthInputField
            name="discountValue"
            control={control}
            label="Discount Value *"
            type="number"
            errors={errors}
            placeholder="e.g. 10"
          />
          <AuthInputField
            name="expirationDate"
            control={control}
            label="Expiration Date *"
            type="date"
            errors={errors}
          />
          <AuthInputField
            name="termsAndConditions"
            control={control}
            label="Terms and Conditions"
            as="textarea"
            errors={errors}
            placeholder="Terms and conditions here..."
            rows={3}
          />
          <AuthInputField
            name="description"
            control={control}
            label="Description"
            as="textarea"
            errors={errors}
            placeholder="Provide a description for the coupon"
            rows={3}
          />
          <div className="flex justify-start space-x-4 mt-6">
            <button 
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
              disabled={!isDirty}
            >
              Update
            </button>
            <button
              type="button"
              onClick={handleCloseModal}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg shadow hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </ReusableModal>
    </BoxComponent>
  );
};

export default CouponManager;
