import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import Input from "../../components/UI/Input";
import HeaderButton from "../../components/UI/HeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import React, { useState, useEffect, useCallback, useReducer } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createProduct,
  updateProduct,
} from "../../store/actions/productsActions";
const FORM_UPDATE = "FORM_UPDATE";
const formReducer = (state, action) => {
  switch (action.type) {
    case FORM_UPDATE:
      const updatedValues = {
        ...state.inputValues,
        [action.input]: action.value,
      };
      const updatedValidities = {
        ...state.inputValidities,
        [action.input]: action.isValid,
      };
      let updatedFormIsValid = true;
      for (const key in updatedValidities) {
        updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
      }
      return {
        formIsValid: updatedFormIsValid,
        inputValidities: updatedValidities,
        inputValues: updatedValues,
      };

    default:
      return state;
  }
};

const EditProductScreen = (props) => {
  const prodId = props.navigation.getParam("productId");
  const productToEdit = useSelector((state) =>
    state.products.userProducts.find((prod) => (prod.id = prodId))
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: productToEdit ? productToEdit.title : "",
      price: productToEdit ? `${productToEdit.price}` : "",
      imageUrl: productToEdit ? productToEdit.imageUrl : "",
      description: productToEdit ? productToEdit.description : "",
    },
    inputValidities: {
      title: productToEdit ? true : false,
      price: productToEdit ? true : false,
      imageUrl: productToEdit ? true : false,
      description: productToEdit ? true : false,
    },
    formIsValid: productToEdit ? true : false,
  });

  const submitHandler = useCallback(() => {
    if (!formState.formIsValid) {
      Alert.alert("Wrong input!", "please check the errors in the form.", [
        { text: "Okay" },
      ]);
      return;
    }
    productToEdit
      ? dispatch(
          updateProduct(
            prodId,
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.imageUrl
          )
        )
      : dispatch(
          createProduct(
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.imageUrl,
            +formState.inputValues.price
          )
        );
    props.navigation.goBack();
  }, [dispatch, prodId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );
  return (
    <ScrollView>
      <View style={styles.form}>
        <Input
          label="Title"
          errorText="Please enter a valid title!"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          returnKeyType="next"
          onInputChange={inputChangeHandler.bind(this, "title")}
          initialValue={productToEdit ? productToEdit.title : ""}
          initiallyValid={!!productToEdit}
          required
        />
        <Input
          label="image Url"
          errorText="Please enter a valid image url!"
          keyboardType="default"
          onInputChange={inputChangeHandler.bind(this, "imageUrl")}
          initialValue={productToEdit ? productToEdit.imageUrl : ""}
          initiallyValid={!!productToEdit}
          required
        />
        <Input
          label="Price"
          errorText="Please enter a valid image price!"
          onInputChange={inputChangeHandler.bind(this, "price")}
          editable={productToEdit ? false : true}
          keyboardType="decimal-pad"
          required
          min={0.1}
        />

        <Input
          label="Description"
          errorText="Please enter a valid Description!"
          onInputChange={inputChangeHandler.bind(this, "description")}
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          multiline
          numberOfLines={3}
          initialValue={productToEdit ? productToEdit.description : ""}
          initiallyValid={!!productToEdit}
          required
          minLength={5}
        />
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

  label: {
    fontFamily: "open-sans-bold",
    marginVertical: 8,
  },
});
