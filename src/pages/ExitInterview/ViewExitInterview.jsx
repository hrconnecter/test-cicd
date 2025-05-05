import React from "react"
import axios from "axios"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import { format, formatDistance } from "date-fns"
import { FaUser, FaCalendar, FaEnvelope, FaClock } from "react-icons/fa"

export default function ViewExitInterview() {
  const { id } = useParams()

  const { data: interviewData, isLoading } = useQuery(
    ["getUserdetails", id],
    () => axios.get(`${process.env.REACT_APP_API}/route/getUser/${id}`).then(res => res?.data?.data),
    {
      enabled: !!id,
    },
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-xl font-medium text-gray-800">Loading...</div>
        </div>
      </div>
    )
  }

  const joiningDate = interviewData?.joining_date ? new Date(interviewData.joining_date) : null;
  const lastDate = interviewData?.lastDate ? new Date(interviewData.lastDate) : null;
  const employmentDuration = joiningDate && lastDate ? formatDistance(joiningDate, lastDate) : "N/A";


  console.log("interviewData?.question" , interviewData?.question);

  return (
    <div className="w-full my-8 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Exit Interview Details</h1>
          <p className="text-blue-100 mt-1">Employee information and interview responses</p>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FaUser className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Employee Name</h3>
                  <p className="text-lg font-semibold text-gray-800">
                    {interviewData?.first_name} {interviewData?.last_name}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FaEnvelope className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                  <p className="text-lg font-semibold text-gray-800">{interviewData?.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FaCalendar className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Joining Date</h3>
                  <p className="text-lg font-semibold text-gray-800">
                    {joiningDate ? format(joiningDate, "MMMM d, yyyy") : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FaClock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Employment Duration</h3>
                  <p className="text-lg font-semibold text-gray-800">{employmentDuration}</p>
                </div>
              </div>

          </div>
              <div className="flex items-start space-x-3">
                <FaCalendar className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Working Date</h3>
                  <p className="text-lg font-semibold text-gray-800">
                    {lastDate ? format(lastDate, "MMMM d, yyyy") : "N/A"}
                  </p>
                </div>
              </div>
            </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${interviewData?.isOffboarded ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}>
                {interviewData?.isOffboarded ? "Offboarded" : "Active Employee"}
              </div>
            </div>
          </div>
        </div>
      </div>

    {
    interviewData?.question?.length <= 0 ?
    <div className="bg-white  rounded-lg shadow-md overflow-hidden">

   <h2 className="text-xl p-4  font-bold text-gray-800">No Exit Interview Responses</h2>

    </div>

    :
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b px-6 py-4 flex items-center space-x-2">
        
          <h2 className="text-xl font-bold text-gray-800">Exit Interview Responses</h2>
        </div>

        <div className="p-6 space-y-8">
          {interviewData?.question?.map((question, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <h3 className="text-lg font-medium text-gray-800 flex-1">{question.question}</h3>
              </div>

              <div className="ml-10">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Selected Answer:</div>
                  <div className="text-gray-800">{question.selectedAnswer}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>}

      <div className="mt-6 flex justify-end space-x-3">
      
        <button onClick={() => window.history.back()} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Back
        </button>
      </div>
    </div>
  )
}
