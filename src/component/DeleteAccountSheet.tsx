import * as React from 'react';
import { useEffect } from 'react';
import { Text, View, StyleSheet, Pressable, Animated, TouchableOpacity } from 'react-native';

interface DeleteAccountSheetProps {
    setDeleteAccountSheetVisible:any;
}

const DeleteAccountSheet:React.FC<DeleteAccountSheetProps> = ({setDeleteAccountSheetVisible}) => {
  const slide = React.useRef(new Animated.Value(300)).current;

  const slideUp = () => {
    Animated.timing(slide, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const slideDown = () => {
    Animated.timing(slide, {
      toValue: 300,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    slideUp();
  }, []);

  const closeModal = () => {
    slideDown();
    setTimeout(() => {
        setDeleteAccountSheetVisible(false);
    }, 800);
  };

  return (
    <Pressable style={styles.container} onPress={closeModal}>
      <Pressable style={{width: '100%', height: '25%'}}>
        <Animated.View
          style={[
            styles.bottomSheet,
            {transform: [{translateY: slide}]},
          ]}>

             <View style={styles.deleteAccountTextView}>
                   <Text style={styles.deleteAccountText}>Delete Account ?</Text>
             </View>

             <View style={styles.deleteWarningView}>
                  <Text style={styles.deleteWarningText}>You will lose all your data by deleting your account.{'\n'}This action cannot be undone.</Text>  
             </View> 

             <View style={styles.buttonView}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => closeModal()}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton}>
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>

          </Animated.View>
      </Pressable>
    </Pressable>
  );
};


const styles = StyleSheet.create({
    container: {
        position:'absolute',
        flex:1,
        backgroundColor:'#00000080',
        width:'100%',
        height:'100%',
        top: 0,
        left: 0,
        justifyContent:'flex-end',
    },
    bottomSheet:{
        width:'100%',
        height:'100%',
        backgroundColor:'white',   
        borderTopRightRadius:25,
        borderTopLeftRadius:25,
    },
    deleteAccountTextView:{
        marginTop:25,
        marginLeft:25,
    },
    deleteAccountText:{
        fontSize:27,
        color:'red',
        fontWeight:'600', 
    },
    deleteWarningView:{
        marginTop:10,
        marginLeft:25,
    },
    deleteWarningText:{
        fontSize:15,
        color:'black',
        fontWeight:'500',
    },
    buttonView:{
        flexDirection:'row' , 
        marginTop:20, 
        justifyContent:'flex-end',
        marginRight:15,
        gap:15,
    },
    cancelButton:{
        padding:10,
        backgroundColor:'green',
        width:'25%',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        elevation:5,
    },
    deleteButton:{
        padding:10,
        backgroundColor:'red',
        width:'25%',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        elevation:5,
    },
    btnText:{
        fontSize:17,
        color:'white',
        fontWeight:'600',
    }
});
  

export default DeleteAccountSheet;

