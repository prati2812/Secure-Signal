import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import style from '../../style/edit-profile/style';
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
      navigation.navigate('Home'); 
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

export default EditProfile;
