import { StyleSheet } from "react-native";

const style  = StyleSheet.create({
       phoneNumberMain:{
            flex:1,
            backgroundColor:'#FFFFFF',
       },
       phoneNumberView:{
           marginTop:70,
           alignItems:'center',
           justifyContent:'center'
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
          fontSize:18,
          color:'black'  
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
       } 
});


export default style;