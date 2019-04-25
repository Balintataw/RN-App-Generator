import React from 'react';
import { Text, View } from 'react-native';

const styles = require('../themes')('Module');

const HomeComponent = () => (
    <View style={styles.container}>
      <Text style={styles.text}>
        Module <Text style={styles.accent}>Home</Text>
      </Text>
    </View>
);
export default {
    name: 'Home',
    Component: HomeComponent,
};