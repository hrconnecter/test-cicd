"use client"

import { useState } from "react"
import UserAvatar from "./UserAvatar"

export default function SpaceModal({ onClose, onCreate, users, currentUser }) {
  const [newSpace, setNewSpace] = useState({
    name: "",
    description: "",
    color: "bg-blue-500",
    members: [],
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewSpace((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleColorSelect = (color) => {
    setNewSpace((prev) => ({
      ...prev,
      color,
    }))
  }

  const toggleMember = (userId) => {
    setNewSpace((prev) => {
      const members = [...prev.members]
      const index = members.indexOf(userId)

      if (index === -1) {
        members.push(userId)
      } else {
        members.splice(index, 1)
      }

      return {
        ...prev,
        members,
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreate(newSpace)
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const colorOptions = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ]

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Create New Space</h2>
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

        <form onSubmit={handleSubmit}>
          <div className="p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Space Name</label>
              <input
                type="text"
                name="name"
                value={newSpace.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Marketing, Development"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={newSpace.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the purpose of this space"
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`h-8 w-8 rounded-full ${color} ${newSpace.color === color ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
                    onClick={() => handleColorSelect(color)}
                  ></button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Members</label>
              <div className="border border-gray-300 rounded-md max-h-48 overflow-y-auto">
                {users
                  .filter((user) => user.id !== currentUser.id)
                  .map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <UserAvatar user={user} size="sm" />
                        <div className="ml-2">
                          <div className="font-medium text-sm">{user.name}</div>
                          <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={newSpace.members.includes(user.id)}
                        onChange={() => toggleMember(user.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                  ))}
              </div>
            </div>
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
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Space
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
