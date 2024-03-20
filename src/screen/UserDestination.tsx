import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface UserDestinationProps {}

const UserDestination = (props: UserDestinationProps) => {
  return (
    <View style={styles.container}>
      <Text>UserDestination</Text>
    </View>
  );
};


const styles = StyleSheet.create({
    container: {}
});

export default UserDestination;


