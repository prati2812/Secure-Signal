import React,{useEffect, useState} from 'react';
import { Text, View, StyleSheet , StatusBar, Pressable, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomHeader from '../../component/CustomHeader';
import NotificationCard from '../../component/NotificationCard';
import NotificationBottomSheet from '../../component/NotificationBottomSheet';
import { fetchEmergencyContactNotification } from '../../redux/notifications/action';
import { useDispatch, useSelector } from 'react-redux';
import { firebase } from '@react-native-firebase/auth';
import axios from 'axios';
import NotifyIcon from '../../assets/icons/NotifyIcon';
import PushNotification from '../../assets/icons/PushNotification';



interface NotificationHistoryProps {}

const NotificationHistory = (props: NotificationHistoryProps) => {
  const [isBottomSheetVisible , setBottomSheetVisible] = useState(false);
  const [read , setRead] = useState(false);
  const userId = firebase.auth().currentUser?.uid; 
  const token = useSelector((state : any) => state.userProfile.token);
  const notificationReadStatus = useSelector((state: any) => state.notifications.notificationAllReadOrNot);
  const notificationDeleteStatus = useSelector((state : any) => state.notifications.deleteAllNotificationOrNot);
  const emergencyContactNotification = useSelector((state : any) => state.notifications.fetchSelectedContactNotification);

  const dispatch = useDispatch();



  useEffect(() => {
    dispatch(fetchEmergencyContactNotification(userId,token)); 
  },[read]); 



  const handleSetting = () => {
      setBottomSheetVisible(true);
  }

  const handleNotificationRead = async(notification_id : String) => {
    let notificationId = notification_id;
    const response = await axios.post('http://10.0.2.2:3000/markAsRead', {
      userId, notificationId
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if(response.status === 200){
       console.log("successfully Read");
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
        />

        {emergencyContactNotification.length > 0  &&
        emergencyContactNotification  && notificationDeleteStatus === false? (
          <ScrollView
            contentContainerStyle={{paddingTop: 15}}
            showsVerticalScrollIndicator={false}>
            {emergencyContactNotification &&
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


