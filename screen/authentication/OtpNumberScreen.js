import React, { useState , useRef, useMemo , useEffect}  from "react";
import {View , Text, TextInput , TouchableHighlight} from 'react-native';
import style from "../../style/otp-number-screen/style";
import Icon from 'react-native-vector-icons/MaterialIcons';

const OtpNumberScreen = ({navigation}) =>{
    
    const [text, onChangeText] = useState('');
    let inputRef = useRef();





    const onPress = () => inputRef.current?.focus();
  
    const otpContent = useMemo(() => 
        <View style={style.otpContainerView}>
            {
                Array.from({length:6}).map((key,i) => (
                   <Text
                        onPress={onPress}
                        style={[style.otpTextStyle , text[i] ? style.otpFilledStyle: {}]}>
                      {text[i]}      
                   </Text>
                ))
            }  
        </View>
    ,[text]);
     


    return(
        <View style={style.otpNumberMain}>
            <View style={style.iconArrowBackView}>
                <Text style={style.iconArrowBack} onPress={() => navigation.navigate('PhoneNumber')}>
                    <Icon name="keyboard-backspace" size={40} />
                </Text>
            </View>

            <View style={style.otpnNumberTextView}>
                <Text style={style.otpNumberText}>
                    Enter the code we just texted you
                </Text>
            </View>

            <View style={style.otpNumberViewTextTextInput}>

                <TextInput
                    maxLength={6}
                    ref={inputRef}
                    style={style.otpTextInput}
                    onChangeText={text => onChangeText(text)}
                    value={text}
                    keyboardType="number-pad"
                />
                {otpContent}

            </View>

            <View style={style.otpNumberResendCodeStyle}>
                   <View style={style.otpNumberResendCodeText}>
                         <Text style={style.otpNumberResendCode}>
                            Resend Code
                         </Text>
                   </View>

                   <View style={style.otpNumberResendCodeTextTimer}>
                         <Text style={style.otpNumberResendCodeTimer}>00:30</Text>
                   </View>
            </View>

            <View style={style.verifyCodeBtnView}>
                    <TouchableHighlight 
                        style={style.verifyBtnCode}
                        onPress={()=> navigation.navigate('Home')}>

                        <View style={style.btnView}>
                           <Text style={style.verifyCode}>
                              Next 
                           </Text>
                        </View>

                    </TouchableHighlight>
              </View>

        

        </View>
    )
}


export default OtpNumberScreen;