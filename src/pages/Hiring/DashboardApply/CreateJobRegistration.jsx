import React, { useContext, useState } from "react";
import {
  Email,
  Lock,
  Person,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import { useMutation } from "react-query";
import { TestContext } from "../../../State/Function/Main";

const CreateJobRegistration = ({ setShowModal, setIsAuthenticated }) => {
  console.log("setShowModal", setShowModal);

  const [isLogin, setIsLogin] = useState(true);
  const [visible, setVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  //handle alert
  const { handleAlert } = useContext(TestContext);
  // const navigate = useNavigate();
  // const { organisationId } = useParams();

  const handleFocus = (input) => setFocusedInput(input);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerMutation = useMutation(
    (data) =>
      axios.post(
        `${process.env.REACT_APP_API}/route/hiring/registration`,
        data
      ),
    {
      onSuccess: (res) => {
        handleAlert(true, "success", "Registration successful");
        setIsLogin(true); // Switch to login after registration
      },
      onError: (error) => {
        handleAlert(
          true,
          "error",
          error?.response?.data?.message || "Registration failed"
        );
      },
    }
  );

  const loginMutation = useMutation(
    (data) =>
      axios.post(`${process.env.REACT_APP_API}/route/hiring/login`, data),
    {
      onSuccess: (res) => {
        // Store token in localStorage
        const token = res.data?.token; // Adjust based on your backend response structure
        if (token) {
          localStorage.setItem("hiring_token", token);
        }

        handleAlert(true, "success", "Login successful");
        setShowModal(false);
        setIsAuthenticated(true);
        // navigate(`/organisation/${organisationId}/applied-jobs`);
      },
      onError: (error) => {
        handleAlert(
          true,
          "error",
          error?.response?.data?.message || "Login failed"
        );
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      email: form.email,
      password: form.password,
      ...(isLogin ? {} : { name: form.name }),
    };

    setLoading(true);
    const mutation = isLogin ? loginMutation : registerMutation;

    mutation.mutate(payload, {
      onSettled: () => setLoading(false),
    });
  };

  return (
    <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8">
      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setIsLogin(true)}
          className={`px-4 py-2 font-semibold text-md border-b-2 ${
            isLogin
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`px-4 py-2 font-semibold text-md border-b-2 ml-6 ${
            !isLogin
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500"
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Header */}
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        {isLogin ? "Welcome Back 👋" : "Create an Account"}
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name (Sign Up only) */}
        {!isLogin && (
          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div
              className={`mt-1 flex items-center border rounded-md px-3 py-2 bg-white ${
                focusedInput === "name" ? "border-blue-500" : "border-gray-300"
              }`}
            >
              <Person className="text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                onFocus={() => handleFocus("name")}
                onBlur={() => setFocusedInput(null)}
                className="ml-2 w-full border-none focus:outline-none"
                required
              />
            </div>
          </div>
        )}

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div
            className={`mt-1 flex items-center border rounded-md px-3 py-2 bg-white ${
              focusedInput === "email" ? "border-blue-500" : "border-gray-300"
            }`}
          >
            <Email className="text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              onFocus={() => handleFocus("email")}
              onBlur={() => setFocusedInput(null)}
              className="ml-2 w-full border-none focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div
            className={`mt-1 flex items-center border rounded-md px-3 py-2 bg-white ${
              focusedInput === "password"
                ? "border-blue-500"
                : "border-gray-300"
            }`}
          >
            <Lock className="text-gray-400" />
            <input
              type={visible ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              onFocus={() => handleFocus("password")}
              onBlur={() => setFocusedInput(null)}
              className="ml-2 w-full border-none focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setVisible(!visible)}
              className="ml-2 focus:outline-none"
            >
              {visible ? (
                <Visibility className="text-gray-500" />
              ) : (
                <VisibilityOff className="text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* Forgot password */}
        {isLogin && (
          <div className="flex justify-end text-sm">
            <Link
              to="/forgot-password"
              className="text-blue-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 px-4 flex justify-center items-center bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          {loading ? (
            <CircularProgress size={20} style={{ color: "white" }} />
          ) : isLogin ? (
            "Login"
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="text-sm text-center text-gray-600 mt-6">
        {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
        <button
          className="text-blue-500 font-medium hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Sign up" : "Login"}
        </button>
      </p>
    </div>
  );
};

export default CreateJobRegistration;
