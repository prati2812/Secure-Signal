import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface MatchedContactProps {}

const MatchedContact = (props: MatchedContactProps) => {
  return (
    <View style={styles.container}>
      <Text>MatchedContact</Text>
    </View>
  );
};

export default MatchedContact;

const styles = StyleSheet.create({
  container: {}
});
