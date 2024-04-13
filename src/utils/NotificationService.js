import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid , Platform} from 'react-native';

export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      getFCMToken();
    }
  

}

const getFCMToken = async () => {
  try{
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    AsyncStorage.setItem("fcm_token" , token);
  }
  catch(error){
    console.log("error during generating token" , error);
  }
}