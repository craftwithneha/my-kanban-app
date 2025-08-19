

import React from "react";

export default function ConfirmDeleteModal({ onConfirm, onClose, taskTitle = "this task" }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-80 max-w-sm mx-4">
        <h2 className="text-lg font-bold mb-3 text-gray-900">Delete Task?</h2>
        <p className="text-sm mb-6 text-gray-600">
          Are you sure you want to delete "{taskTitle}"? 
        </p>
        <div className="flex gap-3 justify-end">
          <button 
            onClick={onClose} 
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded transition-colors duration-200 text-gray-700"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
