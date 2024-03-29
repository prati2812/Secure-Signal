import React,{useEffect , useState} from 'react';
import { Text, View, StyleSheet, Platform, PermissionsAndroid, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import CustomHeader from '../../component/CustomHeader';
import { Searchbar } from 'react-native-paper';
import Contacts  from 'react-native-contacts';
import Contact from '../../component/Contact';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { addSelectedContact, removeSelectedContact } from '../../redux/contacts/action';

interface Contact {
  recordID: string;
  givenName: string;
  phoneNumbers: { number: string }[];
}

interface EmergencyContactListScreenProps {
  selectedContacts: Contact[];
  addSelectedContact: (contact: Contact) => void;
  removeSelectedContact: (recordID: string) => void;
}

const EmergencyContactListScreen:React.FC<EmergencyContactListScreenProps> = ({selectedContacts, addSelectedContact , removeSelectedContact}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<Contact[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isVisible, setVisible] = useState(false);
  const [isSelectedContact , setSelectedContact] = useState(false);

  useEffect(() => {
       handleContactList();
  },[]);

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


  const getContactList = () => {
    Contacts.getAll()
      .then(contacts => {
          setContacts(contacts);
      })
      .catch(e => {
        console.log(e);
      }); 
  };

 
  const handleSearch = (text: string) =>{
    if(text){
       const newData = contacts.filter((item)=>{

           const Name = item.givenName ? item.givenName.toUpperCase() : ''.toUpperCase();
           const itemName = Name.replace(/\s/g,'');

           const PhoneNo = item.phoneNumbers[0]?.number ? item.phoneNumbers[0]?.number : ''.toUpperCase(); 
           const itemPhoneNo = PhoneNo.replace(/[()-\s]/g, '');
           const textData = text.replace(/\s/g,'').toUpperCase();
         return itemName.indexOf(textData) > -1 || itemPhoneNo.indexOf(textData) > - 1;
       })

       setFilteredData(newData);
       setSearchQuery(text);
    }
    else{
      setFilteredData(contacts);
       setSearchQuery(text);
    }   

  };

  const handleSelected = (item : Contact) => {
   

    const isSelected = selectedContacts.some((contact) => contact.recordID === item.recordID);
    if (isSelected) {
      console.log("isSelected", isSelected);
       
      removeSelectedContact(item.recordID);
      console.log("datttaaaa" , item);
      
    } else {
      console.log("isSelected" , isSelected);
      addSelectedContact(item);
      console.log("addd Item" , item);
      
    }
   
    setVisible(true);
    console.log("final data" , selectedContacts);
    setSelectedContact(true);
    
      
  }


  const handleSetasGuardian = () =>{
    setVisible(!isVisible); 
    setSelectedContact(false);
  }


  
 
  return (
    <View style={styles.mainContainer}>
      <CustomHeader name="Contact List" icon={''} />
      <Searchbar
        placeholder="Search name or phone number"
        placeholderTextColor={'gray'}
        onChangeText={text => handleSearch(text)}
        value={searchQuery}
        style={styles.searchBar}
        elevation={1}
      />

      <View>
        { isVisible===false && selectedContacts.length > 0 && (
          <View style={styles.guardiansView}>
            <Text style={styles.guardiansText}>Guardians</Text>

            <ScrollView horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={{paddingRight:17}}>
              <>{
                 selectedContacts.map((item) => {
                  return(
                  <View style={styles.selectedContactView}>
                  <View style={styles.placeHolder}>
                    <Text style={styles.placeHolderText}>{item.givenName[0]}</Text>
                  </View>
                  <View style={styles.selectedContactNameView}>
                    <Text style={styles.selectedContactName}>{item.givenName}</Text>
                  </View>
                </View> 
                 )})
              }
              </>

              
            </ScrollView>
          </View>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 30}}
        style={{paddingTop: 20, paddingLeft: 12, paddingRight: 12}}>
        {filteredData.length > 0
          ? filteredData.map(item => {
              return (
                <Contact
                  contact={item}
                  isSelected={(isSelectedContact === true && selectedContacts.some(
                    contact => contact.recordID === item.recordID,
                  ))}
                  handleSelected={() => handleSelected(item)}
                />
              );
            })
          : contacts.map(item => {
              return (
                <Contact
                  contact={item}
                  isSelected={(isSelectedContact === true && selectedContacts.some(
                    contact => contact.recordID === item.recordID,
                  ))}
                  handleSelected={() => handleSelected(item)}
                />
              );
            })}
      </ScrollView>
      { (selectedContacts.length > 0 && isVisible) && (
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
    }

});
  
const mapStateToProps = (state: { selectedContacts: any; }) => ({
  selectedContacts: state.selectedContacts,
});

const mapDispatchToProps = {
  addSelectedContact,
  removeSelectedContact,
};
export default connect(mapStateToProps, mapDispatchToProps)(EmergencyContactListScreen);

