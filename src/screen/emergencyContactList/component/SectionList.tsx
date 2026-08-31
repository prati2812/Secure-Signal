import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface SectionListProps {
    title:string,
    borderColor:string,
}

const SectionList : React.FC<SectionListProps> = ({title , borderColor}) => {
  return (
    <View style={[styles.container , {borderColor:`${borderColor}`}]}>
        <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
        marginLeft:20,
        marginRight:20,

    },
    sectionTitle:{
        fontSize:18,
        padding:10,
        color:'black',
        fontWeight:'700',

    }
});


export default SectionList;

