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
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import HandleError from '../../hook/useError';
import { launchCamera , launchImageLibrary } from 'react-native-image-picker';


interface EditProfileProps {
  navigation: any,
}

const EditProfile: React.FC<EditProfileProps> = ({navigation}) => {
  const [userName , setUserName] = React.useState('');
  const [isError , setIsError] = React.useState(false);
  const [imageUri , setImageUri] = React.useState('');

  

  const handleUserImage = async () =>{
      const res  = await launchCamera();
      setImageUri(res?.assets[0].uri);

  }

  const handleSaveProfile = () => {
     if(!userName)
     {
         setIsError(true); 
         return false;
     }
     else{
      setIsError(false);
      navigation.navigate('TabNavigator'); 
     }
     
  }


  return (
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

      <Pressable onPress={() => handleUserImage()}>
      <View 
        style={style.editProfileImagePickerView}>
            <Image  
               style={style.editProfileImagePicker}
               source={{uri:imageUri}}>              
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
            <Text style={style.saveProfile}>
              Save Profile
            </Text>
          </View>
        </TouchableOpacity>
      </View>
 
      </ScrollView>
     
      </KeyboardAvoidingView>

      
    </SafeAreaView>
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
      paddingTop:10,
  },
  editProfileImagePicker:{
      backgroundColor:'lightgray',
      width:200,
      height:200,
      borderRadius:120,
  },
  editTextInputView:{
      backgroundColor:'white',
      padding:20,
  },
  editTextInput:{
      backgroundColor:'#F3FAFF',
      margin:2,
      padding:10,
      borderRadius:15
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
      borderRadius:10
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
