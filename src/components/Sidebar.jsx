// //src/components/Sidebar.jsx

// import { LayoutGrid, FileText, Settings } from "lucide-react";
// import { useState } from "react";

// export default function Sidebar() {
//   const [activeItem, setActiveItem] = useState("Boards"); // Default active item

//   const navItems = [
//     { label: "Boards", icon: LayoutGrid },
//     { label: "Pages", icon: FileText },
//     { label: "Settings", icon: Settings },
//   ];

//   return (
//     <aside className="bg-white w-full md:w-64 border-r border-gray-200 shadow-sm">
//       <div className="p-6 md:pt-8">
//         {/* Logo */}
//         <div className="text-2xl font-bold text-black mb-6">agency</div>

//         {/* Navigation Items */}
//         <nav className="space-y-2">
//           {navItems.map((item) => {
//             const isActive = activeItem === item.label;
//             const activeClasses = isActive ? "text-blue-400" : "text-gray-800";

//             return (
//               <button
//                 key={item.label}
//                 onClick={() => setActiveItem(item.label)}
//                 className={`flex items-center gap-3 px-4 py-2 rounded-md w-full text-left cursor-pointer hover:bg-gray-100 ${activeClasses}`}
//               >
//                 <item.icon className={`w-5 h-5 ${activeClasses}`} />
//                 <span className="text-sm">{item.label}</span>
//               </button>
//             );
//           })}
//         </nav>
//       </div>
//     </aside>
//   );
// }



import { LayoutGrid, FileText, Settings } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("Boards"); // Default active item

  const navItems = [
    { label: "Boards", icon: LayoutGrid },
    { label: "Pages", icon: FileText },
    { label: "Settings", icon: Settings },
  ];

  return (
    <aside className="hidden md:block bg-white w-64 border-r border-gray-200 shadow-sm">
      <div className="p-6 md:pt-8">
        {/* Logo */}
        <div className="text-2xl font-bold text-black mb-6">agency</div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = activeItem === item.label;
            const activeClasses = isActive ? "text-blue-400" : "text-gray-800";

            return (
              <button
                key={item.label}
                onClick={() => setActiveItem(item.label)}
                className={`flex items-center gap-3 px-4 py-2 rounded-md w-full text-left cursor-pointer hover:bg-gray-100 ${activeClasses}`}
              >
                <item.icon className={`w-5 h-5 ${activeClasses}`} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
