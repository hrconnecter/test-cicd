import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import RateReviewModel from "../GoalTable/Modal/Rate_Review_Model";
import axios from "axios";
import UserProfile from "../../../../hooks/UserData/useUser";
import useAuthToken from "../../../../hooks/Token/useAuth";
import {  Chip } from "@mui/material";

const TargetIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
)

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
)

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
)

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
)


const ProgressBar = ({ value, max = 100, color = "bg-blue-500" }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
    </div>
  )
}

// Rating component
const Rating = ({ value }) => {
  return (
    <Chip label={value} color={"primary"}  />
  )
}

export default function EmployeeReviewPage() {
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [employee, setEmployee] = useState(null)
  const [goals, setGoals] = useState([])
  const [trainings, setTrainings] = useState([])
  const [feedback360, setFeedback360] = useState([])
  const [managerReview, setManagerReview] = useState(null)
  const location = useLocation()
  const params = useParams()
  const role = UserProfile().useGetCurrentRole()

  const employeeId = params.id
  const organisationId = params.organisationId
  const goal = location.state?.goal
  const performance = location.state?.performance

  const authToken = useAuthToken()

  const { data: setupData, isFetching: isSetupLoading } = useQuery(["performanceSetup"], async () => {
    const response = await axios.get(`${process.env.REACT_APP_API}/route/performance/getSetup/${organisationId}`, {
      headers: {
        Authorization: authToken,
      },
    })
    return response.data
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/route/performance/${employeeId}/goals-trainings`);
        if (response.data.success) {
          const { goals, trainings, getEmployeeData, getEmployeeGoals } = response.data;
          setGoals(goals);
          setTrainings(trainings);

          const { first_name, last_name, empId } = getEmployeeData;
          setEmployee({
            name: `${first_name} ${last_name}`,
            empId,
            position: "Software Engineer", // Hardcoded position
            department: "Engineering", // Hardcoded department
            joinDate: "2022-03-15", // Hardcoded join date
            avatar: null,
          });

          // Set 360° feedback and manager review data
          if (getEmployeeGoals) {
            const { Rating, managerFeedback, managerRating } = getEmployeeGoals;
            setFeedback360(
              Rating.map((review) => ({
                reviewer: `${review.reviewerId.first_name} ${review.reviewerId.last_name}`,
                role: "Reviewer", // Replace with actual role if available
                rating: review.rating,
                feedback: review.comment,
                date: review.reviewDate,
              }))
            );
            setManagerReview({
              name: "Manager", // Replace with actual manager name if available
              position: "Department Manager", // Replace with actual position if available
              overallRating: managerRating,
              strengths: "N/A", // Replace with actual strengths if available
              areasForImprovement: "N/A", // Replace with actual areas for improvement if available
              comments: managerFeedback,
              date: "N/A", // Replace with actual date if available
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [employeeId]);

  if (isSetupLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-300 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-300 rounded mb-3"></div>
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  // Calculate goal completion percentage
  const completedGoals = goals.filter((g) => g.goalStatus === "Completed").length
  const goalCompletionPercentage = goals.length > 0 ? (completedGoals / goals.length) * 100 : 0

  // Calculate training completion percentage
  const completedTrainings = trainings.filter((t) => t.status === "completed").length;
  const trainingCompletionPercentage = trainings.length > 0 ? (completedTrainings / trainings.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto ">
        {/* Employee Header */}
        <div className=" mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                {employee?.avatar ? (
                  <img
                    src={employee.avatar || "/placeholder.svg"}
                    alt={employee?.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <span>{employee?.name?.charAt(0)}</span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{employee?.name}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-gray-500">
                  <p className="flex items-center">
                    <span className="font-medium text-gray-700">ID:</span>
                    <span className="ml-1">{employee?.empId}</span>
                  </p>
                  <p className="hidden sm:block">•</p>
                  <p>{employee?.position}</p>
                  <p className="hidden sm:block">•</p>
                  <p>{employee?.department}</p>
                </div>
              </div>
            </div>

            {(setupData?.isFeedback || role === "Manager" || role === "Super-Admin") && (
              <button
                onClick={() => setShowReviewModal(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg flex items-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm font-medium"
              >
                <EditIcon />
                Performance Evaluation
              </button>
            )}
          </div>

          {/* Employee Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <div className="bg-blue-50 rounded-lg p-4 border">
              <p className="text-sm text-blue-700 font-medium">Goals Completion</p>
              <div className="mt-2 mb-1 flex justify-between">
                <p className="text-lg font-bold text-gray-800">
                  {completedGoals}/{goals.length}
                </p>
                <p className="text-lg font-bold text-gray-800 mt-2">{goalCompletionPercentage.toFixed(0)}%</p>
              </div>
              <ProgressBar value={goalCompletionPercentage} color="bg-blue-500" />
            </div>

            <div className="bg-green-50 rounded-lg p-4 border">
              <p className="text-sm text-green-700 font-medium">Trainings Completed</p>
              <div className="mt-2 mb-1 flex justify-between">
                <p className="text-lg font-bold text-gray-800">
                  {completedTrainings}/{trainings.length}
                </p>
                <p className="text-lg font-bold text-gray-800 mt-2">{trainingCompletionPercentage.toFixed(0)}%</p>
              </div>
              <ProgressBar value={trainingCompletionPercentage} color="bg-green-500" />
            </div>

          

            <div className="bg-purple-50 rounded-lg p-4 border">
              <p className="text-sm text-purple-700 font-medium">Joined</p>
              <p className="text-lg font-bold text-gray-800 mt-2">
                {new Date(employee?.joinDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Goals */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
              <div className="border-b p-5">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <TargetIcon />
                  Performance Goals
                </h2>
                <p className="text-sm text-gray-500 mt-1">Goals set for the current performance period</p>
              </div>
              <div className="p-5">
                {goals?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No goals have been set yet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {goals.map((goal, index) => (
                      <div key={index} className="border-b pb-5 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-1 p-1.5 rounded-full ${goal.goalStatus === "Completed" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}`}
                            >
                              {goal.goalStatus === "Completed" ? <CheckIcon /> : <TargetIcon />}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">{goal.goal}</h3>
                              <div
                                className="mt-1 text-sm text-gray-600"
                                dangerouslySetInnerHTML={{ __html: goal.description }}
                              />

                              {goal.dueDate && (
                                <div className="mt-2 flex items-center text-xs text-gray-500">
                                  <CalendarIcon />
                                  <span className="ml-1">Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${goal.goalStatus === "Completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                          >
                            {goal.goalStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Middle Column: Trainings */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
              <div className="border-b p-5">
                <h2 className="text-xl font-bold text-gray-800">Completed Training</h2>
                <p className="text-sm text-gray-500 mt-1">Training programs completed during this performance period</p>
              </div>
              <div className="p-5">
                {trainings?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No training data available</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {trainings.map((training, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border-b last:border-0 pb-4 last:pb-0"
                      >
                        <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                          {training.trainingId.trainingLogo ? (
                            <img
                              src={training.trainingId.trainingLogo || "/placeholder.svg"}
                              alt={training.trainingId.trainingName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">No Logo</span>
                          )}
                        </div>
                        <div className="space-y-1 flex-1">
                          <h3 className="font-semibold text-gray-800">{training.trainingId.trainingName}</h3>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <CalendarIcon />
                              <span>Start: {new Date(training.startDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CalendarIcon />
                              <span>End: {new Date(training.endDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="mt-1">
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-full ${training.status === "Completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
                            >
                              {training.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: 360 Feedback and Manager Review */}
          <div className="lg:col-span-1 space-y-6">
            {/* Manager Review */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
              <div className="border-b p-5 bg-gradient-to-r from-amber-50 to-amber-100">
                <h2 className="text-xl font-bold text-gray-800">Manager Review</h2>
                <p className="text-sm text-gray-600 mt-1">Latest performance evaluation from manager</p>
              </div>
            {
            !managerReview ? 
            
            <div className="text-center py-8 text-gray-500">
            <p>Ratings not given yet</p>
          </div>
            :
            
            <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">{managerReview?.name || "N/A"}</h3>
                    <p className="text-sm text-gray-500">{managerReview?.position || "N/A"}</p>
                  </div>
                  <div className="text-right">
                   
                    <Rating value={managerReview?.overallRating || 0} />
                  </div>
                </div>

                <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700">Comments</h4>
                    <div className="mt-1 text-sm text-gray-600" 
                    dangerouslySetInnerHTML={{ __html:managerReview?.comments || "N/A" }} />
                </div>
              </div>}
            </div>

            {/* 360 Feedback */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
              <div className="border-b p-5 bg-gradient-to-r from-blue-50 to-blue-100">
                <h2 className="text-xl font-bold text-gray-800">360° Feedback</h2>
                <p className="text-sm text-gray-600 mt-1">Feedback from peers and team members</p>
              </div>
              <div className="p-5">
                {feedback360.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <p>No 360° feedback available</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {feedback360.map((feedback, index) => (
                      <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-800">{feedback.reviewer}</h3>
                            <p className="text-xs text-gray-500">{feedback.role}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
                              {new Date(feedback.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                            <Rating value={feedback.rating} />
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2" dangerouslySetInnerHTML={{__html: feedback.feedback}}/>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <RateReviewModel
        open={showReviewModal}
        id={goal}
        performance={performance}
        handleClose={() => setShowReviewModal(false)}
      />
    </div>
  )
}
