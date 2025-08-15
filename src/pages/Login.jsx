// //src/pages/Login.jsx
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginUser } from "../auth.js"; // Appwrite auth helper
// import { useAuth } from "../contexts/AuthContext.jsx";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const { setCurrentUser } = useAuth();
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const user = await loginUser(email, password);
//       setCurrentUser(user);
//       navigate("/"); // redirect to KanbanBoard
//     } catch (err) {
//       console.error(err);
//       setError("Invalid email or password");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <form
//         onSubmit={handleLogin}
//         className="bg-white p-6 rounded shadow-md w-96 flex flex-col gap-4"
//       >
//         <h2 className="text-xl font-bold">Login</h2>

//         <input
//           type="email"
//           placeholder="Email"
//           className="border p-2 rounded"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="border p-2 rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         {error && <p className="text-red-600">{error}</p>}

//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }



import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../auth.js"; // Appwrite auth helper
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await loginUser(email, password);
      setCurrentUser(user);
      navigate("/"); // redirect to KanbanBoard
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-96 flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>

        <p className="text-sm text-gray-600 text-center mt-2">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up here
          </Link>
        </p>
      </form>
    </div>
  );
}
