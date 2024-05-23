import * as React from 'react';
import {Text, View, StyleSheet, Button, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomHeader from '../../component/CustomHeader';
import {Searchbar} from 'react-native-paper';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {retroMap, nightMap, standardMap} from '../../utils/mapstyle/map';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { firebase } from '@react-native-firebase/auth';
import { useSelector } from 'react-redux';
import instance from '../../axios/axiosInstance';
import { RAPID_API_PLACE_AUTOCOMPLETE_URL, X_RAPID_API_PLACE_AUTOCOMPLETE_HOST, X_RAPID_API_PLACE_AUTOCOMPLETE_KEY } from '@env';





interface Place {
  place_name : string;
  place_id : string;
}


interface UserDestinationProps {
   navigation:any;
}


const UserDestination:React.FC<UserDestinationProps> = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [desiredLocation , setDesiredLocation] = useState<Place[]>([]);
  const [suggestion , setSuggestion] = useState<string[]>([]);
  const [isVisble , setVisible] = useState(false);
  const [isSetDestinationLocation , setDestinationLocation] = useState(false);
  const [destination , setDestination] = useState({ latitude: 0, longitude: 0 });
  const token = useSelector((state : any) => state.userProfile.token);
  const userId = firebase.auth().currentUser?.uid;


  useEffect(() => {
    placeAutoComplete();       
  } , [searchQuery]);
  

  // Place AutoComplete
  const placeAutoComplete = async() => {
    setDestinationLocation(false);
    const options = {
      method: 'GET',
      url: RAPID_API_PLACE_AUTOCOMPLETE_URL,
      params: {
        input: searchQuery,
        radius: '50000'
      },
      headers: {
        'X-RapidAPI-Key': X_RAPID_API_PLACE_AUTOCOMPLETE_KEY,
        'X-RapidAPI-Host': X_RAPID_API_PLACE_AUTOCOMPLETE_HOST
      }
    };

    try {
      const response = await axios.request(options);
      setSuggestion([]);
      let place = [];
      for(let i=0; i < response.data.predictions.length; i++){
         
         place.push(response.data.predictions[i].description);
          
      }

      setSuggestion(place);
      setVisible(true);
      
      

    } catch (error) {
      console.error(error);
    }
  }

 

  // Find Latitude and Longtitude Using Place 
  const searchLocation = async(place:any) => {
    setSearchQuery(place);
    const options = {
      method: 'GET',
      url: 'https://map-geocoding.p.rapidapi.com/json',
      params: {
        address: place
      },
      headers: {
        'X-RapidAPI-Key': '80d5459a70msh8bd6e06f4f88c16p1ceddbjsn78651e30baf8',
        'X-RapidAPI-Host': 'map-geocoding.p.rapidapi.com'
      }
    };
    
    try {
      const response = await axios.request(options);
      setDestination({latitude : response.data.results[0].geometry.location.lat , longitude:response.data.results[0].geometry.location.lng});
      setDestinationLocation(true);
      setVisible(false);
     
    } catch (error) {
      console.error(error);
    }
    

  } 

  
  // Navigate to Location Screen
  const handleLocation = () =>{
    navigation.navigate('Location');
  }

  const handleSetLocation = async() => {

    let travellingLocation = {
       latitude : destination.latitude,
       longtitude: destination.longitude
    }
    let placeName = searchQuery;
    const response = await instance.post('/addTravelLocation', {
      userId, travellingLocation, placeName
    });
    
    if(response.status === 200){
      setSearchQuery('');
      setDestinationLocation(false);
    }
    else{
       console.log("Something occured");
    }
  

       
  }



  return (
    <View style={styles.mainContainer}>
      <CustomHeader name="Add location" icon="map" call={handleLocation}/>

    
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        elevation={1}
      />
      {
        suggestion.length > 0  && isVisble && <View style={styles.autoSuggestion}>
      {
         suggestion && isVisble && suggestion.map((item , Key) => (
             <View key={Key}>
                  <TouchableOpacity onPress={() => searchLocation(item)} style={{backgroundColor:'#F5F5F5' , borderRadius:15, padding:10, elevation:3,}}>
                  <Text style={styles.autoSuggestionText}>{item}</Text>
                  </TouchableOpacity>
             </View>            
         ))
      }
      </View>
     }
      

      <View style={styles.mapContainer}>
        {
            destination.latitude  ?
            <MapView
            style={styles.mapView}
            provider={PROVIDER_GOOGLE}
            customMapStyle={nightMap}
            region={{
              latitude: destination.latitude,
              longitude: destination.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}>
           
                   <Marker coordinate={{latitude: destination.latitude, longitude: destination.longitude}}>
                      
                   </Marker>    
            </MapView>

            : 

            <MapView
            style={styles.mapView}
            provider={PROVIDER_GOOGLE}
            customMapStyle={nightMap}
            region={{
              latitude: 37.7882,
              longitude: -122.4324,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}>
           
                   <Marker coordinate={{latitude: 37.78825, longitude: -122.4324}}>
                      
                   </Marker>    
            </MapView>



        }  
      </View>
      {
         isSetDestinationLocation &&
          <TouchableOpacity
          style={styles.setLocationBtnView}  
          onPress={() => handleSetLocation()}>
          <View style={styles.setLocationBtn}>
            <Text style={styles.btnText}> Set Location</Text>
            <Icon name="add-location-alt" size={28} color={'white'} />
          </View>
        </TouchableOpacity>
      }
      
    </View>
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
  autoSuggestion: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    gap:5,
  },
  autoSuggestionText: {
    fontSize: 17,
    color: 'black',
    fontWeight: '400',
  },
  setLocationBtnView: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  setLocationBtn:{
    backgroundColor:'#3ebb6e',
    padding:10,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:25,
    flexDirection:'row',
    gap:5,
  },
  btnText:{
    color:'white',
    fontSize:20,
  },
});

export default UserDestination;
