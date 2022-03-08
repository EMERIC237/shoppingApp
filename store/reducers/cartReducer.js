import { ADD_TO_CART } from "../actions/cartActions";
import CartItem from "../../models/cart-item";
const initialState = {
  items: {},
  totalAmount: 0,
};
function cartReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.payload;
      const prodPrice = addedProduct.price;
      const prodTitle = addedProduct.title;
      let toAdd;
      if (state.items[addedProduct.id]) {
        const existingItem = state.items[addedProduct.id];
        // already have the item in the cart
        toAdd = new CartItem(
          existingItem.quantity + 1,
          prodPrice,
          prodTitle,
          existingItem.sum + prodPrice
        );
      } else {
        toAdd = new CartItem(1, prodPrice, prodTitle, prodPrice);
      }
      return {
        ...state,
        items: { ...state.items, [addedProduct.id]: toAdd },
        totalAmount: state.totalAmount + prodPrice,
      };

    default:
      return state;
  }
}
export default cartReducer;
