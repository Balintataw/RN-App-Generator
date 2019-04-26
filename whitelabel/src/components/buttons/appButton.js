import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import styles from './styles';

const AppButton = props => (
    <TouchableOpacity onPress={() => {props.handlePress()}}>
        <View style={styles.appButtonContainer}>
            <Text style={styles.appButtonText}>{props.text}</Text>
        </View>
    </TouchableOpacity>
);

export default AppButton;