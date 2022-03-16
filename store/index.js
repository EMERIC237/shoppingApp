import { combineReducers, createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import loggerMiddleware from "redux-logger";
import productsReducer from "./reducers/productsReducer";
import cartReducer from "./reducers/cartReducer";
import ordersReducer from "./reducers/ordersReducer";
import AuthReducer from "./reducers/AuthReducer";

const appReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  auth: AuthReducer,
});
const composeEnhancer = composeWithDevTools(
  applyMiddleware(thunkMiddleware, loggerMiddleware)
);
export default createStore(appReducer, composeEnhancer);
