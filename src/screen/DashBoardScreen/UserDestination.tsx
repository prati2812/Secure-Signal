import * as React from 'react';
import {Text, View, StyleSheet, Button, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomHeader from '../../component/CustomHeader';
import {Searchbar} from 'react-native-paper';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {retroMap, nightMap, standardMap} from '../../utils/mapstyle/map';
import { useEffect } from 'react';

interface UserDestinationProps {}




const UserDestination = (props: UserDestinationProps) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [desiredLocation , setDesiredLocation] = React.useState([]);
  const places = [
    {
      name: 'surat',
      coordinates: {
        latitude: 21.1702,
        longitude: 72.8311,
      },
    },
    {
      name: 'ahmedabad',
      coordinates: {
        latitude: 23.0225,
        longitude: 72.5714,
      },
    },
    {
      name: 'mahesana',
      coordinates: {
        latitude: 23.588,
        longitude: 72.3693,
      },
    },
    { 
      name: 'New York City', 
      coordinates: 
      {
        latitude: 40.7128, 
        longitude: -74.006
      }
    },
    {
      name: 'Los Angeles', 
      coordinates: 
      {
        latitude: 34.0522, 
        longitude: -118.2437
      }
    },
  ];
  

  const handleSearch = () => {
    const filteredData = places.filter(data => 
         data.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log("Filtered Data:", filteredData); 
    setDesiredLocation(filteredData);
  }

  useEffect(() => {
    // Log the updated desiredLocation after it's set
    console.log("Updated desiredLocation:", desiredLocation);
  }, [desiredLocation]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <CustomHeader name="Add location" icon="map" />
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        elevation={1}
        onSubmitEditing={()=> handleSearch()}
      />
      

      <View style={styles.mapContainer}>
        <MapView
          style={styles.mapView}
          provider={PROVIDER_GOOGLE}
          customMapStyle={nightMap}
          region={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>

          
{desiredLocation.map(location => (
            <Marker
              key={location.name} // Use a unique key for each Marker
              coordinate={{
                latitude: location.coordinates.latitude,
                longitude: location.coordinates.longitude,
              }}
            />
          ))}    
        
          </MapView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchBar: {
    padding: 1,
    backgroundColor: 'white',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 30,
    overflow: 'hidden',
    marginLeft: 18,
    marginRight: 18,
    elevation: 4,
    marginBottom: 10,
    marginTop: 10,
  },
  mapView: {
    flex: 1,
  },
});

export default UserDestination;
