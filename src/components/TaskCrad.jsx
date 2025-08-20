
import { useMemo } from "react";
import { Trash2 } from "lucide-react";

export default function TaskCard({ task, onDelete, users = [] }) {
  const creatorName = useMemo(() => {
    const u = users.find(u => u.id === task.createdBy);
    if (!u) return "Unknown";
    return (u.name && u.name.trim()) || u.email || u.id || "Unknown";
  }, [users, task.createdBy]);

  const assigneeName = useMemo(() => {
    if (!task.assignedUser) return "Unassigned";
    const u = users.find(u => u.id === task.assignedUser);
    if (!u) return "Unknown";
    return (u.name && u.name.trim()) || u.email || u.id || "Unknown";
  }, [users, task.assignedUser]);

  const when = useMemo(() => {
    if (!task.createdAt) return "";
    return new Date(task.createdAt).toLocaleString();
  }, [task.createdAt]);

//  const handleDeleteClick = (e) => {
//   e.preventDefault();
//   e.stopPropagation();
//   onDelete({
//     columnId: task.status,   
//     taskId: task.$id,        
//     taskTitle: task.title,   
//   });
// };

const handleDeleteClick = (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
    e.nativeEvent.stopImmediatePropagation();
  }
  onDelete({
    columnId: task.status,
    taskId: task.$id,
    taskTitle: task.title,
  });
};


  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-sm border flex justify-between items-start">
      <div className="pr-3 flex-1">
        <h4 className="font-semibold text-lg">{task.title}</h4>
        {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
        <div className="text-xs text-gray-500 mt-2 space-y-0.5">
          <div>Created: {when}</div>
          <div>Created by: <span className="font-medium">{creatorName}</span></div>
          <div>Assigned to: <span className="font-medium">{assigneeName}</span></div>
        </div>
      </div>

      {/* <button 
        onClick={handleDeleteClick}
        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors duration-200 flex-shrink-0 touch-manipulation"
        title="Delete task"
        type="button"
      >
        <Trash2 size={18} />
      </button> */}

      <button
  onClick={handleDeleteClick}
  onMouseDown={(e) => e.stopPropagation()}
  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors duration-200 flex-shrink-0"
  title="Delete task"
  type="button"
>
  <Trash2 size={18} />
</button>

    </div>
  );
}
