import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);

      toast.success("Login Successful");

      navigate("/dashboard");

    } catch (err) {

      console.log(err);

      toast.error("Invalid Credentials");

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white">

      <div className="w-full max-w-md bg-gray-900/70 backdrop-blur-lg border border-gray-800 p-10 rounded-3xl shadow-2xl">

        <h1 className="text-4xl font-bold mb-2 text-center">
          Welcome Back
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Login to continue your AI interview journey
        </p>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 outline-none focus:border-blue-500 mb-5"
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 outline-none focus:border-blue-500 mb-6"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 transition py-4 rounded-xl font-bold text-lg shadow-lg"
        >
          Login
        </button>

        <p className="text-center text-gray-400 mt-6">

          Don’t have an account?{" "}

          <Link
            to="/register"
            className="text-blue-400 hover:text-blue-300"
          >
            Register
          </Link>

        </p>

      </div>

    </div>

  );

}

export default Login;