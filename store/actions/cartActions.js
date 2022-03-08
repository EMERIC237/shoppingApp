export const ADD_TO_CART = "ADD_TO_CART";

export const AddtoCart = (product) => {
  return {
    type: ADD_TO_CART,
    payload: product,
  };
};
