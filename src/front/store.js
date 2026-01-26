export const initialStore = () => {
  return {
    message: null,
    token: sessionStorage.getItem("token") || null,
    user: sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))
      : null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      },
    ],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "add_task":
      const { id, color } = action.payload;

      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo,
        ),
      };

    case "login":
      return {
        ...store,
        token: action.payload.token,
        user: action.payload.user,
      };

    case "logout":
      // borramos sessionStorage
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      return {
        ...store,
        token: null,
        user: null,
      };

    default:
      throw Error("Unknown action.");
  }
}
