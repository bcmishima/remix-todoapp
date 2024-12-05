import { useState, useEffect } from "react";
import { getTodos, addTodo, updateTodo, deleteTodo } from "~/db/indexeddb";
import { Todo } from "../models/todo";

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    async function fetchTodos() {
      const todos = await getTodos();
      setTodos(todos);
    }
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (newTodo.trim() === "") return;
    const todo = await addTodo({
      id: "",
      title: newTodo,
      completed: false,
    });
    setTodos([...todos, todo]);
    setNewTodo("");
  };

  const handleToggleTodo = async (id: string) => {
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) return;
    const updatedTodo = await updateTodo({
      ...todo,
      completed: !todo.completed,
    });
    setTodos(
      todos.map((todo) => (todo.id === id ? updatedTodo : todo))
    );
  };

  const handleDeleteTodo = async (id: string) => {
    await deleteTodo(id);
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div>
      <h1>Todo List</h1>
      <label htmlFor="new-todo">New Todo:</label>
      <input
        id="new-todo"
        type="text"
        value={newTodo}
        placeholder="Enter new todo"
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button onClick={handleAddTodo}>Add Todo</button>
      <div id="message"></div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo.id)}
              title={`Mark ${todo.title} as ${todo.completed ? "incomplete" : "complete"}`}
            />
            {todo.title}
            <button onClick={() => {
              handleDeleteTodo(todo.id);
              const messageElement = document.getElementById("message");
              if (messageElement) {
                messageElement.innerHTML = todo.title;
              }
            }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
