import React,{useState} from 'react';
import { Text, View, StyleSheet , StatusBar, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomHeader from '../../component/CustomHeader';
import NotificationCard from '../../component/HistoryCard';
import NotificationBottomSheet from '../../component/NotificationBottomSheet';

interface NotificationHistoryProps {}

const NotificationHistory = (props: NotificationHistoryProps) => {
  const [isBottomSheetVisible , setBottomSheetVisible] = useState(false);

  const handleSetting = () => {
      setBottomSheetVisible(true);
  }
  
  return (
    <>
    <View style={styles.container}>
          <StatusBar backgroundColor={'#3ebb6e'}/>

          <CustomHeader name={'Notification'} icon={'cog-outline'} call={handleSetting}/>
         
          <ScrollView
             contentContainerStyle={{paddingTop:15}}
             showsVerticalScrollIndicator={false}>

             <NotificationCard 
                  icon={'campaign'} 
                  message={'New notification'} 
                  time={'1 hours ago'} 
                  color={'#FB6D48'}/>

             <NotificationCard 
                  icon={'notification-important'} 
                  message={'you are added '} 
                  time={'1 hours ago'} 
                  color={'green'}/>     


          </ScrollView>
          


    </View>


    {
         isBottomSheetVisible && <NotificationBottomSheet setBottomSheetVisible={setBottomSheetVisible} />
    } 
    

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


