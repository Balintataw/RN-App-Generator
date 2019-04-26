import React from 'react';
import { TextInput } from 'react-native';

import styles from './styles'

const AppTextInput = props => (
    <TextInput
        secureTextEntry={props.secure ? true : false}
        style={styles.textInput}
        autoCapitalize="none"
        placeholder={props.placeholder}
        placeholderTextColor={props.placeholderColor}
        onChangeText={(val) => props.handleChangeText(val)}
        value={props.value}
    />
);

export default AppTextInput;
