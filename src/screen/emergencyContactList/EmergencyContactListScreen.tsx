import React,{useEffect , useState , Dispatch} from 'react';
import { Text, View, StyleSheet, Platform, PermissionsAndroid,  ScrollView, TouchableOpacity ,ActivityIndicator} from 'react-native';
import CustomHeader from '../../component/CustomHeader';
import { Searchbar } from 'react-native-paper';
import Contacts  from 'react-native-contacts';
import Contact from '../../component/Contact';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch , useSelector } from 'react-redux';
import { removeSelectedContact , addContact, addMatchingContacts} from '../../redux/contacts/action';
import { firebase } from '@react-native-firebase/auth';
import axios from 'axios';
import SectionList from '../../component/SectionList';
import MatchingContact from '../../component/MatchingContact';
import instance from '../../axios/axiosInstance';
import store from '../../redux/store';







interface Contact {
  userId:any;
  contact: any;
  recordID: string;
  givenName: string;
  phoneNumbers: { number: string }[];
}

interface RootState {
  userProfile: any;
  matchingContacts: Contact[];
  contacts:Contact[];
}

interface EmergencyContactListScreenProps {
  userProfile: {
    userName: string;
  };
  selectedContacts: Contact[];
  contacts: RootState; 
  navigation:any;
}



const EmergencyContactListScreen:React.FC<EmergencyContactListScreenProps> = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<Contact[]>([]);
  const [filteredMatchingContactData , setFilteredMatchingContactData] = useState<Contact[]>([]);
  const [updatedContact , setUpdatedContact] = useState<Contact[]>([]);
  const [matchingUpdatedContact , setMatchingUpdatedContact] = useState<Contact[]>([]);
  const [isVisible, setVisible] = useState(false);
  const [isSelectedContact , setSelectedContact] = useState(false);
  const [isUpdated , setUpdated] = useState(false);
  const [isSelected , setSelected] = useState(Number);
  const [indicatorValue , setIndicatorValue] = useState(Number);

  const dispatch = useDispatch();

  
  // Get Current User Id
  const userId = firebase.auth().currentUser?.uid;

  const selectedContacts = useSelector((state : any) => state.contacts.selectedContact);
  const contacts = useSelector((state : EmergencyContactListScreenProps) => state.contacts.contacts);
  const matchedContacts = useSelector((state : EmergencyContactListScreenProps) => state.contacts.matchingContacts);
  const userName  = useSelector((state : RootState) => state.userProfile.userName);
  const token = useSelector((state : any) => state.userProfile.token);
  

  

  useEffect(() => {                  
    if (contacts.length > 0) {
    } else {
      handleContactList();
    }
  }, []);
 
  useEffect(() => { 
    dispatchStore(addMatchingContacts(userId, contacts)); 
  }, [contacts]);

  useEffect(() => {  
    handleUpdateContactList();
    handleMatchingUpdatedContactList();     
  }, [contacts,  matchedContacts]); 
  
  useEffect(() => {
    handleMatchingUpdatedContactList(); 
  }, []);


  useEffect(() => {
      handleContactList();
      handleUpdateContactList();
      handleMatchingUpdatedContactList();
  },[isUpdated]);
  
  
  

  
  // Update Contact List Remove selected and Matching Contact from contact List
  const handleUpdateContactList = () => {  

  //  if (selectedContacts && matchedContacts) {
    
  //   let filteredContacts = contacts.filter(
  //     contactItem =>
  //       !selectedContacts.some(
  //         (selectedItem: { recordID: string; }) => selectedItem.recordID === contactItem.recordID,
  //       ),
  //   );
  
  //   filteredContacts = filteredContacts.filter(
  //     contactItem =>
  //       !matchedContacts.some(
  //         matchedItem => matchedItem.recordID === contactItem.recordID,
  //       ),
  //   );

    
    
  //    if (filteredContacts.length > 0) {     
  //      setIndicatorValue(indicatorValue + 1);
  //      setUpdatedContact(filteredContacts);
  //    }

  //  } else if (matchedContacts) {
  //    const filteredContacts = contacts.filter(
  //      contactItem =>
  //        !matchedContacts.some(
  //          removeItem => removeItem.recordID === contactItem.recordID,
  //        ),
  //    );
          
  //    if (filteredContacts.length > 0) {
  //      setIndicatorValue(indicatorValue + 1);
  //      setUpdatedContact(filteredContacts);
  //    }
     
     
  //  }
  //  else{
       
  //      setUpdatedContact(contacts);
  //  }
    
  let filteredContacts = contacts;

  if (selectedContacts) {
    
    filteredContacts = filteredContacts.filter(
      contactItem => !selectedContacts.some((selectedItem: { recordID: string; }) => selectedItem.recordID === contactItem.recordID)
    );
  }

  if (matchedContacts) {
    filteredContacts = filteredContacts.filter(
      contactItem => !matchedContacts.some(matchedItem => matchedItem.recordID === contactItem.recordID)
    );
  }

  
  setUpdatedContact(filteredContacts);
    
  }


  // Update Matching Contact List Remove selected contact from matching contact list. 
  const handleMatchingUpdatedContactList = () => {
     
    // Remove Selected Contact from Matching Contact List.
    if (matchedContacts && selectedContacts) {
   
        
      const filteredContacts = matchedContacts.filter(
        contactItem =>
          !selectedContacts.some(
            (removeItem: { recordID: string; }) => removeItem.recordID === contactItem.recordID,
          ),
      );

      if (filteredContacts.length > 0) {
        setIndicatorValue(indicatorValue + 1);
        setMatchingUpdatedContact(filteredContacts);
      }
      
    }
    else{
      setMatchingUpdatedContact(matchedContacts);
    }
     
  
  }


  // Ask Permission for Accessing Contact List
  const handleContactList = async() => {
    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              getContactList();
        } else {
             handleContactList();      
        }
      } 
  };

  // Fetch Contacts From Device.
  const getContactList = () => {
    Contacts.getAll()
      .then(contacts => dispatch(addContact(contacts)))
      .catch(e => {
        console.log(e);
      });  

     
      
  };

  
  
 
  // Search Contact 
  const handleSearch = (text: string) =>{
    if(text){
       const newData = updatedContact.filter((item : Contact)=>{

           const Name = item.givenName ? item.givenName.toUpperCase() : ''.toUpperCase();
           const itemName = Name.replace(/\s/g,'');

           const PhoneNo = item.phoneNumbers[0]?.number ? item.phoneNumbers[0]?.number : ''.toUpperCase(); 
           const itemPhoneNo = PhoneNo.replace(/[()-\s]/g, '');
           const textData = text.replace(/\s/g,'').toUpperCase();
         return itemName.indexOf(textData) > -1 || itemPhoneNo.indexOf(textData) > -1;
       })

             
        setFilteredData(newData);
        setSearchQuery(text);  
    }
    else{
      setFilteredData(updatedContact);
      setSearchQuery(text);
    }
    
    

    if(text){
      const newData = matchingUpdatedContact.filter((item) => {
          const Name = item.givenName ? item.givenName.toUpperCase() : ''.toUpperCase();
          const itemName = Name.replace(/\s/g,'');

          const PhoneNo = item.phoneNumbers[0]?.number ? item.phoneNumbers[0]?.number : ''.toUpperCase();
          const itemPhoneNo = PhoneNo.replace(/[()-\s]/g,'');

          const textData = text.replace(/\s/g,'').toUpperCase();
          return itemName.indexOf(textData) > -1 || itemPhoneNo.indexOf(textData) > -1;
      })
      
      setFilteredMatchingContactData(newData);
      setSearchQuery(text);
    }
    else{
       setFilteredMatchingContactData(matchingUpdatedContact);
       setSearchQuery(text);
    }


  };




  // Select Contact From Contact List
  const handleSelectedContact = (item : Contact) => { 
  
      if (selectedContacts && selectedContacts.some((contact: { recordID: string; }) => contact.recordID === item.recordID)){
         setSelected(isSelected-1);
         dispatch({
          type:'REMOVE_SELECTED_CONTACTS',
          payload:item.recordID
        });
      } 
      else {
       setSelected(isSelected+1);     
       dispatch({
          type: 'ADD_SELECTED_CONTACTS',
          payload:item,
        });
          
      }
  
     setVisible(true);
     setSelectedContact(true);  
  
       
  }

  
  // Set Selected Contact as Guardian
  const handleSetasGuardian = async() =>{
    setUpdated(!isUpdated);
    setVisible(false); 
    setSelectedContact(false);
  
    // Update non-app contact list if selected contacts are from there
    let updatedNonMatchingContacts = updatedContact;
    if (
      selectedContacts.some((contact: { recordID: string; }) =>
        updatedNonMatchingContacts.some(
          item => item.recordID === contact.recordID,
        ),
      )
    ) {
      updatedNonMatchingContacts = updatedNonMatchingContacts.filter(
        contact =>
          !selectedContacts.some(
            (selected: { recordID: string; }) => selected.recordID === contact.recordID,
          ),
      );
      setUpdatedContact(updatedNonMatchingContacts);
    }

    // Update app contact list if selected contacts are from there
    let updatedMatchingContacts = matchingUpdatedContact;
    if (
      selectedContacts.some((contact: { recordID: string; }) =>
        updatedMatchingContacts.some(
          item => item.recordID === contact.recordID,
        ),
      )
    ) {
      updatedMatchingContacts = updatedMatchingContacts.filter(
        contact =>
          !selectedContacts.some(
            (selected: { recordID: string; }) => selected.recordID === contact.recordID,
          ),
      );
      setMatchingUpdatedContact(updatedMatchingContacts);
    }




    let emergencyContactList: Contact[] = [];

    selectedContacts.forEach((item: Contact) => {
         emergencyContactList.push(item);
    })
  
    const response = await instance.post('/emergencyContact', {emergencyContactList,userId});

    if(response.status === 201){
        sendNotification();
    }
    else{
       console.log("something went to wrong");
       
    }

     
    
    
  }


  // Send Notification When User Set Selected Contact as Guardian
  const sendNotification = async() => {
  
  
    let selectedUserId = [];
    let tokenMapping = [];
    
    for(const contact of selectedContacts){ 
      if(contact.userId){
         selectedUserId.push(contact.userId);
      }
    }

    
     
    for(let i=0; i < selectedUserId.length; i++){
      const userId = selectedUserId[i];
      console.log("-------",userId);
      
      const response = await instance.post('/fetchUserDetails' , {userId});

      const {userData} = await response.data;
      console.log("userData" , userData);
      tokenMapping.push({notificationToken:userData.notificationToken , userId:userId});
    }

    console.log("=========" , tokenMapping);
    

    for(let i=0; i < tokenMapping.length; i++){
        let  notifyToken = tokenMapping[i].notificationToken;
        console.log(notifyToken);
        
        const title = 'Emergency Contact Set';
        const body = 'You have been designated as an emergency contact by ';
        const response = await instance.post('/sendNotificationEmergencyContact' , {notifyToken , userName, title , body});

              if(response.status === 200){  
                    let userId = tokenMapping[i].userId;
                    let senderName = userName;
                    const response = await instance.post('/saveEmergencyContactNotification' , {
                    userId , senderName});

                    if(response.status === 200){
                        console.log("notifcation saved successfully");
                    }
                    else{
                       console.log("fail to saved notification");
                    }

                    console.log("notification send successfully");
      
              }
              else{
                 console.log("fail notification");
                 
              }


    }
  }

  // Delete Selected Contact
  const handleDeleteSelectedContact = async(contact: Contact) => {
    console.log("=======" , contact);   
    dispatchStore(removeSelectedContact(userId, contact));
    
    
    
     // Filter out the deleted contact from the unselected contacts
     const unselectedContacts = contacts.filter(item => item.recordID !== contact.recordID); 
    dispatch(addContact(unselectedContacts));
    
    setUpdated(!isUpdated);
    
  }


 
  return (
    <View style={styles.mainContainer}>
      <CustomHeader name="Contact List" icon={''} 
          backIcon={'keyboard-backspace'}
          backCall={() => navigation.navigate('TabNavigator')}/>

      {/* Search Bar */}
      <Searchbar
        placeholder="Search name or phone number"
        placeholderTextColor={'gray'}
        onChangeText={text => handleSearch(text)}
        value={searchQuery}
        style={styles.searchBar}
        elevation={1}
      />

      {
          contacts.length === 0 && 
            <View style={{marginTop:20 , flex:1 , alignItems:'center'}}>
                <Text style={{fontSize:30}}>No Contacts</Text>
            </View>
      }  
    
      {/* Selected Contacts list */}
      <View>
        { isVisible===false && selectedContacts.length > 0  && (
          <View style={styles.guardiansView}>
            <Text style={styles.guardiansText}>Guardians</Text>

            <ScrollView horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={{paddingRight:17}}>
              <>{
                 selectedContacts && selectedContacts.map((item: Contact , key: any) => {
                  return (
                    <View style={styles.selectedContactView} key={key}>
                      <View style={styles.placeHolder}>
                        <Text style={styles.placeHolderText}>
                          {item.givenName && item.givenName.length > 0 ? item.givenName[0] : ''}
                        </Text>
                      </View>
                      <View style={styles.selectedContactNameView}>
                        <Text style={styles.selectedContactName}>
                          {item.givenName}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.closeIcon} onPress={() => handleDeleteSelectedContact(item)}>
                        <Icon name="close" size={20} color={'white'} />
                      </TouchableOpacity>
                    </View>
                  );})
              }
              </>

              
            </ScrollView>
          </View>
        )}
      </View>


     <ScrollView
        showsVerticalScrollIndicator={false}
        style={{marginTop:10}}> 
      
      {
          matchingUpdatedContact.length > 0 &&  <>
          <SectionList title={'App Contacts'} borderColor={'lightpink'} />
          <ScrollView
             showsVerticalScrollIndicator={false}
             style={{paddingTop: 20, paddingLeft: 12, paddingRight: 12}}>
             {
                // Search Matching Contact item from Search Bar.
                filteredMatchingContactData.length > 0 ? filteredMatchingContactData.map((item,key) => {
                  return (
                    <MatchingContact
                      contact={item}
                      key={key}
                      isSelected={(isSelectedContact === true && selectedContacts.some(
                        (contact: { recordID: any; }) => contact.recordID === item.recordID,
                      ))}
                      handleMatchingSelected={() => {handleSelectedContact(item)}}
                    />
                  );
                })
                 
                :
                 matchingUpdatedContact  && matchingUpdatedContact.map((item , key) => {
                   return (
                     <MatchingContact
                       contact={item}
                       key={key}
                       isSelected={
                         isSelectedContact === true && selectedContacts &&
                         selectedContacts.some(
                           (contact: { recordID: string; }) => contact.recordID === item.recordID,
                         )
                       }
                       handleMatchingSelected={() => {handleSelectedContact(item)}}
                     />
                   );
                 })
                 
             }  
                     
          </ScrollView>
          </>  
      }  


      <View>
         
     {/* Contact List */}
     {
         updatedContact.length > 0 && 
         <>
          
          <SectionList title={'Non App Contacts'} borderColor={'lightpink'} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 30}}
            style={{paddingTop: 20, paddingLeft: 12, paddingRight: 12}}>
           {  
        
            // Select Contact through searchbar  
            filteredData.length > 0 ? filteredData.map((item,key) => {
              return (
                <Contact
                  contact={item}
                  key={key}
                  isSelected={(isSelectedContact === true && selectedContacts && selectedContacts.some(
                    (contact: { recordID: string; }) => contact.recordID === item.recordID,
                  ))}
                  handleSelected={() => handleSelectedContact(item)}
                />
              );
            })
            :
   
            updatedContact.map((item , key) => {
               return(
                 <Contact 
                   key={key} 
                   contact={item} 
                   isSelected={(isSelectedContact === true && selectedContacts.some(
                     (contact: { recordID: string; }) => contact.recordID === item.recordID,
                  ))} 
                   handleSelected={() => handleSelectedContact(item)}     
                 />           
               );
            })

  
        }
      </ScrollView>
         
         </>
     }
     

       

      </View>

      </ScrollView> 
     

     {/* Selected Contact List */}
      { (selectedContacts && isVisible && isSelected > 0) && (
        <TouchableOpacity
          style={styles.guardiansBtnView} onPress={() => handleSetasGuardian()}>
          <View style={styles.guardiansBtn}>
            <Text style={styles.btnText}> Set as Guardians </Text>
            <Icon name="check-circle" size={28} color={'white'} />
          </View>
        </TouchableOpacity>
      )}
    
    
    </View>
  );
};


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    searchBar: {
        padding: 1,
        backgroundColor: 'white',
        marginLeft: 15,
        marginRight: 15,
        marginTop: 15,
    },
    guardiansBtnView:{
        marginBottom:40,
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        bottom:0,
        left:0,
        right:0,
    },
    guardiansBtn:{
        backgroundColor:'#3ebb6e',
        padding:10,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:25,
        flexDirection:'row'
    },
    btnText:{
        color:'white',
        fontSize:20,
    },
    guardiansView:{
        marginTop: 15,
        marginLeft: 17,
        backgroundColor:'white',
        marginRight:17,
        paddingTop:10,
        paddingBottom:10,
        borderRadius:20,
        overflow:'hidden',
        elevation:5,
    },
    guardiansText:{
        paddingLeft: 10,
        fontSize: 20,
        color: 'black',
        fontWeight: '700',
    },
    selectedContactView:{
        marginTop: 10,
        marginLeft:17,
        alignItems:'center', 
        justifyContent:'center',
    },
    placeHolder:{
        width: 55,
        height: 55,
        borderRadius: 30,
        overflow: 'hidden',
        backgroundColor: '#d9d9d9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeHolderText:{
        fontSize: 30, 
        color: 'black'
    },
    selectedContactNameView:{
        marginTop:2,
        alignItems:'center' , 
        justifyContent:'center'
    },
    selectedContactName:{
        color:'black' , 
        fontSize:17
    },
    closeIcon:{
        top:-2, 
        right:-6, 
        position: 'absolute' , 
        backgroundColor:'red' , 
        borderRadius:20, 
        borderColor:'white' , 
        borderWidth:1
    }

});
  


export default EmergencyContactListScreen;
export const dispatchStore = store.dispatch as typeof store.dispatch | Dispatch<any>
