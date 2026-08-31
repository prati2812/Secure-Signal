import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';

interface CustomHeaderProps{
    name:string,
    icon?:string,
    call?:any,
    backIcon?:string,
    backCall?:any,    
}

const CustomHeader:React.FC<CustomHeaderProps> = ({name , icon , call , backIcon , backCall}) => (
  <Appbar.Header style={styles.appHeader}>
    {backIcon && <Appbar.Action icon={backIcon} onPress={backCall} color='white' size={35}/>}
    <Appbar.Content title={name} color='white' titleStyle={styles.apptitle} />
    {icon && <Appbar.Action icon={icon} onPress={call} color='white' />}
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
})




export default CustomHeader;
