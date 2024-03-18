import { StyleSheet } from "react-native";

const style = StyleSheet.create({
    otpNumberMain: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    iconArrowBackView: {
        marginTop: 20
    },
    iconArrowBack: {
        justifyContent: 'center',
        marginLeft: 10,
        color: 'black'
    },
    otpnNumberTextView: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    otpNumberText: {
        fontSize: 25,
        color: 'black',
        fontWeight: '500',
        padding: 10,
        textAlign: 'center'
    },
    otpNumberViewTextTextInput:{
        marginHorizontal:20
    },
    otpTextInput:{
        height:0,
        width:0, 
    },
    otpContainerView:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    otpTextStyle: {
        height: 60,
        width: 50,
        borderWidth: 1,
        borderRadius: 10,
        fontSize: 28,
        textAlignVertical:'center',
        textAlign:'center',
        color:'black',
        backgroundColor:'#F3FAFF',
        borderColor:'white' 
    },
    otpFilledStyle: {
        backgroundColor: '#F3FAFF',
        overflow: 'hidden',
        borderColor:'gray'
    },
    otpNumberResendCodeStyle:{
        marginTop:10,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    otpNumberResendCodeText:{
        paddingLeft:20,
    },
    otpNumberResendCode:{
        color:'black',
        fontSize:14,
        fontWeight:'500'
    },
    otpNumberResendCodeTextTimer:{
        paddingRight:20,
    },
    otpNumberResendCodeTimer:{
        fontSize:14,
        fontWeight:'500',
    },
    verifyCodeBtnView:{
        flex:1,
        justifyContent:'flex-end',
        margin:20,
        marginBottom:30,
    },
    verifyBtnCode:{
        backgroundColor:'#3ebb6e',
        padding:13,
        borderRadius:10
    },
    btnView:{
        alignItems:'center',
        margin:1
    },
    verifyCode: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700'
    }



});


export default style;