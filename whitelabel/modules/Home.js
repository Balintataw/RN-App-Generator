import React from 'react';
import { Text, View, Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '$primaryColor'
    },
    text: {
        color: '$primaryText',
        fontSize: 22,
        textAlign: 'center',
        marginTop: 25
    },
    accent: {
        color: '$accentColor',
        fontWeight: 'bold',
        fontSize: 22
    },
});

const HomeComponent = () => (
    <View style={styles.container}>
        <Image source={require('../src/assets/images/joss-icon.png')} style={{height:175, width:175}} />
        <View style={styles.textContainer}>
            <Text style={styles.text}>
                Jossendal <Text style={styles.accent}>Development</Text>
            </Text>
            <Text style={styles.text}>
                The <Text style={styles.accent}>Las Vegas</Text> valleys' leading software solutions specialist. 
            </Text>
        </View>
    </View>
);
export default {
    name: 'Home',
    Component: HomeComponent,
};