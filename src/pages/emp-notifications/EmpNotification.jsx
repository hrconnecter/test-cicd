// import { Info, West } from "@mui/icons-material";
// import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
// import { Avatar, CircularProgress } from "@mui/material";
// import axios from "axios";
// import moment from "moment";
// import React, { useEffect } from "react";
// import { useMutation, useQuery, useQueryClient } from "react-query";
// import { Link } from "react-router-dom";
// import useAuthToken from "../../hooks/Token/useAuth";
// import UserProfile from "../../hooks/UserData/useUser";

// const EmpNotificationData = () => {
//   const authToken = useAuthToken();
//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();
//   const employeeId = user?._id;
//   const queryClient = useQueryClient();

//   const { data: EmpNotification, isLoading: empDataLoading } = useQuery({
//     queryKey: ["EmpDataPunchNotification", employeeId],
//     queryFn: async () => {
//       try {
//         const res = await axios.get(
//           `${process.env.REACT_APP_API}/route/punch/get-notification/${employeeId}`,
//           {
//             headers: {
//               Authorization: authToken,
//             },
//           }
//         );
//         return res.data;
//       } catch (error) {
//         console.log(error);
//       }
//     },
//     enabled: employeeId !== undefined,
//   });

//   const punchId = EmpNotification?.punchData?.[0]?._id;

//   // Mutation to update notification count
//   const { mutate: updateNotificationCount } = useMutation(
//     async () => {
//       try {
//         const res = await axios.patch(
//           `${process.env.REACT_APP_API}/route/update/notificationCount/punch/manager/accept/${employeeId}`,
//           { organizationId: user.organizationId, punchId },
//           {
//             headers: {
//               Authorization: authToken,
//             },
//           }
//         );
//         return res.data;
//       } catch (error) {
//         console.log(error);
//       }
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries("EmpDataPunchNotification");
//       },
//       onError: (error) => {
//         console.error("Error updating notification count:", error);
//       },
//     }
//   );

//   useEffect(() => {
//     if (!empDataLoading && EmpNotification) {
//       updateNotificationCount();
//     }
//   }, [empDataLoading, EmpNotification, updateNotificationCount]);

//   // Filter punch records where geoFencingArea is false
//   const filteredPunchData = EmpNotification?.punchData?.filter(
//     (item) => item.geoFencingArea === false
//   );

//   return (
//     <div>
//       <header className="text-xl w-full pt-6 border bg-white shadow-md p-4">
//         <Link to={"/organisation/:organisationId/income-tax"}>
//           <West className="mx-4 !text-xl" />
//         </Link>
//         Employee Punch Status
//       </header>
//       <section className="min-h-[90vh] flex">
//         <article className="w-[100%] min-h-[90vh] border-l-[.5px] bg-gray-50">
//           {empDataLoading ? (
//             <div className="flex items-center justify-center my-2">
//               <CircularProgress />
//             </div>
//           ) : employeeId ? (
//             filteredPunchData?.length <= 0 ? (
//               <div className="flex px-4 w-full items-center my-4">
//                 <h1 className="text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
//                   <Info /> No Punch Requests Found Outside Geo-Fencing Area
//                 </h1>
//               </div>
//             ) : (
//               <>
//                 <div className="p-4 space-y-1 flex items-center gap-3">
//                   <Avatar className="text-white !bg-blue-500">
//                     <AssignmentTurnedInIcon />
//                   </Avatar>
//                   <div>
//                     <h1 className="md:text-xl text-lg">Punch Status</h1>
//                     <p className="text-sm">
//                       Here employees can check the status of their punch requests
//                       outside the geo-fencing area.
//                     </p>
//                   </div>
//                 </div>
//                 <div className="md:px-4 px-0">
//                   {filteredPunchData?.map((item, itemIndex) => (
//                     <div
//                       key={itemIndex}
//                       className="w-full bg-white shadow-md mb-3 p-4 rounded-md"
//                     >
//                       <div className="flex justify-between items-center px-2">
//                         <div>
//                         <h2 className="md:text-lg text-base font-semibold">
//                           {item?.punchData?.[0]?.image === ""
//                             ? "Missed Punch Request"
//                             : "Remote Punch Request"}
//                         </h2>

//                           <h2>
//                             <span className="md:text-lg text-base font-semibold">
//                               Date
//                             </span>{" "}
//                             : {new Date(item?.createdAt).toLocaleDateString()}
//                           </h2>
//                           <h2>
//                             <span className="md:text-lg text-base font-semibold">
//                               Start Time
//                             </span>{" "}
//                             {new Date(
//                               item?.punchData[0]?.createdAt
//                             ).toLocaleTimeString()}
//                           </h2>
//                           <h2>
//                             <span className="md:text-lg text-base font-semibold">
//                               End Time
//                             </span>{" "}
//                             {new Date(
//                               item?.punchData[0]?.updatedAt
//                             ).toLocaleTimeString()}
//                           </h2>
//                           <h2>
//                             <span className="md:text-lg text-base font-semibold">
//                               Punch Requested
//                             </span>{" "}
//                             : {item?.punchData?.length}{" "}
//                             {item?.punchData?.length === 1 ? "time" : "times"}
//                           </h2>
//                           {item?.mReason && (
//                             <h2>
//                               <span className="md:text-lg text-base font-semibold">
//                                 {"Reason --> Manager"}
//                               </span>{" "}
//                               : {item?.mReason}
//                             </h2>
//                           )}
//                           {item?.aReason && (
//                             <h2>
//                               <span className="md:text-lg text-base font-semibold">
//                                 {"Reason --> Accountant"}
//                               </span>{" "}
//                               : {item?.aReason}
//                             </h2>
//                           )}
//                         </div>

//                         <div className="flex flex-col items-center justify-center gap-2 ">
//                           <button
//                             className={`md:w-[100px] h-[30px] md:h-auto ${item.status === "Pending"
//                               ? "bg-[#ffa500]"
//                               : item.status === "Approved"
//                                 ? "bg-[#008000]"
//                                 : "bg-[#ff0000]"
//                               } text-white md:px-4 px-2 py-1 md:py-2 rounded-md`}
//                           >
//                             {item.status}
//                           </button>
//                           <div className="text-sm text-gray-700 underline">
//                             {moment(item?.updatedAt).fromNow()}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )
//           ) : (
//             <div className="flex px-4 w-full items-center my-4">
//               <h1 className="md:text-lg text-sm w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
//                 <Info /> Select employee to see their requests
//               </h1>
//             </div>
//           )}
//         </article>
//       </section>
//     </div>
//   );
// };

// export default EmpNotificationData;


import { Info, West } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import useAuthToken from "../../hooks/Token/useAuth";
import UserProfile from "../../hooks/UserData/useUser";

const EmpNotificationData = () => {
  const authToken = useAuthToken();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const employeeId = user?._id;
  const queryClient = useQueryClient();
  const [selectedPunchData, setSelectedPunchData] = useState(null);

  const { data: EmpNotification, isLoading: empDataLoading } = useQuery({
    queryKey: ["EmpDataPunchNotification", employeeId],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/punch/get-notification/${employeeId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: employeeId !== undefined,
  });

  const punchId = EmpNotification?.punchData?.[0]?._id;

  // Mutation to update notification count
  const { mutate: updateNotificationCount } = useMutation(
    async () => {
      try {
        const res = await axios.patch(
          `${process.env.REACT_APP_API}/route/update/notificationCount/punch/manager/accept/${employeeId}`,
          { organizationId: user.organizationId, punchId },
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("EmpDataPunchNotification");
      },
      onError: (error) => {
        console.error("Error updating notification count:", error);
      },
    }
  );

  useEffect(() => {
    if (!empDataLoading && EmpNotification) {
      updateNotificationCount();
    }
  }, [empDataLoading, EmpNotification, updateNotificationCount]);

  // Filter punch records where geoFencingArea is false
  const filteredPunchData = EmpNotification?.punchData?.filter(
    (item) => item.geoFencingArea === false
  );

  const handleNotificationClick = (punchData) => {
    setSelectedPunchData(punchData);
  };
  return (
   // Inside return JSX:
  <div className="min-h-[calc(100vh-200px)] flex flex-col">
    <header className="text-lg md:text-xl w-full border bg-white shadow-md p-4 flex items-center">
      <Link to={"/organisation/:organisationId/income-tax"}>
        <West className="mx-4 !text-lg md:!text-xl" />
      </Link>
      Employee Punch Status
    </header>

    <section className="flex flex-col md:flex-row flex-grow">
      {/* Left panel with scroll */}
      <article className="w-full md:w-1/3 h-[300px] md:h-[calc(100vh-200px)] overflow-y-auto border-l-[.5px] bg-gray-50">
        {empDataLoading ? (
          <div className="flex items-center justify-center my-4">
            <CircularProgress />
          </div>
        ) : employeeId ? (
          filteredPunchData?.length <= 0 ? (
            <div className="flex px-4 w-full items-center my-4">
              <h1 className="text-base md:text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
                <Info /> No Punch Requests Found Outside Geo-Fencing Area
              </h1>
            </div>
          ) : (
            <>
  
              <div className="px-2 md:px-4">
                {filteredPunchData?.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="w-full bg-white shadow-md mb-3 p-3 md:p-4 rounded-md cursor-pointer"
                    onClick={() => handleNotificationClick(item)}
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-2">
                      <div className="w-full sm:w-1/3 flex flex-col items-start sm:items-center justify-center">
                        <p className="text-sm font-medium text-gray-600">
                          {moment(item?.createdAt).format("MMM DD, YYYY")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {moment(item?.createdAt).format("h:mm A")}
                        </p>
                      </div>
                      <div className="w-full sm:w-2/3">
                        <h2 className="text-base md:text-lg font-semibold">
                          {item?.punchData?.[0]?.image === ""
                            ? "Missed Punch Request"
                            : "Remote Punch Request"}
                        </h2>
                        <p className="text-sm text-gray-700">
                          Status:{" "}
                          <span
                            className={`font-medium ${
                              item.status === "Pending"
                                ? "text-orange-500"
                                : item.status === "Approved"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {item.status}
                          </span>
                        </p>
                        <div className="text-sm text-gray-700">
                          Updated {moment(item?.updatedAt).fromNow()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )
        ) : (
          <div className="flex px-4 w-full items-center my-4">
            <h1 className="text-sm md:text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
              <Info /> Select employee to see their requests
            </h1>
          </div>
        )}
      </article>

      {/* Right panel */}
      {selectedPunchData && (
        <div className="w-full md:w-2/3 h-[400px] md:h-[calc(100vh-200px)] bg-gray-100 p-4 flex flex-col">
          <div className="flex-grow">
            {selectedPunchData.punchData[0].data?.length > 0 ? (
              <div className="h-[20rem] md:h-[30rem] w-full rounded overflow-hidden">
                <MapComponent
                  coordinates={selectedPunchData.punchData[0].data}
                  isMissedPunch={selectedPunchData.punchData[0].image === ""}
                />
              </div>
            ) : (
              <p>No location data available for this punch.</p>
            )}
          </div>
        </div>
      )}
    </section>
  </div>
  );
};  

const MapComponent = ({ coordinates, isMissedPunch }) => {
  useEffect(() => {
    if (!coordinates || coordinates.length < 2) return;

    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: coordinates[0].lat, lng: coordinates[0].lng },
      zoom: 15,
    });

    // Marker for Start
    new window.google.maps.Marker({
      position: { lat: coordinates[0].lat, lng: coordinates[0].lng },
      map,
      label: "A", // or title: "Start"
    });

    // Marker for End
    new window.google.maps.Marker({
      position: { lat: coordinates[coordinates.length - 1].lat, lng: coordinates[coordinates.length - 1].lng },
      map,
      label: "B", // or title: "End"
    });

    if (isMissedPunch) {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({ suppressMarkers: true });

      directionsRenderer.setMap(map);

      const waypoints = coordinates.slice(1, coordinates.length - 1).map((coord) => ({
        location: { lat: coord.lat, lng: coord.lng },
        stopover: true,
      }));

      directionsService.route(
        {
          origin: coordinates[0],
          destination: coordinates[coordinates.length - 1],
          waypoints: waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            directionsRenderer.setDirections(result);
          } else {
            console.error("Directions request failed due to " + status);
          }
        }
      );
    } else {
      const flightPath = new window.google.maps.Polyline({
        path: coordinates.map((coord) => ({ lat: coord.lat, lng: coord.lng })),
        geodesic: true,
        strokeColor: "#2196F3",
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });

      flightPath.setMap(map);
    }
  }, [coordinates, isMissedPunch]);

  return <div id="map" className="w-full h-[32rem] rounded-md shadow-inner" />;
};



export default EmpNotificationData;