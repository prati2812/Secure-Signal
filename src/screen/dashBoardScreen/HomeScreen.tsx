import React, { Dispatch, useCallback, useEffect, useRef, useState } from 'react';
import {Text, View, StyleSheet, StatusBar, ScrollView, Dimensions, TouchableOpacity, Platform, PermissionsAndroid , NativeModules, NativeEventEmitter , AppState, BackHandler, Alert, Keyboard, ActivityIndicator} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect, useDispatch, useSelector } from 'react-redux';
import BackgroundService from 'react-native-background-actions';
import { SendDirectSms } from 'react-native-send-direct-sms';
import { VolumeManager } from 'react-native-volume-manager';
import { firebase } from '@react-native-firebase/auth';
import {addToken, changeUserName, fetchUserComplaints} from '../../redux/userprofile/action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addMatchingContacts, addSelectedContact, updateContactList} from '../../redux/contacts/action';
import axios from 'axios';
import Contact from '../../component/Contact';
import HomeCustomHeader from '../../component/HomeCustomHeader';
import { allNotificationReadOrNot, deleteAllNotificationOrNot } from '../../redux/notifications/action';
import Geolocation from 'react-native-geolocation-service';
import { IS_SUBSCRIBED, updateSubscriptionDetails } from '../../redux/subscription/action';
import { fetchLocation, findNearestHospital, findNearestPoliceStation } from '../../redux/location/action';
import instance from '../../axios/axiosInstance';
import store from '../../redux/store';
import { NavigationContainer } from '@react-navigation/native';
import AppStack from '../../stack/AppStack';
import AuthStack from '../../stack/AuthStack';
import ProtectorBottomSheet from '../../component/ProtectorBottomSheet';
import OptionSelection from '../../component/OptionSection';
import PoliceStationMap from '../../component/PoliceStationMap';
import HospitalMap from '../../component/HospitalMap';
import { Searchbar } from 'react-native-paper';
import { RAPID_API_FIND_PLACE_BASE_URL, RAPID_API_PLACE_AUTOCOMPLETE_URL, X_RAPID_API_FIND_PLACE_HOST, X_RAPID_API_FIND_PLACE_KEY, X_RAPID_API_PLACE_AUTOCOMPLETE_HOST, X_RAPID_API_PLACE_AUTOCOMPLETE_KEY } from '@env';
import TravellingLocationMap from '../../component/TravellingLocationMap';
import InfoCard from '../../component/InfoCard';
import WarningSheet from '../../component/WarningSheet';




const sleep = (time: number | undefined) => new Promise<void>((resolve) => setTimeout(() => resolve(), time));
const width =  Dimensions.get('window').width;
const height = Dimensions.get('screen').height;



interface Contact {
  recordID: string;
  givenName: string;
  phoneNumbers: { number: string }[];
}

interface RootState {
  userProfile: {
    userName: string; 
  };
  selectedContacts: Contact[]; 
}

interface HomeScreenProps {
  navigation: any; 
}


const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [isProtectorSheetVisible, setProtectorSheetVisible] = useState(false);
  const [isWarningSheetVisble, setWarningSheetVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedOption , setSelectedOption] = useState('Police Station');
  const [selectedStation , setSelectedStation] = useState(null);
  const [isInfoSheetVisible , setInfoSheetVisible] = useState(false);
  const [mapNumber , setMapNumber] = useState(1);
  const userName  = useSelector((state : RootState) => state.userProfile.userName);
  const selectedContacts = useSelector((state : any) => state.contacts.selectedContact);
  const isSubscribed = useSelector((state:any) => state.subscription.isSubscribed);
  const notificationReadStatus = useSelector((state: any) => state.notifications.notificationAllReadOrNot);
  const nearestPoliceStation = useSelector((state:any) => state.location.nearestPoliceStation);
  const nearestHospital = useSelector((state:any) => state.location.nearestHospital);
  const userId = firebase.auth().currentUser?.uid;   
  const [volumUp, setVolumeUp] = useState(0);
  const [volumeDown , setVolumeDown] = useState(0);
  const subScriptionEndTime = useSelector((state:any) => state.subscription.subScriptionEndTime);
  const locationData = useSelector((state: any) => state.location.locations);
  
  useEffect(() => {
    dispatchStore(changeUserName(userId))
    .then(setLoading(false))
    .catch(setLoading(false));
    dispatchStore(addSelectedContact(userId));
    dispatchStore(fetchLocation(userId));
    dispatchStore(fetchUserComplaints(userId));
    getCurrentLocation();   
  },[]);


  useEffect(() => {
    // Request location SMS permission
    requestLocationSMSPermission();
    getCurrentLocation();  
    // Define a function to check if both nearestPoliceStation and notificationReadStatus are not null
    const checkValuesNotNull = () => {
        if (nearestPoliceStation !== null && notificationReadStatus !== null && nearestHospital !== null && location !== null) {
            return true;
        }
        return false;
    };

    // If both values are null, dispatch actions
    if (!checkValuesNotNull()) {
        dispatchStore(allNotificationReadOrNot(userId));
        dispatchStore(findNearestPoliceStation(userId , location.latitude.toString() , location.longitude.toString()));
        dispatchStore(findNearestHospital(userId , location.latitude.toString() , location.longitude.toString()));
    }
  }, [nearestPoliceStation, notificationReadStatus , nearestHospital]);

  useEffect(() => {
  
      const eventEmitter = new NativeEventEmitter(NativeModules.MyService);
    
      const subscription = eventEmitter.addListener('onKeyMessage', event => {
      const keyMessage = event.keyMessage;
         if(keyMessage === 'VOLUME_UP_KEY'){
           setVolumeUp(prevVolumeUp => prevVolumeUp + 1); 
         }
         if(keyMessage === 'VOLUME_DOWN_KEY'){
            setVolumeDown(prevVolumeUp => prevVolumeUp + 1); 
         }
         if(keyMessage === 'BACK_PRESS_KEY'){
             navigation.goBack();
         }
         
       });
      
    
      return () => subscription.remove();    
  
  },[]);


  useEffect(() => {
   
    if(volumUp === 3){
       sendSMS();
       backgroundService();
       setWarningSheetVisible(true);
       setVolumeUp(0);
    }
    if(volumeDown === 3){
     stop();
     setWarningSheetVisible(false);
     setVolumeDown(0);
    }
 
  },[volumUp , volumeDown]);

  useEffect(() => {
    let interval: any;
  
    if (isSubscribed) {
      
      interval = setInterval(() => {
        
        try {
          checkSubscriptionStatus();
        } catch (error) {
          
        }
      }, 1000);
    } else {
      
      navigation.navigate('Subscription');
    }
  
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isSubscribed]);
  

  useEffect(() => {
    if(locationData){
      const interval = setInterval(() => { 
         travellingLocationNotification();
      }, 100000);
    
      return () => clearInterval(interval);  
    }
  }, [locationData]);

  const initialRegion = {
    latitude:
      nearestPoliceStation &&                                         
      nearestPoliceStation.nearestPoliceStation &&
      nearestPoliceStation.nearestPoliceStation.length > 0 &&
      nearestPoliceStation.nearestPoliceStation[0].policeStationLocation
        ? nearestPoliceStation.nearestPoliceStation[0].policeStationLocation.latitude
        : 37.78825,
    longitude:
      nearestPoliceStation &&
      nearestPoliceStation.nearestPoliceStation &&
      nearestPoliceStation.nearestPoliceStation.length > 0 &&
      nearestPoliceStation.nearestPoliceStation[0].policeStationLocation
        ? nearestPoliceStation.nearestPoliceStation[0].policeStationLocation.longtitude
        : -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  };
  const [region, setRegion] = useState(initialRegion);
 

  
  useEffect(() => {
    if (nearestPoliceStation && nearestPoliceStation.nearestPoliceStation && nearestPoliceStation.nearestPoliceStation.length > 0) {
      const { latitude, longtitude } = nearestPoliceStation.nearestPoliceStation[0].policeStationLocation;
      setRegion({
        ...region,
        latitude: latitude || 37.78825,
        longitude: longtitude || -122.4324,
      });
    }
  }, [nearestPoliceStation]);


  const InitialRegion = {
    latitude:
      nearestHospital &&                                         
      nearestHospital.nearestHospital &&
      nearestHospital.nearestHospital.length > 0 &&
      nearestHospital.nearestHospital[0].hospitalLocation
        ? nearestHospital.nearestHospital[0].hospitalLocation.latitude
        : 37.78825,
    longitude:
    nearestHospital &&                                         
    nearestHospital.nearestHospital &&
    nearestHospital.nearestHospital.length > 0 &&
    nearestHospital.nearestHospital[0].hospitalLocation
      ? nearestHospital.nearestHospital[0].hospitalLocation.longtitude
        : -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  };
  const [hospitalregion, setHospitalRegion] = useState(InitialRegion);
   
  useEffect(() => {
    if (nearestHospital && nearestHospital.nearestHospital && nearestHospital.nearestHospital.length > 0) {
      const { latitude, longtitude } = nearestHospital.nearestHospital[0].hospitalLocation;
      setHospitalRegion({
        ...region,
        latitude: latitude || 37.78825,
        longitude: longtitude || -122.4324,
      });
    }
  }, [nearestHospital]);

  // check subscription status
  const checkSubscriptionStatus = () => {
    let date = new Date();
    let currentFormattedDate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()} `;
    let  currentDate = new Date(currentFormattedDate);
    let endDate = new Date(subScriptionEndTime);
    if(currentDate > endDate){
      console.log(currentDate , subScriptionEndTime);
       dispatchStore(updateSubscriptionDetails(userId));
    }
    
  }

  // Start Background Service
  const backgroundService = async() => {
    await BackgroundService.start(veryIntensiveTask, options  );
    await BackgroundService.updateNotification({taskDesc: 'New ExampleTask description'});

    const title = 'Emergency';
    const body = 'Live Location sent by '; 
    
   
     

    let selectedUserId = [];
    let tokenMapping = [];
    for(const contact of selectedContacts){ 
        if(contact.userId){
           selectedUserId.push(contact.userId);
        }
    }


    for(let i=0; i < selectedUserId.length; i++){
      const userId = selectedUserId[i];
      const response = await instance.post('/fetchUserDetails',{userId});
     
      const {userData} = await response.data;
      
      tokenMapping.push({notificationToken:userData.notificationToken , userId:userId});
    }
    
  

    console.log(tokenMapping);
    


    for(let i=0; i < tokenMapping.length; i++){
      let  notifyToken = tokenMapping[i].notificationToken;
       
      // Send Live Location Notification to Selected User
      const response = await instance.post('/sendNotificationEmergencyContact' , {notifyToken , userName , title , body});

      if(response.status === 200){
        console.log("successfully notification sent to selected user");
      }
      else{
        console.log("fail");
      }
       
      
    }
    
    const smallestDistanceStation = nearestPoliceStation.nearestPoliceStation.reduce((prev: { distance: number; }, curr: { distance: number; }) => {
      return (prev.distance < curr.distance) ? prev : curr;
    });
    let policeStationId = smallestDistanceStation.id;
       
           
     console.log("====",policeStationId);
      
      //send Live Location Notification to Nearest Police Station
      const response = await instance.post('/sendComplaintNotification' , {policeStationId , userName , title , body});

      if(response.status === 200){
        console.log("sent notification to nearest police station");
      }
      else{
        console.log("fail");
        
      }
      
      
      

      let senderName = userName;
      for(let i=0; i < tokenMapping.length; i++){

         let senderId = tokenMapping[i].userId;

         // save LiveLocation Notification 
         await instance.post('/saveLiveLocation',
           {
             userId,
             senderId,
             senderName
           }).then(() => {
             console.log('successfully notification saved');
         }).catch((err) => {
             console.log(err);             
         });

      }

      
      await instance.post('/savePoliceStationNotification', 
                      {userId , policeStationId , senderName}).then(() => {
          console.log("successfully notification savedd");
            
      }).catch((err) => {
         console.log(err);
      });

          

  }

  // stop background service
  const stop = async() => {
     await BackgroundService.stop();
     
  }

  // Background Service is Running
  const veryIntensiveTask = async (taskDataArguments?: { delay: number; } ) => {
    const { delay } = taskDataArguments || {delay : 1000};
    await new Promise( async (resolve) => {
        for (let i = 0; BackgroundService.isRunning(); i++) {
            sendLiveLocation(); 
            await sleep(delay);
                        
        }
    });
  };


  // Background Service Notification Options
  const options = {
    taskName: 'Location',
    taskTitle: 'Location Sharing',
    taskDesc: 'Location Share',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ff00ff',
    parameters: {
        delay: 5000,
    },
  };
 

  // Send Live Location to the guardians or police station
  const sendLiveLocation = async() => {
    
    await getCurrentLocation();

    
    let selectedUser = [];
    for(const contact of selectedContacts){ 
        if(contact.userId){
           selectedUser.push(contact.userId);
        }
    }
    
    const smallestDistanceStation = nearestPoliceStation.nearestPoliceStation.reduce((prev: { distance: number; }, curr: { distance: number; }) => {
      return (prev.distance < curr.distance) ? prev : curr;
    });
    let policeStationId = smallestDistanceStation.id;
    
    
    // Share Live Location to nearest police station.
    await instance.post('/shareLocationNearestPoliceStation' , {
        userId, policeStationId , location}).then(() => {
       console.log("successfully saved to nearest police station");       
    }).catch((err) => {
       console.log(err);
    });



    for(let i=0; i < selectedUser.length; i++){
      const selectedUserId = selectedUser[i];

      // Share Live Location to the selected user.
      await instance.post('/addLiveLocation' , {
        userId, selectedUserId , location}).then(() =>{
           console.log("successfully saved to selected user");
        }).catch((err) => {
           console.log(err);           
        });


    }



  }

  // Get current user location
  const getCurrentLocation = async() => {
    
    Geolocation.getCurrentPosition(
      position => {
        const newLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude }; 
        setLocation(prevLocation => ({ ...prevLocation, ...newLocation })); 
      },
      error => {
        console.log(error.code, error.message);
        console.log("error");
        
      },
    );
  }
  

  // Request Location and SMS Permission
  const requestLocationSMSPermission = async() => {
    if(Platform.OS === 'android'){
      const granted = await PermissionsAndroid.requestMultiple(['android.permission.ACCESS_FINE_LOCATION' , 
                      'android.permission.SEND_SMS', 'android.permission.POST_NOTIFICATIONS']);
      if(granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED &&
         granted[PermissionsAndroid.PERMISSIONS.SEND_SMS] === PermissionsAndroid.RESULTS.GRANTED &&  
         granted[PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS] === PermissionsAndroid.RESULTS.GRANTED)
      {    
      }
      else{
          requestLocationSMSPermission();
      }
   }
  }
   
  // Get Notification token and send the notification
  const getNotificationToken = async(travellingLocation: string) => {
    const title = 'Safe Arrival Notification';
    const body = `Great news! ${userName} has safely arrived at ${travellingLocation}.`; 
    let placeName = travellingLocation;
   
     

    let selectedUserId = [];
    let tokenMapping = [];
    for(const contact of selectedContacts){ 
        if(contact.userId){
           selectedUserId.push(contact.userId);
        }
    }


    for(let i=0; i < selectedUserId.length; i++){
      const userId = selectedUserId[i];
      const response = await instance.post('/fetchUserDetails',{userId});
     
      const {userData} = await response.data;
      
      tokenMapping.push({notificationToken:userData.notificationToken , userId:userId});
    }
    
  

    console.log(tokenMapping);
    


    for(let i=0; i < tokenMapping.length; i++){
      let  notifyToken = tokenMapping[i].notificationToken;
       
      // Send Live Location Notification to Selected User
      const response = await instance.post('/sendNotificationEmergencyContact' , {notifyToken , userName , title , body});

      if(response.status === 200){
        console.log("successfully notification sent to selected user");
      }
      else{
        console.log("fail");
      }
    }



    let senderName = userName;
    for(let i=0; i < tokenMapping.length; i++){

       let senderId = tokenMapping[i].userId;

       // save SafelyArrival Notification 
       await instance.post('/saveSafelyArrivalNotification',
         {
           userId,
           senderId,
           senderName,
           placeName
         }).then(() => {
           console.log('successfully notification saved');
       }).catch((err) => {
           console.log(err);             
       });

    }




        
           
  }

   // Travellig location notification
  const travellingLocationNotification = async() => {
      let threshold = 2;

      for(let i=0;  i < locationData.length; i++){
          console.log(locationData[i]);
          let currentLocation = location;
          console.log("====",location);
          
          let travellingLocation = locationData[i];
          const response = await instance.post("/findTravellingDistance" , {currentLocation, travellingLocation});
          if(response.status === 200){
             const {distance} = await response.data;
             console.log(distance);
             if(distance <= threshold){
                 if(selectedContacts.length > 0){
                   getNotificationToken(travellingLocation.placeName);  
                 }
                 console.log("hesdf");
                              
                 let locationId = travellingLocation.locationId;
                 console.log("=====",locationId);                 
                 const response = await instance.post("/deleteTravellingLocation" , {userId,locationId});
                 if(response.status === 200){
                     console.log("Delete Location Successfully");
                     dispatchStore(fetchLocation(userId));   
                 }
                 else{
                    console.log("fail");
                 }
             }
             
          }
          
      }
      
  }
  
  

  // Send SMS
  const sendSMS = () => {
   
  
   selectedContacts.forEach((phoneNumber : any) =>{
    let number = phoneNumber.phoneNumbers[0].number;
    number = number.replace(/[()-\s]/g, '');
    number="+91"+number;
    
    SendDirectSms(number, `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`)
    .then((res) => console.log("then", res))
    .catch((err) => console.log("catch", err))
    
   }) 

    
  }

  // Navigate to the HelpScreen
  const handleLocationMap = (mapNumber:number , station : any) => {
    // setMapNumber(mapNumber);
    // setProtectorSheetVisible(true);
    console.log(mapNumber);
    
    console.log("---------" , station);
    
  }

  // Navigate to the Notification Screen
  const handleNotification = () =>{
    navigation.navigate('Notification');
  }

  // Navigate to the Emergency Contact List Screen
  const handleContactList = () => {
      navigation.navigate('EmergencyContactList');
  }

  const handleLocation = () =>{
    navigation.navigate('TopTabNavigator');
  }

  const handleSelectedOption = (title:string) => {
      setSelectedOption(title);
  }

  const handleMarkerClick = (station:any) => {
     setSelectedStation(station);
     setInfoSheetVisible(true);   
     console.log(station);
     
  }
  


  return (
    <>
      <View style={style.homeMain}>
        <StatusBar backgroundColor={'#3ebb6e'} />

        {/* custom header */}
        <HomeCustomHeader
          name="Secure Signal"
          icon="bell"
          call={handleNotification}
          isRead={notificationReadStatus}
          accountIcon="account-circle"
          accountClick={handleLocation}
          contactIcon="account-plus"
          contactClick={handleContactList}
        />

        {loading ? (
          <View style={style.loadingContainer}>
            <ActivityIndicator size="large" color={'green'} />
          </View>
        ) : (
           <View style={{flex:1}}>
             {selectedOption === 'Travelling Location' ? (
                    <TravellingLocationMap />
                  ) : (
                 <><MapView
                    style={style.nearStationMap}
                    provider={PROVIDER_GOOGLE}
                    scrollEnabled={true}
                    showsTraffic={true}
                    zoomEnabled={true}
                    region={{
                      latitude: location ? location.latitude : 37.78825,
                      longitude: location ? location.longitude : -122.4324,
                      latitudeDelta: 0.035,
                      longitudeDelta: 0.0121,
                    }}>
                    <Marker
                      coordinate={{
                        latitude: location ? location.latitude : 37.78825,
                        longitude: location ? location.longitude : -122.4324,
                      }} />
                    {selectedOption === 'Police Station' ? (
                      <>
                        <PoliceStationMap onMarkerPress={handleMarkerClick} />
                      </>
                    ) : (
                      selectedOption === 'Hospital' && (
                        <HospitalMap onMarkerPress={handleMarkerClick} />
                      )
                    )}
                  </MapView>
                  </>     
              )}
              {selectedOption === 'Police Station' &&
                    selectedStation?.policeStationProfile &&
                    isInfoSheetVisible && (
                      <InfoCard
                        setInfoSheetVisible={setInfoSheetVisible}
                        station={selectedStation}
                        navigation={navigation}
                        userName={selectedStation.policeStationProfile.userName}
                        phoneNumber={
                          selectedStation.policeStationProfile.phoneNumber
                        }
                        distance={selectedStation.distance.toFixed(2)}
                        icon={'local-police'}
                        color={'#5F4C24'}
                      />
                    )}
                  {selectedOption === 'Hospital' &&
                    selectedStation?.hospitalProfile &&
                    isInfoSheetVisible && (
                      <InfoCard
                        setInfoSheetVisible={setInfoSheetVisible}
                        station={selectedStation}
                        navigation={navigation}
                        userName={selectedStation.hospitalProfile.userName}
                        phoneNumber={
                          selectedStation.hospitalProfile.phoneNumber
                        }
                        distance={selectedStation.distance.toFixed(2)}
                        icon={'local-hospital'}
                        color={'#008ECC'}
                      />
                    )}
              <View style={{ flexDirection: 'row', position: 'absolute' }}>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                          gap: 10,
                          paddingLeft: 5,
                          paddingRight: 5,
                          paddingBottom: 5,
                          alignItems: 'center',
                        }}
                        style={{}}>
                        <OptionSelection
                          title="Police Station"
                          onSelect={handleSelectedOption}
                          selected={selectedOption === 'Police Station'} />

                        <OptionSelection
                          title="Hospital"
                          onSelect={handleSelectedOption}
                          selected={selectedOption === 'Hospital'} />

                        <OptionSelection
                          title="Travelling Location"
                          onSelect={handleSelectedOption}
                          selected={selectedOption === 'Travelling Location'} />
                      </ScrollView>
                    </View>    
           </View>  
        )}
      </View>
      {isProtectorSheetVisible && (
        <ProtectorBottomSheet
          setProtectorSheetVisible={setProtectorSheetVisible}
          navigation={navigation}
          mapNumber={mapNumber}
        />
      )}
      {
         isWarningSheetVisble &&(
            <WarningSheet setWarningSheetVisible={setWarningSheetVisible}/>
         )
      }
    </>
  );
};



const style = StyleSheet.create({
  homeMain: {
    flex: 1,
    backgroundColor: 'white',
  },
  usernameText: {
    marginTop: 10,
  },
  username: {
    fontSize: 30,
    paddingLeft: 20,
    color: 'black',
    fontWeight: '500',
  },
  caretakerView: {
    marginTop: 14,
  },
  caretakerText: {
    fontSize: 25,
    paddingLeft: 20,
    color: 'black',
    fontWeight: '500',
  },
  caretakerScrollView: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    flexGrow:1,
  },
  contactViewContainer:{
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  contactView: {
    backgroundColor: '#25a5be',
    width: 60,
    height: 60,
    borderRadius: 33,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 7,
    elevation:8,
  },
  contactSelectedView:{
    backgroundColor: 'lightblue',
    width: 60,
    height: 60,
    borderRadius: 33,
    marginTop: 5,
    margin: 7,
    flex: 1,
    elevation:8,
    alignItems:'center',
    justifyContent:'center',
  },
  contactText: {
    fontSize: 35,
    paddingBottom:5,
  },
  nearEmergencyStationView: {
    marginTop: 30,
    marginBottom:10,
  },
  nearEmergencyStationViewText: {
    fontSize: 25,
    paddingLeft: 20,
    color: 'black',
    fontWeight: '500',
  },
  nearEmergencyStationMapView: {
    marginTop: 10,
    width: width,
    height: 175,
  },
  mapContainer:{
    flex: 1,
    overflow: 'hidden', 
    backgroundColor:'black',
    elevation:5,
    borderColor:'green'
  },
  nearStationMap: {
    flex: 1,
  },
  selectedContactView:{
    color:'black', 
    fontSize:17
  },
  selectedContactName:{
    color:'black', 
    fontSize:15
  },
  selectedContactNameView:{
    alignItems:'center' , 
    justifyContent:'center'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    backgroundColor: 'white',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
    marginBottom:15,
    padding:1,
    position:'relative'
  },
  autoSuggestion: {
    position:'absolute',
    marginLeft: 20,
    marginRight: 20,
    marginTop:height/12,
    gap:5,
  },
  autoSuggestionText: {
    fontSize: 17,
    color: 'black',
    fontWeight: '400',
  },

});




export default HomeScreen;
export const dispatchStore = store.dispatch as typeof store.dispatch | Dispatch<any>
