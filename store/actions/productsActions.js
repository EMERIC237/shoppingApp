import Product from "../../models/product";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

export const fetchProducts = () => {
  return async (dispatch) => {
    const response = await fetch(
      "https://shopping-app-a69b5-default-rtdb.firebaseio.com/products.json"
    );
    const resData = await response.json();
    const loadedProducts = [];
    for (const key in resData) {
      loadedProducts.push(
        new Product(
          key,
          "u1",
          resData[key].title,
          resData[key].imageUrl,
          resData[key].description,
          resData[key].price
        )
      );
    }
    dispatch({
      type: SET_PRODUCTS,
      products: loadedProducts,
    });
  };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch) => {
    // runs you async code here
    try {
      const response = await fetch(
        "https://shopping-app-a69b5-default-rtdb.firebaseio.com/products.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            imageUrl,
            price,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("something went wrong");
      }
      const resData = await response.json();
      dispatch({
        type: CREATE_PRODUCT,
        payload: { id: resData.name, title, description, imageUrl, price },
      });
    } catch (error) {
      //send and error message
      throw error;
    }
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch) => {
    const response = await fetch(
      `https://shopping-app-a69b5-default-rtdb.firebaseio.com/products/${id}.json`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    dispatch({
      type: UPDATE_PRODUCT,
      payload: { id, title, description, imageUrl },
    });
  };
};

export const deleteProduct = (productId) => {
  return async (dispatch) => {
    const response = await fetch(
      `https://shopping-app-a69b5-default-rtdb.firebaseio.com/products/${productId}.json`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    dispatch({ type: DELETE_PRODUCT, pid: productId });
  };
};
