// import { Routes, Route, Navigate } from "react-router-dom";
// import Header from "./components/Header.jsx";
// import Sidebar from "./components/Sidebar.jsx";
// import KanbanBoard from "./components/Kanbanboard.jsx";
// import Login from "./pages/Login.jsx";
// import Signup from "./pages/Signup.jsx";
// import { useAuth } from "./contexts/AuthContext.jsx";


// export default function App() {
//   const { currentUser, loading } = useAuth();

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       {currentUser && <Header />}

//       <div className="flex flex-1">
//         {currentUser && <Sidebar />}

//         <main className="flex-1 p-4">
//           <Routes>
//             {!currentUser ? (
//               <>
//                <Route path="/signup" element={<Signup/>} />
//                 <Route path="/login" element={<Login/>} />
//                 <Route path="*" element={<Navigate to="/signup" replace />} />
//               </>
//             ) : (
//               <>
//                 <Route path="/" element={<KanbanBoard currentUser={currentUser} />} />
//               </>
//             )}
//           </Routes>
//         </main>
//       </div>
//     </div>
//   );
// }



import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import KanbanBoard from "./components/Kanbanboard.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import { useAuth } from "./contexts/AuthContext.jsx";

export default function App() {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {currentUser && <Header />}

      <div className="flex flex-1">
        {currentUser && <Sidebar />}

        <main className="flex-1 p-4">
          <Routes>
            {!currentUser ? (
              <>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/signup" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<KanbanBoard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </div>
  );
}
