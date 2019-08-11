import React from "react";
import { ExpoConfigView } from "@expo/samples";
import { View, Text, StyleSheet, Button } from "react-native";
import firebase from "firebase";

export default class SettingsScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Settings</Text>
        <Button title="Sign Out" onPress={() => firebase.auth().signOut()} />
      </View>
    );
  }
  /**
   * Go ahead and delete ExpoConfigView and replace it with your content;
   * we just wanted to give you a quick view of your config.
   */
  //return <ExpoConfigView />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
