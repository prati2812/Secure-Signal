import { useRoute } from '@react-navigation/native';
import * as React from 'react';
import { Text, View, StyleSheet , Pressable , Image, ScrollView, TouchableOpacity, ImageBackground} from 'react-native';
import ImagePicker, { openPicker } from 'react-native-image-crop-picker';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';


interface HelpDescriptionScreenProps {
    navigation: any,
    query:string,
}

const HelpDescriptionScreen: React.FC<HelpDescriptionScreenProps> = ({navigation}) => {

    const [isYes , setYesButton] = React.useState(false);
    const [isNo , setNoButton] = React.useState(true);
    const [uri , setUri] = React.useState([]);

    const handleYes = () => {
        setYesButton(true);
        setNoButton(false);
    }

    const handleNo = () => {
        setYesButton(false);
        setNoButton(true);
    }

    const handleUploadPhotos = () => {
        ImagePicker.openPicker({
           multiple:true,
        }).then(images=>{
            setUri(images);
        });           
    }

    const removeImage = (data) => {
         let newDataList;
         newDataList = uri.filter((item , index) => index!== data);   
         setUri(newDataList);
         
         
    }



    const route = useRoute();
    const data = route.params.query;
  return (
    <SafeAreaView style={styles.helpDescriptionMain}>

      <View style={styles.backPressBtnContainer}>
      <Pressable onPress={() => navigation.goBack()}>
        <View style={styles.backPressBtnView}>
          
            <Text>
              <Icon name="arrow-back" size={35} color={'black'} />
            </Text>
        </View>
      </Pressable>  
        <Text style={styles.queryText}>{data}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.whatHappenedView}>
          <Text style={styles.whatHappenedText}>What happened ?</Text>
        </View>

         {/* Complain Chat Box */}
        <View style={styles.multiLineTextInputView}>
              <TextInput
                multiline={true}
                numberOfLines={5}
                placeholder='Enter Complain'
                underlineColorAndroid ='rgba(0,0,0,0)'
                activeUnderlineColor='transparent'
                underlineColor='transparent'
                style={styles.multiLineTextInput}
              />
        </View>

        {/* selected images */}
        <ScrollView
           horizontal
           showsHorizontalScrollIndicator={false} 
           style={styles.dataScrollView}> 
          <> 
          { 
            
             uri.length ?
              
                  uri.map((item , index) => (
                    
                    <View style={styles.dataShowView} key={index}>

                      <View style={styles.dataImageView}>
  
                         <Image
                            source={{ uri: item.path }}
                            resizeMode='cover'
                            style={styles.imageView} />
  
                              <TouchableOpacity style={styles.imageCloseIcon} onPress={() => removeImage(index)}>
                                <Icon name='close' size={25} color={'white'} />
                              </TouchableOpacity>
  
  
                      </View>
                    </View>
                  ))  
                
              : null
          }
          </>
        </ScrollView> 

         {/* Upload a photo or recording */}
        <View style={styles.uploadDataView}>
             <TouchableOpacity 
                style={styles.uploadPhotoView} 
                onPress={()=> handleUploadPhotos()}>
                  <Text style={styles.uploadPhotoText}>
                       Upload a photo
                  </Text>
             </TouchableOpacity>

             <View style={styles.uploadRecordingView}>
                   <Text>
                        <Icon name='mic' size={50} color={'white'}/>
                   </Text>
             </View>
        </View>

         {/* Divider  */}
        <View style={styles.divder}></View>

        <View style={styles.questionTextView}>
              <Text style={styles.questionText}>
                   Is anyone injured?
              </Text>
        </View>

        <View style={styles.questionOptionSelectionView}>
             
             <Pressable onPress={() => handleYes()} style={{flex:1}}>
              <View style={[styles.questionOptionView , isYes && styles.activateOptionView]}>
                   <Text style={[styles.option , isYes && styles.activateOption]}>
                         Yes
                   </Text>
              </View>
              </Pressable>

              <Pressable onPress={()=> handleNo()} style={{flex:1}}>
              <View style={[styles.questionOptionView , isNo && styles.activateOptionView]}>
                   <Text style={[styles.option , isNo && styles.activateOption]}>
                         No 
                   </Text>
              </View>
              </Pressable>

        </View>

        <View style={styles.helpSubmitBtnView}>
              <Pressable onPress={()=> navigation.navigate('HelpConfirmation')}>
              <View style={styles.helpSubmitBtn}>
                     <Text style={styles.helpSubmitText}>
                            I need help
                     </Text>
              </View>
              </Pressable>    
        </View>


        


      </ScrollView>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
      helpDescriptionMain: {
         flex:1,
         backgroundColor:'white',
      },
      backPressBtnContainer: {
        flexDirection: 'row',
        padding: 10,
      },
      backPressBtnView: {
        marginTop: 1,
        width: 55,
        height: 55,
        backgroundColor: 'white',
        marginLeft: 15,
        borderRadius: 15,
        elevation: 6,
        alignItems: 'center',
        justifyContent: 'center',
      },
      profileBtnView: {
        marginTop: 1,
        width: 70,
        height: 70,
        backgroundColor: 'white',
        marginRight: 15,
        borderRadius: 47,
        elevation: 6,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      },
      profileImage: {
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        aspectRatio: 1,
      },
      queryText:{
        alignSelf:'center', 
        marginHorizontal:80,
        fontSize:22,
        color:'black',
      },
      whatHappenedView:{
        marginTop:10,
        marginLeft:15, 
      },
      whatHappenedText:{
        paddingLeft:10,
        color:'black',
        fontWeight:'600',
        fontSize:18,
      },
      multiLineTextInputView:{
        marginTop:10,
        marginLeft:15,
        marginRight:15,
        backgroundColor:'lightgray',
        height:150,
        borderRadius:25,
        overflow:'hidden',
        elevation:5,
      },
      multiLineTextInput:{
        backgroundColor:'lightgray' , 
      },
      uploadDataView:{
         marginTop:15, 
         flexDirection:'row',
         marginLeft:10,
         marginRight:10,
         padding:10,
      },
      uploadPhotoView:{
         flex:4,
         paddingLeft:15,
         height:70,
         backgroundColor:'white',
         marginRight:10,
         borderRadius:25,
         borderColor:'green',
         borderWidth:2,
         alignItems:'center',
         justifyContent:'center',
         elevation:5,
      },
      uploadPhotoText:{
         fontSize:20,
         color:'black',
         fontWeight:'500',
      },
      uploadRecordingView:{
         flex:1,
         height:70,
         backgroundColor:'#3ebb6e',
         borderRadius:20,
         elevation:5,
         alignItems:'center',
         justifyContent:'center',
      },
      dataScrollView:{
        marginTop:20, 
        marginLeft:20 , 
        flexDirection:'row',
      },
      dataShowView:{
        margin:5
      },
      dataImageView:{ 
        width: 100, 
        height: 100, 
        backgroundColor: 'lightblue', 
        borderRadius: 20, 
        elevation: 6, 
        marginRight:8, 
        margin:5
      },
      imageView:{
        flex: 1, 
        borderRadius: 20,
      },
      imageCloseIcon: { 
        top: -6, 
        right: -6, 
        position: 'absolute', 
        backgroundColor: 'red', 
        borderRadius: 20, 
      },
      divder:{
         marginTop:15,
         marginLeft:20,
         marginRight:20,
         height:2,
         backgroundColor:'lightgray',
         fontWeight:'bold',
      },
      questionTextView:{
        marginTop:10,
        marginLeft:15,
      },
      questionText:{
        paddingLeft:5,
        fontSize:15,
        color:'black',
        fontWeight:'600',
      },
      questionOptionSelectionView:{
        flexDirection:'row',
        marginTop:10,
        marginLeft:15,
        marginRight:15,
        gap:10,
      },
      questionOptionView:{
        flex:1,
        height:60,
        backgroundColor:'lightgray',
        borderRadius:25,
        alignItems:'center',
        justifyContent:'center',
        elevation:5,
      },
      option:{
          color:'black',
          fontSize:20,
          fontWeight:'500',
      },
      activateOptionView:{
        backgroundColor:'#3ebb6e'
      },
      activateOption:{
        color:'white'
      },
      helpSubmitBtnView:{
         marginTop:50,
         marginLeft:15,
         marginRight:15,
         marginBottom:10,
      },
      helpSubmitBtn:{
         height:60,
         backgroundColor:'#FB6D48',
         borderRadius:22,
         alignItems:'center',
         justifyContent:'center',
         elevation:5,
      },
      helpSubmitText:{
         color:'white',
         fontSize:18,
         fontWeight:'500',
      }
     
});

export default HelpDescriptionScreen;


