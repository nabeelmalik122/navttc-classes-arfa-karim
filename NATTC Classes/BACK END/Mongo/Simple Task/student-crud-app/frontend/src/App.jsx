import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    studentClass: '',
    email: ''
  });
  const [editingId, setEditingId] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(API_URL, formData);
      }
      setFormData({ name: '', age: '', studentClass: '', email: '' });
      fetchAllStudents();
    } catch (error) {
      console.error('Error saving student', error);
    }
  };

  const fetchAllStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchAllStudents();
    } catch (error) {
      console.error('Error deleting student', error);
    }
  };

  const startEdit = (student) => {
    setEditingId(student._id);
    setFormData({
      name: student.name,
      age: student.age,
      studentClass: student.studentClass,
      email: student.email
    });
  };

  return (
    <div>
      <h1>Student Management</h1>
      
      <form onSubmit={handleAddOrUpdate}>
        <input 
          type="text" 
          name="name" 
          placeholder="Name" 
          value={formData.name} 
          onChange={handleInputChange} 
          required 
        />
        <br />
        <input 
          type="number" 
          name="age" 
          placeholder="Age" 
          value={formData.age} 
          onChange={handleInputChange} 
          required 
        />
        <br />
        <input 
          type="text" 
          name="studentClass" 
          placeholder="Class" 
          value={formData.studentClass} 
          onChange={handleInputChange} 
          required 
        />
        <br />
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={handleInputChange} 
          required 
        />
        <br />
        <button type="submit">{editingId ? 'Update Student' : 'Add Student'}</button>
      </form>

      <br />
      <button type="button" onClick={fetchAllStudents}>All Students</button>
      <br /><br />

      {students.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Class</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>{student.studentClass}</td>
                <td>{student.email}</td>
                <td>
                  <button onClick={() => startEdit(student)}>Update</button>
                  <button onClick={() => handleDelete(student._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
