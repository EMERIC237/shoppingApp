import Order from "../../models/order";
import { ADD_ORDER, SET_ORDERS } from "../actions/orderActions";

const initialState = {
  orders: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ORDERS:
      return {
        orders: action.orders,
      };
    case ADD_ORDER:
      const newOrder = new Order(
        action.payload.id,
        action.payload.cartItems,
        action.payload.totalAmount,
        action.payload.date
      );
      return {
        ...state,
        orders: state.orders.concat(newOrder),
      };
    default:
      return state;
  }
  return state;
};
