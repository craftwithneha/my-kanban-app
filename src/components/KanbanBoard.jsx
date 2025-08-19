


import React, { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import Column from "./Column";
import AddTaskModal from "./AddTaskModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { fetchAllUsers } from "../utils/fetchUsers";
import { databases, ID, client } from "../appwrite"; 
import { useAuth } from "../contexts/AuthContext";
import {Star} from "lucide-react"
const DB_ID  = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COL_ID = import.meta.env.VITE_APPWRITE_TASKS_COLLECTION_ID;

const initialColumns = {
  todo:       { id: "todo", title: "To Do", tasks: [] },
  inprogress: { id: "inprogress", title: "In Progress", tasks: [] },
  completed:  { id: "completed", title: "Completed", tasks: [] },
};

export default function KanbanBoard() {
  const { currentUser } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [columns, setColumns] = useState(initialColumns);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentColumnId, setCurrentColumnId] = useState(null);
  const [deleteTask, setDeleteTask] = useState(null);

  // Fetch users from backend
  useEffect(() => {
    (async () => {
      try {
        const users = await fetchAllUsers();
        setAllUsers(users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setAllUsers([]);
      }
    })();
  }, []);

  // Fetch tasks from Appwrite
  const fetchTasks = async () => {
    try {
      const res = await databases.listDocuments(DB_ID, COL_ID);
      const grouped = { ...initialColumns };
      res.documents.forEach(task => {
        if (grouped[task.status]) grouped[task.status].tasks.push(task);
      });
      setColumns(grouped);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      // Keep initial columns if fetch fails
      setColumns(initialColumns);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  // Realtime updates for tasks (create/update/delete)
  useEffect(() => {
    let unsubscribe;
    try {
      unsubscribe = client.subscribe(
        `databases.${DB_ID}.collections.${COL_ID}.documents`,
        (event) => {
          const doc = event.payload;
          if (!doc || !doc.$id) return;

          setColumns((prev) => {
            // Create a fresh copy of columns with filtered tasks (remove this doc everywhere)
            const next = Object.fromEntries(
              Object.entries(prev).map(([key, col]) => [
                key,
                { ...col, tasks: (col.tasks || []).filter((t) => t.$id !== doc.$id) },
              ])
            );

            const isCreate = event.events.some((e) => e.endsWith('.create'));
            const isUpdate = event.events.some((e) => e.endsWith('.update'));

            if (isCreate || isUpdate) {
              const status = doc.status || 'todo';
              if (!next[status]) {
                next[status] = { id: status, title: status, tasks: [] };
              }
              next[status] = {
                ...next[status],
                tasks: [...(next[status].tasks || []), doc],
              };
            }
            // For delete, we've already removed it from all columns
            return next;
          });
        }
      );
    } catch (error) {
      console.error("Failed to subscribe to realtime updates:", error);
    }

    return () => {
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (error) {
          console.error("Error unsubscribing from realtime:", error);
        }
      }
    };
  }, []);

  // Refetch users when auth state changes so the creator shows up immediately
  useEffect(() => {
    (async () => {
      try {
        const users = await fetchAllUsers();
        setAllUsers(users);
      } catch (error) {
        console.error("Failed to refetch users:", error);
        // Don't clear existing users on refetch failure
      }
    })();
  }, [currentUser?.$id]);

  // Debug delete task state changes
  useEffect(() => {
    if (deleteTask) {
      console.log("Delete task modal opened:", deleteTask);
    }
  }, [deleteTask]);

  const handleAddTask = async (taskPayload) => {
    try {
      const newTaskData = {
        title: taskPayload.title,
        description: taskPayload.description || "",
        status: currentColumnId,
        assignedUser: taskPayload.assignedUser || "",
        createdAt: taskPayload.createdAt || new Date().toISOString(),
        createdBy: currentUser?.$id || "",
      };

      const res = await databases.createDocument(DB_ID, COL_ID, ID.unique(), newTaskData);

      setColumns(prev => ({
        ...prev,
        [currentColumnId]: {
          ...prev[currentColumnId],
          tasks: [...prev[currentColumnId].tasks, res],
        },
      }));
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const handleDeleteTask = async ({ columnId, taskId, taskTitle }) => {
    console.log("Deleting task", columnId, taskId, taskTitle); 

    // Cache the task being removed for reliable revert on failure
    const removedTask = (() => {
      const col = columns[columnId];
      if (!col || !Array.isArray(col.tasks)) return null;
      return col.tasks.find((t) => t.$id === taskId) || null;
    })();
    
    try {
      // Optimistically update UI first for better UX
      setColumns(prev => ({
        ...prev,
        [columnId]: {
          ...prev[columnId],
          tasks: prev[columnId].tasks.filter(t => t.$id !== taskId),
        },
      }));

      // Then delete from database
      await databases.deleteDocument(DB_ID, COL_ID, taskId);
      
      // Clear delete modal
      setDeleteTask(null);
      
      console.log("Task deleted successfully");
    } catch (err) {
      console.error("Error deleting task:", err);
      
      // Revert UI change if delete failed
      setColumns(prev => ({
        ...prev,
        [columnId]: {
          ...prev[columnId],
          tasks: removedTask
            ? [...prev[columnId].tasks, removedTask]
            : prev[columnId].tasks,
        },
      }));
      
      // Show error to user (you can add a toast notification here)
      alert("Failed to delete task. Please try again.");
    }
  };


  const onDragEnd = async ({ active, over }) => {
    if (!over) return;
    const [activeColId, activeTaskId] = String(active.id).split(":");
    const [overColId, overTaskId]     = String(over.id).split(":");

    if (activeColId === overColId) {
      const column = columns[activeColId];
      const oldIndex = column.tasks.findIndex(t => t.$id === activeTaskId);
      const newIndex = column.tasks.findIndex(t => t.$id === overTaskId);
      const reordered = arrayMove(column.tasks, oldIndex, newIndex);
      setColumns(prev => ({ ...prev, [activeColId]: { ...column, tasks: reordered }}));
      return;
    }

    const fromCol = columns[activeColId];
    const toCol   = columns[overColId];
    const task    = fromCol.tasks.find(t => t.$id === activeTaskId);

    if (!task) {
      console.error("Task not found for drag operation");
      return;
    }

    try {
      await databases.updateDocument(DB_ID, COL_ID, task.$id, { status: overColId });
      setColumns(prev => ({
        ...prev,
        [activeColId]: { ...fromCol, tasks: fromCol.tasks.filter(t => t.$id !== activeTaskId) },
        [overColId]:   { ...toCol,   tasks: [...toCol.tasks, { ...task, status: overColId }] },
      }));
    } catch (err) {
      console.error("Error moving task:", err);
      // Show user-friendly error message
      alert("Failed to move task. Please try again.");
    }
  };

 return (
    <div className="p-4  min-h-screen">
      {/* ✅ Heading added here */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        Kanban Board <Star className="w-7 h-7 text-blue-400" />
      </h1>

      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(columns).map(col => (
            <SortableContext
              key={col.id}
              items={col.tasks.map(t => `${col.id}:${t.$id}`)}
              strategy={rectSortingStrategy}
            >
              <Column
                column={col}
                onAddTask={() => { setCurrentColumnId(col.id); setShowAddModal(true); }}
                onDeleteTask={(payload) => setDeleteTask(payload)}
                users={allUsers}
              />
            </SortableContext>
          ))}
        </div>
      </DndContext>

      {showAddModal && currentUser && (
        <AddTaskModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          columnId={currentColumnId}
          users={allUsers}
          currentUser={currentUser}
          onTaskAdded={handleAddTask}
        />
      )}

      {deleteTask && (
        <ConfirmDeleteModal
          onClose={() => setDeleteTask(null)}
          onConfirm={() => handleDeleteTask(deleteTask)}
          taskTitle={deleteTask.taskTitle || "this task"}
        />
      )}
    </div>
  );

}
