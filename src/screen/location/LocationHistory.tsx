import * as React from 'react';
import { Text, View, StyleSheet, StatusBar, ScrollView } from 'react-native';
import CustomHeader from '../../component/CustomHeader';
import NotificationCard from '../../component/HistoryCard';
import { useState } from 'react';
import NotificationBottomSheet from '../../component/NotificationBottomSheet';
import LocationBottomSheet from '../../component/LocationBottomSheet';

interface LocationHistoryProps {}

const LocationHistory = (props: LocationHistoryProps) => {
    const [isBottomSheetVisible , setBottomSheetVisible] = useState(false);

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

             <NotificationCard 
                  icon={'pin-drop'} 
                  message={'Surat'} 
                  time={'1 hours ago'} 
                  color={'green'}/>     


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

