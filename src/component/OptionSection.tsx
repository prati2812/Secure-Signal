import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

interface OptionSelectionProps {
   title?:string,
   onPress?:any,
   onSelect?:any,
   selected?:boolean,
}

const OptionSelection:React.FC<OptionSelectionProps> = ({title , onPress , onSelect , selected}) => {
  
  const handlePress = ()=> {
      onSelect(title);
  }

  return (

    
    <TouchableOpacity style={[style.editProfileButton , selected && {backgroundColor:'#3ebb6e'}]} onPress={handlePress}>
            <View style={style.editProfileButtonContent}>
              <Text style={[style.editProfileButtonText , selected && {color:'white'}]}>{title}</Text>
            </View>
    </TouchableOpacity>
  );
};

export default OptionSelection;

const style = StyleSheet.create({
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

});
