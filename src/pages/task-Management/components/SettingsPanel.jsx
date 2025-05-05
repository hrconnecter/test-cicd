"use client"

import { useState } from "react"
import UserAvatar from "./UserAvatar"

export default function SettingsPanel({
  currentUser,
  activeTab,
  setActiveTab,
  spaces,
  projects,
  users,
  customFields,
  onCreateCustomField,
}) {
  const [newCustomField, setNewCustomField] = useState({
    name: "",
    type: "text",
    options: "",
    required: false,
    spaceId: null,
    projectId: null,
  })

  const isAdmin = currentUser?.role === "admin"

  const handleCustomFieldChange = (e) => {
    const { name, value, type, checked } = e.target
    setNewCustomField((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmitCustomField = (e) => {
    e.preventDefault()

    const field = {
      ...newCustomField,
      options: newCustomField.type === "select" ? newCustomField.options.split(",").map((o) => o.trim()) : undefined,
    }

    onCreateCustomField(field)

    setNewCustomField({
      name: "",
      type: "text",
      options: "",
      required: false,
      spaceId: null,
      projectId: null,
    })
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex border-b">
        <div className="w-64 border-r">
          <nav className="p-4">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>
            <ul className="space-y-1">
              <li>
                <button
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeTab === "general" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("general")}
                >
                  General
                </button>
              </li>
              {isAdmin && (
                <>
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md ${
                        activeTab === "permissions" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveTab("permissions")}
                    >
                      Permissions
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md ${
                        activeTab === "workflows" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveTab("workflows")}
                    >
                      Workflows
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md ${
                        activeTab === "tools" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveTab("tools")}
                    >
                      Tools
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md ${
                        activeTab === "features" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveTab("features")}
                    >
                      Features
                    </button>
                  </li>
                </>
              )}
              <li>
                <button
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeTab === "customFields" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("customFields")}
                >
                  Custom Fields
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeTab === "members" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("members")}
                >
                  Members
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex-1 p-6">
          {activeTab === "general" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">General Settings</h2>
              <div className="max-w-md">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue="TaskFlow Organization"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>UTC (Coordinated Universal Time)</option>
                    <option>EST (Eastern Standard Time)</option>
                    <option>PST (Pacific Standard Time)</option>
                  </select>
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === "permissions" && isAdmin && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Permissions</h2>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Role Permissions</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-5 gap-4 mb-2 font-medium text-gray-700 border-b pb-2">
                    <div>Role</div>
                    <div>Create Spaces</div>
                    <div>Create Projects</div>
                    <div>Invite Members</div>
                    <div>Access Settings</div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 py-2 border-b">
                    <div className="font-medium">Admin</div>
                    <div>
                      <input type="checkbox" checked disabled className="h-5 w-5" />
                    </div>
                    <div>
                      <input type="checkbox" checked disabled className="h-5 w-5" />
                    </div>
                    <div>
                      <input type="checkbox" checked disabled className="h-5 w-5" />
                    </div>
                    <div>
                      <input type="checkbox" checked disabled className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 py-2 border-b">
                    <div className="font-medium">Project Manager</div>
                    <div>
                      <input type="checkbox" disabled className="h-5 w-5" />
                    </div>
                    <div>
                      <input type="checkbox" checked className="h-5 w-5" />
                    </div>
                    <div>
                      <input type="checkbox" checked className="h-5 w-5" />
                    </div>
                    <div>
                      <input type="checkbox" checked className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 py-2">
                    <div className="font-medium">Member</div>
                    <div>
                      <input type="checkbox" disabled className="h-5 w-5" />
                    </div>
                    <div>
                      <input type="checkbox" disabled className="h-5 w-5" />
                    </div>
                    <div>
                      <input type="checkbox" className="h-5 w-5" />
                    </div>
                    <div>
                      <input type="checkbox" disabled className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Save Changes</button>
            </div>
          )}

          {activeTab === "workflows" && isAdmin && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Workflows</h2>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Task Statuses</h3>
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="bg-gray-200 px-3 py-1 rounded-full text-gray-800 flex items-center">
                      To Do
                      <button className="ml-2 text-gray-500 hover:text-gray-700">
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
                    <div className="bg-blue-100 px-3 py-1 rounded-full text-blue-800 flex items-center">
                      In Progress
                      <button className="ml-2 text-blue-500 hover:text-blue-700">
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
                    <div className="bg-yellow-100 px-3 py-1 rounded-full text-yellow-800 flex items-center">
                      Review
                      <button className="ml-2 text-yellow-500 hover:text-yellow-700">
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
                    <div className="bg-green-100 px-3 py-1 rounded-full text-green-800 flex items-center">
                      Done
                      <button className="ml-2 text-green-500 hover:text-green-700">
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
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Add new status"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600">Add</button>
                  </div>
                </div>

                <h3 className="text-lg font-medium mb-2">Automation Rules</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="mb-4 p-3 border border-gray-200 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Auto-assign to creator</h4>
                      <div className="flex items-center">
                        <span className="text-sm text-green-600 mr-2">Active</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Automatically assigns new tasks to the person who created them.
                    </p>
                  </div>

                  <div className="mb-4 p-3 border border-gray-200 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Notify on due date</h4>
                      <div className="flex items-center">
                        <span className="text-sm text-green-600 mr-2">Active</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Sends a notification to assignees when a task is due.</p>
                  </div>

                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Add Automation Rule
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tools" && isAdmin && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-md mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-medium">Email Integration</h3>
                    </div>
                    <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">
                      Connect
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Connect your email to create tasks from emails and receive notifications.
                  </p>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-2 rounded-md mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-purple-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-medium">Slack Integration</h3>
                    </div>
                    <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">
                      Connect
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Connect Slack to create tasks from messages and receive notifications.
                  </p>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-md mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-medium">Google Drive</h3>
                    </div>
                    <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">
                      Connect
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">Connect Google Drive to attach files to tasks and projects.</p>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="bg-red-100 p-2 rounded-md mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-red-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-medium">Zoom Integration</h3>
                    </div>
                    <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">
                      Connect
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Connect Zoom to schedule and join meetings directly from tasks.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "features" && isAdmin && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Time Tracking</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600">Enable time tracking for tasks and projects.</p>
                </div>

                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Gantt Charts</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600">Enable Gantt chart view for project timelines.</p>
                </div>

                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Calendar View</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600">Enable calendar view for tasks and deadlines.</p>
                </div>

                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">File Attachments</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600">Enable file attachments for tasks and projects.</p>
                </div>

                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Task Dependencies</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600">Enable task dependencies for complex workflows.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "customFields" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Custom Fields</h2>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Current Custom Fields</h3>
                <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3">Name</th>
                        <th className="text-left py-2 px-3">Type</th>
                        <th className="text-left py-2 px-3">Required</th>
                        <th className="text-left py-2 px-3">Space</th>
                        <th className="text-left py-2 px-3">Project</th>
                        <th className="text-left py-2 px-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customFields.map((field) => (
                        <tr key={field.id} className="border-b">
                          <td className="py-2 px-3">{field.name}</td>
                          <td className="py-2 px-3 capitalize">{field.type}</td>
                          <td className="py-2 px-3">{field.required ? "Yes" : "No"}</td>
                          <td className="py-2 px-3">
                            {field.spaceId ? spaces.find((s) => s.id === field.spaceId)?.name : "All Spaces"}
                          </td>
                          <td className="py-2 px-3">
                            {field.projectId ? projects.find((p) => p.id === field.projectId)?.name : "All Projects"}
                          </td>
                          <td className="py-2 px-3">
                            <button className="text-blue-500 hover:text-blue-700 mr-2">Edit</button>
                            <button className="text-red-500 hover:text-red-700">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Add Custom Field</h3>
                <form onSubmit={handleSubmitCustomField} className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Field Name</label>
                      <input
                        type="text"
                        name="name"
                        value={newCustomField.name}
                        onChange={handleCustomFieldChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Priority, Story Points"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Field Type</label>
                      <select
                        name="type"
                        value={newCustomField.type}
                        onChange={handleCustomFieldChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="select">Dropdown</option>
                        <option value="date">Date</option>
                        <option value="url">URL</option>
                      </select>
                    </div>

                    {newCustomField.type === "select" && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Options (comma separated)
                        </label>
                        <input
                          type="text"
                          name="options"
                          value={newCustomField.options}
                          onChange={handleCustomFieldChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Low, Medium, High"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Space (optional)</label>
                      <select
                        name="spaceId"
                        value={newCustomField.spaceId || ""}
                        onChange={handleCustomFieldChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Spaces</option>
                        {spaces.map((space) => (
                          <option key={space.id} value={space.id}>
                            {space.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project (optional)</label>
                      <select
                        name="projectId"
                        value={newCustomField.projectId || ""}
                        onChange={handleCustomFieldChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!newCustomField.spaceId}
                      >
                        <option value="">All Projects</option>
                        {newCustomField.spaceId &&
                          projects
                            .filter((project) => project.spaceId === Number.parseInt(newCustomField.spaceId))
                            .map((project) => (
                              <option key={project.id} value={project.id}>
                                {project.name}
                              </option>
                            ))}
                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="required"
                        name="required"
                        checked={newCustomField.required}
                        onChange={handleCustomFieldChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="required" className="ml-2 block text-sm text-gray-900">
                        Required Field
                      </label>
                    </div>
                  </div>

                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Add Field
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === "members" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Members</h2>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Team Members</h3>
                  <button className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center">
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Invite Member
                  </button>
                </div>

                <div className="bg-gray-50 rounded-md overflow-hidden">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-100 border-b">
                        <th className="text-left py-3 px-4">User</th>
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Role</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <UserAvatar user={user} size="sm" />
                              <span className="ml-2 font-medium">{user.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4 capitalize">{user.role}</td>
                          <td className="py-3 px-4">
                            {isAdmin && user.id !== currentUser?.id && (
                              <>
                                <button className="text-blue-500 hover:text-blue-700 mr-3">Edit Role</button>
                                <button className="text-red-500 hover:text-red-700">Remove</button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {isAdmin && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Pending Invitations</h3>
                  <div className="bg-gray-50 p-4 rounded-md text-center text-gray-500">No pending invitations</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
