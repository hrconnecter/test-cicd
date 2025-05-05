"use client"

import UserAvatar from "./UserAvatar"

export default function TaskList({ tasks, project, users, onTaskClick, customFields, currentUser }) {
  const getAssignees = (assigneeIds) => {
    return assigneeIds.map((id) => users.find((user) => user.id === id)).filter(Boolean)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Urgent":
        return "text-red-600 font-semibold"
      case "High":
        return "text-red-500"
      case "Medium":
        return "text-yellow-500"
      case "Low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Get custom field columns to display
  const customFieldColumns = customFields
    .filter((field) => field.required || tasks.some((task) => task.customFieldValues?.[field.name]))
    .slice(0, 2) // Limit to 2 custom fields to avoid overcrowding

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex justify-between items-center p-4 border-b">
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

      <div className="grid grid-cols-12 py-3 px-4 border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-500">
        <div className="col-span-4">Task</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1">Priority</div>
        <div className="col-span-1">Due Date</div>
        {customFieldColumns.map((field) => (
          <div key={field.id} className="col-span-1">
            {field.name}
          </div>
        ))}
        <div className={`col-span-${4 - customFieldColumns.length}`}>Assignees</div>
      </div>

      <div className="divide-y divide-gray-200">
        {tasks.map((task) => {
          const assignees = getAssignees(task.assignees)

          return (
            <div
              key={task.id}
              className="grid grid-cols-12 py-3 px-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => onTaskClick(task)}
            >
              <div className="col-span-4 flex items-center">
                <div className="mr-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                    checked={task.status === "Done"}
                    onChange={(e) => e.stopPropagation()}
                  />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{task.title}</div>
                  <div className="text-sm text-gray-500 truncate">{task.description}</div>
                </div>
              </div>

              <div className="col-span-2 flex items-center">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    task.status === "To Do"
                      ? "bg-gray-100 text-gray-800"
                      : task.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : task.status === "Review"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                  }`}
                >
                  {task.status}
                </span>
              </div>

              <div className={`col-span-1 flex items-center ${getPriorityColor(task.priority)}`}>{task.priority}</div>

              <div className="col-span-1 flex items-center text-sm">{formatDate(task.dueDate)}</div>

              {customFieldColumns.map((field) => (
                <div key={field.id} className="col-span-1 flex items-center text-sm">
                  {task.customFieldValues?.[field.name] || "-"}
                </div>
              ))}

              <div className={`col-span-${4 - customFieldColumns.length} flex items-center`}>
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
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
