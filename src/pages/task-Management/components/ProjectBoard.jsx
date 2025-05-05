"use client"

import { useState } from "react"
import UserAvatar from "./UserAvatar"

export default function ProjectBoard({ tasks, project, users, onTaskClick, onMoveTask, customFields, currentUser }) {
  const [draggingTask, setDraggingTask] = useState(null)

  const getAssignees = (assigneeIds) => {
    return assigneeIds.map((id) => users.find((user) => user.id === id)).filter(Boolean)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Urgent":
        return "border-l-red-600"
      case "High":
        return "border-l-red-500"
      case "Medium":
        return "border-l-yellow-500"
      case "Low":
        return "border-l-green-500"
      default:
        return "border-l-gray-300"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const columns = ["To Do", "In Progress", "Review", "Done"]

  const handleDragStart = (e, task) => {
    setDraggingTask(task)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, status) => {
    e.preventDefault()
    if (draggingTask && draggingTask.status !== status) {
      onMoveTask(draggingTask.id, status)
    }
    setDraggingTask(null)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{project?.name || "Tasks"}</h2>
        <button className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Task
        </button>
      </div>

      <div className="flex space-x-4 h-[calc(100vh-180px)]">
        {columns.map((status) => (
          <div
            key={status}
            className="flex-1 flex flex-col bg-gray-100 rounded-lg"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div className="p-3 font-medium text-gray-700 border-b border-gray-200 bg-gray-200 rounded-t-lg">
              {status}{" "}
              <span className="ml-2 text-gray-500 text-sm">
                ({tasks.filter((task) => task.status === status).length})
              </span>
            </div>

            <div className="flex-1 p-2 overflow-y-auto">
              {tasks
                .filter((task) => task.status === status)
                .map((task) => {
                  const assignees = getAssignees(task.assignees)

                  return (
                    <div
                      key={task.id}
                      className={`mb-2 bg-white rounded-md shadow border-l-4 ${getPriorityColor(task.priority)} cursor-pointer`}
                      onClick={() => onTaskClick(task)}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                    >
                      <div className="p-3">
                        <div className="font-medium mb-2">{task.title}</div>

                        <div className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</div>

                        {/* Custom Fields */}
                        {Object.entries(task.customFieldValues || {}).length > 0 && (
                          <div className="mb-3">
                            {Object.entries(task.customFieldValues).map(([fieldName, value]) => (
                              <div key={fieldName} className="flex items-center text-xs text-gray-500 mb-1">
                                <span className="font-medium mr-1">{fieldName}:</span> {value}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <div className="flex -space-x-2">
                            {assignees.slice(0, 3).map((user) => (
                              <div key={user.id} className="relative z-0 hover:z-10">
                                <UserAvatar user={user} size="sm" />
                              </div>
                            ))}
                            {assignees.length > 3 && (
                              <div className="relative z-0 hover:z-10 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600">
                                +{assignees.length - 3}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center">
                            {task.comments.length > 0 && (
                              <div className="flex items-center text-gray-500 text-xs mr-3">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                  />
                                </svg>
                                {task.comments.length}
                              </div>
                            )}

                            <div className="text-xs text-gray-500">{formatDate(task.dueDate)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
