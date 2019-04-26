// this file to be imported on generation if bottom tabs layout selected
import React from 'react';
import { Easing, Animated } from 'react-native';
import { createAppContainer, createSwitchNavigator, createBottomTabNavigator, } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EStyleSheet from 'react-native-extended-stylesheet';

import modules from '../modules'

const styles = require('../themes')('App');

const appStackConfig = {}
modules.forEach(({name, Component}) => {
    appStackConfig[name] = {
        screen: Component,
        // navigationOptions: {
        //     header: () => null
        // }

    }
})

const transitionConfig = () => {
    return {
        transitionSpec: {
            duration: 750,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },
        /* slide screen from right */
        // screenInterpolator: sceneProps => {      
        //     const { layout, position, scene } = sceneProps
    
        //     const thisSceneIndex = scene.index
        //     const width = layout.initWidth
    
                // for right slide in transition
        //     const translateX = position.interpolate({
        //         inputRange: [thisSceneIndex - 1, thisSceneIndex],
        //         outputRange: [width, 0],
        //     })
                // for left slide in transition
        //     const translateX = position.interpolate({
        //         inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
        //         outputRange: [-width, 0],
        //     })
    
        //     return { transform: [ { translateX } ] }
        // },

        /* fades screen transition */
        screenInterpolator: sceneProps => {      
            const { position, scene } = sceneProps;
    
            const thisSceneIndex = scene.index;
    
            const opacity = position.interpolate({
                // takes screen index and translates it into a useable opacity value 
                inputRange: [thisSceneIndex - 1, thisSceneIndex],
                outputRange: [0, 1],
            });
    
            return { opacity }; 
        },
    }
};

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

const TabNavigator = createBottomTabNavigator(
    {...appStackConfig},
    {
        defaultNavigationOptions: ({ navigation }) => ({
          tabBarIcon: ({ focused, horizontal, tintColor }) => {
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
        tabBarOptions: {
            activeTintColor: EStyleSheet.value('$primaryText'),
            activeBackgroundColor: EStyleSheet.value('$accentColor'),
            inactiveTintColor: EStyleSheet.value('$accentColor'),
            inactiveBackgroundColor: EStyleSheet.value('$primaryText'),
            showIcon: true,
            labelStyle: {
                fontSize: 12,
            },
            style: {
                backgroundColor: 'blue',
            },
        },
    }
);
  
export default createAppContainer(TabNavigator);
