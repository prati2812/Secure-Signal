import React, { useEffect, useState } from "react";
import { Text, TextInput, View, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator, Alert} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import HandleError from "../../hook/useError";
import auth, { firebase } from '@react-native-firebase/auth';
import { useDispatch } from "react-redux";
import { addVerificationId } from "../../redux/credential/action";



interface PhoneNumberScreenProps {
  navigation: any; 
}

const PhoneNumberScreen: React.FC<PhoneNumberScreenProps> = ({ navigation }) => {
  const regex = /[.,+\-' ']/;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isError, setIsError] = useState(false);
  const [isIndicatorVisible, setIndicatorVisible] = useState(false);
  const dispatch = useDispatch();




  // Phone Number Verification
  const handlePhoneNumber = async () => {
    try {
      if (!phoneNumber) {
        setIsError(true);
        setPhoneNumber(phoneNumber);
        return false;
      }

      let phoneNo = '+91' + phoneNumber;
      dispatch({
        type: 'ADD_USER_PHONE_NUMBER',
        payload: phoneNo,
      });

      setIndicatorVisible(true);
      try {
        firebase.auth().settings.appVerificationDisabledForTesting = true;
        const confirmation = await auth().signInWithPhoneNumber(phoneNo);
        console.log(confirmation.verificationId);

        dispatch(addVerificationId(confirmation.verificationId));

        setIndicatorVisible(false);
        navigation.navigate('OtpNumber');
      } catch (error) {
        setIndicatorVisible(false);
        Alert.alert(
          'Error',
          'Please try again later',
          [
            {
              text: 'Ohk',
            },
          ],
          {
            cancelable: false,
          },
        );
      }
    } catch (error) {
      console.log(error);
    }
  };


  // Phone number validation
  const phoneNumberValidation = (text:string) => {
    if (!text) {
      setIsError(true);
      setPhoneNumber(text);
      return false;
    } 
    else if (text.length < 10) {
      setIsError(true);
      setPhoneNumber(text);
      return false;
    } 
    else if(regex.test(text)) {
       setIsError(true);
       setPhoneNumber(text);
       return false;
    }
    else{
      setPhoneNumber(text);
      setIsError(false);
    }
    
    
  
  }


  const isDisabled = isError || isIndicatorVisible;

  return (
    <View style={style.phoneNumberMain}>
      <StatusBar backgroundColor={'white'}/>
      <View style={style.phoneNumberView}>
        <Text style={style.phoneNumberText}>
          Enter your phone number
        </Text>
      </View>
      <View style={style.phoneNumebrTextInputView}>
        <View style={style.phoneNumberTextInput}>
          <TextInput
            style={style.phoneNumber}
            placeholder="Phone number"
            keyboardType="numeric"
            value={phoneNumber}
            onChangeText={phoneNumberValidation}
            maxLength={10} />
        </View>
      </View>
      {isError && phoneNumber.length <= 10 && phoneNumber.length >= 1  && regex.test(phoneNumber) ?
        <HandleError title="please enter valid phone number" />
        : isError ? <HandleError title="please enter phone number" /> : null
      }
      <View style={style.informationView}>
        <Text style={style.informationText}>
          We'll send you a verification code. Message and
          data rates may apply.
        </Text>
      </View>
      
      <View style={style.sendCodeBtnView}>
        <TouchableOpacity
          style={[style.sendBtnCode, isError && style.sendBtnCodeDisable]}
          onPress={async() => await handlePhoneNumber()}
          disabled={isDisabled}>  
          <View style={style.btnView}>
            {
               isIndicatorVisible ? <ActivityIndicator size={25} color={'white'}/> 
               :   <Text style={style.sendCode}>
                      Send Code
                  </Text>
            }
           
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const style  = StyleSheet.create({
  phoneNumberMain:{
       flex:1,
       backgroundColor:'#FFFFFF',
  },
  iconArrowBackView:{
     marginTop:20,
  },
  iconArrowBack:{
     justifyContent:'center',
     marginLeft:10,
     color:'black'  
  },
  phoneNumberView:{
      marginTop:30,
      alignItems:'center',
      justifyContent:'center',
  },
  phoneNumberText:{
     fontSize:25,
     color:'black',
     fontWeight:'500',
     padding:10,
     textAlign:'center'
  },
  phoneNumebrTextInputView:{
     backgroundColor:'white',
     padding:20
  },
  phoneNumberTextInput:{
     backgroundColor:'#F3FAFF',
     margin:2,
     padding:10,
     borderRadius:15,
     elevation:3,
  },
  phoneNumber:{
     fontSize:20,
     color:'black'  
  },
  errorPhoneNumberView:{
     paddingLeft:25,
     marginTop:-33,
     padding:10, 
  }, 
  errorPhoneNumber:{
    color:'red',
    marginLeft:2,
  }, 
  informationView:{
     margin:-10,
     justifyContent:'center', 
  },
  informationText:{
     color:'black',
     fontSize:16,
     paddingLeft:35,
     paddingRight:35,
     fontWeight:'400'
  },
  sendCodeBtnView:{
      flex:1,
      justifyContent:'flex-end',
      margin:20,
      marginBottom:30,
  },
  sendBtnCode:{
      backgroundColor:'#3ebb6e',
      padding:13,
      borderRadius:10,
      elevation:3,
  },
  sendBtnCodeDisable:{
    backgroundColor: '#74d198', 
  },
  btnView:{
     color:'white',
     alignItems:'center',
     margin:1
  },
  sendCode:{
     color:'white',
     fontSize:18,
     fontWeight:'700'
  },

});


export default PhoneNumberScreen;
