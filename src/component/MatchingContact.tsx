import * as React from 'react';
import { useEffect } from 'react';
import { Text, View, StyleSheet, Pressable, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import instance from '../axios/axiosInstance';
import base64 from 'base64-js';

interface ContactRoot {
    userId: any;
    recordID: string;
    givenName: string;
    phoneNumbers: { number: string }[];
}


interface MatchingContactProps {
    contact:ContactRoot;
    isSelected:boolean;
    handleMatchingSelected:Function;
}




const MatchingContact: React.FC<MatchingContactProps> = ({contact , isSelected , handleMatchingSelected}) => {
   
    const [imageData , setImageData] = React.useState<string|null>(null); 
  
    const userId = contact.userId;
   
    
    const token = useSelector((state:any) => state.userProfile.token);

    useEffect(() => {
      if(userId){
        fetchUserProfile();
      }
   },[]); 
 
    const fetchUserProfile = async() => {
        const response = await instance.post('/fetchUserDetails',{ userId });
                
        if(response.status === 200){
          const { userData, imageBuffer } = await response.data;      
          const base64Image = base64.fromByteArray(imageBuffer.data);
          const imageUrl = `data:image/jpeg;base64,${base64Image}`;

          setImageData(imageUrl); 
          
                  
          
        }
        else{
          console.log("Something occured");
          
        }
    
    }

   
 
      
    
  return (
    <Pressable onLongPress={() => handleMatchingSelected(contact)}>
      <View style={[styles.contactContainer]}>
        {
          isSelected ?
          <View style={[styles.placeholder , isSelected && styles.isSelected]}>
                 <Icon name="check" size={35} color={'black'} />    
          </View>
          :
          <View style={styles.placeholder}>
           {
               
                      <Image
                        source={{uri: imageData ?  imageData  : 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
                        style={{flex:1}}
                      />  
           }
             
        </View>

        }
        

        <View style={styles.contactDetails}>
          <Text style={styles.contactName}>{contact.givenName}</Text>
          <Text style={styles.contactNumber}>
            {contact.phoneNumbers[0]?.number}
          </Text>
        </View>
      </View>
    </Pressable>
    
  );
};


const styles = StyleSheet.create({
    contactContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        gap: 5,
        borderRadius:25,
        elevation:5,
        overflow:'hidden',
        marginBottom:10,
        marginLeft:10,
        marginRight:10,
        padding:10,
        borderColor:'lightblue',
        borderWidth:2,
      },
      placeholder: {
        width: 55,
        height: 55,
        borderRadius: 30,
        overflow: 'hidden',
        backgroundColor: 'lightblue',

      },
      txt: {
        fontSize: 30,
        color:'black',
      },
      contactDetails: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 5,
      },
      contactName: {
        color:'black',
        fontSize: 22,
      },
      contactNumber: {
        color: '#888',
        fontWeight:'600',
      },
      isSelected:{ 
        alignItems:'center',
        justifyContent:'center',
      }
});
  

export default MatchingContact;


