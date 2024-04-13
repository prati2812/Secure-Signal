import React, { useEffect, useState } from 'react';
import {Text, View, StyleSheet, StatusBar, ScrollView, Dimensions, TouchableOpacity, Platform, PermissionsAndroid , NativeModules, NativeEventEmitter , AppState} from 'react-native';
import CustomHeader from '../../component/CustomHeader';
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
import { addSelectedContact } from '../../redux/contacts/action';
import axios from 'axios';
import { requestUserPermission } from '../../utils/NotificationService';


const sleep = (time: number | undefined) => new Promise<void>((resolve) => setTimeout(() => resolve(), time));
const width =  Dimensions.get('window').width;




const veryIntensiveTask = async (taskDataArguments: { delay: any; }) => {
  const { delay } = taskDataArguments;
  await new Promise( async (resolve) => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
      
    
        VolumeManager.showNativeVolumeUI({ enabled: true });    
        const { volume } = await VolumeManager.getVolume();
        //console.log("Current", volume);
        // tempValue = volume;
        // flag = true;
       
      
        
        // Listen to volume changes
        // const volumeListener = VolumeManager.addVolumeListener((result) => {
        //   console.log("change volume" , result.volume);
        // });
        
        
        
          await sleep(delay);
      }
  });
};

const volumeLevel = async() => {
  VolumeManager.showNativeVolumeUI({ enabled: true });

  await VolumeManager.setVolume(0.5);
  
  const { volume } = await VolumeManager.getVolume();

 
  const volumeListener = VolumeManager.addVolumeListener((result) => {
    console.log("change volume" , result.volume);
  });

  console.log("volume Listener" , volumeListener);
  
  
}


// Create Notification
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
  const userName  = useSelector((state : RootState) => state.userProfile.userName);
  const selectedContacts = useSelector((state : RootState) => state.selectedContacts);
  const imageResponse = useSelector((state) => state.userProfile.imageResponse);
  const [appState,setAppState] = useState(AppState.currentState);
  const userId = firebase.auth().currentUser?.uid; 
  const dispatch = useDispatch();
  const [volume , setVolume] = useState(-1);  
  const [token , setToken] = useState(null);
  
  const getToken = async() => {
    const value = await AsyncStorage.getItem('token');
    setToken(value);
    dispatch(addToken(value));
  }
  

  // Fetch Selected Contact From Database
  const fetchContacts  = async() => {
      
      const response = await axios.post('http://10.0.2.2:3000/fetchContacts', {
        userId,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

       if(response.status === 200){

        const responseData = await response.data;
        const {contacts} = responseData;
        
        for(let i=0; i < contacts[0].length; i++){
             dispatch(addSelectedContact(contacts[0][i]));
        }

       }
       else{
          console.log("something occured");
           
       }
      
       

  }

  // Fetch User Details From Database
  const fetchUserDetails = async() =>{
      const response = await axios.post('http://10.0.2.2:3000/fetchUserDetails' , {
      userId,},{
        headers:{
          'Content-Type':'application/json',
          Authorization: `Bearer ${token}`,
        },
      });


      if(response.status === 200){
        const responseData = await response.data;
        const{phoneNumber , userName} = responseData;
        dispatch(changeUserName(userName));
        dispatch(addUserPhoneNumber(phoneNumber));
      }
      else{
        console.log("Something occured");
        
      }
      
      

      
      
  }

  // Fetch User Image From Database
  const fetchUserProfile = async() => {
    const response = await RNFetchBlob.fetch(
                'POST' , 
                'http://10.0.2.2:3000/fetchUserProfile',
                {
                  'Content-Type' : 'application/json' , 
                  'Authorization': `Bearer ${token}`,
                },
                JSON.stringify({userId})
              );

    
    if(response.data){
      const imageData = response.data;
      const image = `data:image/jpeg;base64,${imageData.toString('base64')}`;
      dispatch(addImageUri(image));  
      
    }
    else{
      console.log("Something occured");
      
    }

  }

 

  useEffect(() => {

    getToken();
    fetchContacts();  
    fetchUserDetails();
    fetchUserProfile();
  
  },[token]);
  
  useEffect(() => {
    volumeLevel();     
  },[volume]);


  useEffect(() =>{
     requestLocationPermission(); 
     requestSMSPermission();
     //backgroundService();  
  },[]);


  const volumeLevel = async() => {
    VolumeManager.showNativeVolumeUI({ enabled: true });

    await VolumeManager.setVolume(0.5);
    
    const { volume } = await VolumeManager.getVolume();
  
   
    const volumeListener = VolumeManager.addVolumeListener((result) => {
      console.log("change volume" , result.volume);
      setVolume(result.volume);

    });
  
       
  }


  // Start Background Service
  const backgroundService = async() => {
    await BackgroundService.start(veryIntensiveTask, options);
    await BackgroundService.updateNotification({taskDesc: 'New ExampleTask description'});
  }

  // Send SMS
  const sendSMS = () => {
    SendDirectSms("+918733049183", `https://www.google.com/maps/search/?api=1&query=${21.1702},${72.8311}`)
    .then((res) => console.log("then", res))
    .catch((err) => console.log("catch", err))
  }

  // Request Location Permission
  const requestLocationPermission = async() => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      } else {
                   
      }
    }
  }

  // Request SMS Permission
  const requestSMSPermission = async() => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
        {
          title: 'SMS Permission',
          message: 'This app needs permission to send SMS.',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //sendSMS();
      } else {
        console.log('SMS permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }
  

  // Navigation to HelpScreen
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
      <CustomHeader name="Secure Signal" icon="bell" call={handleNotification}/>

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
               selectedContacts.length > 0 &&
               selectedContacts.map((item , key) => {
                return(
                  <TouchableOpacity style={style.contactSelectedView}>
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
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}>
              <Marker coordinate={{latitude: 37.78825, longitude: -122.4324}} >
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
