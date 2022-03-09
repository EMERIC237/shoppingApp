import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import HeaderButton from "../../components/UI/HeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createProduct,
  updateProduct,
} from "../../store/actions/productsActions";

const EditProductScreen = (props) => {
  const prodId = props.navigation.getParam("productId");
  const prouctToEdit = useSelector((state) =>
    state.products.userProducts.find((prod) => (prod.id = prodId))
  );
  const dispatch = useDispatch();
  const [title, setTitle] = useState(prouctToEdit ? prouctToEdit.title : "");
  const [imageUrl, setImageUrl] = useState(
    prouctToEdit ? prouctToEdit.imageUrl : ""
  );
  const [price, setPrice] = useState(
    prouctToEdit ? `${prouctToEdit.price}` : ""
  );
  const [description, setDescription] = useState(
    prouctToEdit ? prouctToEdit.description : ""
  );

  const submitHandler = useCallback(() => {
    prouctToEdit
      ? dispatch(updateProduct(prodId, title, description, imageUrl))
      : dispatch(createProduct(title, description, imageUrl, +price));
    props.navigation.goBack();
  }, [dispatch, prodId, title, description, imageUrl, price]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={styles.input}
            value={imageUrl}
            onChangeText={(text) => setImageUrl(text)}
          />
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            value={price}
            editable={prouctToEdit ? false : true}
            onChangeText={(text) => setPrice(text)}
          />
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
        </View>
      </View>
    </ScrollView>
  );
};
EditProductScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: navData.navigation.getParam("productId")
      ? "Edit Product"
      : "Add Product",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
          }
          onPress={submitFn}
        />
      </HeaderButtons>
    ),
  };
};
export default EditProductScreen;

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  formControl: {
    width: "100%",
  },
  label: {
    fontFamily: "open-sans-bold",
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
});
