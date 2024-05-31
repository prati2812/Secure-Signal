import * as React from 'react';
import { useEffect } from 'react';
import { Text, View, StyleSheet, Animated, Pressable, ScrollView } from 'react-native';
import ComplaintsCard from './ComplaintsCard';
import { useDispatch, useSelector } from 'react-redux';
import { addProtectorData } from '../redux/protector/action';


interface ProtectorBottomSheetProps {
    setProtectorSheetVisible:any;
    navigation?:any;
    mapNumber:number,
}

const ProtectorBottomSheet:React.FC<ProtectorBottomSheetProps> = ({setProtectorSheetVisible , navigation , mapNumber}) => {
  const slide = React.useRef(new Animated.Value(300)).current;  
  let nearestPoliceStation = useSelector((state:any) => state.location.nearestPoliceStation); 
  const nearestHospital = useSelector((state:any) => state.location.nearestHospital);
  const dispatch = useDispatch();

  

  const slideUp = () => {
    Animated.timing(slide, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };


  // BottomSheet Slide Down Animation
  const slideDown = () => {
   
    Animated.timing(slide, {
      toValue: 300,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    slideUp()
  })




 // Close BottomSheet
  const closeModal = () => {
    
     slideDown();
     setTimeout(() => {
      setProtectorSheetVisible(false);
     },800);
  }

  

  const handleComplaintNavigation = (station : object) => {
    dispatch(addProtectorData(station));
    navigation.navigate('HelpScreen' , { mapNumber: mapNumber});
    closeModal();
  }




  return (
  
      <Pressable style={styles.container} onPress={closeModal}>
        <Pressable style={{width: '100%', height: '45%'}}>
          <Animated.View
            style={[styles.bottomSheet, {transform: [{translateY: slide}]}]}>

            <ScrollView
             showsVerticalScrollIndicator={false}
             contentContainerStyle={{marginTop:20, paddingBottom:20}}>
             {
                mapNumber === 1 && nearestPoliceStation.nearestPoliceStation.sort((a: { distance: number; }, b: { distance: number; }) => a.distance - b.distance).map((station: {distance: any;policeStationProfile: {userName : string}; id: string;}) => (
                          
                    <ComplaintsCard
                    key={station.id} 
                    icon={'person'} 
                    message={station.policeStationProfile.userName} 
                    time={`${station.distance.toFixed(2)} km away`} 
                    color={'#af952e'} 
                    handleDetails={() => {handleComplaintNavigation(station)}} 
                    borderColor={'#af952e'} />                             
                  ))
             }
             {
                mapNumber === 2 &&  nearestHospital.nearestHospital.sort((a: { distance: number; }, b: { distance: number; }) => a.distance - b.distance).map((station: { id: string; hospitalProfile: { userName: string; }; distance: number; }) => (
                          
                    <ComplaintsCard
                    key={station.id} 
                    icon={'person'} 
                    message={station.hospitalProfile.userName} 
                    time={`${station.distance.toFixed(2)} km away`} 
                    color={'#008ECC'} 
                    handleDetails={() => {handleComplaintNavigation(station)}} 
                    borderColor={'#008ECC'} />                             
                  ))
             }
                  
                  



            </ScrollView>    
         
          </Animated.View>
        </Pressable>
      </Pressable>

    
    
  );
};

const styles = StyleSheet.create({
    container: {
        position:'absolute',
        flex:1,
        backgroundColor:'#00000080',
        width:'100%',
        height:'100%',
        top: 0,
        left: 0,
        justifyContent:'flex-end',
    },
    bottomSheet:{
        width:'100%',
        height:'100%',
        backgroundColor:'white',   
        borderTopRightRadius:25,
        borderTopLeftRadius:25,
    },
});
  

export default ProtectorBottomSheet;

