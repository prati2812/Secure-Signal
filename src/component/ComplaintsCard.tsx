import * as React from 'react';
import { useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import { useSelector } from 'react-redux';

interface ComplaintsCardProps {
   icon:string;
   message:string;
   time:string;
   color:string;
   isRead?:boolean;
   handleDetails : Function;
   statusIcon?:string;
   statusIconColor?:string;
   borderColor?:string;
}

const ComplaintsCard:React.FC<ComplaintsCardProps> = ({icon,message , time , color, isRead , handleDetails , statusIcon , statusIconColor , borderColor}) => {

 
  
  return (
    <TouchableOpacity onPress={() => handleDetails()}>
    <View style={[styles.notificationView , borderColor !== undefined && {borderColor:borderColor}]}>
                 <View style={styles.notificationIcon}>
                        <Icon name={icon} size={40} color={color} />
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
                       statusIcon && <FontIcon name={statusIcon} size={30}  color={statusIconColor}/>
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
    borderColor: '#3ebb6e',
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


export default ComplaintsCard;


