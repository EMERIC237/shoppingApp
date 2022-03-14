import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  Button,
  ActivityIndicator,
  View,
  Text,
  Platform,
} from "react-native";
import ProductItem from "../../components/shop/ProductItem";
import HeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";
import * as cartActions from "../../store/actions/cartActions";
import * as productsActions from "../../store/actions/productsActions";

const ProductsOverviewScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const products = useSelector((state) => state.products.availableProducts);
  const dispatch = useDispatch();

  //function to load the products
  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      "willFocus",
      loadProducts
    );

    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts]);

  useEffect(() => {
    let _isMounted = true;
    if (_isMounted) {
      setIsLoading(true);
      loadProducts().then(() => setIsLoading(false));
    }
    return () => (_isMounted = false);
  }, [dispatch, loadProducts]);

  // const { navigation } = props;

  const selectItemHandler = (id, title) => {
    props.navigation.navigate({
      routeName: "ProductDetail",
      params: {
        productId: id,
        productTitle: title,
      },
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occured!</Text>
        <Button
          title="Try Again"
          onPress={loadProducts}
          color={Colors.primary}
        />
      </View>
    );
  }
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No Products found. Maybe start adding some!</Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={products}
      renderItem={(itemData) => (
        <ProductItem
          imageUrl={itemData.item.imageUrl}
          ownerId={itemData.item.ownerId}
          title={itemData.item.title}
          description={itemData.item.description}
          price={itemData.item.price}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}
        >
          <Button
            color={Colors.primary}
            title="View Details"
            onPress={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          />
          <Button
            color={Colors.primary}
            title="To Cart"
            onPress={() => {
              dispatch(cartActions.AddtoCart(itemData.item));
            }}
          />
        </ProductItem>
      )}
    />
  );
};

ProductsOverviewScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "All Products",
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
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          onPress={() => {
            navData.navigation.navigate("Cart");
          }}
        />
      </HeaderButtons>
    ),
  };
};
export default ProductsOverviewScreen;

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
