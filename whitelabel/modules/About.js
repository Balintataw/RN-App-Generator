// ./modules/About.js
import React from 'react';
import { Text, View } from 'react-native';

const styles = require('../themes')('Module');

const AboutComponent = () => (
    <View style={styles.container}>
      <Text style={styles.text}>
        Module <Text style={styles.accent}>About</Text>
      </Text>
    </View>
);
export default {
    name: 'About',
    Component: AboutComponent,
};