import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Textarea } from '../components/utils/Input';
import Loader from '../components/utils/Loader';
import useFetch from '../hooks/useFetch';
import MainLayout from '../layouts/MainLayout';
import validateManyFields from '../validations';
import './Task.css'; // Import the separate CSS file

const Task = () => {
  const authState = useSelector(state => state.authReducer);
  const navigate = useNavigate();
  const [fetchData, { loading }] = useFetch();
  const { taskId } = useParams();

  const mode = taskId === undefined ? 'add' : 'update';
  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Low',
    status: 'Pending',
    category: 'Work'
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    document.title = mode === 'add' ? 'Add Task' : 'Update Task';
  }, [mode]);

  useEffect(() => {
    if (mode === 'update') {
      const config = { url: `/tasks/${taskId}`, method: 'get', headers: { Authorization: authState.token } };
      fetchData(config, { showSuccessToast: false }).then((data) => {
        if (data.task) {
          setTask(data.task);
          setFormData({
            title: data.task.title || '',
            description: data.task.description || '',
            dueDate: data.task.dueDate ? data.task.dueDate.split('T')[0] : '',
            priority: data.task.priority || 'Low',
            status: data.task.status || 'Pending',
            category: data.task.category || 'Work'
          });
        }
      });
    }
  }, [mode, authState.token, taskId, fetchData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = (e) => {
    e.preventDefault();
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        priority: task.priority || 'Low',
        status: task.status || 'Pending',
        category: task.category || 'Work'
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateManyFields('task', formData);
    setFormErrors({});

    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }

    const config = {
      url: mode === 'add' ? '/tasks' : `/tasks/${taskId}`,
      method: mode === 'add' ? 'post' : 'put',
      data: formData,
      headers: { Authorization: authState.token },
    };

    fetchData(config).then(() => {
      navigate('/');
    });
  };

  const fieldError = (field) => (
    <p className={`error-text ${formErrors[field] ? 'block' : 'hidden'}`}>
      <i className='mr-2 fa-solid fa-circle-exclamation'></i>
      {formErrors[field]}
    </p>
  );

  return (
    <MainLayout>
      <form className='task-form'>
        {loading ? (
          <Loader />
        ) : (
          <>
            <h2 className='text-center mb-4'>{mode === 'add' ? 'Add New Task' : 'Edit Task'}</h2>

            {/* Title */}
            <div className='input-group'>
              <label htmlFor='title'>Title</label>
              <input type='text' name='title' id='title' value={formData.title} placeholder='Enter task title' onChange={handleChange} />
              {fieldError('title')}
            </div>

            {/* Description */}
            <div className='input-group'>
              <label htmlFor='description'>Description</label>
              <Textarea name='description' id='description' value={formData.description} placeholder='Write here..' onChange={handleChange} />
              {fieldError('description')}
            </div>

            {/* Due Date */}
            <div className='input-group'>
              <label htmlFor='dueDate'>Due Date</label>
              <input type='date' name='dueDate' id='dueDate' value={formData.dueDate} onChange={handleChange} />
              {fieldError('dueDate')}
            </div>

            {/* Priority */}
            <div className='input-group'>
              <label htmlFor='priority'>Priority</label>
              <select name='priority' id='priority' value={formData.priority} onChange={handleChange}>
                <option value='Low'>Low</option>
                <option value='Medium'>Medium</option>
                <option value='High'>High</option>
              </select>
              {fieldError('priority')}
            </div>

            {/* Status */}
            <div className='input-group'>
              <label htmlFor='status'>Status</label>
              <select name='status' id='status' value={formData.status} onChange={handleChange}>
                <option value='Pending'>Pending</option>
                <option value='In Progress'>In Progress</option>
                <option value='Completed'>Completed</option>
              </select>
              {fieldError('status')}
            </div>

            {/* Category */}
            <div className='input-group'>
              <label htmlFor='category'>Category</label>
              <select name='category' id='category' value={formData.category} onChange={handleChange}>
                <option value='Work'>Work</option>
                <option value='Personal'>Personal</option>
                <option value='Other'>Other</option>
              </select>
              {fieldError('category')}
            </div>

            <button className='btn primary' onClick={handleSubmit}>
              {mode === 'add' ? 'Add Task' : 'Update Task'}
            </button>
            <button className='btn danger' onClick={() => navigate('/')}>
              Cancel
            </button>
            {mode === 'update' && (
              <button className='btn secondary' onClick={handleReset}>
                Reset
              </button>
            )}
          </>
        )}
      </form>
    </MainLayout>
  );
};

export default Task;
