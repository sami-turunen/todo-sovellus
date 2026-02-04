import { useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [done, setDone] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [editData, setEditData] = useState(null);

  const openAddModal = () => {
    setEditData(null);
    setTaskName("");
    setIsOpen(true);
  };

  const openEditModal = (task, list, setList) => {
    setEditData({ task, list, setList });
    setTaskName(task);
    setIsOpen(true);
  };

  const saveTask = () => {
    if (!taskName.trim()) return;

    if (editData) {
      const { task, list, setList } = editData;
      setList(list.map(t => (t === task ? taskName : t)));
    } else {
      setTasks([...tasks, taskName]);
    }

    setIsOpen(false);
    setTaskName("");
  };

  const deleteTask = (task, list, setList) => {
    if (window.confirm("Poistetaanko tehtävä?")) {
      setList(list.filter(t => t !== task));
    }
  };

  const moveToInProgress = (task) => {
    setTasks(tasks.filter(t => t !== task));
    setInProgress([...inProgress, task]);
  };

  const moveToDone = (task) => {
    setInProgress(inProgress.filter(t => t !== task));
    setDone([...done, task]);
  };

  return (
    <div className="app">
      <h1>To Do -sovellus</h1>

      <button className="add-button" onClick={openAddModal}>
        Lisää tehtävä
      </button>

      <div className="columns">
        <Column
          title="Tehtävät"
          items={tasks}
          onMove={moveToInProgress}
          moveText="Työn alle"
          onEdit={openEditModal}
          onDelete={deleteTask}
          setList={setTasks}
        />

        <Column
          title="Kesken"
          items={inProgress}
          onMove={moveToDone}
          moveText="Valmis"
          onEdit={openEditModal}
          onDelete={deleteTask}
          setList={setInProgress}
        />

        <Column
          title="Valmis"
          items={done}
          onEdit={openEditModal}
          onDelete={deleteTask}
          setList={setDone}
          done
        />
      </div>

      {isOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{editData ? "Muokkaa tehtävää" : "Uusi tehtävä"}</h3>
            <input
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Tehtävän nimi"
              autoFocus
            />
            <div className="modal-buttons">
              <button onClick={saveTask}>Tallenna</button>
              <button className="cancel" onClick={() => setIsOpen(false)}>
                Peruuta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Column({
  title,
  items,
  onMove,
  moveText,
  onEdit,
  onDelete,
  setList,
  done,
}) {
  return (
    <div className="column">
      <h2>{title}</h2>
      {items.map((task, index) => (
        <div className={`task ${done ? "done-task" : ""}`} key={index}>
          <span>{task}</span>
          <div className="buttons">
            {onMove && (
              <button onClick={() => onMove(task)}>{moveText}</button>
            )}
            <button onClick={() => onEdit(task, items, setList)}>✏️</button>
            <button onClick={() => onDelete(task, items, setList)}>🗑️</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
