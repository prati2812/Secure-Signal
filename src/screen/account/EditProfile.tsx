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
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import HandleError from '../../component/useError';
import { Dispatch, useEffect, useState } from 'react';
import ImagePickerSheet from './component/ImagePickerSheet';
import { useSelector , useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { changeUserName, setProfileCompleted } from '../../redux/userprofile/action';
import { firebase } from '@react-native-firebase/auth';
import instance from '../../axios/axiosInstance';
import store from '../../redux/store';


interface EditProfileProps {
  navigation: any,
}



const EditProfile: React.FC<EditProfileProps> = ({navigation}) => {
  const [userName , setUserName] = useState('');
  const [isError , setIsError] = useState(false);
  const [isImageSelectionSheetVisible , setImageSelectionSheetVisible] = useState(false);
  const [isIndicatorVisible, setIndicatorVisible] = useState(false);
  const [notificationToken , setNotificationToken] = useState<string | null>('');
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();


  const imageUri = useSelector((state:any) => state.userProfile.imageUri);
  const imageResponse = useSelector((state:any) => state.userProfile.imageResponse);
  const phoneNumber = useSelector((state: any) => state.userProfile.phoneNumber);
  const name  = useSelector((state : any) => state.userProfile.userName);
  const isDeleted = useSelector((state : any) => state.userProfile.isDeleted);
  const userId = firebase.auth().currentUser?.uid;
     

  
  


  useEffect(() => {
    getToken();
    dispatchStore(changeUserName(userId))
    .then(() => setLoading(false))
    .catch(() => setLoading(false));
  },[]);

 

  useEffect(() => {
     getToken();   
  },[userName]);

  useEffect(() => {
    setUserName(name);
  },[name]);

  useEffect(() => {
    const profileExist = async() => {
   
   
      if (isDeleted) {
        setLoading(false);
      } else if (name) {
        if(isDeleted){
          setLoading(false);
        }
        else{
         await AsyncStorage.setItem('profileExist', 'true');
         dispatch(setProfileCompleted(true));
         navigation.navigate('NavigationStack');
         setLoading(false);  
        }
        
      } else if (name === undefined) {
        setLoading(false);
      }
    
     
     
   }
   profileExist();

  },[name , isDeleted]);


  // get FCM token from AsyncStorage
  const getToken = async() => {
    const notificationToken = await AsyncStorage.getItem('fcm_token');
    setNotificationToken(notificationToken);
  }


  
  
  const closeApp = () => {
    dispatch({
      type: 'CHANGE_USER_NAME',
      payload: null,
    });

    dispatch({
      type: 'ADD_IMAGE_URI',
      payload: null,
    });
    navigation.navigate('PhoneNumber')
  }


  // Close or break operation
  const handleCloseApp = async() => {
    Alert.alert(
      'Exit App',
      'If you proceed, You will need to register your phone number again when you use the app next time.',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => closeApp()},
      ],
      {
        cancelable: false,
      },
    );
  }

  // Select User image
  const handleUserImage = async () =>{
      setImageSelectionSheetVisible(true);
  }

  
  // save userProfile data to the database
  const handleSaveProfile = async() => {
       

    if(!isError){
      dispatch({
        type: 'CHANGE_USER_NAME',
        payload: userName,
      })
  
      const formData = new FormData();
      if (imageResponse && imageResponse.assets && imageResponse.assets.length > 0){
        formData.append('image' , {
          uri: imageResponse.assets[0].uri,
          type: imageResponse.assets[0].type,
          name: imageResponse.assets[0].fileName,
        }); 
      }
      
      formData.append('phoneNumber', phoneNumber);
      formData.append('userName', userName);
      formData.append('userId', userId);
      formData.append('notificationToken', notificationToken);
      
      console.log(formData);
  
      setIndicatorVisible(true);
  
      const response = await instance.post('/uploadImage',formData);
  
      if(response.status === 201){
        const responseData = await response.data;
        const {token} = responseData;
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem("profileExist", "true");
        dispatch(setProfileCompleted(true));  
        setIndicatorVisible(false);
        navigation.navigate('NavigationStack');
      }
      else{
        setIndicatorVisible(false);
        Alert.alert("Error" , 
               "Something went to wrong, Please try again later");
      }
    
    }

    
      
     
     
  }


  // username validation
  const userNamevalidation = (text : string) => {
    if(text.length !<= 2){
      setIsError(true);
      setUserName(text);
    } 
    setUserName(text);
    setIsError(false);
  }


  const isDisabled = isError || isIndicatorVisible;

  return (
    <>
      <SafeAreaView style={style.editProfileMain}>
      {loading ? (
              <View style={style.loadingContainer}>
                <ActivityIndicator size="large" color={'#3ebb6e'} />
              </View>
            ) :(
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'android' ? 'height' : undefined}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={style.editProfileIconView}>
              <TouchableOpacity
                style={style.closeIcon}
                onPress={() => handleCloseApp()}>
                <Icon name="close" size={30} color={'black'} />
              </TouchableOpacity>
            </View>

             
              <>
                <View style={style.editProfileTextView}>
                  <Text style={style.editText}>Edit Profile</Text>
                </View>
                <Pressable
                  onPress={() => handleUserImage()}
                  style={{elevation: 15, alignItems: 'center'}}>
                  <View style={style.editProfileImagePickerView}>
                    <Image
                      style={style.editProfileImagePicker}
                      source={{
                        uri: imageUri
                          ? imageUri
                          : 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                      }}></Image>
                  </View>
                </Pressable>
                <View style={style.editTextInputView}>
                  <View style={style.editTextInput}>
                    <TextInput
                      style={style.editUsername}
                      placeholder="Enter your name"
                      value={userName}
                      onChangeText={userNamevalidation}
                      onSubmitEditing={handleSaveProfile}
                    />
                  </View>
                </View>
                {isError ? (
                  <HandleError title="please enter your name" />
                ) : null}

                <View style={style.saveProfileBtnView}>
                  <TouchableOpacity
                    style={[
                      style.SaveProfileBtn,
                      isError && style.SaveProfileBtnDisable,
                    ]}
                    disabled={isDisabled}
                    onPress={() => handleSaveProfile()}>
                    <View style={style.btnView}>
                      {isIndicatorVisible ? (
                        <ActivityIndicator size={25} color={'white'} />
                      ) : (
                        <Text style={style.saveProfile}>Save Profile</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              </>
           
          </ScrollView>
        </KeyboardAvoidingView>
         )}
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
  editProfileMain: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  editProfileIconView: {
    marginTop: 20,
  },
  closeIcon: {
    paddingLeft: 20,
    textAlign: 'center',
    fontSize: 20,
    color: 'black',
    fontWeight: '700',
  },
  editProfileTextView: {
    marginTop: 10,
  },
  editText: {
    textAlign: 'center',
    fontSize: 20,
    color: 'black',
    fontWeight: '700',
  },
  editProfileImagePickerView: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightblue',
    width: 200,
    borderRadius: 120,
    elevation: 3,
    marginBottom: 2,
    overflow: 'hidden',
  },
  editProfileImagePicker: {
    width: 200,
    height: 200,
  },
  editTextInputView: {
    backgroundColor: 'white',
    padding: 20,
  },
  editTextInput: {
    backgroundColor: '#F3FAFF',
    margin: 2,
    padding: 10,
    borderRadius: 15,
    elevation: 3,
  },
  editUsername: {
    fontSize: 20,
    color: 'black',
  },
  saveProfileBtnView: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 20,
    marginBottom: 30,
  },
  SaveProfileBtn: {
    backgroundColor: '#3ebb6e',
    padding: 13,
    borderRadius: 10,
    elevation: 3,
  },
  SaveProfileBtnDisable: {
    backgroundColor: '#93dbb5',
  },
  btnView: {
    alignItems: 'center',
    margin: 1,
  },
  saveProfile: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditProfile;
export const dispatchStore = store.dispatch as typeof store.dispatch | Dispatch<any>