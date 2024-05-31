import React, { Dispatch, useCallback, useEffect, useRef, useState } from 'react';
import {Text, View, StyleSheet, StatusBar, ScrollView, Dimensions, TouchableOpacity, Platform, PermissionsAndroid , NativeModules, NativeEventEmitter , AppState, BackHandler, Alert, Keyboard} from 'react-native';
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



const sleep = (time: number | undefined) => new Promise<void>((resolve) => setTimeout(() => resolve(), time));
const width =  Dimensions.get('window').width;




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
  const [mapNumber , setMapNumber] = useState(1);
  const userName  = useSelector((state : RootState) => state.userProfile.userName);
  const selectedContacts = useSelector((state : any) => state.contacts.selectedContact);
  const isSubscribed = useSelector((state:any) => state.subscription.isSubscribed);
  const notificationReadStatus = useSelector((state: any) => state.notifications.notificationAllReadOrNot);
  const nearestPoliceStation = useSelector((state:any) => state.location.nearestPoliceStation);
  const nearestHospital = useSelector((state:any) => state.location.nearestHospital);
  const userId = firebase.auth().currentUser?.uid; 
  const dispatch = useDispatch();
  const [volume , setVolume] = useState(-1);  
  const [token , setToken] = useState<string | null>(null);
  const [volumUp, setVolumeUp] = useState(0);
  const [volumeDown , setVolumeDown] = useState(0);
  const subScriptionEndTime = useSelector((state:any) => state.subscription.subScriptionEndTime);
  const locationData = useSelector((state: any) => state.location.locations);
  
  
  console.log(nearestHospital);
  
  
   
  

  useEffect(() => {
    getToken();
    dispatchStore(changeUserName(userId));
    dispatchStore(addSelectedContact(userId));
    dispatchStore(fetchLocation(userId));
    dispatchStore(fetchUserComplaints(userId));
    getCurrentLocation();   
  },[token]);

 
 

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
       setVolumeUp(0);
    }
    if(volumeDown === 3){
     stop();
     setVolumeDown(0);
    }
 
  },[volumUp , volumeDown]);

  useEffect(() => {
    if (isSubscribed === true) {
      
      const interval = setInterval(() => {
      
        checkSubscriptionStatus();
      }, 1000);

      return () => clearInterval(interval);
    }
    else{
      navigation.navigate('Subscription');
    }
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
 

  // Get token
  const getToken = async() => {
    const value = await AsyncStorage.getItem('token');
    if(value !== null){
      setToken(value);
      dispatch(addToken(value));
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
  const handleLocationMap = (mapNumber:number) => {
    setMapNumber(mapNumber);
    setProtectorSheetVisible(true);
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
    navigation.navigate('Location');
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
        mapIcon="map"
        mapHistory={handleLocation}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.usernameText}>
          <Text style={style.username}>Hello {userName}</Text>
        </View>

        {/* Guardians Contact List */}
        <View style={style.caretakerView}>
          <Text style={style.caretakerText}>My Caretaker</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={style.caretakerScrollView}>
            <TouchableOpacity
              style={style.contactView}
              onPress={() => handleContactList()}>
              <Text style={style.contactText}>+</Text>
            </TouchableOpacity>

            {selectedContacts &&
              selectedContacts.map(
                (
                  item: {givenName: string | any[]},
                  key: React.Key | null | undefined,
                ) => (
                  <View key={key}>
                    <View style={style.contactSelectedView}>
                      <Text style={style.contactText}>
                        {item.givenName && item.givenName.length > 0
                          ? item.givenName[0]
                          : ''}
                      </Text>
                    </View>
                    <View style={style.selectedContactNameView}>
                      <Text style={style.selectedContactName}>
                        {item.givenName}
                      </Text>
                    </View>
                  </View>
                ),
              )}
          </ScrollView>
        </View>

        {/* Near Police Station */}
        <View style={style.nearEmergencyStationView}>
          <Text style={style.nearEmergencyStationViewText}>
            Near Police Station
          </Text>

          <View style={style.nearEmergencyStationMapView}>
            <View style={style.mapContainer}>
              <MapView
                onPress={() => handleLocationMap(1)}
                style={style.nearStationMap}
                provider={PROVIDER_GOOGLE}
                scrollEnabled={false}
                zoomEnabled={false}
                region={region}>
                {nearestPoliceStation && nearestPoliceStation.nearestPoliceStation && 
                nearestPoliceStation.nearestPoliceStation.map(
                  (station: any) => (
                    <Marker
                      key={station.id}
                      coordinate={{
                        latitude:
                          station && station.policeStationLocation
                            ? station.policeStationLocation.latitude
                            : 37.78825,
                        longitude:
                          station && station.policeStationLocation
                            ? station.policeStationLocation.longtitude
                            : -122.4324,
                      }}>
                      <Icon name="local-police" size={40} color={'#5F4C24'} />
                    </Marker>
                  ),
                )}
              </MapView>
            </View>
          </View>
        </View>

        {/* Near Hospital */}
        <View style={style.nearEmergencyStationView}>
          <Text style={style.nearEmergencyStationViewText}>Near Hospital</Text>
          <View style={style.nearEmergencyStationMapView}>
            <View style={style.mapContainer}>
              <MapView
                onPress={() => handleLocationMap(2)}
                style={style.nearStationMap}
                provider={PROVIDER_GOOGLE}
                scrollEnabled={false}
                zoomEnabled={false}
                region={hospitalregion}>
                {
                  nearestHospital && nearestHospital.nearestHospital &&
                   nearestHospital.nearestHospital.map((station: any)=> (
                    <Marker
                    key={station.id}
                    coordinate={{
                      latitude: station && station.hospitalLocation
                          ?  station.hospitalLocation.latitude
                          : 37.78825,
                      longitude: station && station.hospitalLocation 
                          ? station.hospitalLocation.longtitude
                          : -122.4324,
                    }}>
                    <Icon name="local-hospital" size={40} color={'red'} />
                  </Marker>
                    
                   ))
                }
              </MapView>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
      {
       isProtectorSheetVisible && <ProtectorBottomSheet setProtectorSheetVisible={setProtectorSheetVisible}
        navigation={navigation} mapNumber={mapNumber}/>
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
    flex: 1,
    elevation:8,
  },
  contactSelectedView:{
    backgroundColor: 'lightblue',
    width: 60,
    height: 60,
    borderRadius: 33,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 7,
    flex: 1,
    elevation:8,
  },
  contactText: {
    fontSize: 35,
    textAlign: 'center',
  },
  nearEmergencyStationView: {
    marginTop: 10,
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
    borderRadius: 20,
    overflow: 'hidden', 
    backgroundColor:'black',
    marginLeft:18,
    marginRight:18,
    elevation:5,
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
  }

});




export default HomeScreen;
export const dispatchStore = store.dispatch as typeof store.dispatch | Dispatch<any>
