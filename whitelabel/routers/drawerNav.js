import React from 'react';
import { createAppContainer, createSwitchNavigator, createDrawerNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EStyleSheet from 'react-native-extended-stylesheet';

import modules from '../modules'

const styles = require('../themes')('App');

const appStackConfig = {}
modules.forEach(({name, Component}) => {
    if(name === 'Auth') {
        // will need to take special handling with Auth module and create an authStack
    }
    appStackConfig[name] = {
        screen: Component,
        navigationOptions: {
            drawerLabel: name,
        }
    }
})

// const AuthStack = createSwitchNavigator(
//     {
//         Login: {
//             screen: Login
//         },
//     },
//     {
//         mode: 'modal',
//         headerMode: 'none',
//         // cardStyle: { paddingTop: StatusBar.currentHeight },
//         defaultNavigationOptions: {
//         }
//     }
// );

// const AppNavigator = createSwitchNavigator(
//     {
//         AuthLoading: Loading,
//         Auth: {
//             screen: AuthStack
//         },
//         App: {
//             screen: AppStack
//         }
//     },
//     {
//         initialRouteName: 'AuthLoading',
//     }
// );

const DrawerNavigator = createDrawerNavigator(
    { ...appStackConfig },
    {
        defaultNavigationOptions: ({ navigation }) => ({
          drawerIcon: ({ focused, horizontal, tintColor }) => {
            const { routeName } = navigation.state;
            let IconComponent = Ionicons;
            let iconName;
            if (routeName === 'Home') {
              iconName = `ios-home`;
              // Sometimes we want to add badges to some icons. 
              // You can check the implementation below.
            //   IconComponent = HomeIconWithBadge; 
            } else if (routeName === 'About') {
              iconName = `ios-information-circle${focused ? '' : '-outline'}`;
            } else if (routeName === 'Contact') {
              iconName = `ios-contact`;
            }
    
            // You can return any component that you like here!
            return <IconComponent name={iconName} size={25} color={tintColor} />;
          },
        }),
        initialRouteName: 'Home' || modules[0].name
    }
);
  
export default createAppContainer(DrawerNavigator);
