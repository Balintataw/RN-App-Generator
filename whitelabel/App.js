import React from 'react';
import { SafeAreaView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Navigator from './routes/index';

const theme = require('./themes')('App');

// possibly dont need to rebuild stylesheet. require seems to be enough
// EStyleSheet.build(theme);

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
})

export default () => (
    <SafeAreaView style={styles.container}>
        <Navigator onNavigationStateChange={null}/>
    </SafeAreaView>
);