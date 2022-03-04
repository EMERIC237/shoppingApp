import { StyleSheet, Text, View } from "react-native";
import store from "./store";
import { Provider } from "react-redux";
//Provider and store will be used to wrap the navigator

export default function App() {
  return (
    <Provider store={store}>
      <View>
        <Text>my app</Text>
      </View>
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
