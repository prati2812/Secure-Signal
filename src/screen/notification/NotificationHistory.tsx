import React,{Dispatch, useEffect, useState} from 'react';
import { Text, View, StyleSheet , StatusBar, Pressable, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomHeader from '../../component/CustomHeader';
import NotificationCard from '../../component/NotificationCard';
import NotificationBottomSheet from '../../component/NotificationBottomSheet';
import { allNotificationReadOrNot, fetchEmergencyContactNotification, fetchHospitalStatusNotification, fetchLiveLocationNotification, fetchPoliceStationStatusNotification, fetchSafeArrivalNotification } from '../../redux/notifications/action';
import { useDispatch, useSelector } from 'react-redux';
import { firebase } from '@react-native-firebase/auth';
import axios from 'axios';
import NotifyIcon from '../../assets/icons/NotifyIcon';
import PushNotification from '../../assets/icons/PushNotification';
import instance from '../../axios/axiosInstance';
import store from '../../redux/store';



interface NotificationHistoryProps {
  navigation:any;
}

const NotificationHistory: React.FC<NotificationHistoryProps> = ({navigation}) => {
  const [isBottomSheetVisible , setBottomSheetVisible] = useState(false);
  const [read , setRead] = useState(false);
  const userId = firebase.auth().currentUser?.uid; 
  const token = useSelector((state : any) => state.userProfile.token);
  const notificationReadStatus = useSelector((state: any) => state.notifications.notificationAllReadOrNot);
  const notificationDeleteStatus = useSelector((state : any) => state.notifications.deleteAllNotificationOrNot);
  const emergencyContactNotification = useSelector((state : any) => state.notifications.fetchSelectedContactNotification);
  const liveLocationNotification = useSelector((state:any) => state.notifications.fetchLiveLocationNotification);
  const safeArrivalNotification = useSelector((state:any) => state.notifications.fetchSafeArrivalNotification);
  const hospitalStatusNotification = useSelector((state:any) => state.notifications.fetchHospitalStatusNotification);
  const policeStationStatusNotification = useSelector((state:any) => state.notifications.fetchPoliceStationStatusNotification);
  const notificationTypes = useSelector((state : any) => state.notifications.notificationTypes);



  useEffect(() => {
    dispatchStore(fetchEmergencyContactNotification(userId)); 
    dispatchStore(fetchLiveLocationNotification(userId));
    dispatchStore(fetchSafeArrivalNotification(userId));
    dispatchStore(fetchHospitalStatusNotification(userId));
    dispatchStore(fetchPoliceStationStatusNotification(userId));
  },[read]); 

  useEffect(() => {
     if(notificationTypes){
      console.log("--------",notificationTypes);
     }
  },[notificationTypes])
  
  
  
  
  

  const handleSetting = () => {  
      setBottomSheetVisible(true);
  }

  // Read Emergency Notification 
  const handleNotificationRead = async(notification_id : String) => {
    let notificationId = notification_id;
    const response = await instance.post('/markAsRead', {userId, notificationId});

    if(response.status === 200){
       console.log("successfully Read");
       dispatchStore(allNotificationReadOrNot(userId));
       setRead(!read);
       
    }
 
  }

  // Read Live Location Notification
  const handleLiveLocationNotificationRead = async(notification_id : String , senderId : String) => {
    let notificationId = notification_id;
    const response = await instance.post('/liveLocationNotificationMarkAsRead' , {userId , notificationId});
    if(response.status === 200){
      console.log("Live Location Notification Successfully Read");
      dispatchStore(allNotificationReadOrNot(userId));
      setRead(!read);  
      navigation.navigate("LiveLocationRoute" , {senderId});
      
      
    }
  }

  // Read Safe Arrival Notification
  const handleSafeArrivalNotificationRead = async(notification_id : String) => {
    let notificationId = notification_id;
    const response = await instance.post('/safeArrivalNotificationMarksAsRead', {userId, notificationId});

    if(response.status === 200){
       console.log("successfully Read");
       dispatchStore(allNotificationReadOrNot(userId));
       setRead(!read);
       
    }
 
  }
  
  
  const handleHospitalStatusNotificationRead = async(notification_id : String) => {
    let notificationId = notification_id;
    const response = await instance.post('/hospitalComplaintStatusMarksAsRead' , {userId , notificationId});
    if(response.status === 200){
      console.log("Hospital Complaint Status Notification Successfully Read");
      dispatchStore(allNotificationReadOrNot(userId));
      setRead(!read);  
    }
  }

  const handlePoliceStationStatusNotificationRead = async(notification_id : String) => {
    let notificationId = notification_id;
    const response = await instance.post('/policeStationComplaintStatusMarkAsRead' , {userId , notificationId});
    if(response.status === 200){
      console.log("Police Station Complaint Status Notification Successfully Read");
      dispatchStore(allNotificationReadOrNot(userId));
      setRead(!read);  
    }
  }
  


  
  return (
    <>
      <View style={styles.container}>
        <StatusBar backgroundColor={'#3ebb6e'} />

        <CustomHeader
          name={'Notification'}
          icon={'cog-outline'}
          call={handleSetting}
          backIcon={'keyboard-backspace'}
          backCall={() => navigation.goBack()}
        />

        {(emergencyContactNotification.length > 0  || liveLocationNotification.length > 0 || safeArrivalNotification.length > 0 || hospitalStatusNotification.length > 0 || policeStationStatusNotification.length > 0)  && notificationDeleteStatus === false ? (
          <ScrollView
            contentContainerStyle={{paddingTop: 15}}
            showsVerticalScrollIndicator={false}>
            { (notificationTypes === "All" || notificationTypes === "Emergency Contact") && emergencyContactNotification.length > 0 &&
              emergencyContactNotification.map(
                (
                  item: {
                    notification_id: String;
                    isRead: boolean;
                    senderName: any;
                    timeStamp: string;
                  },
                  key: React.Key | null | undefined,
                ) => {
                  return (
                    <NotificationCard
                      key={key}
                      icon={'notification-important'}
                      message={`You've been added as an Emergency contact by a ${item.senderName}.`}
                      time={item.timeStamp}
                      color={'green'}
                      isRead={notificationReadStatus !== null && notificationReadStatus === true ? true : item.isRead}
                      handleIsRead={() =>
                        handleNotificationRead(item.notification_id)
                      }
                    />
                  );
                },
              )}
              {
                (notificationTypes === "All" || notificationTypes === "Live Location") && liveLocationNotification.length > 0 && 
                  liveLocationNotification.map(
                    (
                      item: {
                        notification_id: String;
                        isRead: boolean;
                        senderName: any;
                        timeStamp: string;
                        senderId:string;
                      },
                      key: React.Key | null | undefined,
                    ) => {
                         return (
                           <NotificationCard
                             key={key}
                             icon={'location-pin'}
                             message={`Live Location Shared by a ${item.senderName}.`}
                             time={item.timeStamp}
                             color={'#FF5733'}
                             isRead={notificationReadStatus !== null && notificationReadStatus === true ? true : item.isRead}
                             handleIsRead={() =>
                               handleLiveLocationNotificationRead(item.notification_id , item.senderId)
                             }
                           />
                         );
                    },) 
              }
              {
                (notificationTypes === "All" || notificationTypes === "Safe Arrival") && safeArrivalNotification.length > 0 && 
                  safeArrivalNotification.map(
                    (
                      item: {
                        notification_id: String;
                        isRead: boolean;
                        senderName: any;
                        timeStamp: string;
                        senderId:string;
                        placeName:string;
                      },
                      key: React.Key | null | undefined,
                    ) => {
                         return (
                           <NotificationCard
                             key={key}
                             icon={'celebration'}
                             message={`Great news! ${item.senderName} has safely arrived at ${item.placeName}.`}
                             time={item.timeStamp}
                             color={'#fc6c85'}
                             isRead={notificationReadStatus !== null && notificationReadStatus === true ? true : item.isRead}
                             handleIsRead={() => handleSafeArrivalNotificationRead(item.notification_id)}
                           />
                         );
                    },) 
              }
              {
                (notificationTypes === "All" || notificationTypes === "Hospital") && hospitalStatusNotification.length > 0 &&
                 hospitalStatusNotification.map(
                  (
                    item: {
                      notification_id: String;
                      isRead: boolean;
                      senderName: any;
                      timeStamp: string;
                      senderId:string;
                    },
                    key: React.Key | null | undefined,
                  ) => {
                    return (
                      <NotificationCard
                        key={key}
                        icon={'local-hospital'}
                        message={`Complaint status updated by a ${item.senderName}.`}
                        time={item.timeStamp}
                        color={'#008ECC'}
                        isRead={notificationReadStatus !== null && notificationReadStatus === true ? true : item.isRead}
                        handleIsRead={() =>
                          handleHospitalStatusNotificationRead(item.notification_id)
                        }
                      />
                    );
                   },) 
                 
              }
              {
                (notificationTypes === "All" || notificationTypes === "Police Station") && policeStationStatusNotification.length > 0 &&
                policeStationStatusNotification.map(
                  (
                    item: {
                      notification_id: String;
                      isRead: boolean;
                      senderName: any;
                      timeStamp: string;
                      senderId:string;
                    },
                    key: React.Key | null | undefined,
                  ) => {
                    return (
                      <NotificationCard
                        key={key}
                        icon={'local-police'}
                        message={`Complaint status updated by a ${item.senderName}.`}
                        time={item.timeStamp}
                        color={'#af952e'}
                        isRead={notificationReadStatus !== null && notificationReadStatus === true ? true : item.isRead}
                        handleIsRead={() =>
                          handlePoliceStationStatusNotificationRead(item.notification_id)
                        }
                      />
                    );
                   },) 
              }
          </ScrollView>
        ) : (
            <View style={{flex:1 , top:'20%'}}> 
                  <PushNotification />
            </View>
        )}
      </View>

      {isBottomSheetVisible && (
        <NotificationBottomSheet
          setBottomSheetVisible={setBottomSheetVisible}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'white'
    },
    
});

export default NotificationHistory;
export const dispatchStore = store.dispatch as typeof store.dispatch | Dispatch<any>


