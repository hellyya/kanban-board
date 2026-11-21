function App() {
  const storedBoards = localStorage.getItem("boards");
  const [boards, setBoards] = React.useState(
    storedBoards
      ? JSON.parse(storedBoards)
      : [
          { id: 1, title: "To Do", tasks: [] },
          { id: 2, title: "In Progress", tasks: [] },
          { id: 3, title: "Done", tasks: [] },
        ]
  );

  const [activeBoard, setActiveBoard] = React.useState(null);
  const [newTask, setNewTask] = React.useState({ title: "", desc: "" });
  const [dragData, setDragData] = React.useState(null);
  const [newBoardName, setNewBoardName] = React.useState("");

  // Persist boards
  React.useEffect(() => {
    localStorage.setItem("boards", JSON.stringify(boards));
  }, [boards]);

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const addTask = () => {
    if (!newTask.title.trim()) return alert("Title required");
    const task = {
      id: Date.now(),
      title: newTask.title,
      desc: newTask.desc,
      date: new Date().toLocaleDateString(),
    };
    setBoards((prev) =>
      prev.map((board) =>
        board.id === activeBoard
          ? { ...board, tasks: [...board.tasks, task] }
          : board
      )
    );
    setNewTask({ title: "", desc: "" });
    setActiveBoard(null);
  };

  // Move task, supports same board reordering
  const moveTask = (taskId, fromBoardId, toBoardId, targetTaskId = null) => {
    setBoards((prevBoards) => {
      let movedTask;

      // Remove from source
      const boardsWithoutTask = prevBoards.map((board) => {
        if (board.id === fromBoardId) {
          const tasks = [...board.tasks];
          const index = tasks.findIndex((t) => t.id === taskId);
          [movedTask] = tasks.splice(index, 1);
          return { ...board, tasks };
        }
        return board;
      });

      // Insert into target
      return boardsWithoutTask.map((board) => {
        if (board.id === toBoardId && movedTask) {
          const tasks = [...board.tasks];
          if (targetTaskId) {
            const targetIndex = tasks.findIndex((t) => t.id === targetTaskId);
            tasks.splice(targetIndex, 0, movedTask);
          } else {
            tasks.push(movedTask);
          }
          return { ...board, tasks };
        }
        return board;
      });
    });

    setDragData(null);
  };

  const renameBoard = (id, newTitle) => {
    setBoards((prev) =>
      prev.map((board) => (board.id === id ? { ...board, title: newTitle } : board))
    );
  };

  const deleteBoard = (id) => {
    if (window.confirm("Delete this board?")) {
      setBoards((prev) => prev.filter((board) => board.id !== id));
    }
  };

  const addBoard = () => {
    if (!newBoardName.trim()) return alert("Board name required");
    setBoards((prev) => [...prev, { id: Date.now(), title: newBoardName, tasks: [] }]);
    setNewBoardName("");
  };

  return (
    <div>
      {/* Add Board */}
      <div>
        <input
          placeholder="New board name"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
        />
        <button onClick={addBoard}>+ Add Board</button>
      </div>

      {/* Boards */}
      <div className="boards">
        {boards.map((board) => (
          <div
            key={board.id}
            className="board"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (!dragData) return;
              // Drop at end if not over a task
              moveTask(dragData.taskId, dragData.fromBoard, board.id);
            }}
          >
            <h3>{board.title}</h3>
            <button
              onClick={() => {
                const newTitle = window.prompt("Rename board", board.title);
                if (newTitle) renameBoard(board.id, newTitle);
              }}
            >
              Rename
            </button>
            <button onClick={() => deleteBoard(board.id)}>Delete</button>

            {/* Tasks */}
            {board.tasks.map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={() =>
                  setDragData({ taskId: task.id, fromBoard: board.id })
                }
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.stopPropagation();
                  if (!dragData || dragData.taskId === task.id) return;
                  moveTask(dragData.taskId, dragData.fromBoard, board.id, task.id);
                }}
              >
                <strong>{task.title}</strong>
                <p>{task.desc}</p>
                <small>{task.date}</small>
              </div>
            ))}

            {/* Add Task */}
            {activeBoard === board.id ? (
              <div>
                <input
                  name="title"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={handleChange}
                />
                <input
                  name="desc"
                  placeholder="Description"
                  value={newTask.desc}
                  onChange={handleChange}
                />
                <button onClick={addTask}>Add</button>
                <button onClick={() => setActiveBoard(null)}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => setActiveBoard(board.id)}>+ Add Task</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
