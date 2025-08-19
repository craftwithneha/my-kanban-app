
import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";

export default function TaskCard({ task, onDelete, users = [] }) {
  const [confirm, setConfirm] = useState(false);

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

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-sm border flex justify-between items-start">
      <div className="pr-3">
        <h4 className="font-semibold text-lg">{task.title}</h4>
        {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
        <div className="text-xs text-gray-500 mt-2 space-y-0.5">
          <div>Created: {when}</div>
          <div>Created by: <span className="font-medium">{creatorName}</span></div>
          <div>Assigned to: <span className="font-medium">{assigneeName}</span></div>
        </div>
      </div>

      <button onClick={() => setConfirm(true)} className="text-red-500 hover:text-red-700">
        <Trash2 size={18} />
      </button>

      {confirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <h3 className="text-lg font-semibold">Delete Task</h3>
            <p className="text-gray-600 mt-2">Are you sure you want to delete this task?</p>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setConfirm(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Cancel
              </button>
              <button
                onClick={() => { onDelete(); setConfirm(false); }}
                className="px-4 py-2 bg-blue-300 text-white rounded hover:bg-blue-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
