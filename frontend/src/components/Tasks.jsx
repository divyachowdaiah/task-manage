import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loader from './utils/Loader';
import Tooltip from './utils/Tooltip';
import './Tasks.css'; // Import CSS file

const Tasks = () => {
  const authState = useSelector(state => state.authReducer);
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false); // Controls search bar visibility
  const [fetchData, { loading }] = useFetch();

  const fetchTasks = useCallback(() => {
    const config = { url: "/tasks", method: "get", headers: { Authorization: authState.token } };
    fetchData(config, { showSuccessToast: false }).then(data => setTasks(data.tasks));
  }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks]);

  const handleDelete = (id) => {
    const config = { url: `/tasks/${id}`, method: "delete", headers: { Authorization: authState.token } };
    fetchData(config).then(() => fetchTasks());
  };

  // Filter tasks based on search input
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="tasks-container">
      <h2 className="tasks-header">Your tasks ({filteredTasks.length})</h2>

      {/* Search Icon (Click to Toggle Search Bar) */}
      <div className="search-container">
        <i
          className="fa fa-search search-icon"
          onClick={() => setShowSearch(!showSearch)}
        ></i>

        {showSearch && (
          <input
            type="text"
            placeholder="Search tasks..."
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        )}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="tasks-grid">
          {filteredTasks.length === 0 ? (
            <div className="tasks-empty">
              <span>No tasks found</span>
              <Link to="/tasks/add" className="add-task-button">+ Add new task</Link>
            </div>
          ) : (
            filteredTasks.map((task, index) => (
              <div key={task._id} className="task-item">
                <div className="task-header">
                  <span className="task-title">{task.title || `Task #${index + 1}`}</span>

                  <div className="task-actions">
                    <Tooltip text="Edit this task" position="top">
                      <Link to={`/tasks/${task._id}`} className="task-edit">
                        <i className="fa-solid fa-pen"></i>
                      </Link>
                    </Tooltip>

                    <Tooltip text="Delete this task" position="top">
                      <span className="task-delete" onClick={() => handleDelete(task._id)}>
                        <i className="fa-solid fa-trash"></i>
                      </span>
                    </Tooltip>
                  </div>
                </div>

                <div className="task-details">
                  <p><strong>Description:</strong> {task.description}</p>
                  <p><strong>Due Date:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Priority:</strong> {task.priority}</p>
                  <p><strong>Status:</strong> {task.status}</p>
                  <p><strong>Category:</strong> {task.category}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;
