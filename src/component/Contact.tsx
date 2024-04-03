import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ContactRoot {
  recordID: string;
  givenName: string;
  phoneNumbers: { number: string }[];
}


interface ContactProps{
     contact:ContactRoot;
     isSelected:boolean;
     handleSelected:Function;
}
const Contact:React.FC<ContactProps> = ({contact , isSelected , handleSelected}) => {
  return (
     
    <Pressable onLongPress={() => handleSelected(contact)}>
      <View style={[styles.contactContainer]}>
        {
          isSelected ?
          <View style={[styles.placeholder , isSelected && styles.isSelected]}>
                 <Icon name="check" size={35} color={'black'} />     
          </View>
          :
          <View style={styles.placeholder}>
          <Text style={styles.txt}>{contact.givenName[0]}</Text>
        </View>

        }
        

        <View style={styles.contactDetails}>
          <Text style={styles.contactName}>{contact?.givenName}</Text>
          <Text style={styles.contactNumber}>
            {contact.phoneNumbers[0]?.number}
          </Text>
        </View>
      </View>
    </Pressable>
    
  );
};
const styles = StyleSheet.create({
  contactContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    gap: 5,
    borderRadius:25,
    elevation:5,
    overflow:'hidden',
    marginBottom:10,
    marginLeft:10,
    marginRight:10,
    padding:10,
    borderColor:'lightblue',
    borderWidth:2,
  },
  placeholder: {
    width: 55,
    height: 55,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#d9d9d9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    fontSize: 30,
    color:'black',
  },
  contactDetails: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 5,
  },
  contactName: {
    color:'black',
    fontSize: 22,
  },
  contactNumber: {
    color: '#888',
    fontWeight:'600',
  },
  isSelected:{
    backgroundColor:'lightblue',
  }
});
export default Contact;