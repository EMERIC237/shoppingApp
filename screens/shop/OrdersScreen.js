import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import HeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import OrderItem from "../../components/shop/OrderItem";
import { fetchOrders } from "../../store/actions/orderActions";

const OrdersScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const orders = useSelector((state) => state.orders.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchOrders())
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.noFound}>
        <Text style={styles.message}>
          There is no order for now!!!please start adding some
        </Text>
      </View>
    );
  }
  return (
    <FlatList
      data={orders}
      renderItem={(itemData) => (
        <OrderItem
          amount={itemData.item.totalAmount}
          date={itemData.item.readableDate}
          items={itemData.item.items}
        />
      )}
    />
  );
};
OrdersScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your orders",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};
export default OrdersScreen;

const styles = StyleSheet.create({
  centered: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  noFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontSize: 14,
  },
});
