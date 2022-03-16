import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import Input from "../../components/UI/Input";
import HeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import React, { useState, useEffect, useCallback, useReducer } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createProduct,
  updateProduct,
} from "../../store/actions/productsActions";
const FORM_UPDATE = "FORM_UPDATE";
const formReducer = (state, action) => {
  if (action.type === FORM_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.inputValue,
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
  }
  return state;
};

const EditProductScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
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

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert("Wrong input!", "please check the errors in the form.", [
        { text: "Okay" },
      ]);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (productToEdit) {
        await dispatch(
          updateProduct(
            prodId,
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.imageUrl
          )
        );
      } else {
        await dispatch(
          createProduct(
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.imageUrl,
            +formState.inputValues.price
          )
        );
      }
      props.navigation.goBack();
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  }, [dispatch, prodId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_UPDATE,
        inputValue: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.form}>
          <Input
            id="title"
            label="Title"
            errorText="Please enter a valid title!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={productToEdit ? productToEdit.title : ""}
            initiallyValid={!!productToEdit}
            required
          />
          <Input
            id="imageUrl"
            label="Image Url"
            errorText="Please enter a valid image url!"
            keyboardType="default"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={productToEdit ? productToEdit.imageUrl : ""}
            initiallyValid={!!productToEdit}
            required
          />
          <Input
            id="price"
            label="Price"
            errorText="Please enter a valid image price!"
            onInputChange={inputChangeHandler}
            editable={productToEdit ? false : true}
            keyboardType="decimal-pad"
            required
            min={0.1}
          />

          <Input
            id="description"
            label="Description"
            errorText="Please enter a valid description!"
            onInputChange={inputChangeHandler}
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            multiline
            numberOfLines={3}
            initialValue={productToEdit ? productToEdit.description : ""}
            initiallyValid={!!productToEdit}
            required
            minLength={5}
            returnKeyType="send"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
