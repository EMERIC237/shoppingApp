import { combineReducers, createStore } from "redux";
import productsReducer from "./reducers/productsReducer";

const appReducer = combineReducers({
  products: productsReducer,
});

export default createStore(appReducer);
