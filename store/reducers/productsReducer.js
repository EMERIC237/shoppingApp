import PRODUCTS from "../../data/dummy-data ";
import Product from "../../models/product";
import {
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  UPDATE_PRODUCT,
} from "../actions/productsActions";
const initialState = {
  availableProducts: PRODUCTS,
  userProducts: PRODUCTS.filter((prod) => prod.ownerId === "u1"),
};

function uid() {
  return (performance.now().toString(36) + Math.random().toString(36)).replace(
    /\./g,
    ""
  );
}
function productsReducer(state = initialState, action) {
  console.log("before going through the reducer", state.userProducts);

  switch (action.type) {
    case DELETE_PRODUCT:
      return {
        ...state,
        userProducts: state.userProducts.filter(
          (product) => product.id !== action.pid
        ),
        availableProducts: state.availableProducts.filter(
          (product) => product.id !== action.pid
        ),
      };
    case CREATE_PRODUCT:
      console.log("before creating new product", state.userProducts);

      const { title, description, imageUrl, price } = action.payload;
      const newId = uid();
      const newProduct = new Product(
        newId,
        "u1",
        title,
        imageUrl,
        description,
        price
      );
      console.log(state.userProducts);
      console.log({ newProduct });
      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct),
      };

    case UPDATE_PRODUCT:
      const {
        id: prodId,
        title: updatedTitle,
        description: updatedDescription,
        imageUrl: updatedImageUrl,
      } = action.payload;
      console.log(action.payload);
      const productIndex = state.userProducts.findIndex(
        (prod) => prod.id === prodId
      );
      const productIndexInAvailable = state.availableProducts.findIndex(
        (prod) => prod.id === prodId
      );
      const updatedProduct = new Product(
        prodId,
        state.userProducts[productIndex]["ownerId"],
        updatedTitle,
        updatedImageUrl,
        updatedDescription,
        state.userProducts[productIndex]["price"]
      );
      const updatedUserProducts = [...state.userProducts];
      updatedUserProducts[productIndex] = updatedProduct;

      const updatedAvailableProducts = [...state.availableProducts];
      updatedAvailableProducts[productIndexInAvailable] = updatedProduct;

      return {
        ...state,
        availableProducts: updatedAvailableProducts,
        userProducts: updatedUserProducts,
      };
    default:
      return state;
  }
}

export default productsReducer;
