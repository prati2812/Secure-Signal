import * as React from 'react';
import { Text, View, StyleSheet, StatusBar, ScrollView } from 'react-native';
import CustomHeader from '../../component/CustomHeader';
import NotificationCard from '../../component/NotificationCard';
import { Dispatch, useEffect, useState } from 'react';
import NotificationBottomSheet from '../../component/NotificationBottomSheet';
import LocationBottomSheet from '../../component/LocationBottomSheet';
import { firebase } from '@react-native-firebase/auth';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLocation } from '../../redux/location/action';
import store from '../../redux/store';
import PushNotification from '../../assets/icons/PushNotification';
import { FAB } from 'react-native-paper';


interface LocationHistoryProps {
  navigation:any;
}

const LocationHistory:React.FC<LocationHistoryProps> = ({navigation}) => {
    const [isBottomSheetVisible , setBottomSheetVisible] = useState(false);
    const [isVisble , setVisible] = useState(false);
    const userId = firebase.auth().currentUser?.uid;
    const token = useSelector((state : any) => state.userProfile.token);
    const locationData = useSelector((state: any) => state.location.locations);
    const dispatch = useDispatch();

    useEffect(() => {
      // fetchTravellingLocation();
      dispatchStore(fetchLocation(userId));
    },[]); 



    // format the date
    const dateConvert = (timeStamp : string) => {
      const date = new Date(timeStamp);

      const year = date.getFullYear();
      const month = date.getMonth() + 1; 
      const day = date.getDate();

      // Format the date and time
      const formattedDate = `${ day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;

      return formattedDate;
    }



   

  return (
    <>
    <View style={styles.container}>
         <StatusBar backgroundColor={'#3ebb6e'}/>
          {
             locationData.length > 0 ? (
              <ScrollView
              contentContainerStyle={{paddingTop:15}}
              showsVerticalScrollIndicator={false}>
 
          {
              locationData.length > 0 &&   locationData.map((item: { createdAt: string; placeName: string; } , key: React.Key | null | undefined) => {
                 let date = dateConvert(item.createdAt);
                 return (
                   <NotificationCard 
                     key={key}
                     icon={'pin-drop'}
                     message={item.placeName}
                     time={date}
                     color={'green'} 
                     isRead={true} 
                     handleIsRead={() => {}}/>     
                 )
              })
            
          }

            
 
           </ScrollView>
             ) : (
                 <View style={{flex:1 , top:'20%'}}>
                       <PushNotification />
                 </View>
             )
          }

            <FAB
              style={styles.fab}
              icon="filter-outline"
              color='white'
              onPress={() => setBottomSheetVisible(true)} />  
          
    </View>
    
    {
         isBottomSheetVisible && <LocationBottomSheet setBottomSheetVisible={setBottomSheetVisible} />
    }
    </>
  );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'white'
    },
    fab: {
      position: 'absolute',
      margin: 20,
      right: 0,
      bottom: 25,
      backgroundColor:'#3ebb6e',
      borderRadius:30,
    },
});
  

export default LocationHistory;
export const dispatchStore = store.dispatch as typeof store.dispatch | Dispatch<any>
