import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';

interface HomeCustomHeaderProps{
    name:string,
    icon?:string,
    call?:any,
    isRead:boolean,
}

const HomeCustomHeader:React.FC<HomeCustomHeaderProps> = ({name , icon , call , isRead}) => (
    
  <Appbar.Header style={styles.appHeader}>
    <Appbar.Content title={name} color='white' titleStyle={styles.apptitle} />
    {icon && 
       <>
       <Appbar.Action icon={icon} onPress={call} color='white' size={30}/>
       { isRead === false &&  <View style={styles.bellIcon}></View>}
       </>  
    }
  </Appbar.Header>
);

const styles = StyleSheet.create({
    appHeader:{
        backgroundColor:'#3ebb6e'
    },
    apptitle:{
        paddingLeft: 10,
        fontWeight:'700',
    },
    bellIcon:{ 
        borderWidth: 6, 
        borderColor: '#fd5c63', 
        borderRadius: 10, 
        right:'45%', 
        bottom:8
    },
})




export default HomeCustomHeader;