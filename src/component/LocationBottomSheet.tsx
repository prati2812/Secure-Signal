import * as React from 'react';
import { useEffect } from 'react';
import { Text, View, StyleSheet, Animated, Pressable } from 'react-native';
import NotificationFilter from './NotificationFilter';

interface LocationBottomSheetProps {
    setBottomSheetVisible: any;
}

const LocationBottomSheet:React.FC<LocationBottomSheetProps> = ({setBottomSheetVisible}) => {
    const slide = React.useRef(new Animated.Value(300)).current;


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
  
      useEffect(() => {
        slideUp()
      })


    const closeModal = () => {
        slideDown();
        setTimeout(() => {
         setBottomSheetVisible(false);
        },800);
     }

    return (
    <Pressable style={styles.container} onPress={closeModal}>
      <Pressable style={{ width: '100%', height: '13%'}}>
        <Animated.View style={[styles.bottomSheet , {transform: [{ translateY: slide}]}]}>
        <View style={styles.notificationBottomSheet}>

          <NotificationFilter
            icon={'delete'}
            color={'red'}
            message={'Delete all'}
            iconBackgroundColor={'#FFD6D7'}
            textColor={'red'}
          />
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

