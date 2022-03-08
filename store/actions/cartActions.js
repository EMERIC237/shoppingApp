export const ADD_TO_CART = "ADD_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";

export const AddtoCart = (product) => {
  return {
    type: ADD_TO_CART,
    payload: product,
  };
};

export const removeItem = (id, prodPrice, quantity) => {
  return {
    type: REMOVE_FROM_CART,
    payload: {
      id,
      prodPrice,
      quantity,
    },
  };
};
