import { firebase } from '@react-native-firebase/auth';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { Modal, Searchbar } from 'react-native-paper';
import { RAPID_API_FIND_PLACE_BASE_URL, RAPID_API_PLACE_AUTOCOMPLETE_URL, X_RAPID_API_FIND_PLACE_HOST, X_RAPID_API_FIND_PLACE_KEY, X_RAPID_API_PLACE_AUTOCOMPLETE_HOST, X_RAPID_API_PLACE_AUTOCOMPLETE_KEY } from '@env';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';
import instance from '../axios/axiosInstance';
import { useSelector } from 'react-redux';
import { height } from '../utils/constant';


interface Place {
    place_name : string;
    place_id : string;
}

interface TravellingLocationMapProps {
  navigation:any;
}



const TravellingLocationMap:React.FC<TravellingLocationMapProps> = ({navigation}) => {
    const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestion , setSuggestion] = useState<string[]>([]);
    const [isVisble , setVisible] = useState(false);
    const [visible, setVisibleSubscription] = React.useState(false);
    const [isSetDestinationLocation , setDestinationLocation] = useState(false);
    const [destination , setDestination] = useState({ latitude: 0, longitude: 0 });
    const userId = firebase.auth().currentUser?.uid;  
    const isSubscribed = useSelector((state:any) => state.subscription.isSubscribed);
  
    useEffect(() => {
       getCurrentLocation();  
    },[]);


    useEffect(() => {
      if (isSubscribed && searchQuery) {
          placeAutoComplete();  
      } else if (!isSubscribed) {
          setVisibleSubscription(true);
      }        
  }, [searchQuery]);

      const getCurrentLocation = async () => {
        Geolocation.getCurrentPosition(
          position => {
            const newLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setLocation(prevLocation => ({...prevLocation, ...newLocation}));
          },
          error => {
            console.log(error.code, error.message);
            console.log('error');
          },
        );
      };
        
  
  // Place AutoComplete
  const placeAutoComplete = async() => {
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
      url: RAPID_API_FIND_PLACE_BASE_URL,
      params: {
        address: place
      },
      headers: {
        'X-RapidAPI-Key': X_RAPID_API_FIND_PLACE_KEY,
        'X-RapidAPI-Host': X_RAPID_API_FIND_PLACE_HOST
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

  const handleSubscriptionNavigation = () => {
    navigation.navigate('Subscription');
    setVisibleSubscription(false);
 }

  

  return (
    <View style={style.mapContainer}>
      <MapView
        style={style.nearStationMap}
        provider={PROVIDER_GOOGLE}
        scrollEnabled={true}
        showsTraffic={true}
        zoomEnabled={false}
        region={{
          latitude: destination ? destination.latitude : location.latitude,
          longitude: destination ? destination.longitude : location.longitude,
          latitudeDelta: 0.035,
          longitudeDelta: 0.0121,
        }}>
        <Marker
          coordinate={{
            latitude: destination ? destination.latitude : location.latitude,
            longitude: destination ? destination.longitude : location.longitude,
          }}
        />
      </MapView>
      {
        <>
          <Searchbar
            placeholder="Search"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={style.searchBar}
            elevation={1}
          />
          {suggestion.length > 0 && isVisble && (
            <View style={style.autoSuggestion}>
              {suggestion &&
                isVisble &&
                suggestion.map((item, Key) => (
                  <View key={Key}>
                    <TouchableOpacity
                      onPress={() => searchLocation(item)}
                      style={{
                        backgroundColor: '#F5F5F5',
                        borderRadius: 15,
                        padding: 10,
                        elevation: 3,
                      }}>
                      <Text style={style.autoSuggestionText}>{item}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          )}
        </>
      }

      {isSetDestinationLocation &&  searchQuery.length > 0 &&(
        <TouchableOpacity
          style={style.setLocationBtnView}
          onPress={() => handleSetLocation()}>
          <View style={style.setLocationBtn}>
            <Text style={style.btnText}> Set Location</Text>
            <Icon name="add-location-alt" size={28} color={'white'} />
          </View>
        </TouchableOpacity>
      )}
      {
        <>
          <Modal
            visible={visible}
            onDismiss={() =>setVisibleSubscription(false)}
            contentContainerStyle={style.containerStyle}>
            <View style={{alignItems:'center',justifyContent:'center'}}>
                   <Text style={{flexWrap:'wrap' , marginLeft:10, marginRight:10 , fontSize:20, fontWeight:'700', color:'black'}}>Subscribe now to unlock this and many other exclusive features!</Text>
                   <TouchableOpacity style={{backgroundColor:'#3ebb6e' , borderRadius:8 , justifyContent:'center', marginTop:20, padding:10}}
                    onPress={() => handleSubscriptionNavigation()}>
                         <Text style={{color:'white' , textAlign:'center' , fontSize:20}}>Subscribe Now</Text>
                   </TouchableOpacity>
            </View>
          </Modal>
        </>
      }
    </View>
  );
};

export default TravellingLocationMap;

const style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
      },
      searchBar: {
        position:'absolute',
        padding: 1,
        backgroundColor: 'white',
        marginLeft: 15,
        marginRight: 15,
        marginTop:70,
      },
      mapContainer: {
        flex: 1,
      },
      mapView: {
        flex: 1,
      },
      autoSuggestion: {
        position:'absolute',
        marginLeft: 20,
        marginRight: 20,
        marginTop: height/6,
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
      nearStationMap: {
        flex: 1,
      },
      containerStyle:{
        backgroundColor:'white',
        marginLeft:30,
        marginRight:30,
        height:'35%',
        borderRadius:20,
        elevation:5,
      },
    
});
