import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import GetMyLocation from "../components/Location";

export default class MapperScreen extends React.Component {
  state = {
    markers: []
  };
  //press event to add marker
  _handleLongPress = e => {
    this.setState({
      markers: [
        ...this.state.markers,
        {
          coordinates: {
            longitude: e.nativeEvent.coordinate.longitude,
            latitude: e.nativeEvent.coordinate.latitude
          }
        }
      ]
    });
  };

  render() {
    const { region } = this.props;
    console.log(region);

    return (
      <View style={styles.container}>
        <MapView
          provider={MapView.PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            latitude: 40.75325,
            longitude: -74.003807,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121
          }}
          //add marker when user presses and hold map
          onLongPress={e => this._handleLongPress(e)}
        >
          {this.state.markers.map((mark, i) => (
            <MapView.Marker
              key={i}
              ref={this.setMarkerRef}
              draggable
              coordinate={mark.coordinates}
            />
          ))}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});
