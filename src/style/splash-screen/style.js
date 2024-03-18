import { StyleSheet } from "react-native";

const style = StyleSheet.create({
    splashMain:{
        flex:1
    },
    splashLinearGradient:{
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    viewImage:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'     
    },
    splashImage:{
        width:80,
        height:80,
        tintColor:'white'
    },
    splashText:{
       color:'white',
       fontSize:30,
       fontWeight:'bold'
    }

})


export default style;