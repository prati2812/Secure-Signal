import React,{useEffect} from 'react';
import { Text, View, StyleSheet, Pressable, TouchableOpacity,Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ImagePickerSheetProps {
    setBottomSheetVisible:any;
}

const ImagePickerSheet:React.FC<ImagePickerSheetProps> = ({setBottomSheetVisible}) => {
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
       <Pressable style={styles.container} onPress={closeModal}>
           <Pressable style={{ width: '100%', height: '20%', }}>
                 <Animated.View style={[styles.bottomSheet , {transform: [{ translateY: slide}]}]}>
                      <View style={styles.imageSelectionTitleView}>
                              <Text style={styles.titleText}>Select Action</Text>
                      </View>

                      <View style={styles.selectionOptionView}>
 
                               <TouchableOpacity style={styles.selection}>
                                      <Icon name="photo-camera" size={40} color={'black'} />
                                      <Text style={styles.txt}>Camera</Text>
                               </TouchableOpacity>

                               <TouchableOpacity style={styles.selection}>
                                      <Icon name="photo-library" size={40} color={'black'} />
                                      <Text style={styles.txt}>Gallery</Text>
                               </TouchableOpacity>

                            
                               
                      </View>


                 </Animated.View>
           </Pressable>
       </Pressable>
  );
};

export default ImagePickerSheet;

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
  imageSelectionTitleView:{
    marginTop:20,
    marginLeft:20,
  },
  titleText:{
    color:'black',
    fontSize:22,
    fontWeight:'500',
  },
  selectionOptionView:{
    marginTop:15,
    marginLeft:20,
    marginRight:20,
    flexDirection:'row',
    gap:20,
  },
  selection:{
    justifyContent:'center',
    backgroundColor:'white',
    alignItems:'center',
    padding:10,
    borderRadius:10,
    elevation:5,
    borderColor:'gray',
    borderWidth:1,
    width:80
  },
  txt:{
    color:'black',
    fontSize:16,
    fontWeight:'600'
  }

});
