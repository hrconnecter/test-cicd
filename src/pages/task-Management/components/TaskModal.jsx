"use client"

import { useState } from "react"
import UserAvatar from "./UserAvatar"

export default function TaskModal({ task, project, users, onClose, onUpdate, customFields, currentUser }) {
  const [editedTask, setEditedTask] = useState({ ...task })

  const formatDate = (dateString) => {
    return dateString ? dateString.split("T")[0] : ""
  }

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return ""

    const date = new Date(dateTimeString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedTask((prev) => ({ ...prev, [name]: value }))
  }

  const handleCustomFieldChange = (fieldName, value) => {
    setEditedTask((prev) => ({
      ...prev,
      customFieldValues: {
        ...prev.customFieldValues,
        [fieldName]: value,
      },
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(editedTask)
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const getAssignees = (assigneeIds) => {
    return assigneeIds.map((id) => users.find((user) => user.id === id)).filter(Boolean)
  }

  const assignees = getAssignees(editedTask.assignees)

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center">
            <div className={`h-3 w-3 rounded-sm ${project?.color || "bg-gray-500"} mr-2`}></div>
            <span className="text-sm text-gray-600">{project?.name || "Project"}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button className="text-gray-500 hover:text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>
            </button>

            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                name="title"
                value={editedTask.title}
                onChange={handleChange}
                className="w-full text-xl font-medium border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 px-0 py-2"
                placeholder="Task title"
              />
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={editedTask.status}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  name="priority"
                  value={editedTask.priority}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formatDate(editedTask.dueDate)}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={editedTask.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Add a description..."
              ></textarea>
            </div>

            {customFields && customFields.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom Fields</label>
                <div className="space-y-3">
                  {customFields.map((field) => {
                    const fieldValue = editedTask.customFieldValues?.[field.name] || ""

                    return (
                      <div key={field.id} className="flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">
                          {field.name} {field.required && <span className="text-red-500">*</span>}
                        </label>

                        {field.type === "text" && (
                          <input
                            type="text"
                            value={fieldValue}
                            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required={field.required}
                          />
                        )}

                        {field.type === "number" && (
                          <input
                            type="number"
                            value={fieldValue}
                            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required={field.required}
                          />
                        )}

                        {field.type === "select" && (
                          <select
                            value={fieldValue}
                            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required={field.required}
                          >
                            <option value="">Select {field.name}</option>
                            {field.options.map((option, idx) => (
                              <option key={idx} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        )}

                        {field.type === "date" && (
                          <input
                            type="date"
                            value={fieldValue}
                            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required={field.required}
                          />
                        )}

                        {field.type === "url" && (
                          <input
                            type="url"
                            value={fieldValue}
                            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="https://"
                            required={field.required}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignees</label>
              <div className="flex flex-wrap gap-2">
                {assignees.map((user) => (
                  <div key={user.id} className="flex items-center bg-gray-100 rounded-full pl-1 pr-2 py-1">
                    <UserAvatar user={user} size="sm" />
                    <span className="ml-2 text-sm">{user.name}</span>
                    <button
                      type="button"
                      className="ml-1 text-gray-400 hover:text-gray-600"
                      onClick={() => {
                        setEditedTask((prev) => ({
                          ...prev,
                          assignees: prev.assignees.filter((id) => id !== user.id),
                        }))
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}

                <button type="button" className="flex items-center text-blue-500 hover:text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="ml-1 text-sm">Add assignee</span>
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
              <div className="space-y-4">
                {editedTask.comments.length > 0 ? (
                  editedTask.comments.map((comment) => {
                    const commenter = users.find((user) => user.id === comment.userId)

                    return (
                      <div key={comment.id} className="flex space-x-3">
                        <UserAvatar user={commenter} size="sm" />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="font-medium text-sm">{commenter.name}</span>
                            <span className="ml-2 text-xs text-gray-500">{formatDateTime(comment.timestamp)}</span>
                          </div>
                          <div className="mt-1 text-sm text-gray-700">{comment.text}</div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-sm text-gray-500">No comments yet</div>
                )}

                <div className="flex space-x-3 mt-4">
                  <UserAvatar user={currentUser} size="sm" />
                  <div className="flex-1">
                    <textarea
                      rows={2}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                      placeholder="Add a comment..."
                    ></textarea>
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="flex justify-end space-x-2 p-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
