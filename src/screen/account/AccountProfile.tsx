import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface AccountProfileProps {}

const AccountProfile = (props: AccountProfileProps) => {
  return (
    <View style={styles.container}>
      <Text>AccountProfile</Text>
    </View>
  );
};


const styles = StyleSheet.create({
    container: {}
});
  
export default AccountProfile;

