import { Skeleton } from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect, useContext } from "react";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import { useQuery } from "react-query";
import { UseContext } from "../../../../State/UseState/UseContext";
import { useParams } from "react-router-dom";
import useLeaveTable from "../../../../hooks/Leave/useLeaveTable";
import { Info } from "@mui/icons-material";

const EmployeeLeaveDonut = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const param = useParams();
  const organisationId = param?.id;

  // Fetch the total leaves from the API using useQuery
  const { data: totalLeaves, isLoading } = useQuery(
    "totalLeaves",
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get-all-leave-count/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      enabled: !!authToken, // Only fetch if authToken exists
    }
  );

  // Fetch the remaining leaves
  const RemainingLeaves = useLeaveTable();
  const { data: remainingLeaves, isLoading: isLoading2 } = RemainingLeaves;

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const getDonutData = (remainingLeave) => {
    const totalLeave = totalLeaves?.data?.find(
      (leave) => leave._id === remainingLeave._id
    );

    const totalCount = totalLeave?.count ?? 0;
    const remainingCount = remainingLeave?.count ?? 0;
    const takenCount = totalCount - remainingCount;

    return {
      labels: [],
      datasets: [
        {
          data: [remainingCount, Math.max(takenCount, 0)],
          backgroundColor: [remainingLeave.color, "#D3D3D3"],
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const dataset = context.dataset.data;
            const remainingCount = dataset[0];
            const takenCount = dataset[1];
            if (context.dataIndex === 0) {
              return `Balance: ${remainingCount}`;
            } else {
              return `Taken: ${takenCount}`;
            }
          },
        },
      },
    },
    cutout: "70%",
  };

  const renderSkeletons = (count) => {
    return Array(count)
      .fill(0)
      .map((_, index) => (
        <div
          key={index}
          className="relative w-[180px] h-[180px] bg-white border-[0.5px] border-[#E5E7EB] rounded-lg shadow-sm flex flex-col items-center p-4"
        >
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="circular" width={120} height={120} />
          <Skeleton variant="text" width="50%" height={20} />
        </div>
      ));
  };

  return (
    <article className="mb-2 w-full h-max">
      <div className="flex flex-col">
        <h1 className="font-semibold text-[#67748E] mb-4 text-[20px]">
          Leave Balance
        </h1>
        {isLoading || isLoading2 ? (
          <div className="flex gap-5">
            {renderSkeletons(3)} {/* Adjust skeleton count as needed */}
          </div>
        ) : remainingLeaves?.leaveTypes?.length > 0 ? (
          <div
            className={`${remainingLeaves.leaveTypes.length > 3
              ? "flex overflow-x-auto gap-5 scrollbar-hide"
              : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5"
              }`}
          >
            {remainingLeaves.leaveTypes.map((remainingLeave) => {
              const remainingCount = remainingLeave?.count ?? 0;

              return (
                <div
                  key={remainingLeave._id}
                  className={`flex-none ${remainingLeaves.leaveTypes.length > 3 ? "w-[160px]" : "w-full"
                    } h-[180px] bg-white border-[0.5px] border-[#E5E7EB] rounded-lg shadow-sm flex flex-col items-center p-4`}
                >
                  <div className="font-semibold text-[#67748E] truncate">
                    {remainingLeave.leaveName}
                  </div>
                  <div className="relative flex justify-center w-full h-full">
                    <Doughnut
                      data={getDonutData(remainingLeave)}
                      options={options}
                      className="w-[70%] h-[70%]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-sm font-bold text-[#67748E]">
                        {remainingCount} balance
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-[180px] text-[#67748E] text-lg font-semibold bg-white border-[0.5px] border-[#E5E7EB] rounded-lg shadow-sm">
            <div className="px-5 py-2  ">
              <div className="space-x-2 items-center text-red-600  flex">
                <Info className="text-xl text-red-600" />
                <h1 className="text-lg font-bold">No leave data available</h1>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default EmployeeLeaveDonut;
