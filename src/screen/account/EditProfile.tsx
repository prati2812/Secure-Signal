import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import HandleError from '../../hook/useError';
import { useEffect, useState } from 'react';
import ImagePickerSheet from '../../component/ImagePickerSheet';
import { useSelector , useDispatch} from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { changeUserName } from '../../redux/userprofile/action';


interface EditProfileProps {
  navigation: any,
}



const EditProfile: React.FC<EditProfileProps> = ({navigation}) => {
  const [userName , setUserName] = useState('');
  const [isError , setIsError] = useState(false);
  const [isImageSelectionSheetVisible , setImageSelectionSheetVisible] = useState(false);
  const [isIndicatorVisible, setIndicatorVisible] = useState(false);
  const dispatch = useDispatch();


  const imageUri = useSelector((state:any) => state.userProfile.imageUri);
  const imageResponse = useSelector((state:any) => state.userProfile.imageResponse);
  const phoneNumber = useSelector((state: any) => state.userProfile.phoneNumber);
  const userId = useSelector((state: any) => state.userProfile.userId);
  const notificationToken = AsyncStorage.getItem('fcm_token');


 
  useEffect(() => {
     setIsError(false);   
  },[userName]);

  

  const handleUserImage = async () =>{
      setImageSelectionSheetVisible(true);

  }

  const handleSaveProfile = async() => {
       
       if(userName.length === 0 || !userName){
           setIsError(true);
           return false;
       } 
       setIsError(false);
    
       dispatch(changeUserName(userName));
       
       
      
        const formData = new FormData();
        formData.append('image', {
          uri: imageResponse.assets[0].uri,
          type: imageResponse.assets[0].type,
          name: imageResponse.assets[0].fileName,
        });

        formData.append('phoneNumber', phoneNumber); 
        formData.append('userName', userName);
        formData.append('userId', userId.user.uid);
        formData.append("notificationToken" , notificationToken._j);
        
      
        setIndicatorVisible(true); 
      
        const response = await axios.post('http://10.0.2.2:3000/uploadImage', formData, {
          headers: {
            "Content-Type": 'multipart/form-data',
          },
        });

  
          const responseData = await response.data;
          const {token , imageUrl} = responseData;
          AsyncStorage.setItem('token' , token);
          
          setIndicatorVisible(false);
          
            
        
  
        
        
       navigation.navigate('Home');  
     
     
  }


  return (
    <>
    <SafeAreaView style={style.editProfileMain}>
      

      <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === 'android' ? 'height' : undefined}>

      <ScrollView
        showsVerticalScrollIndicator={false}>      

      <View 
        style={style.editProfileIconView}>
        <TouchableOpacity 
          style={style.closeIcon}>
            <Icon name="close" size={30} color={'black'} />
        </TouchableOpacity>
      </View>

      <View 
        style={style.editProfileTextView}>
           <Text style={style.editText}>
                Edit Profile
           </Text>
      </View>

      <Pressable onPress={() => handleUserImage()} style={{elevation:15, alignItems:'center'}}>
      <View 
        style={style.editProfileImagePickerView}>
            <Image  
               style={style.editProfileImagePicker}
               source={{uri: imageUri ? imageUri : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}}>              
            </Image>
      </View>
      </Pressable>

      <View style={style.editTextInputView}>
        <View style={style.editTextInput}>
          <TextInput
            style={style.editUsername}
            placeholder="Enter your name" 
            value={userName}
            onChangeText={(text) => setUserName(text)}/>
        </View>
      </View>
      {
          isError ?  <HandleError title='please enter your name'/> : null 
      }

      <View style={style.saveProfileBtnView}>
        <TouchableOpacity
          style={style.SaveProfileBtn}
          onPress={() => handleSaveProfile()}>
          <View style={style.btnView}>
            {
               isIndicatorVisible ? <ActivityIndicator size={25} color={'white'}/>  
               :    <Text style={style.saveProfile}>
               Save Profile
             </Text>
            }
          
          </View>
        </TouchableOpacity>
      </View>
 
      </ScrollView>
     
      </KeyboardAvoidingView>

      
    </SafeAreaView>

     {isImageSelectionSheetVisible && (
        <ImagePickerSheet
          setImageSelectionSheetVisible={setImageSelectionSheetVisible}
        />
      )}  

    </>
  );
};

const style = StyleSheet.create({
  editProfileMain:{
      flex:1,
      backgroundColor:'#FFFFFF'
  },
  editProfileIconView:{
      marginTop:20,
  },
  closeIcon:{
      paddingLeft:20,
  },
  editProfileTextView:{
      marginTop:10,
  },
  editText:{
      textAlign:'center',
      fontSize:20,
      color:'black',
      fontWeight:'700',
  },
  editProfileImagePickerView:{
      marginTop:10,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:'lightblue',
      width:200,
      borderRadius:120,
      elevation:3,
      marginBottom:2,
      overflow:'hidden'
  },
  editProfileImagePicker:{
      width:200,
      height:200,
  },
  editTextInputView:{
      backgroundColor:'white',
      padding:20,
  },
  editTextInput:{
      backgroundColor:'#F3FAFF',
      margin:2,
      padding:10,
      borderRadius:15,
      elevation:3,
  },
  editUsername:{
      fontSize:20,
      color:'black' 
  },
  saveProfileBtnView:{
      flex:1,
      justifyContent:'flex-end',
      margin:20,
      marginBottom:30,
  },
  SaveProfileBtn:{
      backgroundColor:'#3ebb6e',
      padding:13,
      borderRadius:10,
      elevation:3,
  },
  btnView:{
      alignItems:'center',
      margin:1
  },
  saveProfile:{
      color:'white',
      fontSize:18,
      fontWeight:'700'
  }

});

export default EditProfile;
