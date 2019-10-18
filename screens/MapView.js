/* eslint-disable complexity */
// import React, { Component } from "react";
// import {
//   Text,
//   View,
//   StyleSheet,
//   Image,
//   StatusBarIOS,
//   Dimensions
// } from "react-native";
// import MapView, { Marker, Polyline } from "react-native-maps";
// import Constants from "expo-constants";
// import * as Location from "expo-location";
// import * as Permissions from "expo-permissions";
// import pick from "lodash/pick";
// import haversine from "haversine";

// const { width, height } = Dimensions.get("window");

// export default class MapperScreen extends Component {
//   constructor() {
//     super();
//     this.state = {
//       mapRegion: null,
//       hasLocationPermissions: false,
//       locationResult: null,
//       routeCoordinates: [],
//       distanceTravelled: 0,
//       prevLatLng: {}
//     };
//   }

//   componentDidMount() {
//     this._getLocationAsync();
//   }

//   componentWillUnmount() {
//     navigator.geolocation.clearWatch(this.watchID);
//   }

//   _handleMapRegionChange = mapRegion => {
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

//     this.watchID = navigator.geolocation.watchPosition(position => {
//       const { routeCoordinates, distanceTravelled } = this.state;
//       const newLatLngs = {
//         latitude: position.coords.latitude,
//         longitude: position.coords.longitude
//       };
//       const positionLatLngs = pick(position.coords, ["latitude", "longitude"]);
//       console.log(routeCoordinates);
//       this.setState({
//         routeCoordinates: routeCoordinates.concat(positionLatLngs),
//         distanceTravelled: distanceTravelled + this.calcDistance(newLatLngs),
//         prevLatLng: newLatLngs
//       });
//     });

//     //Center the map on the location we just fetched.
//     this.setState({
//       mapRegion: {
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//         latitudeDelta: 0.0052,
//         longitudeDelta: 0.0051
//       }
//     });
//   };

//   calcDistance(newLatLng) {
//     const { prevLatLng } = this.state;
//     return haversine(prevLatLng, newLatLng) || 0;
//   }

//   render() {
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
//             style={styles.map}
//             initialRegion={this.state.mapRegion}
//             provider={MapView.PROVIDER_GOOGLE}
//             showsUserLocation={true}
//             followsUserLocation={true}
//             showsMyLocationButton={true}
//           >
//             <Polyline
//               coordinates={this.state.routeCoordinates}
//               strokeColor="#19B5FE"
//               strokeWidth={6}
//             />
//             <Text>DISTANCE</Text>
//             <Text>
//               {parseFloat(this.state.distanceTravelled).toFixed(2)} km
//             </Text>
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
import { Text, View, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import pick from "lodash/pick";
import haversine from "haversine";

const GEOLOCATION_OPTIONS = {
  accuracy: Location.Accuracy.BestForNavigation,
  timeInterval: 50,
  distanceInterval: 0.5
};

export default class MapperScreen extends Component {
  constructor() {
    super();
    this.state = {
      mapRegion: null,
      hasLocationPermissions: false,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
      lineColors: []
    };
  }

  componentDidMount() {
    this._getLocationAsync();
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  _handleMapRegionChange = mapRegion => {
    this.setState({ mapRegion });
  };

  _setStrokeColorOnSpeed = distance => {
    let speed = distance * 20;
    if (speed >= 0 && speed <= 3.63) {
      return "#FF4633";
    } else if (speed > 3.63 && speed <= 4.866) {
      return "#FF9C33";
    } else if (speed > 6.37 && speed <= 7.152) {
      return "#FFFC33";
    } else if (speed > 7.152 && speed <= 10.06) {
      return "#4CFF33";
    } else if (speed > 10.06 && speed <= 13.888) {
      return "#335BFF";
    } else if (speed > 13.888) {
      return "#D733FF";
    } else {
      return "#000000";
    }
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        hasLocationPermissions: false
      });
      return;
    } else {
      this.setState({ hasLocationPermissions: true });
    }
    //get initial location
    let location = await Location.getCurrentPositionAsync(GEOLOCATION_OPTIONS);
    //Center the map on the location we just fetched.
    this.setState({
      mapRegion: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0052,
        longitudeDelta: 0.0051
      }
    });
    //listen to location
    Location.watchPositionAsync(GEOLOCATION_OPTIONS, newLocation => {
      const { routeCoordinates, distanceTravelled, lineColors } = this.state;
      const { coords } = newLocation;
      const newLatLngs = {
        latitude: coords.latitude,
        longitude: coords.longitude
      };
      const positionLatLngs = pick(coords, ["latitude", "longitude"]);
      console.log("linecolors", lineColors);
      //console.log("routeCoords", routeCoordinates.length);
      this.setState({
        routeCoordinates: routeCoordinates.concat(positionLatLngs),
        distanceTravelled: distanceTravelled + this.calcDistance(newLatLngs),
        prevLatLng: newLatLngs,
        lineColors: lineColors.concat(
          this._setStrokeColorOnSpeed(distanceTravelled)
        )
      });
    });
  };

  calcDistance(newLatLng) {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  }

  render() {
    const {
      hasLocationPermissions,
      mapRegion,
      routeCoordinates,
      distanceTravelled,
      lineColors
    } = this.state;
    return (
      <View style={styles.container}>
        {!hasLocationPermissions ? (
          <Text>Location permissions are not granted.</Text>
        ) : routeCoordinates.length < 1 ? (
          <Text>Finding your current location...</Text>
        ) : mapRegion === null ? (
          <Text>Map region doesn't exist.</Text>
        ) : (
          <MapView
            style={styles.map}
            initialRegion={mapRegion}
            // provider={MapView.PROVIDER_GOOGLE}
            showsMyLocationButton={true}
            showsUserLocation={true}
            followsUserLocation={true}
          >
            <Polyline
              coordinates={routeCoordinates}
              strokeWidth={6}
              strokeColors={lineColors}
              strokeColor="#19B5FE"
            />
            <View style={styles.distance}>
              <Text>Distance Traveled:</Text>
              <Text>{parseFloat(distanceTravelled).toFixed(2)} km</Text>
            </View>
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
  },
  distance: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 600,
    backgroundColor: "#a832a8"
  }
});
