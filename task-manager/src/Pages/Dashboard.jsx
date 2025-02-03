import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllTasks } from '../redux/task/taskSlice';
import landingPageImage from "../assets/task-management.png"
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  // get item
  const token = localStorage.getItem('token')
  // console.log(token)
  return (
    <div>
      <div className="flex flex-col lg:flex-row items-center h-[500px] bg-indigo-50 px-6 lg:px-20 ">
        <div className="lg:w-1/2 text-center lg:text-left">
          <h2 className="text-4xl font-bold text-indigo-900 py-4">
            Everyday task management made simple
          </h2>
          <p className="mt-4 text-lg text-indigo-700">
            Create, track & validate updates on your staff’s assigned operational tasks from a single app.
          </p>
          <button className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md"
            onClick={() => navigate("/task-manager")} >
            Get Started
          </button>
        </div>

        <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0 bg-transparent">
          <img
            src={landingPageImage}
            alt="Task Management"
            className="w-full max-w-md rounded-lg "
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
