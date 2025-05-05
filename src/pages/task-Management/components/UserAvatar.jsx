export default function UserAvatar({ user, size = "sm" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div
      className={`${sizeClasses[size]} ${user.color} rounded-full flex items-center justify-center text-white font-medium`}
    >
      {getInitials(user.name)}
    </div>
  )
}
