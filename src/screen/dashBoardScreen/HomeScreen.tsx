import React, { useCallback, useEffect, useRef, useState } from 'react';
import {Text, View, StyleSheet, StatusBar, ScrollView, Dimensions, TouchableOpacity, Platform, PermissionsAndroid , NativeModules, NativeEventEmitter , AppState} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect, useDispatch, useSelector } from 'react-redux';
import BackgroundService from 'react-native-background-actions';
import { SendDirectSms } from 'react-native-send-direct-sms';
import { VolumeManager } from 'react-native-volume-manager';
import { firebase } from '@react-native-firebase/auth';
import { addImageUri, addToken, addUserPhoneNumber, changeUserName } from '../../redux/userprofile/action';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addMatchingContacts, addSelectedContact, updateContactList} from '../../redux/contacts/action';
import axios from 'axios';
import Contact from '../../component/Contact';
import HomeCustomHeader from '../../component/HomeCustomHeader';
import { allNotificationReadOrNot, deleteAllNotificationOrNot } from '../../redux/notifications/action';
import Geolocation from 'react-native-geolocation-service';
import { startSubscriptionService } from '../../utils/SubscriptionService';
import { IS_SUBSCRIBED, updateSubscriptionDetails } from '../../redux/subscription/action';
import { findNearestPoliceStation } from '../../redux/location/action';



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
  const [token , setToken] = useState(null);
  const [volumUp, setVolumeUp] = useState(0);
  const [volumeDown , setVolumeDown] = useState(0);
  const subScriptionEndTime = useSelector((state:any) => state.subscription.subScriptionEndTime);

 

  useEffect(() => {
    getToken();
    dispatch(addImageUri(userId,token));
    dispatch(addSelectedContact(userId,token));
    dispatch(changeUserName(userId,token));
  },[token]);

  useEffect(() => {
    requestLocationSMSPermission();
    dispatch(allNotificationReadOrNot(userId,token));
    if(notificationReadStatus === null){
      dispatch(allNotificationReadOrNot(userId,token));
    }

    dispatch(findNearestPoliceStation(userId));
    if(nearestPoliceStation === null){
      dispatch(findNearestPoliceStation(userId));
    }
  },[]);

  

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

  
  // check subscription status
  const checkSubscriptionStatus = () => {
    let date = new Date();
    let currentFormattedDate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()} `;
    let  currentDate = new Date(currentFormattedDate);
    let endDate = new Date(subScriptionEndTime);
    if(currentDate > endDate){
      console.log(currentDate , subScriptionEndTime);
       dispatch(updateSubscriptionDetails(userId));
    }
    
  }



  // Start Background Service
  const backgroundService = async() => {
    await BackgroundService.start(veryIntensiveTask, options  );
    await BackgroundService.updateNotification({taskDesc: 'New ExampleTask description'});

    const title = 'Emergency';
    const body = 'Live Location sent by '; 
    
    console.log("hello");
    

    let selectedUserId = [];
    let tokenMapping = [];
    for(const contact of selectedContacts){ 
        if(contact.notificationToken){
           selectedUserId.push(contact.notificationToken);
        }
    }


    for(let i=0; i < selectedUserId.length; i++){
      const userId = selectedUserId[i];
      const response = await axios.post('http://10.0.2.2:3000/fetchUserDetails' , {
          userId,},{
          headers:{
            'Content-Type':'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

      const data  = await response.data;
      tokenMapping.push({notificationToken:data.notificationToken , userId:userId});
    }
    
  

    console.log(tokenMapping);
    


    for(let i=0; i < tokenMapping.length; i++){
      let  notifyToken = tokenMapping[i].notificationToken;
      console.log("selected user" , notifyToken);
       
      const response = await axios.post('http://10.0.2.2:3000/sendNotificationEmergencyContact' , {
        notifyToken , userName , title , body},{
        headers:{
          'Content-Type':'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      

       
       console.log("successfully sent");
      
    }
    

     
     let policeStationId = nearestPoliceStation.nearestPoliceStation.id; 
     console.log(policeStationId);
      
      //send Live Location Notification
      const response = await axios.post('http://10.0.2.2:3000/sendComplaintNotification' , {
         policeStationId , userName , title , body},{
        headers:{
          'Content-Type':'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if(response.status === 200){
        console.log("sent");
      }
      else{
        console.log("fail");
        
      }
      
      
      

      let senderName = userName;
      for(let i=0; i < tokenMapping.length; i++){

         let userId = tokenMapping[i].userId;

         const response = await axios.post(
           'http://10.0.2.2:3000/saveLiveLocation',
           {
             userId,
             senderName
           },
           {
             headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`,
             },
           },
         );

      }

      console.log("successfully");
      

      
      

  }

  // stop background service
  const stop = async() => {
     await BackgroundService.stop();
  }

  

  const veryIntensiveTask = async (taskDataArguments: { delay: any; } ) => {
    const { delay } = taskDataArguments;
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
    let selectedUser = [];
    for(const contact of selectedContacts){ 
        if(contact.notificationToken){
           selectedUser.push(contact.notificationToken);
        }
    }

    await getCurrentLocation();
    
    let policeStationId = nearestPoliceStation.nearestPoliceStation.id;


   
    
    await axios.post('http://10.0.2.2:3000/shareLocationNearestPoliceStation' , {
        userId, policeStationId , location},{
        headers:{
          'Content-Type':'application/json',
          Authorization: `Bearer ${token}`,
        },
    });



    for(let i=0; i < selectedUser.length; i++){
      const selectedUserId = selectedUser[i];
      const response = await axios.post('http://10.0.2.2:3000/addLiveLocation' , {
        userId, selectedUserId , location},{
        headers:{
          'Content-Type':'application/json',
          Authorization: `Bearer ${token}`,
        },
      });


    }



  }

  const getCurrentLocation = async() => {
    Geolocation.watchPosition(
      position => {
        const newLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude };
        console.log(newLocation); 
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
    console.log("hello");
        
    let selectedUserId = [];
    let tokenMapping = [];
    for(const contact of selectedContacts){ 
        if(contact.notificationToken){
           selectedUserId.push(contact.notificationToken);
        }
    }


    for(let i=0; i < selectedUserId.length; i++){
      const userId = selectedUserId[i];
      const response = await axios.post('http://10.0.2.2:3000/fetchUserDetails' , {
          userId,},{
          headers:{
            'Content-Type':'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

      const data  = await response.data;
      tokenMapping.push({notificationToken:data.notificationToken , userId:userId});
    }
    


    for(let i=0; i < tokenMapping.length; i++){
      let  notifyToken = tokenMapping[i].notificationToken;
      console.log(notifyToken);
      
      const response = await axios.post('http://10.0.2.2:3000/sendNotificationEmergencyContact' , {
        notifyToken , userName},{
        headers:{
          'Content-Type':'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if(response.status === 200){
      
    
         let userId = tokenMapping[i].userId;
         let senderName = userName; 
         const response = await axios.post('http://10.0.2.2:3000/saveEmergencyContactNotification' , {
          userId , senderName},{
          headers:{
            'Content-Type':'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if(response.status === 200){
          console.log("notifcation saved successfully");
          
        }

          console.log("notification send successfully");
      
      }   
         
    }
        
           
  }

   


  // Send SMS
  const sendSMS = () => {
    SendDirectSms("+918733049183", `https://www.google.com/maps/search/?api=1&query=${21.1702},${72.8311}`)
    .then((res) => console.log("then", res))
    .catch((err) => console.log("catch", err))
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
      <HomeCustomHeader name="Secure Signal" icon="bell" call={handleNotification} isRead={notificationReadStatus}/>

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


            <TouchableOpacity style={style.contactView} onPress={() => handleContactList()}>
              <Text style={style.contactText}>+</Text>
            </TouchableOpacity>

            {
               selectedContacts  &&
               selectedContacts.map((item , key) => {
                return(
                  <TouchableOpacity key={key} style={style.contactSelectedView}>
                  <Text style={style.contactText}>{item.givenName[0]}</Text>
                </TouchableOpacity>
    
               )})
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
                latitude:37.78825,
                longitude:-122.4324,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}>
              <Marker coordinate={{latitude: 37.78825, 
                                   longitude:-122.4324}} >
                  <Icon name='local-police' size={40} color={'#5F4C24'}/>
              </Marker>
            </MapView>
            </View>
          </View>
        </View>

        {/* Near Hospital */}
        <View style={style.nearEmergencyStationView}>
          <Text style={style.nearEmergencyStationViewText}>
            Near Hospital
          </Text>
          <View style={style.nearEmergencyStationMapView}>
           <View style={style.mapContainer}>
            <MapView
              onPress={() => handleLocationMap(2) }
              style={style.nearStationMap}
              provider={PROVIDER_GOOGLE}
              scrollEnabled={false}
              zoomEnabled={false}
              region={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}>
              <Marker coordinate={{latitude: 37.78825, longitude: -122.4324}} >
                    <Icon name='local-hospital' size={40} color={'red'}/>
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
