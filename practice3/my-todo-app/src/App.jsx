import { useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  function addTask(title) {
    setTasks([...tasks, { title, completed: false }]);
  }

  function toggleTask(index) {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  }

  function handleDeleteTask(indexToDelete) {
    const updatedTasks = tasks.filter((_, i) => i !== indexToDelete);
    setTasks(updatedTasks);
  }
  

  async function fetchBoredActivity() {
    try {
      const res = await fetch('https://bored.api.lewagon.com/api/activity');
      const data = await res.json();
      addTask(data.activity);
    } catch (err) {
      alert('API 請求失敗');
    }
  }

  return (
    <div className="container">
      <h1>我的待辦清單</h1>
      <input
        type="text"
        value={input}
        placeholder="新增任務..."
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && input.trim() && (addTask(input.trim()), setInput(''))}
      />
      <button onClick={() => input.trim() && (addTask(input.trim()), setInput(''))}>新增</button>
      <button onClick={fetchBoredActivity}>我好無聊 😩</button>
      <ul>
        {tasks.map((task, i) => (
        <li
          key={i}
          onClick={() => toggleTask(i)}
          style={{
            textDecoration: task.completed ? 'line-through' : 'none',
            color: task.completed ? 'gray' : 'black',
          }}
        >
          {task.title}
          <button onClick={() => handleDeleteTask(i)}>刪除</button>
        </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
