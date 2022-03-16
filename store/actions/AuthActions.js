import AsyncStorage from "@react-native-async-storage/async-storage";
export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN";
export const AUTHENTICATE = "AUTHENTICATE";

export const LOGOUT = "LOGOUT";
/**
 *Function to sign up on the app using hte email and password
 *
 * @param {string} email
 * @param {string} password
 * @returns a dispatch function that will be called by the redux thunk to return oru action object
 */
export const signup = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBSzD3_mNgj4OMIYz1KXzfw3-Z_YzxjBn4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorType = errorData.error.message;
      let message = "Something went wrong!";
      if (errorType === "EMAIL_EXISTS") {
        message = "This email exist already";
      } else if (errorType === "INVALID_PASSWORD") {
        message = "This password is not valid!";
      }
      throw new Error(message);
    }
    const resData = await response.json();
    dispatch(authenticate(resData.localId, resData.idToken));
    //check get the expiration date of the token
    const onExpiration = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, onExpiration);
  };
};

export const authenticate = (userId, token) => {
  return { type: AUTHENTICATE, payload: { userId, token } };
};

/**
 *Function to login on the app using the email and password
 *
 * @param {string} email
 * @param {string} password
 * @returns a dispatch function that will be called by the redux thunk to return oru action object
 */
export const login = (email, password) => {
  console.log("trying to login here ......");
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBSzD3_mNgj4OMIYz1KXzfw3-Z_YzxjBn4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorType = errorData.error.message;
      let message = "Something went wrong!";
      if (errorType === "EMAIL_NOT_FOUND") {
        message = "This email could not be found!";
      } else if (errorType === "INVALID_PASSWORD") {
        message = "This password is not valid!";
      }
      throw new Error(message);
    }

    const resData = await response.json();
    dispatch(authenticate(resData.localId, resData.idToken));

    const onExpiration = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, onExpiration);
  };
};

/**
 *  function to save the token on the device
 * @param {string} token
 * @param {string} userId
 * @param {date object} onExpiration
 * @implements AsyncStorage
 */
const saveDataToStorage = (token, userId, onExpiration) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({ token, userId, expiryDate: onExpiration.toISOString() })
  );
};

/**
 * function to logout of the device and delete the token
 * @name logout
 * @returns an action object
 */
export const logout = () => {
  return { type: LOGOUT };
};
