import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import firebase from "firebase";

export default class LoadingScreen extends React.Component {
  componentDidMount() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        {
          console.log("homescreen");
        }
        this.props.navigation.navigate("HomeStack");
      } else {
        {
          console.log("loginscreen");
        }
        this.props.navigation.navigate("LoginScreen");
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
