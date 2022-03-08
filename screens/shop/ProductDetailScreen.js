import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Button,
} from "react-native";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Colors from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as cartActions from "../../store/actions/cartActions";

const ProductDetailScreen = (props) => {
  const productId = props.navigation.getParam("productId");
  const product = useSelector((state) =>
    state.products.availableProducts.find((product) => product.id === productId)
  );
  const dispatch = useDispatch();
  return (
    <ScrollView>
      <View>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: product.imageUrl }} />
        </View>
        <View style={styles.actions}>
          <Button
            color={Colors.primary}
            title="To Cart"
            onPress={() => {
              dispatch(cartActions.AddtoCart(product));
            }}
          />
        </View>
        <Text style={styles.price}>${product.price}</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>
    </ScrollView>
  );
};

ProductDetailScreen.navigationOptions = (navigationData) => {
  const productTitle = navigationData.navigation.getParam("productTitle");

  return {
    headerTitle: productTitle,
    headerleft: () => (
      <View onPress={() => navigationData.navigation.pop()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </View>
    ),
  };
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    height: 300,
    marginHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  actions: {
    marginVertical: 10,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  price: {
    fontFamily: "open-sans-bold",
    textAlign: "center",
    fontSize: 24,
    color: "#888",
    fontWeight: "500",
    marginVertical: 20,
  },
  description: {
    fontFamily: "open-sans",
    fontSize: 20,
    textAlign: "center",
    marginHorizontal: 20,
  },
});
