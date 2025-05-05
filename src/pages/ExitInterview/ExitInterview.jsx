import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";

export default function ExitInterview() {
  const { id } = useParams();

  const naviagte = useNavigate()

  const { data: employeeData } = useQuery(
    ["employeeDataforisExit", id],
    () =>
      axios
        .get(
          `${process.env.REACT_APP_API}/route/getUser/${id}`
        )
        .then((res) => res?.data?.data),
    {
      enabled: !!id,
    }
  );

  

  const { data: questionsData } = useQuery(
    ["offboardQuestions"],
    () =>
      axios
        .get(
          `${process.env.REACT_APP_API}/route/setup/getOffboardDataForEmployee/${id}`
        )
        .then((res) => res?.data?.data),
    {
      enabled: !!id,
    }
  );


  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = questionsData.questions.map((question) => ({
      question: question.text,
      answers: question.answers,
      selectedAnswer: formData[question._id],
    }));

    try {
      await axios.post(
        `${process.env.REACT_APP_API}/route/isExitInterview/giveExitInterview/${id}`,
        { question: formattedData }
      );
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if(employeeData?.isOffboarded && employeeData?.question?.length > 0) {
    Cookies.remove("aegis");
    Cookies.remove("role");
    return naviagte("/sign-in")
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <div className="flex flex-col items-center text-center max-w-md">
          {/* <CheckCircle className="h-16 w-16 text-green-500 mb-4" /> */}
          <h2 className="text-2xl font-bold mb-2">Thank You for Your Feedback</h2>
          <p className="text-gray-600 mb-6">
            Your responses have been submitted successfully. We appreciate your
            time with our organization and wish you the best in your future
            endeavors.
          </p>
          <button
            onClick={() => {
                Cookies.remove("aegis");
                Cookies.remove("role");
                window.location.reload();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Thanks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full my-4 max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Exit Interview</h1>
        <p className="text-gray-600 mt-1">
          Please provide your honest feedback to help us improve our workplace.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-6">
          {questionsData?.questions?.map((question, index) => (
            <div key={question._id} className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">
                {index + 1}. {question.text}
              </h3>
              <div className="grid gap-2">
                {question.answers.map((answer, answerIndex) => (
                  <label
                    key={`${question._id}-${answerIndex}`}
                    className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                      formData[question._id] === answer
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <input
                        type="radio"
                        name={question._id}
                        value={answer}
                        checked={formData[question._id] === answer}
                        onChange={() => handleChange(question._id, answer)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border ${
                          formData[question._id] === answer
                            ? "border-blue-500 bg-white"
                            : "border-gray-400 bg-white"
                        } flex items-center justify-center`}
                      >
                        {formData[question._id] === answer && (
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                    </div>
                    <span className="flex-1">{answer}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
       
        </div>
        <div className="flex justify-between border-t p-6 bg-gray-50">
          <div className="text-sm text-gray-600">Your feedback will remain confidential.</div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
}

