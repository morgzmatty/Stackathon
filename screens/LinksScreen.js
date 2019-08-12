import React from "react";
import { ScrollView, StyleSheet, Linking, Button } from "react-native";

export default function LinksScreen() {
  return (
    <ScrollView style={styles.container}>
      <Button
        title="How to Run Like A Pro"
        onPress={this._handleOpenWithLinking}
        style={styles.button}
      />
    </ScrollView>
  );
}

_handleOpenWithLinking = () => {
  Linking.openURL("https://www.youtube.com/watch?v=fQ7ewHFw_I8");
};

LinksScreen.navigationOptions = {
  title: "Links"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  }
});
