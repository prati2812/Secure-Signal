import * as React from 'react';
import {Text, View, StyleSheet, Pressable, Animated, StatusBar, TouchableOpacity, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NotificationFilter from './NotificationFilter';
import { useEffect } from 'react';
import axios from 'axios';
import { firebase } from '@react-native-firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { addNotificationTypes, deleteAllNotificationOrNot } from '../redux/notifications/action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import instance from '../axios/axiosInstance';
import { SelectList } from 'react-native-dropdown-select-list';


interface NotificationBottomSheetProps {
  setBottomSheetVisible: any;
}

const NotificationBottomSheet: React.FC<NotificationBottomSheetProps> = ({  setBottomSheetVisible,}) =>{

    const slide = React.useRef(new Animated.Value(300)).current;
    const userId = firebase.auth().currentUser?.uid; 
    const token = useSelector((state : any) => state.userProfile.token);
    const dispatch = useDispatch();
    const [selected, setSelected] = React.useState("");
    const notificationTypes = useSelector((state : any) => state.notifications.notificationTypes);
  
    const data = [
      {key: '1', value: 'All'},
      {key: '2', value: 'Emergency Contact'},
      {key: '3', value: 'Live Location'},
      {key: '4', value: 'Safe Arrival'},
    ];

    useEffect(() => {
      slideUp()
    } , [])

    
    
    
    
    

    const slideUp = () => {
        Animated.timing(slide, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start();
    };
    
    const slideDown = () => {
       
        Animated.timing(slide, {
          toValue: 300,
          duration: 800,
          useNativeDriver: true,
        }).start();
    };
  
    
    const closeModal = () => {
        slideDown();
        setTimeout(() => {
         setBottomSheetVisible(false);
        },800);
    }


    // Read All Notification
    const handleAllMarkAsNotification = async() => {
      const response = await instance.post('/markAllAsRead' , {userId});

      if(response.status === 200){
        console.log("successfully Read All Notification");
        dispatch({
           type:'ALL_NOTIFICATION_READ',
           payload:true,

        })
        closeModal();
        
     }



    } 

    // Delete All Notification
    const handleDeleteAllNotificaion = async() => {
      const response = await instance.post('/deleteAllNotification', {userId});
  
      if(response.status === 200){
         console.log("successfully Delete All Notification");
         dispatch(deleteAllNotificationOrNot(true));
         closeModal();
         
      }
    }


    const handleFilterNotification = async() => {
       dispatch(addNotificationTypes(selected));
    }
   

    return (
      <Pressable style={styles.container} onPress={closeModal}>
        <Pressable style={{width: '100%', height: '25%'}}>
          <Animated.View
            style={[styles.bottomSheet, {transform: [{translateY: slide}]}]}>
             <ScrollView>
                 
            <View style={styles.notificationBottomSheet}>

            
              <View style={{flexDirection: 'row' , gap:5 , alignItems:'center'}}>
                <NotificationFilter
                  icon={'filter-list'}
                  color={'black'}
                  message={''}
                  iconBackgroundColor={'lightblue'}
                  textColor={'black'}
                />
                <SelectList
                  setSelected={(val: string) => setSelected(val)}
                  data={data}
                  save="value"
                  boxStyles={{borderWidth: 3, borderColor: 'lightblue' , width:'90%'}}
                  dropdownStyles={{borderWidth: 3, borderColor: 'lightblue'}}
                  inputStyles={{
                    color: 'black',
                    fontSize: 17,
                    fontWeight: '600',
                  }}
                  dropdownTextStyles={{
                    color: 'black',
                    fontSize: 17,
                    fontWeight: '600',
                  }}
                  maxHeight={100}
                  defaultOption={notificationTypes}
                  onSelect={handleFilterNotification}
                />
              </View>

              <TouchableOpacity onPress={() => handleAllMarkAsNotification()}>
                <NotificationFilter
                  icon={'done-all'}
                  color={'black'}
                  message={'Mark all as read'}
                  iconBackgroundColor={'lightgray'}
                  textColor={'black'}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDeleteAllNotificaion()}>
                <NotificationFilter
                  icon={'delete'}
                  color={'red'}
                  message={'Delete all notification'}
                  iconBackgroundColor={'#FFD6D7'}
                  textColor={'red'}
                />
              </TouchableOpacity>
            </View>
            </ScrollView>
          </Animated.View>
        </Pressable>
      </Pressable>
    );
};

export default NotificationBottomSheet;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    backgroundColor: '#00000080',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  notificationBottomSheet: {
    margin: 25,
  },
});
