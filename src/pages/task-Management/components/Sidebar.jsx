"use client"

import { useState } from "react"

export default function Sidebar({
  spaces,
  projects,
  collapsed,
  setCollapsed,
  activeView,
  setActiveView,
  currentUser,
  canCreateSpace,
  canCreateProject,
  onCreateSpace,
  onCreateProject,
  onSelectSpace,
  onSelectProject,
  activeSpace,
  activeProject,
  canAccessSettings,
}) {
  const [expandedSpaces, setExpandedSpaces] = useState({})

  const toggleSpaceExpand = (spaceId) => {
    setExpandedSpaces((prev) => ({
      ...prev,
      [spaceId]: !prev[spaceId],
    }))
  }

  const getSpaceProjects = (spaceId) => {
    return projects.filter((project) => project.spaceId === spaceId)
  }

  return (
    <aside
      className={`bg-gray-900 text-white transition-all duration-300 ${collapsed ? "w-16" : "w-64"} flex flex-col`}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        <div className={`flex items-center ${collapsed ? "justify-center w-full" : ""}`}>
          <div className="bg-blue-500 h-8 w-8 rounded-md flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          {!collapsed && <span className="ml-2 font-bold text-lg">TaskFlow</span>}
        </div>
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} className="text-gray-400 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        )}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="absolute -right-3 top-10 bg-blue-500 rounded-full p-1 text-white shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="py-4">
          <div className={`px-4 ${collapsed ? "text-center" : ""} mb-2 text-xs font-semibold text-gray-400 uppercase`}>
            {!collapsed && "Views"}
          </div>

          {canAccessSettings && (
            <button
              className={`flex items-center py-2 px-4 w-full ${
                activeView === "settings"
                  ? "bg-gray-800 text-blue-400"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
              onClick={() => setActiveView("settings")}
            >
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {!collapsed && <span className="ml-3">Settings</span>}
            </button>
          )}
        </div>

        <div className="py-4">
          <div className="flex items-center justify-between px-4 mb-2">
            <div className={`${collapsed ? "text-center w-full" : ""} text-xs font-semibold text-gray-400 uppercase`}>
              {!collapsed && "Spaces"}
            </div>
            {!collapsed && canCreateSpace && (
              <button onClick={onCreateSpace} className="text-gray-400 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            )}
          </div>

          {spaces.map((space) => (
            <div key={space.id} className="mb-1">
              <button
                className={`flex items-center py-2 px-4 w-full ${
                  activeSpace === space.id
                    ? "bg-gray-800 text-blue-400"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                } ${collapsed ? "justify-center" : ""}`}
                onClick={() => {
                  onSelectSpace(space.id)
                  if (!collapsed) {
                    toggleSpaceExpand(space.id)
                  }
                }}
              >
                <div className={`h-3 w-3 rounded-sm ${space.color}`}></div>
                {!collapsed && (
                  <>
                    <span className="ml-3 truncate flex-1 text-left">{space.name}</span>
                    {expandedSpaces[space.id] ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </>
                )}
              </button>

              {!collapsed && expandedSpaces[space.id] && (
                <div className="ml-6 pl-4 border-l border-gray-700">
                  {getSpaceProjects(space.id).map((project) => (
                    <button
                      key={project.id}
                      className={`flex items-center py-2 px-2 w-full text-sm ${
                        activeProject === project.id
                          ? "bg-gray-800 text-blue-400"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      } rounded-md my-1`}
                      onClick={() => onSelectProject(project.id)}
                    >
                      <div className={`h-2 w-2 rounded-sm ${project.color}`}></div>
                      <span className="ml-2 truncate">{project.name}</span>
                    </button>
                  ))}

                  {canCreateProject(currentUser, space.id) && (
                    <button
                      className="flex items-center py-2 px-2 w-full text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-md my-1"
                      onClick={() => onCreateProject(space.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
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
                      <span className="ml-2">New Project</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {collapsed && canCreateSpace && (
            <button
              className="flex items-center py-2 px-4 w-full justify-center text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={onCreateSpace}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          )}
        </div>

        {activeProject && (
          <div className="py-4">
            <div
              className={`px-4 ${collapsed ? "text-center" : ""} mb-2 text-xs font-semibold text-gray-400 uppercase`}
            >
              {!collapsed && "Project Views"}
            </div>

            <button
              className={`flex items-center py-2 px-4 w-full ${
                activeView === "list" ? "bg-gray-800 text-blue-400" : "text-gray-300 hover:bg-gray-800 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
              onClick={() => setActiveView("list")}
            >
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
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              {!collapsed && <span className="ml-3">List View</span>}
            </button>

            <button
              className={`flex items-center py-2 px-4 w-full ${
                activeView === "board"
                  ? "bg-gray-800 text-blue-400"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
              onClick={() => setActiveView("board")}
            >
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
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                />
              </svg>
              {!collapsed && <span className="ml-3">Board View</span>}
            </button>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className={`flex items-center ${collapsed ? "justify-center" : ""}`}>
          <div
            className={`${currentUser?.color || "bg-gray-500"} h-8 w-8 rounded-full flex items-center justify-center text-white font-medium`}
          >
            {currentUser?.name?.charAt(0) || "?"}
          </div>
          {!collapsed && (
            <div className="ml-3">
              <div className="text-sm font-medium">{currentUser?.name || "User"}</div>
              <div className="text-xs text-gray-400 capitalize">{currentUser?.role || "Member"}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
