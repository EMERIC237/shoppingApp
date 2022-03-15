import PRODUCTS from "../../data/dummy-data ";
import Product from "../../models/product";
import {
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  SET_PRODUCTS,
  UPDATE_PRODUCT,
} from "../actions/productsActions";
const initialState = {
  availableProducts: PRODUCTS,
  userProducts: PRODUCTS.filter((prod) => prod.ownerId === "u1"),
};

function productsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        availableProducts: action.products,
        userProducts: action.products.filter((prod) => prod.ownerId === "u1"),
      };
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
      const { id, title, description, imageUrl, price } = action.payload;

      const newProduct = new Product(
        id,
        "u1",
        title,
        imageUrl,
        description,
        price
      );

      return {
        ...state,
        availableProducts: [...state.availableProducts, newProduct],
        userProducts: [...state.userProducts, newProduct],
      };

    case UPDATE_PRODUCT:
      const {
        id: prodId,
        title: updatedTitle,
        description: updatedDescription,
        imageUrl: updatedImageUrl,
      } = action.payload;
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
