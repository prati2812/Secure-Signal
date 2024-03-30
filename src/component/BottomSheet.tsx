import React, {useEffect, useRef , useState} from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity , TextInput, Animated, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePickerSheet from './ImagePickerSheet';

interface BottomSheetProps {
  setBottomSheetVisible:any;
}

const BottomSheet:React.FC<BottomSheetProps> = ({setBottomSheetVisible}) => {

  const [isImageSelectionSheetVisible , setImageSelectionSheetVisible] = useState(false);
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
      slideUp()
    })

    const closeModal = () => {
       slideDown();
       setTimeout(() => {
        setBottomSheetVisible(false);
       },800);
    }

  return (
    <>
    <Pressable style={styles.container} onPress={closeModal}>
      <Pressable style={{ width: '100%', height: '45%', }}>
        <Animated.View style={[styles.bottomSheet , {transform: [{ translateY: slide}]}]}>

        <View style={styles.editProfileView}> 
          <Text style={styles.editProfileTxt}>Edit Profile</Text>
        </View>  
        {/* Edit User Image */}
        <View style={styles.editUserImageView}>
              <View style={styles.editProfileImage}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            }}
            style={{flex: 1}}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.editProfileIcon} onPress={()=>setImageSelectionSheetVisible(true)}>
            <Icon name="edit" size={20} color={'black'}/>
          </TouchableOpacity>
              </View>
        </View>

        {/* Edit Username */}
          <View style={styles.editTextInput}>
            <TextInput
              style={styles.editUsername}
              placeholder="Enter your name"
            />
          </View>

        <View style={styles.buttonView}>
               <TouchableOpacity
                   style={styles.cancelButton}
                   onPress={() => closeModal()}>
                            <Text style={styles.btnText}>
                                   Cancel 
                            </Text>
               </TouchableOpacity>

               <TouchableOpacity
                   style={styles.updateButton}>
                            <Text style={styles.btnText}>
                                   Update
                            </Text>
               </TouchableOpacity>
        </View>


        </Animated.View>
      </Pressable> 
    </Pressable>

    {
         isImageSelectionSheetVisible && <ImagePickerSheet setBottomSheetVisible={ setBottomSheetVisible}/> 
    }
    </>
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
    editProfileView:{
        alignItems:'center',
    },
    editProfileTxt:{
        marginTop:15,
        fontSize:22,
        color:'black',
        fontWeight:'700',
    },
    editUserImageView:{
        alignItems:'center',  
    },
    editProfileImage:{
        marginTop:10,
        height:120, 
        width:120, 
        borderRadius:100 , 
        elevation:5,
        backgroundColor:'lightblue',
        flexDirection:'row',
    },
    editProfileIcon:{
        position:'absolute' , 
        bottom:7, 
        backgroundColor:'white', 
        borderRadius:20,
        right:4,
        padding:5,
        borderColor:'black',
        borderWidth:2,
    },
    editTextInput:{
        backgroundColor:'white',
        marginTop:15,
        borderRadius:10,
        elevation:5,
        marginLeft:15,
        marginRight:15,
        padding:5,
        borderColor:'green',
        borderWidth:1.5,
    },
    editUsername:{
        fontSize:20,
        color:'black' 
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
        backgroundColor:'white',
        width:'25%',
        alignItems:'center',
        justifyContent:'center',
        borderColor:'red',
        borderWidth:2,
        borderRadius:10,
        elevation:5,


    },
    updateButton:{
        padding:10,
        backgroundColor:'white',
        width:'25%',
        alignItems:'center',
        justifyContent:'center',
        borderColor:'green',
        borderWidth:2,
        borderRadius:10,
        elevation:5,
    },
    btnText:{
        fontSize:17,
        color:'black',
        fontWeight:'600',
    }
});
  
export default BottomSheet;

