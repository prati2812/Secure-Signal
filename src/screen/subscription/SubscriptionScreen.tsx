import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface subscriptionScreenProps {}

const subscriptionScreen = (props: subscriptionScreenProps) => {
  return (
    <View style={styles.container}>
      <Text>subscriptionScreen</Text>
    </View>
  );
};

export default subscriptionScreen;

const styles = StyleSheet.create({
  container: {}
});
