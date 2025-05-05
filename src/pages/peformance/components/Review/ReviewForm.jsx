
import { useState } from "react"
import { FiStar } from "react-icons/fi"


export default function ReviewForm({ isOpen, onClose, employeeName }) {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg w-full max-w-2xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold">Review & Rating Form</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select assignee name</label>
            <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>{employeeName}</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Add rating</label>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-2xl focus:outline-none"
                >
                  <FiStar
                    className={`h-6 w-6 ${rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter review</label>
            <div className="border rounded-md">
              <div className="flex flex-wrap items-center gap-1 border-b p-2">
                <select className="text-sm border rounded px-2 py-1">
                  <option>Sans Serif</option>
                </select>
                <select className="text-sm border rounded px-2 py-1">
                  <option>Normal</option>
                </select>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="w-4 h-4"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a2.5 2.5 0 0 1-2.5 2.5H8V13h7.5a2.5 2.5 0 0 1 2.5 2.5z" />
                    <path d="M8 13v5h7.5a2.5 2.5 0 0 0 0-5H8zm0-2h4.5a2.5 2.5 0 1 0 0-5H8v5z" fill="currentColor" />
                  </svg>
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="w-4 h-4"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      d="M15.246 14H8.754l-1.6 4H5l6-15h2l6 15h-2.154l-1.6-4zm-.8-2L12 5.885 9.554 12h4.892z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="w-4 h-4"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M8 3v9a4 4 0 1 0 8 0V3h2v9a6 6 0 1 1-12 0V3h2z" fill="currentColor" />
                  </svg>
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="w-4 h-4"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      d="M5 9h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1zm0-2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V10a3 3 0 0 0-3-3H5z"
                      fill="currentColor"
                    />
                    <path d="M18 14h-2v3h-3v2h3v3h2v-3h3v-2h-3v-3z" fill="currentColor" />
                  </svg>
                </button>
              </div>
              <textarea
                className="w-full p-3 min-h-[150px] focus:outline-none"
                placeholder="Enter your review here..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t p-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            CANCEL
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            SAVE
          </button>
        </div>
      </div>
    </div>
  )
}
