import { LOGIN, SIGNUP } from "../actions/AuthActions";

const initialState = {
  token: null,
  userId: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SIGNUP:
      return {
        token: action.payload.token,
        userId: action.payload.userId,
      };

    case LOGIN:
      return {
        token: action.payload.token,
        userId: action.payload.userId,
      };
    default:
      return state;
  }
};
