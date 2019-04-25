import React from 'react';
import { StatusBar, Easing, Animated } from 'react-native';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';

import modules from '../modules'

    const appStackConfig = {}
    modules.forEach(({name, Component}) => {
        appStackConfig[name] = {
            screen: Component,
            navigationOptions: {
                header: () => null
            }

        }
        // a[name] = {
        //     screen: Component,
        //     navigationOptions: {
        //         header: () => null
        //     }
        // }
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

const AppStack = createStackNavigator(
        {...appStackConfig}, 
        {
            mode: 'modal',
            headerMode: 'screen',
            cardStyle: { paddingTop: StatusBar.currentHeight },
            initialRouteName: 'Home',
            transitionConfig,
        }
);
// const AppStack = createStackNavigator(
//     {
//         Home: {
//             screen: Home,
//             navigationOptions: {
//                 header: () => null
//             }
//         },
//         Breathe: {
//             screen: Breather,
//             navigationOptions: {
//                 header: () => null
//             }
//         },
//         Audio: {
//             screen: Audio,
//             // screen: PlayerScreen,
//             navigationOptions: {
//                 header: () => null
//             }
//         }
//     },
//     {
//         // mode: 'modal',
//         // headerMode: 'screen',
//         // cardStyle: { paddingTop: StatusBar.currentHeight },
//         initialRouteName: 'Home',
//         transitionConfig,
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

export default createAppContainer(AppStack);
