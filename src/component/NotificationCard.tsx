import * as React from 'react';
import { useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface NotificationCardProps {
   icon:string;
   message:string;
   time:string;
   color:string;
   isRead:boolean;
   handleIsRead : Function
}

const NotificationCard:React.FC<NotificationCardProps> = ({icon,message , time , color, isRead , handleIsRead}) => {

  
  return (
    <TouchableOpacity onPress={() => handleIsRead()}>
    <View style={styles.notificationView}>
                 <View style={styles.notificationIcon}>
                        <Icon name={icon} size={45} color={color} />
                 </View>
                 <View style={styles.notificationData}>
                       <Text style={styles.notificationMessage}>
                              {message}
                       </Text>
                       <Text style={styles.notificationTime}>
                              {time}
                       </Text>
                 </View>

                 {
                    isRead === false && <View style={{borderWidth:7, borderColor:'green' , borderRadius:10,}}></View>
                 }
                
    </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  notificationView: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginLeft: 15,
    marginRight: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    gap: 10,
    marginBottom: 15,
    alignItems: 'center',
    borderColor: 'green',
    borderWidth: 1,
  },
  notificationIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 5,
    borderRadius: 10,
  },
  notificationData: {
    padding: 5,
    flexShrink:1,
    gap:5,
    flex:1,
  },
  notificationMessage: {
    fontSize: 18,
    color: 'black',
    fontWeight: '500',
  },
  notificationTime: {
    fontWeight: '600',
    fontSize:13,
  },
});


export default NotificationCard;


