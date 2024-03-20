import React, { useEffect, useState } from "react";
import { Text, TextInput, View, TouchableOpacity, StyleSheet} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import HandleError from "../../hook/useError";
import axios from "axios";



interface PhoneNumberScreenProps {
  navigation: any; 
}

const PhoneNumberScreen: React.FC<PhoneNumberScreenProps> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isError, setIsError] = useState(false);

 

  const handlePhoneNumber = async() => {
    try {
      if (!phoneNumber) {
        return setIsError(true);
      } else {
        setIsError(false);
      }

      if (phoneNumber.length < 10) {
        return setIsError(true);
      } else {
        setIsError(false);
      }

      navigation.navigate('OtpNumber');
    } catch (error) 
    {
      
    }
  
  }

  return (
    <View style={style.phoneNumberMain}>
      <View style={style.iconArrowBackView}>
        <Text style={style.iconArrowBack}>
          <Icon name="keyboard-backspace" size={40} />
        </Text>
      </View>
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
            onChangeText={(text) => setPhoneNumber(text)}
            maxLength={10} />
        </View>
      </View>
      {isError && phoneNumber.length < 10 && phoneNumber.length >= 1 ?
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
          style={style.sendBtnCode}
          onPress={() => handlePhoneNumber()}>
          <View style={style.btnView}>
            <Text style={style.sendCode}>
              Send Code
            </Text>
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
     marginTop:20
  },
  iconArrowBack:{
     justifyContent:'center',
     marginLeft:10,
     color:'black'  
  },
  phoneNumberView:{
      marginTop:10,
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
     borderRadius:15
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
      borderRadius:10
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
