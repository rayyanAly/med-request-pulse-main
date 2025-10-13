import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import store from "./redux/store";
import { loadUserFromStorage } from "./redux/actions/loginActions";
import "./index.css";

store.dispatch(loadUserFromStorage());

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
