import React, { Dispatch, useCallback, useEffect, useRef, useState } from 'react';
import {Text, View, StyleSheet, StatusBar, ScrollView, Dimensions, TouchableOpacity, Platform, PermissionsAndroid , NativeModules, NativeEventEmitter , AppState} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect, useDispatch, useSelector } from 'react-redux';
import BackgroundService from 'react-native-background-actions';
import { SendDirectSms } from 'react-native-send-direct-sms';
import { VolumeManager } from 'react-native-volume-manager';
import { firebase } from '@react-native-firebase/auth';
import {addToken, changeUserName } from '../../redux/userprofile/action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addMatchingContacts, addSelectedContact, updateContactList} from '../../redux/contacts/action';
import axios from 'axios';
import Contact from '../../component/Contact';
import HomeCustomHeader from '../../component/HomeCustomHeader';
import { allNotificationReadOrNot, deleteAllNotificationOrNot } from '../../redux/notifications/action';
import Geolocation from 'react-native-geolocation-service';
import { startSubscriptionService } from '../../utils/SubscriptionService';
import { IS_SUBSCRIBED, updateSubscriptionDetails } from '../../redux/subscription/action';
import { fetchLocation, findNearestPoliceStation } from '../../redux/location/action';
import instance from '../../axios/axiosInstance';
import store from '../../redux/store';



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
  const userName  = useSelector((state : RootState) => state.userProfile.userName);
  const selectedContacts = useSelector((state : any) => state.contacts.selectedContact);
  const matchedContacts = useSelector((state : any) => state.contacts.matchingContacts);
  const isSubscribed = useSelector((state:any) => state.subscription.isSubscribed);
  const notificationReadStatus = useSelector((state: any) => state.notifications.notificationAllReadOrNot);
  const nearestPoliceStation = useSelector((state:any) => state.location.nearestPoliceStation);
  const [appState,setAppState] = useState(AppState.currentState);
  const userId = firebase.auth().currentUser?.uid; 
  const dispatch = useDispatch();
  const [volume , setVolume] = useState(-1);  
  const [token , setToken] = useState<string | null>(null);
  const [volumUp, setVolumeUp] = useState(0);
  const [volumeDown , setVolumeDown] = useState(0);
  const subScriptionEndTime = useSelector((state:any) => state.subscription.subScriptionEndTime);
  const latitude = nearestPoliceStation && nearestPoliceStation.policeStationLocation ? nearestPoliceStation.policeStationLocation.latitude : 0.00;
  const longitude = nearestPoliceStation && nearestPoliceStation.policeStationLocation ? nearestPoliceStation.policeStationLocation.longitude : 0.00;
  const locationData = useSelector((state: any) => state.location.locations);
  
  
   

  useEffect(() => {
    getToken();
    dispatchStore(changeUserName(userId));
    dispatchStore(addSelectedContact(userId));
    dispatchStore(fetchLocation(userId));
    getCurrentLocation();   
  },[token]);

 

  useEffect(() => {
    // Request location SMS permission
    requestLocationSMSPermission();

    // Define a function to check if both nearestPoliceStation and notificationReadStatus are not null
    const checkValuesNotNull = () => {
        if (nearestPoliceStation !== null && notificationReadStatus !== null) {
            return true;
        }
        return false;
    };

    // If both values are null, dispatch actions
    if (!checkValuesNotNull()) {
        dispatchStore(allNotificationReadOrNot(userId));
        dispatchStore(findNearestPoliceStation(userId));
    }
  }, [nearestPoliceStation, notificationReadStatus]);

  

  useEffect(() => {
  
      const eventEmitter = new NativeEventEmitter(NativeModules.MyService);
    
      const subscription = eventEmitter.addListener('onKeyMessage', event => {
      const keyMessage = event.keyMessage;
         console.log(keyMessage);
         if(keyMessage === 'VOLUME_UP_KEY'){
           setVolumeUp(prevVolumeUp => prevVolumeUp + 1); 
         }
         if(keyMessage === 'VOLUME_DOWN_KEY'){
            setVolumeDown(prevVolumeUp => prevVolumeUp + 1); 
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
    // const currentLocation = () => {
    //   Geolocation.getCurrentPosition(
    //     position => {
    //       setLocation({
    //         latitude: position.coords.latitude,
    //         longitude: position.coords.longitude
    //       });
    //       console.log(location);
          
    //     },
    //     error => {
    //       console.log(error.code, error.message);
    //     },
    //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    //   );
    // };
    // currentLocation();
    // if(locationData){
    //   const interval = setInterval(() => {
    //      travellingLocationNotification();
    //   }, 10000);
    
    //   return () => clearInterval(interval);  
    // }
  }, []);





  
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
    

   
          
     let policeStationId = nearestPoliceStation.nearestPoliceStation.id; 
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
 


  const sendLiveLocation = async() => {
    
    await getCurrentLocation();

    
    let selectedUser = [];
    for(const contact of selectedContacts){ 
        if(contact.userId){
           selectedUser.push(contact.userId);
        }
    }
    
    
    let policeStationId = nearestPoliceStation.nearestPoliceStation.id;

  
  
    
    
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
 


  const getToken = async() => {
    const value = await AsyncStorage.getItem('token');
    if(value !== null){
      setToken(value);
      dispatch(addToken(value));
    }
    
  }
  
  

  const getNotificationToken = async() => {
    const title = 'Safe Arrival Notification';
    const body = `Great news! ${userName} has safely arrived at his destination`; 
    
   
     

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

       // save LiveLocation Notification 
       await instance.post('/saveSafelyArrivalNotification',
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




        
           
  }

   
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
                 getNotificationToken();
                 let locationId = travellingLocation.locationId;
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

  const handleLocationMap = (mapNumber:number) => {
    navigation.navigate('HelpScreen', { mapNumber: mapNumber});
  }

  const handleNotification = () =>{
    navigation.navigate('Notification');
  }

  const handleContactList = () => {
      navigation.navigate('EmergencyContactList');
  }

  return (
    <View style={style.homeMain}>
      <StatusBar backgroundColor={'#3ebb6e'} />

      {/* custom header */}
      <HomeCustomHeader
        name="Secure Signal"
        icon="bell"
        call={handleNotification}
        isRead={notificationReadStatus}
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

            {selectedContacts && selectedContacts.map((item: { givenName: string | any[]; }, key: React.Key | null | undefined) => (
                <TouchableOpacity key={key} style={style.contactSelectedView}>
                    <Text style={style.contactText}>{item.givenName && item.givenName.length > 0 ? item.givenName[0] : ''}</Text>
                </TouchableOpacity>
                
              ))
            }


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
                region={{
                  latitude: nearestPoliceStation && nearestPoliceStation.policeStationLocation ? nearestPoliceStation.nearestPoliceStation.policeStationLocation.latitude : 37.78825,
                  longitude: nearestPoliceStation && nearestPoliceStation.policeStationLocation ? nearestPoliceStation.nearestPoliceStation.policeStationLocation.longtitude : -122.4324,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}>
                <Marker coordinate={{latitude: nearestPoliceStation && nearestPoliceStation.policeStationLocation ? nearestPoliceStation.nearestPoliceStation.policeStationLocation.latitude : 37.78825, 
                                     longitude: nearestPoliceStation && nearestPoliceStation.policeStationLocation ? nearestPoliceStation.nearestPoliceStation.policeStationLocation.longtitude : -122.4324}}>
                  <Icon name="local-police" size={40} color={'#5F4C24'} />
                </Marker>
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
                region={{
                  latitude: nearestPoliceStation && nearestPoliceStation.policeStationLocation ? nearestPoliceStation.nearestPoliceStation.policeStationLocation.latitude : 37.78825,
                  longitude: nearestPoliceStation && nearestPoliceStation.policeStationLocation ? nearestPoliceStation.nearestPoliceStation.policeStationLocation.longtitude : -122.4324,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}>
                <Marker coordinate={{latitude: nearestPoliceStation && nearestPoliceStation.policeStationLocation ? nearestPoliceStation.nearestPoliceStation.policeStationLocation.latitude : 37.78825, 
                                     longitude: nearestPoliceStation && nearestPoliceStation.policeStationLocation ? nearestPoliceStation.nearestPoliceStation.policeStationLocation.longtitude : -122.4324}}>
                  <Icon name="local-hospital" size={40} color={'red'} />
                </Marker>
              </MapView>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
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
});




export default HomeScreen;
export const dispatchStore = store.dispatch as typeof store.dispatch | Dispatch<any>
