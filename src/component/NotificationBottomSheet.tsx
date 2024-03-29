import * as React from 'react';
import {Text, View, StyleSheet, Pressable, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NotificationFilter from './NotificationFilter';
import { useEffect } from 'react';

interface NotificationBottomSheetProps {
  setBottomSheetVisible: any;
}

const NotificationBottomSheet: React.FC<NotificationBottomSheetProps> = ({  setBottomSheetVisible,}) =>{

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
      <Pressable style={{ width: '100%', height: '20%'}}>
        <Animated.View style={[styles.bottomSheet , {transform: [{ translateY: slide}]}]}>
        <View style={styles.notificationBottomSheet}>
          <NotificationFilter
            icon={'done-all'}
            color={'black'}
            message={'Mark all as read'}
            iconBackgroundColor={'lightgray'}
            textColor={''}
          />

          <NotificationFilter
            icon={'delete'}
            color={'red'}
            message={'Delete all notification'}
            iconBackgroundColor={'#FFD6D7'}
            textColor={'red'}
          />
        </View>
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
