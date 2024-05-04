import * as React from 'react';
import { Text, View, StyleSheet, StatusBar, ScrollView } from 'react-native';
import CustomHeader from '../../component/CustomHeader';
import NotificationCard from '../../component/NotificationCard';
import { useEffect, useState } from 'react';
import NotificationBottomSheet from '../../component/NotificationBottomSheet';
import LocationBottomSheet from '../../component/LocationBottomSheet';
import { firebase } from '@react-native-firebase/auth';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLocation } from '../../redux/location/action';


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
      dispatch(fetchLocation(userId,token));
    },[]); 




    const dateConvert = (timeStamp : string) => {
      const date = new Date(timeStamp);

      const year = date.getFullYear();
      const month = date.getMonth() + 1; 
      const day = date.getDate();

      // Format the date and time
      const formattedDate = `${ day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;

      return formattedDate;
    }



    const handleSetting = () => {
        setBottomSheetVisible(true);
    }  


  return (
    <>
    <View style={styles.container}>
         <StatusBar backgroundColor={'#3ebb6e'}/>

         <CustomHeader 
             name={'Locations'} 
             icon={'cog-outline'} 
             call={handleSetting}
             backIcon={'keyboard-backspace'}
             backCall={() => navigation.goBack()}/>

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
    }
});
  

export default LocationHistory;

