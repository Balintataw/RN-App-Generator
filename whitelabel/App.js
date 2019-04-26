import React from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Navigator from './routes/index';

import modules from './modules';

const theme = require('./themes')('App');

EStyleSheet.build(theme);
    // { // always call EStyleSheet.build() even if you don't use global variables!
//   $textColor: '#0275d8'
// }
// );
const styles = EStyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
})

export default () => (
    <SafeAreaView style={styles.container}>

      {/* <Text style={styles.title}>
        White-Label App
      </Text>
      <View style={styles.container}> */}
        {/* {modules.map(({ name, Component }) =>
            <Component key={name} />
        )} */}
        <Navigator onNavigationStateChange={null}/>
      {/* </View> */}
    </SafeAreaView>
);