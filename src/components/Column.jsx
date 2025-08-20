import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import DraggableCard from './DraggableCard'
import TaskCard from './TaskCrad'

import { Plus } from 'lucide-react'

const Column = ({ column, onAddTask, onDeleteTask, users = [] }) => {
  const { id, title, tasks = [] } = column
  const { setNodeRef } = useDroppable({ id })

  return (
    <div className='bg-blue-50 rounded-2xl p-4 w-full flex flex-col shadow-md'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='font-semibold text-gray-800'>
          {title} ({tasks.length})
        </h2>
        <button
          onClick={onAddTask}
          className='p-1 rounded-full hover:bg-gray-200 transition'
        >
          <Plus size={18} />
        </button>
      </div>

      <div ref={setNodeRef} className='flex flex-col gap-3 min-h-[200px]'>
        {tasks.map(task => (
          <DraggableCard key={task.$id} id={`${id}:${task.$id}`}>
            <TaskCard
              task={task}
              users={users}
              onDelete={() => onDeleteTask({ columnId: id, taskId: task.$id, taskTitle: task.title })}
            />
          </DraggableCard>
        ))}
      </div>
    </div>
  )
}

export default Column
