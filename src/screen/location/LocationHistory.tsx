import * as React from 'react';
import { Text, View, StyleSheet, StatusBar, ScrollView } from 'react-native';
import CustomHeader from '../../component/CustomHeader';
import NotificationCard from '../../component/NotificationCard';
import { useEffect, useState } from 'react';
import NotificationBottomSheet from '../../component/NotificationBottomSheet';
import LocationBottomSheet from '../../component/LocationBottomSheet';
import { firebase } from '@react-native-firebase/auth';
import axios from 'axios';
import { useSelector } from 'react-redux';


interface LocationHistoryProps {}

const LocationHistory = (props: LocationHistoryProps) => {
    const [isBottomSheetVisible , setBottomSheetVisible] = useState(false);
    const [isVisble , setVisible] = useState(false);
    const [locationData , setLocationData] = useState([]);
    const userId = firebase.auth().currentUser?.uid;
    const token = useSelector((state : any) => state.userProfile.token);

    const dateConvert = (timeStamp : string) => {
      const date = new Date(timeStamp);

      const year = date.getFullYear();
      const month = date.getMonth() + 1; 
      const day = date.getDate();

      // Format the date and time
      const formattedDate = `${ day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;

      return formattedDate;
    }

    const fetchTravellingLocation = async() => {
      const response = await axios.post('http://10.0.2.2:3000/fetchTravellingLocations', {
        userId,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
      });

      if(response.status === 200){
         setLocationData(response.data);
      }
      else{
        console.log("something occured");
         
      }
    }

    useEffect(() => {
       fetchTravellingLocation();
    },[]);


    const handleSetting = () => {
        setBottomSheetVisible(true);
    }  
  return (
    <>
    <View style={styles.container}>
         <StatusBar backgroundColor={'#3ebb6e'}/>

         <CustomHeader name={'Locations'} icon={'cog-outline'} call={handleSetting}/>

         <ScrollView
             contentContainerStyle={{paddingTop:15}}
             showsVerticalScrollIndicator={false}>

         {
             locationData.length > 0 &&   locationData.map((item , key) => {
                let date = dateConvert(item.createdAt);
                return (
                  <NotificationCard 
                  icon={'pin-drop'} 
                  message={item.placeName} 
                  time={date} 
                  color={'green'}/>     
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

