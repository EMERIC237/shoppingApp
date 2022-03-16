import Order from "../../models/order";

export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";

export const fetchOrders = () => {
  return async (dispatch, getState) => {
    try {
      const userId = getState().auth.userId;
      const response = await fetch(
        `https://shopping-app-a69b5-default-rtdb.firebaseio.com/orders/${userId}.json`
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const resData = await response.json();
      const loadedOrders = [];
      for (const key in resData) {
        loadedOrders.push(
          new Order(
            key,
            resData[key].cartItems,
            resData[key].totalAmount,
            new Date(resData[key].date)
          )
        );
      }
      dispatch({
        type: SET_ORDERS,
        orders: loadedOrders,
      });
    } catch (error) {
      throw error;
    }
  };
};

export const addOrder = (cartItems, totalAmount) => {
  const date = new Date();
  return async (dispatch, getState) => {
    try {
      const userId = getState().auth.userId;
      const token = getState().auth.token;
      const response = await fetch(
        `https://shopping-app-a69b5-default-rtdb.firebaseio.com/orders/${userId}.json?auth=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cartItems,
            totalAmount,
            date: date.toISOString(),
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const resData = await response.json();

      dispatch({
        type: ADD_ORDER,
        payload: {
          id: resData.name,
          cartItems,
          totalAmount,
          date: date,
        },
      });
    } catch (error) {
      throw error;
    }
  };
};
