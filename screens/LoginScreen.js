import React from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import Expo from "expo";
import firebase from "firebase";
import * as Google from "expo-google-app-auth";
import { iosClientId } from "../secrets";

export default class LoginScreen extends React.Component {
  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = googleUser => {
    console.log("Google Auth Response", googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(
      function(firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!this.isUserEqual(googleUser, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
          );
          // Sign in with credential from the Google user.
          firebase
            .auth()
            .signInWithCredential(credential)
            .then(function(result) {
              console.log("user signed in");
              if (result.additionalUserInfo.isNewUser) {
                firebase
                  .database()
                  .ref("/users/" + result.user.uid)
                  .set({
                    gmail: result.user.email,
                    profilePicture: result.additionalUserInfo.profile.picture,
                    locale: result.additionalUserInfo.profile.locale,
                    firstName: result.additionalUserInfo.profile.given_name,
                    lastName: result.additionalUserInfo.profile.family_name,
                    createdAt: Date.now()
                  })
                  .then(function(snapshot) {
                    //console.log()
                  });
              } else {
                firebase
                  .database()
                  .ref("/users/" + result.user.uid)
                  .update({ last_logged_in: Date.now() });
              }
            })
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
        } else {
          console.log("User already signed-in Firebase.");
        }
      }.bind(this)
    );
  };

  signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        //androidClientId: YOUR_CLIENT_ID_HERE,
        iosClientId: iosClientId,
        scopes: ["profile", "email"]
      });

      if (result.type === "success") {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>NOT ANOTHER RUNNING APP</Text>
        <View style={styles.welcomeContainer}>
          <Image
            source={require("../assets/images/RonnieRunningApp.png")}
            style={{ width: 300, height: 300 }}
          />
        </View>
        <Button
          title="Sign In With Google"
          onPress={() => this.signInWithGoogleAsync()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  welcomeContainer: {
    justifyContent: "center"
  }
});
