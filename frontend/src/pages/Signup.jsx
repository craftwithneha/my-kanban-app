
// //src/pages/Signup.jsx
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { signupUser } from "../auth.js"; // Appwrite auth helper
// import { useAuth } from "../contexts/AuthContext.jsx";

// export default function Signup() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const { setCurrentUser } = useAuth();
//   const navigate = useNavigate();

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const user = await signupUser(email, password, name);
//       setCurrentUser(user);
//       navigate("/"); // redirect to KanbanBoard
//     } catch (err) {
//       console.error(err);
//       setError("Signup failed. Try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <form
//         onSubmit={handleSignup}
//         className="bg-white p-6 rounded shadow-md w-96 flex flex-col gap-4"
//       >
//         <h2 className="text-xl font-bold">Sign Up</h2>

//         <input
//           type="text"
//           placeholder="Name"
//           className="border p-2 rounded"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />

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
//           Sign Up
//         </button>
//       </form>
//     </div>
//   );
// }



import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../auth.js"; // Appwrite auth helper
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await signupUser(email, password, name);
      setCurrentUser(user);
      navigate("/"); // redirect to KanbanBoard
    } catch (err) {
      console.error(err);
      setError("Signup failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded shadow-md w-96 flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold">Sign Up</h2>

        <input
          type="text"
          placeholder="Name"
          className="border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          Sign Up
        </button>

        <p className="text-sm text-gray-600 text-center mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
