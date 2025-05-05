/* eslint-disable no-unused-vars */
// tab
import React from "react";
import SendAssessment from "./SendAssessment";
// import MyAssessment from "./MyAssessment";

const SkillsAssessment = () => {
  return (

      <div className=" p-6 ">
       
          <h2 className="text-2xl font-bold text-gray-800">Send Assessment</h2>
          <p className="text-gray-600 mt-2">
            Here you can send assessments to Employee.
            <SendAssessment />
          </p>
      </div>
    
  );
};
export default SkillsAssessment;

// // tab
// import React, { useState } from "react";
// import SendAssessment from "./SendAssessment";
// import MyAssessment from "./MyAssessment";

// const SkillsAssessment = () => {
//   const [activeTab, setActiveTab] = useState("sendAssessment");

//   return (
//     <div className="p-6">
//       {/* Tab Navigation */}
//       <div className="flex border-b border-gray-300">
//         <button
//           className={`px-4 py-2 font-semibold text-sm ${
//             activeTab === "sendAssessment"
//               ? "border-b-2 border-blue-500 text-blue-500"
//               : "text-gray-500"
//           }`}
//           onClick={() => setActiveTab("sendAssessment")}
//         >
//           Send Assessment
//         </button>
//         {/* <button
//           className={`px-4 py-2 font-semibold text-sm ${
//             activeTab === "myAssessment"
//               ? "border-b-2 border-blue-500 text-blue-500"
//               : "text-gray-500"
//           }`}
//           onClick={() => setActiveTab("myAssessment")}
//         >
//           My Assessment
//         </button> */}
//       </div>

//       {/* Tab Content */}
//       <div className="mt-6">
//         {activeTab === "sendAssessment" && (
//           <div>
//             <h2 className="text-lg font-bold text-gray-800">Send Assessment</h2>
//             <p className="text-gray-600 mt-2">
//               Here you can send assessments to Employee.
//               <SendAssessment />
//             </p>
//           </div>
//         )}
//         {/* {activeTab === "myAssessment" && (
//           <div>
//             <h2 className="text-lg font-bold text-gray-800">Self-Assessment🔖</h2>
//             <p className="text-gray-600 mt-2">
//               Here you can view your assessments.
//             </p>
//             <MyAssessment/>
//           </div>
//         )} */}
//       </div>
//     </div>
//   );
// };

// export default SkillsAssessment;
