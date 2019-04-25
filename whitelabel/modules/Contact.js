// ./modules/Contact.js
import React from 'react';
import { Text, View } from 'react-native';

const styles = require('../themes')('Module');

const ContactComponent = () => (
    <View style={styles.container}>
      <Text style={styles.text}>
        Module <Text style={styles.accent}>Contact</Text>
      </Text>
    </View>
);
export default {
    name: 'Contact',
    Component: ContactComponent,
};