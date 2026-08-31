import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';

interface HomeCustomHeaderProps{
    name:string,
    icon?:string,
    call?:any,
    isRead:boolean,
    accountIcon?:string,
    accountClick?:any,
    contactIcon?:any,
    contactClick?:any,
}

const HomeCustomHeader:React.FC<HomeCustomHeaderProps> = ({name , icon , call , isRead , accountIcon , accountClick, contactIcon , contactClick}) => (
    
  <Appbar.Header style={styles.appHeader}>
    <Appbar.Content title={name} color='white' titleStyle={styles.apptitle} />
    {
        contactIcon &&
        <>
            <Appbar.Action icon={contactIcon}  onPress={contactClick} color='white' size={30}/>
        </>
    }
    {icon && 
       <>
       <Appbar.Action icon={icon} onPress={call} color='white' size={30}/>
       { isRead === false &&  <View style={styles.bellIcon}></View>}
       </>  
    }
    {
          accountIcon && <Appbar.Action icon={accountIcon} onPress={accountClick} color='white' size={30}/>  
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