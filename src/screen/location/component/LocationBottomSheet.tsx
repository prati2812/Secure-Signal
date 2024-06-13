import * as React from 'react';
import { Dispatch, useEffect } from 'react';
import { View, StyleSheet, Animated, Pressable, TouchableOpacity } from 'react-native';
import NotificationFilter from '../../../component/NotificationFilter';
import instance from '../../../axios/axiosInstance';
import { firebase } from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import store from '../../../redux/store';
import { fetchLocation } from '../../../redux/location/action';

interface LocationBottomSheetProps {
    setBottomSheetVisible: any;
}

const LocationBottomSheet:React.FC<LocationBottomSheetProps> = ({setBottomSheetVisible}) => {
    const slide = React.useRef(new Animated.Value(300)).current;
    const userId = firebase.auth().currentUser?.uid;

    useEffect(() => {
      slideUp()
    })


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

    const handleDeleteAllLocation = async() => {
        const response = await instance.post("/deleteAllTravellingLocation" , {userId});
        if(response.status === 200){
          dispatchStore(fetchLocation(userId));
          closeModal();
       }  
    }

    return (
    <Pressable style={styles.container} onPress={closeModal}>
      <Pressable style={{ width: '100%', height: '15%'}}>
        <Animated.View style={[styles.bottomSheet , {transform: [{ translateY: slide}]}]}>
        <View style={styles.notificationBottomSheet}>

        <TouchableOpacity onPress={() => handleDeleteAllLocation()}>  
          <NotificationFilter
            icon={'delete'}
            color={'red'}
            message={'Delete all'}
            iconBackgroundColor={'#FFD6D7'}
            textColor={'red'}
          />
        </TouchableOpacity>  
        </View>
        </Animated.View>
      </Pressable>  
    </Pressable>
  );
};

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
  
export default LocationBottomSheet;
export const dispatchStore = store.dispatch as typeof store.dispatch | Dispatch<any>

