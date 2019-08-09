// import React from "react";
// import { Platform, StyleSheet, Text, View } from "react-native";
// import MapView from "react-native-maps";
// import Constants from "expo-constants";
// import * as Location from "expo-location";
// import * as Permissions from "expo-permissions";
// import GetMyLocation from "../components/Location";

// export default class MapperScreen extends React.Component {
//   state = {
//     markers: [],
//     mapRegion: null,
//     hasLocationPermissions: false,
//     locationResult: null
//   };

//   componentDidMount() {
//     if (Platform.OS === "android" && !Constants.isDevice) {
//       this.setState({
//         errorMessage:
//           "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
//       });
//     } else {
//       this._getLocationAsync();
//     }
//   }

//   _handleMapRegionChange = mapRegion => {
//     console.log(mapRegion);
//     this.setState({ mapRegion });
//   };

//   _getLocationAsync = async () => {
//     let { status } = await Permissions.askAsync(Permissions.LOCATION);
//     if (status !== "granted") {
//       this.setState({
//         locationResult: "Permission to access location was denied"
//       });
//     } else {
//       this.setState({ hasLocationPermissions: true });
//     }
//     let location = await Location.getCurrentPositionAsync({});
//     this.setState({ locationResult: JSON.stringify(location) });
//   };

//   //press event to add marker
//   _handleLongPress = e => {
//     this.setState({
//       markers: [
//         ...this.state.markers,
//         {
//           coordinates: {
//             longitude: e.nativeEvent.coordinate.longitude,
//             latitude: e.nativeEvent.coordinate.latitude
//           }
//         }
//       ]
//     });
//   };

//   render() {
//     // const { region } = this.props;
//     // console.log(region);

//     return (
//       <View style={styles.container}>
//         {this.state.locationResult === null ? (
//           <Text>Finding your current location...</Text>
//         ) : this.state.hasLocationPermissions === false ? (
//           <Text>Location permissions are not granted.</Text>
//         ) : this.state.mapRegion === null ? (
//           <Text>Map region doesn't exist.</Text>
//         ) : (
//           <MapView
//             provider={MapView.PROVIDER_GOOGLE}
//             style={styles.map}
//             region={this.state.mapRegion}
//             onRegionChange={this._handleMapRegionChange}
//             onLongPress={e => this._handleLongPress(e)}
//           >
//             {this.state.markers.map((mark, i) => (
//               <MapView.Marker
//                 key={i}
//                 ref={this.setMarkerRef}
//                 draggable
//                 coordinate={mark.coordinates}
//               />
//             ))}
//           </MapView>
//         )}
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//     flex: 1
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject
//   },
//   paragraph: {
//     margin: 24,
//     fontSize: 18,
//     fontWeight: "bold",
//     textAlign: "center",
//     color: "#34495e"
//   }
// });

import React, { Component } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

export default class App extends Component {
  state = {
    mapRegion: null,
    hasLocationPermissions: false,
    locationResult: null
  };

  componentDidMount() {
    this._getLocationAsync();
  }

  _handleMapRegionChange = mapRegion => {
    this.setState({ mapRegion });
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        locationResult: "Permission to access location was denied"
      });
    } else {
      this.setState({ hasLocationPermissions: true });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ locationResult: JSON.stringify(location) });

    //Center the map on the location we just fetched.
    this.setState({
      mapRegion: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.locationResult === null ? (
          <Text>Finding your current location...</Text>
        ) : this.state.hasLocationPermissions === false ? (
          <Text>Location permissions are not granted.</Text>
        ) : this.state.mapRegion === null ? (
          <Text>Map region doesn't exist.</Text>
        ) : (
          <MapView
            style={styles.map}
            region={this.state.mapRegion}
            // onRegionChange={this._handleMapRegionChange}
            provider={MapView.PROVIDER_GOOGLE}
            showsUserLocation={true}
            followsUserLocation={true}
            showsMyLocationButton={true}
          >
            <Marker coordinate={this.state.mapRegion}>
              <Image
                source={require("../assets/images/runner-icon.png")}
                style={{ width: 40, height: 40 }}
              />
            </Marker>
          </MapView>
        )}
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
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e"
  }
});
