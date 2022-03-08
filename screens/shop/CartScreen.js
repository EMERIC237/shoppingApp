import { StyleSheet, Text, View, FlatList, Button } from "react-native";
import { useSelector } from "react-redux";
import React from "react";
import Colors from "../../constants/Colors";

const CartScreen = (props) => {
  const cartTotalAmount = useSelector((state) => state.cart.totalAmount);
  const cartItems = useSelector((state) => Object.values(state.cart.items));
  console.log(cartItems);
  return (
    <View style={styles.screen}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:
          <Text style={styles.amount}>${cartTotalAmount.toFixed(2)}</Text>
        </Text>
        <Button title="Order Now" disabled={cartItems.length === 0} />
      </View>
      <View>
        <Text>Cart Items: </Text>
      </View>
      <FlatList
        data={cartItems}
        renderItem={(itemData) => (
          <View>
            <Text>{itemData.item.productTitle}</Text>
            <Text>{itemData.item.quantity}</Text>
            <Text>{itemData.item.sum.toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
  },
  summaryText: {
    fontFamily: "open-sans",
    fontSize: 18,
  },
  amount: { color: Colors.primary },
});
