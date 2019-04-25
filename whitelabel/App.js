import React from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import Navigator from './routes/index';

import modules from './modules';


const styles = require('./themes')('App');

export default () => (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        White-Label App
      </Text>
      <View style={styles.container}>
        {/* {modules.map(({ name, Component }) =>
            <Component key={name} />
        )} */}
      <Navigator onNavigationStateChange={null}/>
      </View>
    </SafeAreaView>
);