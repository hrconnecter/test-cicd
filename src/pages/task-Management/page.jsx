import { useState, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import SettingsPanel from "./components/SettingsPanel"
import TaskList from "./components/TaskList"
import ProjectBoard from "./components/ProjectBoard"
import TaskModal from "./components/TaskModal"
import SpaceModal from "./components/SpaceModal"
import ProjectModal from "./components/ProjectModal"


export default function Taskmanagement() {
  const [activeView, setActiveView] = useState("list") // 'list', 'board', or 'settings'
  const [selectedTask, setSelectedTask] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeSettingsTab, setActiveSettingsTab] = useState("general")
  const [currentUser, setCurrentUser] = useState(null)
  const [showSpaceModal, setShowSpaceModal] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [activeSpace, setActiveSpace] = useState(null)
  const [activeProject, setActiveProject] = useState(null)

  // Sample data
  const [users] = useState([
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      color: "bg-blue-400",
      role: "admin",
      email: "alex@example.com",
    },
    {
      id: 2,
      name: "Sam Taylor",
      avatar: "/placeholder.svg?height=40&width=40",
      color: "bg-green-400",
      role: "project_manager",
      email: "sam@example.com",
    },
    {
      id: 3,
      name: "Jordan Lee",
      avatar: "/placeholder.svg?height=40&width=40",
      color: "bg-purple-400",
      role: "member",
      email: "jordan@example.com",
    },
    {
      id: 4,
      name: "Casey Morgan",
      avatar: "/placeholder.svg?height=40&width=40",
      color: "bg-yellow-400",
      role: "member",
      email: "casey@example.com",
    },
  ])

  const [spaces, setSpaces] = useState([
    {
      id: 1,
      name: "Marketing",
      color: "bg-purple-500",
      description: "All marketing related work",
      createdBy: 1,
      members: [1, 2, 3],
    },
    {
      id: 2,
      name: "Development",
      color: "bg-blue-500",
      description: "Software development projects",
      createdBy: 1,
      members: [1, 2, 4],
    },
    {
      id: 3,
      name: "Design",
      color: "bg-green-500",
      description: "Design projects and assets",
      createdBy: 2,
      members: [2, 3],
    },
  ])

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Q4 Campaign",
      color: "bg-purple-500",
      spaceId: 1,
      description: "Q4 marketing campaign planning and execution",
      createdBy: 2,
      members: [1, 2, 3],
    },
    {
      id: 2,
      name: "Website Redesign",
      color: "bg-blue-500",
      spaceId: 2,
      description: "Company website redesign project",
      createdBy: 1,
      members: [1, 2, 4],
    },
    {
      id: 3,
      name: "Mobile App",
      color: "bg-green-500",
      spaceId: 2,
      description: "Mobile application development",
      createdBy: 2,
      members: [2, 4],
    },
    {
      id: 4,
      name: "Brand Guidelines",
      color: "bg-yellow-500",
      spaceId: 3,
      description: "Update company brand guidelines",
      createdBy: 2,
      members: [2, 3],
    },
  ])

  const [customFields, setCustomFields] = useState([
    {
      id: 1,
      name: "Priority",
      type: "select",
      options: ["Low", "Medium", "High", "Urgent"],
      required: true,
      spaceId: null, // null means global field
      projectId: null, // null means applies to all projects
    },
    {
      id: 2,
      name: "Status",
      type: "select",
      options: ["To Do", "In Progress", "Review", "Done"],
      required: true,
      spaceId: null,
      projectId: null,
    },
    {
      id: 3,
      name: "Estimated Hours",
      type: "number",
      required: false,
      spaceId: 2,
      projectId: null,
    },
    {
      id: 4,
      name: "Review URL",
      type: "url",
      required: false,
      spaceId: 3,
      projectId: 4,
    },
  ])

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Create wireframes",
      description: "Design initial wireframes for homepage",
      status: "To Do",
      priority: "High",
      projectId: 2,
      assignees: [1, 2],
      dueDate: "2023-12-15",
      createdBy: 1,
      customFieldValues: {
        "Estimated Hours": 8,
      },
      comments: [
        { id: 1, userId: 3, text: "Let me know when these are ready for review", timestamp: "2023-12-01T10:30:00" },
      ],
    },
    {
      id: 2,
      title: "Write content for blog",
      description: "Create 5 blog posts for the marketing campaign",
      status: "In Progress",
      priority: "Medium",
      projectId: 1,
      assignees: [3],
      dueDate: "2023-12-10",
      createdBy: 2,
      customFieldValues: {},
      comments: [],
    },
    {
      id: 3,
      title: "Implement authentication",
      description: "Set up user authentication for the mobile app",
      status: "In Progress",
      priority: "High",
      projectId: 3,
      assignees: [1, 4],
      dueDate: "2023-12-20",
      createdBy: 2,
      customFieldValues: {
        "Estimated Hours": 12,
      },
      comments: [],
    },
    {
      id: 4,
      title: "Design logo options",
      description: "Create 3-5 logo options for client review",
      status: "Done",
      priority: "Medium",
      projectId: 4,
      assignees: [2],
      dueDate: "2023-12-05",
      createdBy: 2,
      customFieldValues: {
        "Review URL": "https://example.com/designs/logos",
      },
      comments: [],
    },
    {
      id: 5,
      title: "Set up analytics",
      description: "Implement Google Analytics and create dashboard",
      status: "To Do",
      priority: "Low",
      projectId: 1,
      assignees: [3, 4],
      dueDate: "2023-12-25",
      createdBy: 1,
      customFieldValues: {},
      comments: [],
    },
  ])

  // Set current user (for demo purposes, we'll use the admin)
  useEffect(() => {
    setCurrentUser(users[0])
  }, [users])

  const handleTaskClick = (task) => {
    setSelectedTask(task)
  }

  const handleCloseModal = () => {
    setSelectedTask(null)
    setShowSpaceModal(false)
    setShowProjectModal(false)
  }

  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    setSelectedTask(null)
  }

  const handleMoveTask = (taskId, newStatus) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  const handleCreateSpace = (newSpace) => {
    const spaceId = spaces.length > 0 ? Math.max(...spaces.map((s) => s.id)) + 1 : 1
    const space = {
      ...newSpace,
      id: spaceId,
      createdBy: currentUser.id,
      members: [currentUser.id, ...newSpace.members],
    }
    setSpaces([...spaces, space])
    setShowSpaceModal(false)
  }

  const handleCreateProject = (newProject) => {
    const projectId = projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1
    const project = {
      ...newProject,
      id: projectId,
      createdBy: currentUser.id,
      members: [currentUser.id, ...newProject.members],
    }
    setProjects([...projects, project])
    setShowProjectModal(false)
  }

  const handleCreateCustomField = (newField) => {
    const fieldId = customFields.length > 0 ? Math.max(...customFields.map((f) => f.id)) + 1 : 1
    const field = {
      ...newField,
      id: fieldId,
    }
    setCustomFields([...customFields, field])
  }

  const getFilteredTasks = (projectId) => {
    return tasks.filter((task) => task.projectId === projectId)
  }

  const getSpaceById = (id) => {
    return spaces.find((space) => space.id === id)
  }

  const getProjectById = (id) => {
    return projects.find((project) => project.id === id)
  }

  const canCreateSpace = (user) => {
    return user && user.role === "admin"
  }

  const canCreateProject = (user, spaceId) => {
    if (!user) return false
    if (user.role === "admin") return true

    const space = getSpaceById(spaceId)
    return user.role === "project_manager" && space && space.members.includes(user.id)
  }

  const canAccessSettings = (user) => {
    return user && (user.role === "admin" || user.role === "project_manager")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        spaces={spaces}
        projects={projects}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        activeView={activeView}
        setActiveView={setActiveView}
        currentUser={currentUser}
        canCreateSpace={canCreateSpace(currentUser)}
        canCreateProject={canCreateProject}
        onCreateSpace={() => setShowSpaceModal(true)}
        onCreateProject={(spaceId) => {
          setActiveSpace(spaceId)
          setShowProjectModal(true)
        }}
        onSelectSpace={setActiveSpace}
        onSelectProject={(projectId) => {
          setActiveProject(projectId)
          setActiveView("list")
        }}
        activeSpace={activeSpace}
        activeProject={activeProject}
        canAccessSettings={canAccessSettings(currentUser)}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          users={users}
          currentUser={currentUser}
          activeSpace={activeSpace ? getSpaceById(activeSpace) : null}
          activeProject={activeProject ? getProjectById(activeProject) : null}
        />

        <main className="flex-1 overflow-auto p-4">
          {activeView === "settings" && canAccessSettings(currentUser) ? (
            <SettingsPanel
              currentUser={currentUser}
              activeTab={activeSettingsTab}
              setActiveTab={setActiveSettingsTab}
              spaces={spaces}
              projects={projects}
              users={users}
              customFields={customFields}
              onCreateCustomField={handleCreateCustomField}
            />
          ) : activeView === "list" && activeProject ? (
            <TaskList
              tasks={getFilteredTasks(activeProject)}
              project={getProjectById(activeProject)}
              users={users}
              onTaskClick={handleTaskClick}
              customFields={customFields.filter(
                (field) => field.projectId === null || field.projectId === activeProject,
              )}
              currentUser={currentUser}
            />
          ) : activeView === "board" && activeProject ? (
            <ProjectBoard
              tasks={getFilteredTasks(activeProject)}
              project={getProjectById(activeProject)}
              users={users}
              onTaskClick={handleTaskClick}
              onMoveTask={handleMoveTask}
              customFields={customFields.filter(
                (field) => field.projectId === null || field.projectId === activeProject,
              )}
              currentUser={currentUser}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Welcome to TaskFlow</h2>
                <p className="text-gray-500 mb-6">Select a project from the sidebar to get started</p>
                {canCreateSpace(currentUser) && (
                  <button
                    onClick={() => setShowSpaceModal(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Create a Space
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          project={getProjectById(selectedTask.projectId)}
          users={users}
          onClose={handleCloseModal}
          onUpdate={handleUpdateTask}
          customFields={customFields.filter(
            (field) => field.projectId === null || field.projectId === selectedTask.projectId,
          )}
          currentUser={currentUser}
        />
      )}

      {showSpaceModal && (
        <SpaceModal onClose={handleCloseModal} onCreate={handleCreateSpace} users={users} currentUser={currentUser} />
      )}

      {showProjectModal && (
        <ProjectModal
          onClose={handleCloseModal}
          onCreate={handleCreateProject}
          users={users}
          currentUser={currentUser}
          spaceId={activeSpace}
          space={getSpaceById(activeSpace)}
        />
      )}
    </div>
  )
}
