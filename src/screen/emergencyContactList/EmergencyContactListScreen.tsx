import React,{useEffect , useState} from 'react';
import { Text, View, StyleSheet, Platform, PermissionsAndroid, FlatList, ScrollView, TouchableOpacity ,ActivityIndicator} from 'react-native';
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
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';





interface Contact {
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
}



const EmergencyContactListScreen:React.FC<EmergencyContactListScreenProps> = ({}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<Contact[]>([]);
  const [filteredMatchingContactData , setFilteredMatchingContactData] = useState([]);
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

  const selectedContacts = useSelector((state : EmergencyContactListScreenProps) => state.selectedContacts);
  const contacts = useSelector((state : EmergencyContactListScreenProps) => state.contacts.contacts);
  const matchedContacts = useSelector((state : EmergencyContactListScreenProps) => state.contacts.matchingContacts);
  const userName  = useSelector((state : RootState) => state.userProfile.userName);
  const token = useSelector((state : any) => state.userProfile.token);
  


  useEffect(() => {   
       if (contacts.length > 0) {
       } else {
         handleContactList();
       }
  });


 

  useEffect(() => {  
    handleUpdateContactList();
    handleMatchingUpdatedContactList();
  },[!isUpdated]);
 
  useEffect(() => {
     dispatch(addMatchingContacts(userId,contacts,token)); 
  } , [contacts]);



  const handleUpdateContactList = () => {
    const filteredContacts = contacts.filter((contactItem) =>
    !matchedContacts.some(removeItem => removeItem.recordID === contactItem.recordID) &&
    !selectedContacts.some(removeItem => removeItem.recordID === contactItem.recordID)
    );

    
    if(filteredContacts.length > 0){
      setIndicatorValue(indicatorValue+1);
      setUpdatedContact(filteredContacts);  
    }
  
  }

  const handleMatchingUpdatedContactList = () => {
    console.log(matchedContacts);
    
    const filteredContacts = matchedContacts.filter((contactItem) =>
       !selectedContacts.some(removeItem => removeItem.recordID === contactItem.recordID)
    );

    
    if(filteredContacts.length > 0){
       setIndicatorValue(indicatorValue+1);
       setMatchingUpdatedContact(filteredContacts);   
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
   
      if (selectedContacts.some((selectedItem) => selectedItem.recordID === item.recordID)) {
         setSelected(isSelected-1);
         dispatch({
          type:'REMOVE_SELECTED_CONTACTS',
          payload:item.recordID
        });
      } else {
        setSelected(isSelected+1);
       dispatch({
          type: 'ADD_SELECTED_CONTACTS',
          payload:item,
        });
      }
    
  
    
    setVisible(true);
    setSelectedContact(true); 
  
       
  }

  // Select Contact From Matching Contact List
  const handleMatchingContactSelect = (item : Contact) => {
    if (selectedContacts.some((contact) => contact.recordID === item.recordID)) {
      setSelected(isSelected-1);
      dispatch({
        type:'REMOVE_SELECTED_CONTACTS',
        payload:item.recordID
      });
    } else {
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
    const updatedContact = contacts.filter((contact: { recordID: string; }) => 
                          !selectedContacts.some(selectedContact => 
                          selectedContact.recordID === contact.recordID));  
                          
                          
    dispatch(addContact(updatedContact));
  
    
    let emergencyContactList: Contact[] = [];

    selectedContacts.forEach((item) => {
         emergencyContactList.push(item);
    })
  
    const response = await axios.post('http://10.0.2.2:3000/emergencyContact', {
      emergencyContactList,
      userId
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });

    if(response){
        sendNotification();
    }

     
    
    
  }


  // Send Notification When User Set Selected Contact as Guardian
  const sendNotification = async() => {
  
  
    let selectedUserId = [];
    let tokenMapping = [];
    for(const contact of selectedContacts){ 
        if(contact.notificationToken){
           selectedUserId.push(contact.notificationToken);
        }
    }

    
    for(let i=0; i < selectedUserId.length; i++){
      const userId = selectedUserId[i];
      const response = await axios.post('http://10.0.2.2:3000/fetchUserDetails' , {
          userId,},{
          headers:{
            'Content-Type':'application/json',
             Authorization: `Bearer ${token}`,
          },
      });

      const data  = await response.data;
      tokenMapping.push({notificationToken:data.notificationToken , userId:userId});
    }

    for(let i=0; i < tokenMapping.length; i++){
        let  notifyToken = tokenMapping[i].notificationToken;
        console.log(notifyToken);
      
        const response = await axios.post('http://10.0.2.2:3000/sendNotificationEmergencyContact' , {
              notifyToken},{
                    headers:{
                      'Content-Type':'application/json',
                      Authorization: `Bearer ${token}`,
                    },
              });

              if(response.status === 200){  
                    let userId = tokenMapping[i].userId;
                    let senderName = userName;
                    const response = await axios.post('http://10.0.2.2:3000/saveEmergencyContactNotification' , {
                    userId , senderName},{
                          headers:{
                            'Content-Type':'application/json',
                            Authorization: `Bearer ${token}`,
                          },
                    });

                    if(response.status === 200){
                        console.log("notifcation saved successfully");
                    }

                    console.log("notification send successfully");
      
              }


    }
  }

  // Delete Selected Contact
  const handleDeleteSelectedContact = async(contact: Contact) => {
      
    dispatch(removeSelectedContact(userId, contact, token));
    const unselectedContacts = contacts.filter(
      (item: { recordID: string }) => item.recordID !== contact.recordID
    );
    dispatch(addContact(unselectedContacts));
    setUpdated(!isUpdated);
    
  }


 
  return (
    <View style={styles.mainContainer}>
      <CustomHeader name="Contact List" icon={''} />

      {/* Search Bar */}
      <Searchbar
        placeholder="Search name or phone number"
        placeholderTextColor={'gray'}
        onChangeText={text => handleSearch(text)}
        value={searchQuery}
        style={styles.searchBar}
        elevation={1}
      />


      {/* Selected Contacts list */}
      <View>
        { isVisible===false && selectedContacts.length > 0 && (
          <View style={styles.guardiansView}>
            <Text style={styles.guardiansText}>Guardians</Text>

            <ScrollView horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={{paddingRight:17}}>
              <>{
                 selectedContacts.map((item , key) => {
                  return (
                    <View style={styles.selectedContactView}>
                      <View style={styles.placeHolder}>
                        <Text style={styles.placeHolderText}>
                          {item.givenName[0]}
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
          matchedContacts.length > 0 &&  <>
          <SectionList title={'Matched Contacts'} borderColor={'lightpink'} />
          <ScrollView
             showsVerticalScrollIndicator={false}
             style={{paddingTop: 20, paddingLeft: 12, paddingRight: 12}}>
             {
                
                filteredMatchingContactData.length > 0 ? filteredMatchingContactData.map((item,key) => {
                  return (
                    <MatchingContact
                      contact={item}
                      key={key}
                      isSelected={(isSelectedContact === true && selectedContacts.some(
                        contact => contact.recordID === item.recordID,
                      ))}
                      handleMatchingSelected={() => {handleMatchingContactSelect(item)}}
                    />
                  );
                })
              
                :
                 matchingUpdatedContact.length > 0  && matchingUpdatedContact.map((item , key) => {
                   return (
                     <MatchingContact
                       contact={item}
                       key={key}
                       isSelected={
                         isSelectedContact === true &&
                         selectedContacts.some(
                           contact => contact.recordID === item.recordID,
                         )
                       }
                       handleMatchingSelected={() => {handleMatchingContactSelect(item)}}
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
         contacts.length > 0 && 
         <>
          
          <SectionList title={'No App Contacts'} borderColor={'lightpink'} />
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
                  isSelected={(isSelectedContact === true && selectedContacts.some(
                    contact => contact.recordID === item.recordID,
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
                   isSelected={selectedContacts.some((selectedItem) => selectedItem.recordID === item.recordID)} 
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
      { (selectedContacts.length > 0 && isVisible && isSelected > 0) && (
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

