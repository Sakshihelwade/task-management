// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import Loader from "../component/Loader";
// import { Edit, Trash2, Plus } from "lucide-react";
// import axios from "axios";
// import { Dialog, Transition } from "@headlessui/react";
// import { Fragment } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   createTask,
//   deleteTask,
//   getAllTasks,
//   updateTask,
//   updateTasksOrder,
// } from "../redux/task/taskSlice";
// import { toast, ToastContainer } from "react-toastify";

// const TaskManager = () => {
//   const [filter, setFilter] = useState("");
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
//   const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
//   const [currentTask, setCurrentTask] = useState(null);
//   const [taskData, setTaskData] = useState({
//     title: "",
//     shortDescription: "",
//     status: "Pending",
//   });
//   const dispatch = useDispatch();
//   const {
//     tasks: taskList,
//     success,
//     error,
//     totalPages,
//   } = useSelector((state) => state.task);  

//   const fetchTasks = useCallback(async () => {
//     setLoading(true);
//     dispatch(getAllTasks({ page: page, filter: filter })) 
//       .finally(() => setLoading(false));
//   }, [page, filter]);


//   useEffect(() => {
//     const debounceTimer = setTimeout(() => {
//       fetchTasks();
//     }, 500); 

//     return () => clearTimeout(debounceTimer); 
//   }, [filter, fetchTasks]);

//   useEffect(() => {
//     setTasks(taskList);
//   }, [taskList]);

//   const handleDragEnd = useCallback(
//     async (result) => {
//       if (!result.destination) return;

//       const reorderedTasks = Array.from(tasks);
//       const [movedTask] = reorderedTasks.splice(result.source.index, 1);
//       reorderedTasks.splice(result.destination.index, 0, movedTask);

//       toast.success("Sequence changed successfully")
//       setTasks(reorderedTasks);
//       setLoading(true);
//       dispatch(
//         updateTasksOrder({
//           tasks: reorderedTasks,
//         })
//       ).finally(() => {
//         setLoading(false);
//       });
//     },
//     [tasks]
//   );

//   const handleEdit = useCallback((task) => {
//     setCurrentTask(task);
//     setTaskData(task);
//     setIsTaskModalOpen(true);
//   }, []);

// const handleDelete = useCallback(async () => {
//   setLoading(true);
//   dispatch(deleteTask(currentTask?._id))
//     .then(() => {
//       setTasks(tasks.filter((task) => task._id !== currentTask._id));
//       setIsDeleteConfirmOpen(false);
//       fetchTasks();
//       toast.success("Task deleted successfully")
//     })
//     .finally(() => {
//       setLoading(false);
//     });
// }, [currentTask, tasks]);

//   const handleSaveTask = useCallback(async () => {
//     setLoading(true);
//     if (currentTask) {
//       dispatch(updateTask({ id: currentTask._id, data: taskData }))
//         .then(() => {
//           toast.success("Task updated successfully")
//           setIsTaskModalOpen(false);
//           setTaskData({ title: "", description: "", status: "Pending" });
//           setCurrentTask(null);
//           fetchTasks();
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     } else {
//       dispatch(createTask(taskData))
//         .then(() => {
//           toast.success("Task created successfully")
//           setIsTaskModalOpen(false);
//           setTaskData({ title: "", description: "", status: "Pending" });
//           setCurrentTask(null);
//           fetchTasks();
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     }
//   }, [currentTask, taskData, fetchTasks]);

//   const memoizedTasks = useMemo(() => tasks, [tasks]);
//   const memoizedPagination = useMemo(
//     () => ({
//       page,
//       totalPages,
//     }),
//     [page, totalPages]
//   );

//   return (
//     <div className="p-4 bg-white shadow-md rounded-xl">
//       <Loader loading={loading} />
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold text-indigo-700">Task Manager</h2>
//         <input
//           type="text"
//           placeholder="Search by title or description..."
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
//         />
//         <button
//           className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//           onClick={() => {
//             setCurrentTask(null);
//             setTaskData({ title: "", description: "", status: "Pending" });
//             setIsTaskModalOpen(true);
//           }}
//         >
//           <Plus className="inline w-5 h-5 mr-2" /> Add Task
//         </button>
//       </div>
//       <DragDropContext onDragEnd={handleDragEnd}>
//         <Droppable droppableId="tasks">
//           {(provided) => (
//             <table
//               ref={provided.innerRef}
//               {...provided.droppableProps}
//               className="w-full border-collapse border table-auto"
//             >
//               <thead>
//                 <tr className="bg-blue-100 text-left">
//                   <th className="p-2">Sr No.</th>
//                   <th className="p-2">Title</th>
//                   <th className="p-2">Description</th>
//                   <th className="p-2">Status</th>
//                   <th className="p-2 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {memoizedTasks?.map((task, index) => (
//                   <Draggable
//                     key={task._id}
//                     draggableId={task._id}
//                     index={index}
//                   >
//                     {(provided) => (
//                       <tr
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                         className="border-b hover:bg-gray-50"
//                       >
//                         <td className="p-2">{Number(task.order) + 1}</td>
//                         <td className="p-2">{task.title}</td>
//                         <td className="p-2 truncate max-w-sm">
//                           {task.shortDescription}
//                         </td>
//                         <td className="p-2">{task.status}</td>
//                         <td className="p-2 text-center flex justify-center gap-2">
//                           <button
//                             className="bg-transparent hover:bg-blue-100 text-blue-600 font-semibold py-1 px-2 border border-blue-600 rounded"
//                             onClick={() => handleEdit(task)}
//                           >
//                             <Edit className="w-4 h-4" />
//                           </button>
//                           <button
//                             className="bg-transparent hover:bg-red-100 text-red-600 font-semibold py-1 px-2 border border-red-600 rounded"
//                             onClick={() => {
//                               setCurrentTask(task);
//                               setIsDeleteConfirmOpen(true);
//                             }}
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </td>
//                       </tr>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </tbody>
//             </table>
//           )}
//         </Droppable>
//       </DragDropContext>

//       {/* Task Modal */}
// <Transition appear show={isTaskModalOpen} as={Fragment}>
//   <Dialog
//     as="div"
//     className="relative z-10"
//     onClose={() => setIsTaskModalOpen(false)}
//   >
//     <Transition.Child
//       as={Fragment}
//       enter="ease-out duration-300"
//       enterFrom="opacity-0"
//       enterTo="opacity-100"
//       leave="ease-in duration-200"
//       leaveFrom="opacity-100"
//       leaveTo="opacity-0"
//     >
//       <div className="fixed inset-0 bg-black bg-opacity-25" />
//     </Transition.Child>

//     <div className="fixed inset-0 overflow-y-auto">
//       <div className="flex min-h-full items-center justify-center p-4 text-center">
//         <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
//           <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
//             {currentTask ? "Edit Task" : "Add Task"}
//           </Dialog.Title>
//           <div className="mt-2">
//             <input
//               type="text"
//               placeholder="Title"
//               value={taskData.title}
//               onChange={(e) =>
//                 setTaskData({ ...taskData, title: e.target.value })
//               }
//               className="w-full px-3 py-2 border rounded mt-2"
//             />
//             <textarea
//               placeholder="Description"
//               value={taskData.shortDescription}
//               onChange={(e) =>
//                 setTaskData({
//                   ...taskData,
//                   shortDescription: e.target.value,
//                 })
//               }
//               className="w-full px-3 py-2 border rounded mt-2"
//             />
//             <select
//               value={taskData.status}
//               onChange={(e) =>
//                 setTaskData({ ...taskData, status: e.target.value })
//               }
//               className="w-full px-3 py-2 border rounded mt-2"
//             >
//               <option value="Pending">Pending</option>
//               <option value="Completed">Completed</option>
//               <option value="In Progress">In Progress</option>
//             </select>
//           </div>
//           <div className="mt-4 flex justify-end gap-2">
//             <button
//               className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//               onClick={() => setIsTaskModalOpen(false)}
//             >
//               Cancel
//             </button>
//             <button
//               className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//               onClick={handleSaveTask}
//             >
//               Save
//             </button>
//           </div>
//         </Dialog.Panel>
//       </div>
//     </div>
//   </Dialog>
// </Transition>

//       {/* Delete Confirmation Dialog */}
// <Transition appear show={isDeleteConfirmOpen} as={Fragment}>
//   <Dialog
//     as="div"
//     className="relative z-10"
//     onClose={() => setIsDeleteConfirmOpen(false)}
//   >
//     <Transition.Child
//       as={Fragment}
//       enter="ease-out duration-300"
//       enterFrom="opacity-0"
//       enterTo="opacity-100"
//       leave="ease-in duration-200"
//       leaveFrom="opacity-100"
//       leaveTo="opacity-0"
//     >
//       <div className="fixed inset-0 bg-black bg-opacity-25" />
//     </Transition.Child>

//     <div className="fixed inset-0 overflow-y-auto">
//       <div className="flex min-h-full items-center justify-center p-4 text-center">
//         <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
//           <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
//             Confirm Delete
//           </Dialog.Title>
//           <div className="mt-2">
//             <p>Are you sure you want to delete this task?</p>
//           </div>
//           <div className="mt-4 flex justify-end gap-2">
//             <button
//               className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//               onClick={() => setIsDeleteConfirmOpen(false)}
//             >
//               Cancel
//             </button>
//             <button
//               className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//               onClick={handleDelete}
//             >
//               Delete
//             </button>
//           </div>
//         </Dialog.Panel>
//       </div>
//     </div>
//   </Dialog>
// </Transition>
//       <div className="flex justify-center mt-4">
//         <nav>
//           <ul className="inline-flex items-center -space-x-px">
//             <li>
//               <button
//                 className="py-2 px-3 leading-tight bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:text-blue-700 rounded-full"
//                 disabled={page === 1}
//                 onClick={() => setPage(page - 1)}
//               >
//                 Prev
//               </button>
//             </li>
//             <li>
//               <span className="py-2 px-3 mx-3 leading-tight bg-blue-500 text-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center">
//                 {page}
//               </span>
//             </li>
//             <li>
//               <button
//                 className="py-2 px-3 leading-tight bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:text-blue-700 rounded-full"
//                 disabled={page === totalPages}
//                 onClick={() => setPage(page + 1)}
//               >
//                 Next
//               </button>
//             </li>
//           </ul>
//         </nav>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default TaskManager;


import React, { useState, useEffect, useMemo, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Loader from "../component/Loader";
import { Edit, Trash2, Plus } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
  updateTasksOrder,
} from "../redux/task/taskSlice";
import { toast, ToastContainer } from "react-toastify";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import PaginationOutlined from "../component/PaginationOutlined";

const TaskManager = () => {
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [taskData, setTaskData] = useState({
    title: "",
    shortDescription: "",
    status: "",
  });
  const dispatch = useDispatch();
  const {
    tasks: taskList,
    success,
    error,
    totalPages,
  } = useSelector((state) => state.task);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    dispatch(getAllTasks({ page: page, filter: filter, status: statusFilter }))
      .finally(() => setLoading(false));
  }, [page, filter, statusFilter]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchTasks();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [filter, statusFilter, fetchTasks]);

  useEffect(() => {
    setTasks(taskList);
  }, [taskList]);

  const handleDragEnd = useCallback(
    async (result) => {
      if (!result.destination) return;

      const reorderedTasks = Array.from(tasks);
      const [movedTask] = reorderedTasks.splice(result.source.index, 1);
      reorderedTasks.splice(result.destination.index, 0, movedTask);

      toast.success("Sequence changed successfully");
      setTasks(reorderedTasks);
      setLoading(true);
      dispatch(
        updateTasksOrder({
          tasks: reorderedTasks,
        })
      ).finally(() => {
        setLoading(false);
      });
    },
    [tasks]
  );

  const handleEdit = useCallback((task) => {
    setCurrentTask(task);
    setTaskData(task);
    setIsTaskModalOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    setLoading(true);
    dispatch(deleteTask(currentTask?._id))
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== currentTask._id));
        setIsDeleteConfirmOpen(false);
        fetchTasks();
        toast.success("Task deleted successfully")
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentTask, tasks]);

  const handleSaveTask = useCallback(async () => {
    setLoading(true);
    if (currentTask) {
      dispatch(updateTask({ id: currentTask._id, data: taskData }))
        .then(() => {
          toast.success("Task updated successfully");
          setIsTaskModalOpen(false);
          setTaskData({ title: "", description: "", status: "" });
          setCurrentTask(null);
          fetchTasks();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      dispatch(createTask(taskData))
        .then(() => {
          toast.success("Task created successfully");
          setIsTaskModalOpen(false);
          setTaskData({ title: "", description: "", status: "" });
          setCurrentTask(null);
          fetchTasks();
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [currentTask, taskData, fetchTasks]);

  const memoizedTasks = useMemo(() => tasks, [tasks]);
  // const memoizedTasks = useMemo(() => taskList?.tasks || [], [taskList]);
  const memoizedPagination = useMemo(
    () => ({
      page,
      totalPages,
    }),
    [page, totalPages]
  );


  // const [filters, setFilters] = useState({
  //   title: '',
  //   description: '',
  //   status: '',
  //   srNo: '',
  //   taskNo: ''
  // });

  // const handleFilterChange = (e, column) => {
  //   const value = e.target.value;

  //   const newValue = column === 'srNo' || column === 'taskNo' ? parseInt(value, 10) : value.toLowerCase();

  //   setFilters({
  //     ...filters,
  //     [column]: newValue
  //   });
  // };

  // const handleStatusChange = (e) => {
  //   setFilters({
  //     ...filters,
  //     status: e.target.value.toLowerCase()
  //   });
  // };

  // const filteredTasks = memoizedTasks.filter(task => {
  //   const taskOrder = task.order + 1;
  //   return (
  //     (filters.title ? task.title.toLowerCase().includes(filters.title) : true) &&
  //     (filters.description ? task.shortDescription.toLowerCase().includes(filters.description) : true) &&
  //     (filters.status ? task.status.toLowerCase() === filters.status : true) &&
  //     (filters.srNo ? task.order + 1 === filters.srNo : true) &&
  //     (filters.taskNo ? taskOrder === filters.taskNo : true)
  //   );
  // });


  return (
    <div className="p-4 bg-white shadow-md rounded-xl">
      <Loader loading={loading} />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-indigo-700">Task Manager</h2>
        <input
          type="text"
          placeholder="Search by title or description..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
        
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => {
            setCurrentTask(null);
            setTaskData({ title: "", description: "", status: "Pending" });
            setIsTaskModalOpen(true);
          }}
        >
          <Plus className="inline w-5 h-5 mr-2" /> Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <table ref={provided.innerRef} {...provided.droppableProps} className="min-w-full border-collapse border table-auto shadow-sm">
              <thead>
                <tr className="bg-blue-100 text-left">
                  <th className="p-3 text-center">Actions</th>
                  <th className="p-3">
                    Sr No.
                    {/* <input
                      className="w-full mt-1 p-1 border border-gray-300 rounded"
                      type="number"
                      placeholder="Search Sr No."
                      value={filters.srNo || ''}
                      onChange={(e) => handleFilterChange(e, 'srNo')}
                    /> */}
                  </th>
                  <th className="p-3">
                    Task No.
                    {/* <input
                      className="w-full mt-1 p-1 border border-gray-300 rounded"
                      type="number"
                      placeholder="Search Task No."
                      value={filters.taskNo || ''}
                      onChange={(e) => handleFilterChange(e, 'taskNo')}
                    /> */}
                  </th>
                  <th className="p-3">
                    Title
                    {/* <input
                      className="w-full mt-1 p-1 border border-gray-300 rounded"
                      type="search"
                      placeholder="Search Title"
                      value={filters.title}
                      onChange={(e) => handleFilterChange(e, 'title')}
                    /> */}
                  </th>
                  <th className="p-3">
                    Description
                    {/* <input
                      className="w-full mt-1 p-1 border border-gray-300 rounded"
                      type="search"
                      placeholder="Search Description"
                      value={filters.description}
                      onChange={(e) => handleFilterChange(e, 'description')}
                    /> */}
                  </th>
                  <th className="p-3">
                    Status
                    <br/>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    >
                      <option value="">All</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {memoizedTasks?.map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="hover:bg-gray-50"
                      >
                        <td className="p-3 text-center flex justify-center gap-2">
                          <button
                            className="text-blue-500 hover:bg-blue-100 p-2 rounded"
                            onClick={() => handleEdit(task)}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="text-red-500 hover:bg-red-100 p-2 rounded"
                            onClick={() => {
                              setCurrentTask(task);
                              setIsDeleteConfirmOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                        <td className="p-3">{(page - 1) * itemsPerPage + (index + 1)}</td>
                        <td className="p-3">{Number(task.order) + 1}</td>
                        <td className="p-3">{task.title}</td>
                        <td className="p-3 truncate max-w-xs">{task.shortDescription}</td>
                        <td className={`p-3 ${task.status === 'Pending' ? 'text-red-500' : task.status === 'In Progress' ? 'text-blue-500' : task.status === 'Completed' ? 'text-green-500' : task.status === 'Overdue' ? 'text-red-500' : ''}`}>
                          {task.status}
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>

      <Transition appear show={isTaskModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsTaskModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                  {currentTask ? "Edit Task" : "Add Task"}
                </Dialog.Title>
                <div className="mt-2">
                  <div className="mb-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      placeholder="Title"
                      value={taskData.title}
                      onChange={(e) =>
                        setTaskData({ ...taskData, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded mt-1"
                    />
                  </div>

                  <div className="mb-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      placeholder="Description"
                      value={taskData.shortDescription}
                      onChange={(e) =>
                        setTaskData({
                          ...taskData,
                          shortDescription: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded mt-1"
                    />
                  </div>

                  <div className="mb-2">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="status"
                      value={taskData.status}
                      onChange={(e) =>
                        setTaskData({ ...taskData, status: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded mt-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    onClick={() => setIsTaskModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={handleSaveTask}
                  >
                    Save
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isDeleteConfirmOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsDeleteConfirmOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                  Confirm Delete
                </Dialog.Title>
                <div className="mt-2">
                  <p>Are you sure you want to delete this task?</p>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    onClick={() => setIsDeleteConfirmOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div className='flex justify-center py-3'>
        <PaginationOutlined page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>

      <ToastContainer />
    </div>
  );
};

export default TaskManager;
