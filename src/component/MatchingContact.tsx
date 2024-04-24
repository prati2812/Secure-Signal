import * as React from 'react';
import { Text, View, StyleSheet, Pressable, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';


interface ContactRoot {
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
   
    const [imageData , setImageData] = React.useState(null); 
  
    const userId = contact.id; 
    const token = useSelector((state:any) => state.userProfile.token);
 
    const fetchUserProfile = async() => {
        const response = await RNFetchBlob.fetch(
                    'POST' , 
                    'http://10.0.2.2:3000/fetchUserProfile',
                    {
                      'Content-Type' : 'application/json' , 
                      'Authorization': `Bearer ${token}`,
                    },
                    JSON.stringify({userId})
                  );
    
        
        if(response.data){
          const imageData = response.data;
          const image = `data:image/jpeg;base64,${imageData.toString('base64')}`;
          setImageData(image);
          
        }
        else{
          console.log("Something occured");
          
        }
    
    }

   
   React.useEffect(() => {
      fetchUserProfile();
      console.log(imageData);
      
   },[]); 
      
    
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
               imageData &&
               
                      <Image
                        source={{uri: (imageData !== 'data:image/jpeg;base64,Internal Server Error') ? imageData : 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
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

function dispatch(arg0: any) {
    throw new Error('Function not implemented.');
}

