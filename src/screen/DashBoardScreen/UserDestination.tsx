import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../component/CustomHeader';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axios from 'axios';
import ReactNativeAlgoliaPlaces from 'react-native-algolia-places';


interface UserDestinationProps {}

const handle = async() => {
  
   
}


const UserDestination = (props: UserDestinationProps) => {
  return (
       <SafeAreaView style={styles.mainContainer}>
           <CustomHeader name="Add location" icon="map" />  
           

     



       </SafeAreaView>
  );
};


const styles = StyleSheet.create({
      mainContainer: 
      {
         flex:1,
         backgroundColor:'white',
      }
});

export default UserDestination;


