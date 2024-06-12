import React, { useState } from 'react';
import { Text, View, StyleSheet, StatusBar, Image, TouchableOpacity, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomSheet from '../../component/BottomSheet';
import DeleteAccountSheet from '../../component/DeleteAccountSheet';
import { useDispatch, useSelector } from 'react-redux';
import CustomProfileOption from '../../component/CustomProfileOption';
import { firebase } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addToken, setProfileCompleted } from '../../redux/userprofile/action';



interface UserProfile {
  imageUri: string | null;
  userName: string;
}

interface AccountProfileProps {
  navigation: any;
}

const AccountProfile: React.FC<AccountProfileProps> = ({ navigation }) => {
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [isDeleteAccountSheetVisible, setDeleteAccountSheetVisible] = useState(false);
  const userProfile = useSelector((state: { userProfile: UserProfile }) => state.userProfile);
  const subScriptionType = useSelector((state:any) => state.subscription.subScriptionType);
  const dispatch = useDispatch();
  const { imageUri, userName } = userProfile;


  const handleLogout = async() => {
    await new Promise(resolve => setTimeout(resolve, 2000)); 


    await AsyncStorage.multiRemove(["token" , "profileExist"]);
    dispatch(addToken(''));
    dispatch(setProfileCompleted(false));
    navigation.navigate('PhoneNumber');
  } 
 

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#3ebb6e'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: imageUri || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
              style={styles.profileImage}
              resizeMode='cover'
            />
          </View>

          <TouchableOpacity style={styles.editProfileButton} onPress={() => setBottomSheetVisible(true)}>
            <View style={styles.editProfileButtonContent}>
              <Icon name='border-color' size={15} color={'black'} />
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.optionsSection}>
          
          
          <CustomProfileOption optionName='Name' data={userName} icon='person' />
          <CustomProfileOption optionName='PhoneNumber' data={firebase.auth().currentUser?.phoneNumber} icon='call' />

          <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('Subscription')}>
            <CustomProfileOption optionName='subscription' icon='bolt' data={subScriptionType ? subScriptionType: 'No Subscription'}/>
          </TouchableOpacity>   
        </View>

        
        <TouchableOpacity style={[styles.deleteAccountButton , {backgroundColor:'white' , borderColor:'red' , borderWidth:1 , marginBottom:-10}]} onPress={() => handleLogout()}>
          <View style={styles.deleteAccountButtonContent}>
            <Icon name='logout' size={25} color={'red'} />
            <Text style={[styles.deleteAccountButtonText , {color:'red'}]}>Log out</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.deleteAccountButton} onPress={() => setDeleteAccountSheetVisible(true)}>
          <View style={styles.deleteAccountButtonContent}>
            <Icon name='delete-forever' size={25} color={'white'} />
            <Text style={styles.deleteAccountButtonText}>Delete Account</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Render bottom sheet if visible */}
      {isBottomSheetVisible && <BottomSheet setBottomSheetVisible={setBottomSheetVisible} />}

      {/* Render delete account sheet if visible */}
      {isDeleteAccountSheetVisible && <DeleteAccountSheet setDeleteAccountSheetVisible={setDeleteAccountSheetVisible} navigation={navigation}/>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  profileSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    backgroundColor: 'lightblue',
    height: 150,
    width: 150,
    borderRadius: 100,
    elevation: 5,
    overflow: 'hidden',
  },
  profileImage: {
    flex: 1,
  },
  profileName: {
    marginTop: 10,
    fontSize: 20,
    color: 'black',
    fontWeight: '700',
  },
  phoneNumber: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: '600',
  },
  editProfileButton: {
    marginTop: 10,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 20,
    borderColor: '#3ebb6e',
    borderWidth: 3,
    elevation: 5,
  },
  editProfileButtonContent: {
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editProfileButtonText: {
    color: 'black',
    fontSize: 15,
    fontWeight: '500',
  },
  optionsSection: {
    marginTop: 15,
    marginHorizontal: 15,
    marginBottom: 15,
  },
  deleteAccountButton: {
    marginTop: 30,
    backgroundColor: '#D01110',
    padding: 10,
    borderRadius: 15,
    elevation: 5,
    marginHorizontal: 15,
    marginBottom: 15,
  },
  deleteAccountButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  deleteAccountButtonText: {
    color: 'white',
    fontSize: 20,
  },
});

export default AccountProfile;


