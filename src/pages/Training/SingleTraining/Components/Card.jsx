import React from "react";

const TrainingDetailCard = ({ title, desc, icon: Icon, className }) => {
  return (
    <div className="min-w-[210px] bg-white rounded-lg  shadow-sm p-4 flex items-center gap-3">
      <div className={`p-2 rounded-full ${className}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-base font-semibold text-gray-700 !font-sans">
          {" "}
          {desc}
        </p>
        <p className="text-sm text-gray-500 !font-sans">{title}</p>
      </div>
    </div>
  );
};

export default TrainingDetailCard;
