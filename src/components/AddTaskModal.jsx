
import { useState } from "react";

export default function AddTaskModal({ isOpen, onClose, users, columnId, onTaskAdded, currentUser }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [date, setDate] = useState("");

  if (!isOpen || !currentUser) return null;

  const handleAdd = () => {
    if (!title.trim()) return alert("Title required");

    const iso = date ? new Date(date).toISOString() : new Date().toISOString();

    onTaskAdded({
      title,
      description,
      assignedUser,
      createdAt: iso,
      status: columnId,
    });

    setTitle("");
    setDescription("");
    setAssignedUser("");
    setDate("");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      
      <div className="bg-white p-8 rounded shadow-md w-120 mt-4">
        <h1 className="font-4xl font-bold text-black ">Add Task </h1>
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="border p-2 w-full  mt-4 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="border p-2 w-full mt-4 rounded"
        />
        <input
          type="datetime-local"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full border p-2 mt-4 rounded"
        />
        <select
          value={assignedUser}
          onChange={e => setAssignedUser(e.target.value)}
          className="w-full border p-2 mt-4 rounded"
        >
          <option value="">Assign User</option>
          {(users || []).map(u => {
            const label = (u.name && u.name.trim()) || u.email || u.id;
            return (
              <option key={u.id} value={u.id}>{label}</option>
            );
          })}
        </select>
        <div className="flex justify-end  mt-4 gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleAdd} className="px-4 py-2 bg-blue-500 text-white rounded">Add Task</button>
        </div>
      </div>
    </div>
  );
}
