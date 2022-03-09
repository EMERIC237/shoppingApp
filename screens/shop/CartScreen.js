import { StyleSheet, Text, View, FlatList, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { removeItem } from "../../store/actions/cartActions";
import React from "react";
import Colors from "../../constants/Colors";
import CartItem from "../../components/shop/CartItem";
import { addOrder } from "../../store/actions/orderActions";
import Card from "../../components/UI/Card";

const CartScreen = (props) => {
  const cartTotalAmount = useSelector((state) => state.cart.totalAmount);
  const cartItems = useSelector((state) => {
    const itemsList = [];
    for (const key in state.cart.items) {
      itemsList.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
      });
    }
    return itemsList.sort((a, b) => (a.productId > b.productId ? 1 : -1));
  });
  const dispatch = useDispatch();

  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:
          <Text style={styles.amount}>
            ${Math.round((cartTotalAmount.toFixed(2) * 100) / 100)}
          </Text>
        </Text>
        <Button
          title="Order Now"
          disabled={cartItems.length === 0}
          onPress={() => {
            dispatch(addOrder(cartItems, cartTotalAmount));
          }}
        />
      </Card>
      <View>
        <Text>Cart Items: </Text>
      </View>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.productId}
        renderItem={(itemData) => (
          <CartItem
            quantity={itemData.item.quantity}
            title={itemData.item.productTitle}
            amount={itemData.item.sum}
            deletable
            onRemove={() => {
              dispatch(
                removeItem(
                  itemData.item.productId,
                  itemData.item.productPrice,
                  itemData.item.quantity
                )
              );
            }}
          />
        )}
      />
    </View>
  );
};
CartScreen.navigationOptions = {
  headerTitle: "Your cart",
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
  },
  summaryText: {
    fontFamily: "open-sans",
    fontSize: 18,
  },
  amount: { color: Colors.primary },
});
