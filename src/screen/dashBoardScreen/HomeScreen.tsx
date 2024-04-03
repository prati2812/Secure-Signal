import React, { useEffect, useState } from 'react';
import {Text, View, StyleSheet, StatusBar, ScrollView, Dimensions, TouchableOpacity, Platform, PermissionsAndroid , NativeModules, NativeEventEmitter, DeviceEventEmitter, ToastAndroid} from 'react-native';
import CustomHeader from '../../component/CustomHeader';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect, useSelector } from 'react-redux';
import BackgroundService from 'react-native-background-actions';
import { SendDirectSms } from 'react-native-send-direct-sms';








const sleep = (time: number | undefined) => new Promise<void>((resolve) => setTimeout(() => resolve(), time));


const veryIntensiveTask = async (taskDataArguments: { delay: any; }) => {
  const { delay } = taskDataArguments;
  await new Promise( async (resolve) => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
          console.log(i);
          const eventEmitter = new NativeEventEmitter(NativeModules.MainActivity);
    
    const subscription = eventEmitter.addListener('onKeyMessage', event => {
      const keyMessage = event.keyMessage;
      console.log(keyMessage);
    });
    return () => subscription.remove();
        
          await sleep(delay);
      }
  });
};


const options = {
  taskName: 'Location',
  taskTitle: 'Location Sharing',
  taskDesc: 'ExampleTask description',
  taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
  },
  color: '#ff00ff',
  parameters: {
      delay: 5000,
  },
};


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
  const userName  = useSelector((state : RootState) => state.userProfile.userName);
  const selectedContacts = useSelector((state : RootState) => state.selectedContacts);

  useEffect(() =>{
     requestLocationPermission(); 
     requestSMSPermission();
     backgroundService();
  },[]);



  const backgroundService = async() => {
    await BackgroundService.start(veryIntensiveTask, options);
    await BackgroundService.updateNotification({taskDesc: 'New ExampleTask description'});
  }

  const sendSMS = () => {
    SendDirectSms("+918733049183", `https://www.google.com/maps/search/?api=1&query=${21.1702},${72.8311}`)
    .then((res) => console.log("then", res))
    .catch((err) => console.log("catch", err))
  }

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
               selectedContacts.map((item) => {
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
