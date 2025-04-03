import { useState, useEffect } from "react";
import todoService from "../services/todoService";
import React from "react";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await todoService.getAllTodos();
      setTodos(data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch todos");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    try {
      const newTodo = await todoService.createTodo(inputValue);
      setTodos([...todos, newTodo]);
      setInputValue("");
    } catch (err) {
      setError("Failed to create todo");
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const updatedTodo = await todoService.updateTodo(id, {
        completed: !completed,
      });
      setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
    } catch (err) {
      setError("Failed to update todo");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      setError("Failed to delete todo");
    }
  };

  const startEditing = (todo) => {
    setEditingId(todo._id);
    setEditValue(todo.title);
  };

  const handleEdit = async (id) => {
    if (!editValue.trim()) return;
    try {
      const updatedTodo = await todoService.updateTodo(id, {
        title: editValue,
      });
      setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
      setEditingId(null);
    } catch (err) {
      setError("Failed to update todo");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center relative">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded font-semibold hover:bg-red-600 cursor-pointer"
      >
        Logout
      </button>

      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">To-Do</h1>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Add a new todo..."
              className="flex-1 p-2 border outline-none border-gray-300 rounded"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer font-semibold hover:bg-green-600"
            >
              Add
            </button>
          </div>
        </form>

        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="flex items-center justify-between p-3 border rounded"
            >
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo._id, todo.completed)}
                  className="h-4 w-4"
                />
                {editingId === todo._id ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleEdit(todo._id)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleEdit(todo._id)
                    }
                    className="flex-1 p-1 border rounded outline-none border-none"
                    autoFocus
                  />
                ) : (
                  <span
                    className={`flex-1 ${
                      todo.completed ? "line-through text-gray-500" : ""
                    }`}
                    onDoubleClick={() => startEditing(todo)}
                  >
                    {todo.title}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {editingId !== todo._id && (
                  <button
                    onClick={() => startEditing(todo)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
