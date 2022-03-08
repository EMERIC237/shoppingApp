import Order from "../../models/order";
import { ADD_ORDER } from "../actions/orderActions";

const initialState = {
  orders: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_ORDER:
      const newOrder = new Order(
        new Date().toString(),
        action.payload.cartItems,
        action.payload.totalAmount,
        new Date()
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
