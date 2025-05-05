// import axios from "axios";
// import React, { useState, useEffect, useCallback } from "react";
// import { Link } from "react-router-dom";
// import useAuthToken from "../../../hooks/Token/useAuth";
// // import hrmsImg from '../../../assets/hrmsImg.png'; // Default image
// import Fish from "../../../assets/Fish.jpg";
// import foodbagroundimage from "../../../assets/foodbagroundimage.webp";
// import useCartStore from "./useCartStore";
// import { FaMapMarkerAlt } from "react-icons/fa";
// import ReusableModal from "../../../components/Modal/component";
// import LocationSelector from "./LocationSelector";
// // import BoxComponent from '../../../components/BoxComponent/BoxComponent';

// const Vendorlist = () => {
//   const [vendors, setVendors] = useState([]);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [locationName, setLocationName] = useState("");
//   const [filteredVendors, setFilteredVendors] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const authToken = useAuthToken();
//   const { clearCart } = useCartStore();

//   const fetchVendors = useCallback(async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/vendor/fetchvendor`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       setVendors(response.data.vendors || []);
//     } catch (error) {
//       console.error("Error fetching vendors:", error);
//     }
//   }, [authToken]);

//   useEffect(() => {
//     fetchVendors();
//   }, [fetchVendors]);

//   useEffect(() => {
//     clearCart();
//   }, [clearCart]);

//   console.log(currentLocation);

//   const getLocationName = async (latitude, longitude) => {
//     try {
//       const response = await axios.get(
//         `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
//       );
//       const displayName = response.data.address.state_district;
//       setLocationName(displayName);
//     } catch (error) {
//       console.error("Error fetching location name:", error);
//     }
//   };

//   const filterVendorsByLocation = (latitude, longitude) => {
//     const filtered = vendors.filter((vendor) => {
//       const vendorLat = parseFloat(vendor.latitude);
//       const vendorLon = parseFloat(vendor.longitude);
//       const distance = haversineDistance(
//         latitude,
//         longitude,
//         vendorLat,
//         vendorLon
//       );
//       return distance < 40; // Filter vendors within 40 km
//     });
//     setFilteredVendors(filtered);
//   };

//   const haversineDistance = (lat1, lon1, lat2, lon2) => {
//     const toRad = (value) => (value * Math.PI) / 180;
//     const R = 6371; // Radius of the Earth in km
//     const dLat = toRad(lat2 - lat1);
//     const dLon = toRad(lon2 - lon1);
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(toRad(lat1)) *
//         Math.cos(toRad(lat2)) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c; // Distance in km
//   };

//   const handleSearch = () => {
//     const lowercasedSearchTerm = searchTerm.toLowerCase();
//     const filtered = vendors.filter((vendor) =>
//       vendor.companyname.toLowerCase().includes(lowercasedSearchTerm)
//     );
//     setFilteredVendors(filtered);
//   };

//   const handleLocationSelect = (lat, lng) => {
//     setCurrentLocation({ lat, lng });
//     getLocationName(lat, lng);
//     filterVendorsByLocation(lat, lng);
//     closeLocationModal();
//   };

//   const openLocationModal = () => {
//     setModalIsOpen(true);
//   };

//   const closeLocationModal = () => {
//     setModalIsOpen(false);
//   };

//   // Helper function to get the Shop Image URL from vendor documents
//   const getShopImageUrl = (documents) => {
//     const shopImageDoc = documents.find(
//       (doc) => doc.selectedValue === "Shop Image"
//     );
//     return shopImageDoc ? shopImageDoc.url : Fish; // Return the URL or default image
//   };

//   return (
//     <div className="min-h-screen p-6">
//       {/* Hero Section with Background Overlay */}
//       <div className="relative h-[70vh] mb-12 rounded-xl overflow-hidden shadow-xl">
//         <img
//           src={foodbagroundimage}
//           alt="Background"
//           className="w-full h-full object-cover opacity-85"
//         />

//         <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4">
//           <div className="flex flex-col sm:flex-row items-center bg-white bg-opacity-90 rounded-xl shadow-2xl p-6 w-full sm:w-[90%] lg:w-[70%]">
//             {/* Location Button */}
//             <div className="flex flex-col items-center mt-4">
//               <button
//                 onClick={openLocationModal}
//                 className="p-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full shadow-lg mb-2 transition-all transform hover:scale-110 hover:shadow-2xl"
//                 title="Select location"
//               >
//                 <FaMapMarkerAlt size={24} />
//               </button>
//               {/* Location Name */}
//               <p className="text-xs text-gray-700 font-medium whitespace-nowrap">
//                 {locationName}
//               </p>
//             </div>

//             {/* Search Bar */}
//             <div className="flex w-full mt-4 sm:mt-0 sm:ml-6">
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search vendors..."
//                 className="p-3 w-full border border-gray-300 rounded-l-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//               />
//               <button
//                 onClick={handleSearch}
//                 className="p-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-r-xl shadow-lg transition-all transform hover:scale-110"
//               >
//                 Search
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Page Title */}
//       <h1
//         className={`text-2xl sm:text-3xl md:text-4xl font-bold text-start mb-8 text-gray-800 tracking-wide`}
//       >
//         {filteredVendors.length > 0
//           ? `Top Vendors in ${locationName}`
//           : "Discover the Best Vendors Across India"}
//       </h1>

//       {/* Vendor Cards Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//         {(filteredVendors.length > 0 ? filteredVendors : vendors).map(
//           (vendor) => (
//             <Link
//               key={vendor._id}
//               to={`/vendors/restaurantmenu/${vendor._id}`}
//               className="group flex flex-col items-center bg-white rounded-2xl shadow-lg transition-all transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:border hover:border-blue-400"
//             >
//               {/* Vendor Image */}
//               <img
//                 className="w-full h-48 object-cover rounded-t-2xl"
//                 src={getShopImageUrl(vendor.documents)} // Dynamic image based on availability
//                 alt={vendor.companyname}
//               />
//               <div className="p-6 w-full text-center">
//                 <h2 className="font-semibold text-xl text-gray-800 mb-2">
//                   {vendor.companyname}
//                 </h2>
//                 {/* <p className="text-gray-500 text-sm">{vendor.address}</p> */}
//               </div>
//             </Link>
//           )
//         )}
//       </div>

//       {/* Reusable Modal for selecting location */}
//       <ReusableModal
//         open={modalIsOpen}
//         onClose={closeLocationModal}
//         heading="Select Location"
//         subHeading="Choose your preferred location."
//       >
//         <LocationSelector onLocationSelect={handleLocationSelect} />
//       </ReusableModal>
//     </div>
//   );
// };

// export default Vendorlist;




import axios from "axios";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import useAuthToken from "../../../hooks/Token/useAuth";
// import hrmsImg from '../../../assets/hrmsImg.png'; // Default image
import Fish from "../../../assets/Fish.jpg";
import foodbagroundimage from "../../../assets/foodbagroundimage.webp";
import useCartStore from "./useCartStore";
import { FaMapMarkerAlt } from "react-icons/fa";
import ReusableModal from "../../../components/Modal/component";
import LocationSelector from "./LocationSelector";
import { UseContext } from "../../../State/UseState/UseContext";
// import BoxComponent from '../../../components/BoxComponent/BoxComponent';

const Vendorlist = () => {
  const [vendors, setVendors] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const authToken = useAuthToken();
  const { clearCart } = useCartStore();
  const { setAppAlert } = useContext(UseContext);

  const fetchVendors = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/vendor/fetchvendor`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setVendors(response.data.vendors || []);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  }, [authToken]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  console.log(currentLocation);

  const getLocationName = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const displayName = response.data.address.state_district;
      setLocationName(displayName);
    } catch (error) {
      console.error("Error fetching location name:", error);
    }
  };

  const filterVendorsByLocation = (latitude, longitude) => {
    const filtered = vendors.filter((vendor) => {
      const vendorLat = parseFloat(vendor.latitude);
      const vendorLon = parseFloat(vendor.longitude);
      const distance = haversineDistance(
        latitude,
        longitude,
        vendorLat,
        vendorLon
      );
      return distance < 40; // Filter vendors within 40 km
    });
    setFilteredVendors(filtered);
  };

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const handleSearch = () => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = vendors.filter((vendor) =>
      vendor.companyname.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredVendors(filtered);

     // Display popup if no vendors are found
  if (filtered.length === 0) {
    // alert("No vendor found");
    setAppAlert({
      alert: true,
      type: "success",
      msg: "No vendors found. Please try a different name.",
    });
  }
  };

  const handleLocationSelect = (lat, lng) => {
    setCurrentLocation({ lat, lng });
    getLocationName(lat, lng);
    filterVendorsByLocation(lat, lng);
    closeLocationModal();
  };

  const openLocationModal = () => {
    setModalIsOpen(true);
  };

  const closeLocationModal = () => {
    setModalIsOpen(false);
  };

  // Helper function to get the Shop Image URL from vendor documents
  const getShopImageUrl = (documents) => {
    const shopImageDoc = documents.find(
      (doc) => doc.selectedValue === "Shop Image"
    );
    return shopImageDoc ? shopImageDoc.url : Fish; // Return the URL or default image
  };

  return (
    <div className="min-h-screen p-6">
      {/* Hero Section with Background Overlay */}
      <div className="relative h-[70vh] mb-12 rounded-xl overflow-hidden shadow-xl">
        <img
          src={foodbagroundimage}
          alt="Background"
          className="w-full h-full object-cover opacity-85"
        />

        <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4">
          <div className="flex flex-col sm:flex-row items-center bg-white bg-opacity-90 rounded-xl shadow-2xl p-6 w-full sm:w-[90%] lg:w-[70%]">
            {/* Location Button */}
            <div className="flex flex-col items-center mt-4">
              <button
                onClick={openLocationModal}
                className="p-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full shadow-lg mb-2 transition-all transform hover:scale-110 hover:shadow-2xl"
                title="Select location"
              >
                <FaMapMarkerAlt size={24} />
              </button>
              {/* Location Name */}
              <p className="text-xs text-gray-700 font-medium whitespace-nowrap">
                {locationName}
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex w-full mt-4 sm:mt-0 sm:ml-6">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search vendors..."
                className="p-3 w-full border border-gray-300 rounded-l-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                onClick={handleSearch}
                className="p-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-r-xl shadow-lg transition-all transform hover:scale-110"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Page Title */}
      <h1
        className={`text-2xl sm:text-3xl md:text-4xl font-bold text-start mb-8 text-gray-800 tracking-wide`}
      >
        {filteredVendors.length > 0
          ? `Top Vendors in ${locationName}`
          : "Discover the Best Vendors Across India"}
      </h1>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {(filteredVendors.length > 0 ? filteredVendors : vendors).map(
          (vendor) => (
            <Link
              key={vendor._id}
              to={`/vendors/restaurantmenu/${vendor._id}`}
              className="group flex flex-col items-center bg-white rounded-2xl shadow-lg transition-all transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:border hover:border-blue-400"
            >
              {/* Vendor Image */}
              <img
                className="w-full h-48 object-cover rounded-t-2xl"
                src={getShopImageUrl(vendor.documents)} // Dynamic image based on availability
                alt={vendor.companyname}
              />
              <div className="p-6 w-full text-center">
                <h2 className="font-semibold text-xl text-gray-800 mb-2">
                  {vendor.companyname}
                </h2>
                {/* <p className="text-gray-500 text-sm">{vendor.address}</p> */}
              </div>
            </Link>
          )
        )}
      </div>

      {/* Reusable Modal for selecting location */}
      <ReusableModal
        open={modalIsOpen}
        onClose={closeLocationModal}
        heading="Select Location"
        subHeading="Choose your preferred location."
      >
        <LocationSelector onLocationSelect={handleLocationSelect} />
      </ReusableModal>
    </div>
  );
};

export default Vendorlist;
