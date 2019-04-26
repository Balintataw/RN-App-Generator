import React from 'react';
import { Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import { AppTextInput } from '../src/components/inputs';
import { AppButton } from '../src/components/buttons';

const styles =  EStyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '$primaryColor'
    },
    text: {
        color: '$primaryText',
        fontSize: 22,
        textAlign: 'center'
    },
    accent: {
        color: '$accentColor',
        fontWeight: 'bold',
        fontSize: 22
    },
});

class AuthComponent extends React.Component {
    state = {
        email: '',
        password: ''
    };
    onChangeText = (key, value) => {
        this.setState({ [key]: value });
    };
    handleButtonPress = () => {
        alert(JSON.stringify(this.state))
    };
    render() {
        return (
        <View style={styles.container}>
            <Text style={styles.accent}>Sign In</Text>
            <AppTextInput 
                value={this.state.email}
                placeholderColor={EStyleSheet.value('$primaryText')}
                handleChangeText={(val) => this.onChangeText('email', val)} 
                placeholder="Email" />
            <AppTextInput 
                secure
                placeholderColor={EStyleSheet.value('$primaryText')}
                value={this.state.password}
                handleChangeText={(val) => this.onChangeText('password', val)} 
                placeholder="Password" />
            <AppButton
                text="Click Me"
                handlePress={this.handleButtonPress}
                nav={this.props.navigation} />
        </View>
        )
    }
}
export default {
    name: 'Auth',
    Component: AuthComponent,
};