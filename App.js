import { StyleSheet, Text, View } from "react-native";
import store from "./store";
import { Provider } from "react-redux";
import ShopNavigator from "./navigation/ShopNavigator";
//Provider and store will be used to wrap the navigator

export default function App() {
  return (
    <Provider store={store}>
      <ShopNavigator />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
