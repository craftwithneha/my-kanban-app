

import React from "react";

export default function ConfirmDeleteModal({ onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-lg font-bold mb-2">Delete Task?</h2>
        <p className="text-sm mb-4">Are you sure you want to delete this task?</p>
        <div className="flex gap-2 justify-end">
         
          <button onClick={onClose} className="bg-gray-300 px-4 py-1 rounded">Cancel</button>
<button onClick={onConfirm} className="bg-blue-300 text-white px-4 py-1 rounded">Delete</button>

        </div>
      </div>
    </div>
  );
}
