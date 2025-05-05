import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserProfile from "../hooks/UserData/useUser";
import ChatBot from "../pages/HR-Helpdesk/ChatBot/ChatBot";
import useSubscriptionGet from "../hooks/QueryHook/Subscription/hook";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { getCurrentUser, useGetCurrentRole } = UserProfile();

  const [user, setUser] = useState(null); // Initialize user as null initially
  const [isLoading, setIsLoading] = useState(true); // Initialize loading as true

  const role = useGetCurrentRole(); // Call useGetCurrentRole directly here

  useEffect(() => {
    setIsLoading(true);
    setUser(getCurrentUser());
    setIsLoading(false);
    // eslint-disable-next-line
  }, []); // Ensure the effect runs when getCurrentUser changes

  return (
    <AuthContext.Provider value={{ user, role, isLoading, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

function RequireAuth({
  children,
  permission = [
    "Super-Admin",
    "Delegate-Super-Admin",
    "Department-Head",
    "Delegate-Department-Head",
    "Department-Admin",
    "Delegate-Department-Admin",
    "Accountant",
    "Delegate-Accountant",
    "HR",
    "Manager",
    "Employee",
    "Teacher",
  ],
}) {
  const { user, role, isLoading } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const isAuthPage =
    window.location.pathname.includes("sign-in") ||
    window.location.pathname.includes("sign-up");

  const isPermission = permission?.includes(role);

  const organisationId =
    params.organisationId || params.organizationId || params.id || params.orgId;

  const { data } = useSubscriptionGet({ organisationId });
  const isPackages =
    data?.organisation?.packages?.includes("HR Help Desk") ?? false;
  console.log("packageName", data);

  useEffect(() => {
    if (!isPageLoaded || isLoading) {
      return;
    }

    let timer;

    if (role === "Foundation-Admin") {
      setIsPageLoaded(true);
      return navigate(`/organisation/${user.organizationId}/Attendance-FD`);
    }

    if ((user || isPermission) && isAuthPage) {
      setIsPageLoaded(true);
      return navigate("/");
    }

    if ((!user || !isPermission) && !isAuthPage) {
      setIsPageLoaded(true);
      timer = setTimeout(() => {
        return navigate("/sign-in");
      }, 1000);
    } else if (
      user?.organizationId !== organisationId &&
      role !== "Super-Admin"
    ) {
      setIsPageLoaded(true);
      return navigate(-1);
    }

    return () => {
      clearTimeout(timer);
    };

    // eslint-disable-next-line
  }, [isPageLoaded, isPermission, isLoading]);

  useEffect(() => {
    // Simulate page loading completion after 1 second
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // if (!isPageLoaded || isLoading) {
  //   return (
  //     <div className="flex items-center justify-center bg-gray-50 w-full h-[90vh]">
  //       <div className="grid place-items-center gap-2">
  //         <CircularProgress />
  //         <h1 className="text-center text-xl w-full">Loading</h1>
  //       </div>
  //     </div>
  //   );
  // }

  if (user && isPermission) {
    return (
      <>
        {/* <SwipeableTemporaryDrawer /> */}
        {children}

        {isPackages && (
          <ChatBot
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
            }}
          />
        )}
      </>
    );
  }
}

export default RequireAuth;
