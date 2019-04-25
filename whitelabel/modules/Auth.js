import React from 'react';
import { Text, View } from 'react-native';

const styles = require('../themes')('Module');

const AuthComponent = () => (
    <View style={styles.container}>
      <Text style={styles.text}>
        Module <Text style={styles.accent}>Auth</Text>
      </Text>
    </View>
);
export default {
    name: 'Auth',
    Component: AuthComponent,
};