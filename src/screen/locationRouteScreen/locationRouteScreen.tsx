import * as React from 'react';
import { Text, View, StyleSheet ,StatusBar} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';


interface LocationRouteScreenProps {}
const LocationRouteScreen = (props: LocationRouteScreenProps) => {
  return (
    <View style={styles.mapContainer}>
      <StatusBar backgroundColor={'lightgray'} />
      <MapView
        style={styles.locationMap}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        region={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
      </MapView>
    </View>
  );
};


const styles = StyleSheet.create({
    mapContainer: {
      flex:1,
      backgroundColor:'white',
    },
    locationMap:{
      flex:1,  
    }
});
  

export default LocationRouteScreen;

