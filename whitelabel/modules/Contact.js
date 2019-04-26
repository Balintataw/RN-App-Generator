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

class ContactComponent extends React.Component {
    state = {
        name: '',
        email: ''
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
            <Text style={styles.accent}>Contact Us</Text>
            <AppTextInput 
                value={this.state.name}
                placeholderColor={EStyleSheet.value('$primaryText')}
                handleChangeText={(val) => this.onChangeText('name', val)} 
                placeholder="Name" />
            <AppTextInput 
                value={this.state.email}
                placeholderColor={EStyleSheet.value('$primaryText')}
                handleChangeText={(val) => this.onChangeText('email', val)} 
                placeholder="Email" />
            <AppButton
                text="Click Me"
                handlePress={this.handleButtonPress}
                nav={this.props.navigation} />
        </View>
        )
    }
};
export default {
    name: 'Contact',
    Component: ContactComponent,
};