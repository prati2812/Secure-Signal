import * as React from 'react';
import { useEffect } from 'react';
import { Text, View, StyleSheet, Animated, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { addProtectorData } from '../redux/protector/action';

interface InfoCardProps {
    setInfoSheetVisible:any;
    station:any;
    navigation?:any;
    userName?:string,
    phoneNumber?:string,
    distance?:string,
    icon?:string,
    color?:string,
}

const InfoCard:React.FC<InfoCardProps> = ({setInfoSheetVisible , station , navigation, userName , phoneNumber , distance , icon , color}) => {
      const dispatch = useDispatch();
      if(!station){
         return null;
      }
     
      console.log("-----------",station);
      

       
     
     const handleComplaintNavigation = () => {
        dispatch(addProtectorData(station));
        if(station.policeStationLocation){
          navigation.navigate('HelpScreen' , {mapNumber: 1});  
        }
        else if(station.hospitalLocation){
          navigation.navigate('HelpScreen' , {mapNumber: 2}); 
        }
        
     }
        
      return (
        
        <View
        style={{
          backgroundColor: 'white',
          height: '15%',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingVertical: 10,
          marginLeft: 20,
          marginRight: 20,
          marginBottom: 10,
          borderRadius:20,
          elevation:5,
        }}>

          <View style={{flexDirection:'row' , justifyContent:'space-between',padding:10}}>

              
                <View style={{flexDirection:'row' , gap:-5}}>
                     <View style={{justifyContent:'center'}}>
                      {
                         icon && <Icon name={icon} size={30} color={color}/>
                      }
                     
                     </View>
                       
                     <View style={{marginLeft:15}}>
                          <Text style={{color:'black' , fontSize:16}}>{userName}</Text>
                          <Text style={{color:'black' , fontSize:14}}>{phoneNumber}</Text>
                     </View>
                     
                </View>

                <View style={{flexDirection:'row' , gap:5 , alignItems:'center'}}>
                     <View style={{justifyContent:'center'}}>
                       <Icon name='location-on' size={30} color={'#BA0021'}/>
                     </View>
                      <View style={{marginRight:15}}>
                             <Text style={{color:'black' , fontSize:16}}>{`${distance} Km`}</Text>
                      </View>
                </View>
          </View>   

           <View style={{alignItems:'center' , justifyContent:'center', padding:5}}>
               <TouchableOpacity style={{backgroundColor:'#3ebb6e' , flexDirection:'row', alignItems:'center', padding:3, gap:5 , borderRadius:8 , justifyContent:'center'}}
                                 onPress={() => handleComplaintNavigation()}>
                         <Icon name='chat' size={25} color={'white'} style={{marginLeft:10}}/>
                         <Text style={{marginRight:10 , color:'white' , textAlign:'center'}}>Complaint</Text>
               </TouchableOpacity>
           </View>  


      </View>
     
    
        
        
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


export default InfoCard;

