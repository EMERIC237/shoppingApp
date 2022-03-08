import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ProductItem from "./shop/ProductItem";

const ProductList = () => {
  return (
    <View style={styles.listView}>
      <ProductItem />
    </View>
  );
};

export default ProductList;

const styles = StyleSheet.create({
  listView: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
