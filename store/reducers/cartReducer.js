import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cartActions";
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
    case REMOVE_FROM_CART:
      //We make a shallow copy of the cart, delete the items and replace the new value of the cart.item
      const { id: pid, prodPrice: price, quantity: qtt } = action.payload;
      let updateItems = { ...state.items };

      if (qtt > 1) {
        //we need to reduce it not erase
        updateItems[pid].quantity = qtt - 1;
        updateItems[pid].sum = updateItems[pid].sum - price;
      } else {
        //we erase the whole element
        delete updateItems[pid];
      }
      return {
        ...state,
        items: { ...updateItems },
        totalAmount: state.totalAmount - price,
      };

    default:
      return state;
  }
}
export default cartReducer;
