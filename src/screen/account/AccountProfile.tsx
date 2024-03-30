import React, {useState} from 'react';
import { Text, View, StyleSheet , StatusBar , Image,  TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../component/CustomHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomProfileOption from '../../component/CustomProfileOption';
import BottomSheet from '../../component/BottomSheet';


interface AccountProfileProps {
  navigation:any;
}

const AccountProfile: React.FC<AccountProfileProps> = ({navigation}) => {
  const [imageUri , setImageUri] = useState('https://cdn-icons-png.flaticon.com/512/149/149071.png');
  const [isBottomSheetVisible , setBottomSheetVisible] = useState(false);

  return (
      <>
      <View style={styles.main}>
          <StatusBar backgroundColor={'#3ebb6e'} />

          
          {/* custom header */}
          <CustomHeader name="Profile" icon={''} />

        

        <ScrollView
              showsVerticalScrollIndicator={false}> 

          {/* Edit Profile */}
          <View style={styles.editProfileView}>
                
               
                <View style={styles.editProfileImage}>
                  <Image 
                      source={{uri:imageUri}}
                      style={{flex:1}}
                      resizeMode='contain'
                  />
                </View>

                <Text style={styles.editProfileName}>
                      Pratik P
                </Text>

                <Text style={styles.editPhoneNumber}>
                       +91123456789
                </Text>

                <TouchableOpacity style={styles.editProfileBtn} onPress={()=> setBottomSheetVisible(true)}>
                         <View style={styles.editProfileBtnView}>
                              <Icon name='border-color' size={15} color={'black'}/>
                              <Text style={styles.editProfileBtnText}> Edit Profile</Text>
                         </View>
                </TouchableOpacity>  

                  
          </View>

          <View style={styles.optionsView}>
                
                <CustomProfileOption optionName='Name' data='Pratik' icon='person'/>

                <CustomProfileOption optionName='PhoneNumber' data='+911234567890' icon='call'/>

                <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('Subscription')}>      
                <CustomProfileOption optionName='subscription' icon='bolt'/>
                </TouchableOpacity>

                
          </View>

           {/* Delete Account Button */}
          <TouchableOpacity
                   style={styles.deleteAccountBtn}>
                       <View style={styles.deleteAccountView}>
                             <Icon name='delete-forever' size={25} color={'white'}/>
                             <Text style={styles.deleteAccountText}>Delete Account</Text>
                       </View>
          </TouchableOpacity>
  
        </ScrollView>
     
      </View>

      {
         isBottomSheetVisible && <BottomSheet setBottomSheetVisible={ setBottomSheetVisible}/> 
      }
     
      </> 
  );
};


const styles = StyleSheet.create({
    main: 
    {
       backgroundColor:'white',
       height:'100%',
    },
    editProfileView:{
      marginTop:20, 
      flex:0.4 , 
      alignItems:'center'
    },
    editProfileImage:{
      backgroundColor:'lightblue' , 
      height:150, 
      width:150, 
      borderRadius:100 , 
      elevation:5
    },
    editProfileName:{
      marginTop:10, 
      fontSize:20, 
      color:'black' , 
      fontWeight:'700'
    },
    editPhoneNumber:{
      marginTop:5, 
      fontSize:16, 
      fontWeight:'600'
    },
    editProfileBtn:{
      marginTop:10, 
      backgroundColor:'white' , 
      padding:12, 
      borderRadius:20, 
      borderColor:'#3ebb6e' , 
      borderWidth:3 , 
      elevation:5
    },
    editProfileBtnView:{
      flexDirection:'row', 
      gap:7 , 
      alignItems:'center' , 
      justifyContent:'center'
    },
    editProfileBtnText:{
      color:'black', 
      fontSize:15 , 
      fontWeight:'500'
    },
    optionsView:{
      marginTop:15, 
      marginLeft:15, 
      marginRight:15 ,
      marginBottom:15,
    },
    deleteAccountBtn:{
      marginTop:30 , 
      backgroundColor:'#D01110' , 
      padding:10, 
      borderRadius:15, 
      elevation:5,
      marginLeft:15, 
      marginRight:15 , 
      marginBottom:15,
    },
    deleteAccountView:{
      flexDirection:'row' , 
      alignItems:'center' , 
      justifyContent:'center' , 
      gap:5
    },
    deleteAccountText:{
      color:'white', 
      fontSize:20
    }
    
});
  
export default AccountProfile;

