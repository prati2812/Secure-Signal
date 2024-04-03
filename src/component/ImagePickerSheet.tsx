import React,{useEffect} from 'react';
import { Text, View, StyleSheet, Pressable, TouchableOpacity,Animated, Platform, PermissionsAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CameraOptions, ImageLibraryOptions, MediaType, launchCamera , launchImageLibrary } from 'react-native-image-picker';
import { useDispatch } from 'react-redux';
import { addImageUri } from '../redux/action';

interface ImagePickerSheetProps {
  setImageSelectionSheetVisible:any;
 
}

const ImagePickerSheet:React.FC<ImagePickerSheetProps> = ({setImageSelectionSheetVisible}) => {
    const [imageUri , setImageUri] = React.useState('');
    const slide = React.useRef(new Animated.Value(300)).current;
    const dispatch = useDispatch();


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

      useEffect(() => {
          requestCameraPermission();
          requestGalleryPermission();
      },[]);

      const closeModal = () => {
         slideDown();
         setTimeout(() => {
          setImageSelectionSheetVisible(false);
         },800);
      }  

      const requestCameraPermission = async() => {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                 
          } else {
                 requestCameraPermission();      
          }
        }
      }

      const requestGalleryPermission = async() => {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
               
          } else {
                 requestGalleryPermission();      
          }
        }
      }

      const handleCamera = async() => {
       
          const options:CameraOptions = {
            mediaType: 'photo' as MediaType,
            quality: 1,
          };
          const res = await launchCamera(options);
          if (!res.didCancel && res.assets && res.assets.length > 0  && res.assets[0].uri) {
            setImageUri(res.assets[0].uri);
            dispatch(addImageUri(res.assets[0].uri));
          }
          closeModal();
        
      }

      const handleImageGallery = async() => {
       
          const options:ImageLibraryOptions = {
            mediaType: 'photo' as MediaType,
            quality: 1,
          };
          const res = await launchImageLibrary(options);
          if (!res.didCancel && res.assets && res.assets.length > 0  && res.assets[0].uri) {
            setImageUri(res.assets[0].uri);
            dispatch(addImageUri(res.assets[0].uri));
          }
          closeModal();
        
      }

  return (
       <Pressable style={styles.container} onPress={closeModal}>
           <Pressable style={{ width: '100%', height: '23%', }}>
                 <Animated.View style={[styles.bottomSheet , {transform: [{ translateY: slide}]}]}>
                      <View style={styles.imageSelectionTitleView}>
                              <Text style={styles.titleText}>Select Action</Text>
                      </View>

                      <View style={styles.selectionOptionView}>
 
                               <TouchableOpacity style={styles.selection} onPress={() => handleCamera()}>
                                      <Icon name="photo-camera" size={40} color={'black'} />
                                      <Text style={styles.txt}>Camera</Text>
                               </TouchableOpacity>

                               <TouchableOpacity style={styles.selection}>
                                      <Icon name="photo-library" size={40} color={'black'} onPress={() => handleImageGallery()}/>
                                      <Text style={styles.txt}>Gallery</Text>
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





export default ImagePickerSheet;

