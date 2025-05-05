// import React from 'react';

// const SkillMatrix = () => {
//   const mostSkilled = [
//     { rank: 1, score: 3.92, name: 'Jean Griffin' },
//     { rank: 2, score: 3.85, name: 'Stephanie Baker' },
//     { rank: 3, score: 3.77, name: 'Erica Bowden' },
//     { rank: 4, score: 3.58, name: 'Dwight Hoyle' },
//     { rank: 5, score: 3.58, name: 'Gretchen Joseph' },
//     { rank: 6, score: 3.38, name: 'Karen Hamilton' },
//   ];

//   const mostInterested = [
//     { rank: 1, score: 3.31, name: 'Jean Griffin' },
//     { rank: 2, score: 3.31, name: 'Neal Lawrence' },
//     { rank: 3, score: 2.92, name: 'Karen Hamilton' },
//     { rank: 4, score: 2.85, name: 'Gretchen Joseph' },
//     { rank: 5, score: 2.85, name: 'Stephanie Baker' },
//     { rank: 6, score: 2.85, name: 'Wesley Grant' },
//   ];

//   const topSkills = [
//     { rank: 1, score: 4.12, name: 'CSS' },
//     { rank: 2, score: 3.83, name: 'Javascript' },
//     { rank: 3, score: 3.62, name: 'Network architecture' },
//     { rank: 4, score: 3.54, name: 'Design firmware' },
//     { rank: 5, score: 3.42, name: 'Implement a firewall' },
//     { rank: 6, score: 3.42, name: 'PHP' },
//   ];

//   return (
//     <div className="container mx-auto p-4">
//       <div className="grid grid-cols-3 gap-4">
//         <div className="bg-white shadow-md rounded-lg p-4">
//           <h2 className="text-xl font-bold mb-2">Most skilled</h2>
//           <ul>
//             {mostSkilled.map((item) => (
//               <li key={item.name} className="flex items-center mb-2">
//                 <span className="w-8 h-8 bg-green-300 rounded-full flex items-center justify-center text-white font-bold mr-2">
//                   {item.rank}
//                 </span>
//                 <span className="w-8 h-8 bg-green-300 rounded-full flex items-center justify-center text-white font-bold mr-2">
//                   {item.score}
//                 </span>
//                 <span>{item.name}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="bg-white shadow-md rounded-lg p-4">
//           <h2 className="text-xl font-bold mb-2">Most interested</h2>
//           <ul>
//             {mostInterested.map((item) => (
//               <li key={item.name} className="flex items-center mb-2">
//                 <span className="w-8 h-8 bg-green-300 rounded-full flex items-center justify-center text-white font-bold mr-2">
//                   {item.rank}
//                 </span>
//                 <span className="w-8 h-8 bg-green-300 rounded-full flex items-center justify-center text-white font-bold mr-2">
//                   {item.score}
//                 </span>
//                 <span>{item.name}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="bg-white shadow-md rounded-lg p-4">
//           <h2 className="text-xl font-bold mb-2">Top skills</h2>
//           <ul>
//             {topSkills.map((item) => (
//               <li key={item.name} className="flex items-center mb-2">
//                 <span className="w-8 h-8 bg-green-300 rounded-full flex items-center justify-center text-white font-bold mr-2">
//                   {item.rank}
//                 </span>
//                 <span className="w-8 h-8 bg-green-300 rounded-full flex items-center justify-center text-white font-bold mr-2">
//                   {item.score}
//                 </span>
//                 <span>{item.name}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SkillMatrix;


import React from 'react';

const SkillReport = () => {
  return (
    <div className="flex space-x-4 p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="w-1/3 bg-white rounded-lg shadow-inner p-4">
        <p className="text-gray-600 text-sm font-medium mb-2">At a glance</p>
        <div className="flex space-x-4">
          <div className="w-1/2">
            <div className="h-24 bg-[#89c7e4] rounded-lg mb-2"></div>
            <p className="text-center text-lg font-bold">3.40</p>
            <p className="text-center text-gray-600 text-sm">Skill level</p>
          </div>
          <div className="w-1/2">
            <div className="h-24 bg-[#a7c4d1] rounded-lg mb-2"></div>
            <p className="text-center text-lg font-bold">2.72</p>
            <p className="text-center text-gray-600 text-sm">Interest level</p>
          </div>
        </div>
      </div>
      <div className="w-1/3 bg-white rounded-lg shadow-inner p-4">
        <p className="text-gray-600 text-sm font-medium mb-2">Statistics</p>
        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-gray-700">People in this team:</p>
            <p className="text-gray-900 font-bold">12</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-700">Self-assessments completed:</p>
            <p className="text-gray-900 font-bold">12 / 12 (100%)</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-700">Supervisor assessments completed:</p>
            <p className="text-gray-900 font-bold">12 / 12 (100%)</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-700">Assessable skills:</p>
            <p className="text-gray-900 font-bold">13</p>
          </div>
        </div>
      </div>
      <div className="w-1/3 bg-white rounded-lg shadow-inner p-4">
        <p className="text-gray-600 text-sm font-medium mb-2">Manager</p>
        <div className="flex items-center space-x-2">
          <p className="text-gray-900 font-bold">1</p>
          <img src="https://placehold.co/50x50" alt="Hazel Raynor" className="rounded-full h-8 w-8" />
          <p className="text-gray-900 font-medium">Hazel Raynor</p>
        </div>
      </div>
    </div>
  );
};

export default SkillReport;