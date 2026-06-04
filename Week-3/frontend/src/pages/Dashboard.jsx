import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [filter, setFilter] = useState('all'); // options: 'all', 'pending', 'completed'
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Retrieve JWT to verify user session

  // Protected Route logic: redirect to login if no token exists
  useEffect(() => {
    if (!token) {
      navigate('/login'); 
    } else {
      fetchTasks();
    }
  }, [token]);

  // Fetch tasks with the required Bearer token authorization header
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks', err);
    }
  };

  // Create/Add a brand new task
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const response = await axios.post('http://localhost:5000/api/tasks', 
        { title: newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, response.data]);
      setNewTitle('');
    } catch (err) {
      console.error('Error adding task', err);
    }
  };

  // Update a task's status (toggle completed true/false)
  const toggleComplete = async (id, currentStatus) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${id}`, 
        { completed: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map(task => task._id === id ? response.data : task));
    } catch (err) {
      console.error('Error updating task', err);
    }
  };

  // Delete a task entirely from the database cluster
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error('Error deleting task', err);
    }
  };

  // Terminate user session and clear storage
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>My To-Do Workspace</h2>
        <button onClick={handleLogout} style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
      </div>

      {/* Input Form to Add New Tasks */}
      <form onSubmit={addTask} style={{ display: 'flex', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Add a new task..." 
          value={newTitle} 
          onChange={(e) => setNewTitle(e.target.value)} 
          style={{ flex: 1, padding: '10px', borderRadius: '4px 0 0 4px', border: '1px solid #ccc', fontSize: '14px' }} 
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '0 4px 4px 0', cursor: 'pointer', fontWeight: 'bold' }}>Add</button>
      </form>

      {/* Mini Project Requirement: Dynamic Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button onClick={() => setFilter('all')} style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: filter === 'all' ? '#007bff' : '#eee', color: filter === 'all' ? '#fff' : '#000', border: 'none', borderRadius: '4px', fontWeight: '500' }}>All</button>
        <button onClick={() => setFilter('pending')} style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: filter === 'pending' ? '#007bff' : '#eee', color: filter === 'pending' ? '#fff' : '#000', border: 'none', borderRadius: '4px', fontWeight: '500' }}>Pending</button>
        <button onClick={() => setFilter('completed')} style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: filter === 'completed' ? '#007bff' : '#eee', color: filter === 'completed' ? '#fff' : '#000', border: 'none', borderRadius: '4px', fontWeight: '500' }}>Completed</button>
      </div>

      {/* Task List Rendering Node */}
      <ul style={{ listStyleType: 'none', padding: 0, margin: 0, border: '1px solid #eee', borderRadius: '4px' }}>
        {tasks
          .filter(task => {
            if (filter === 'pending') return !task.completed;
            if (filter === 'completed') return task.completed;
            return true; // 'all'
          })
          .map(task => (
            <li key={task._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid #eee', background: task.completed ? '#f8f9fa' : '#fff' }}>
              <span 
                onClick={() => toggleComplete(task._id, task.completed)} 
                style={{ cursor: 'pointer', textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#6c757d' : '#000', fontWeight: '500', flex: 1 }}
              >
                {task.title}
              </span>
              <button onClick={() => deleteTask(task._id)} style={{ padding: '5px 10px', backgroundColor: '#fff', color: '#dc3545', border: '1px solid #dc3545', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
            </li>
          ))}
        {tasks.length === 0 && (
          <li style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No tasks found. Add your first goal above!</li>
        )}
      </ul>
    </div>
  );
}

export default Dashboard;