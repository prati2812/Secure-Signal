import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';

interface CustomHeaderProps{
    name:string,
    icon:string,
}

const CustomHeader:React.FC<CustomHeaderProps> = ({name , icon}) => (
  <Appbar.Header style={styles.appHeader}>
    <Appbar.Content title={name} color='white' titleStyle={styles.apptitle} />
    <Appbar.Action icon={icon} onPress={() => {}}  color='white'/>
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
