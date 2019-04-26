import React from 'react';
import { Text, View, SafeAreaView, Image, ScrollView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        backgroundColor: '$primaryColor',
        padding: 8
    },
    scrollView: {
        marginTop:10,
    },
    text: {
        color: '$primaryText',
        fontSize: 22,
    },
    accent: {
        color: '$accentColor',
        fontWeight: 'bold',
        fontSize: 22
    },
    image: {
        width:80,
        height:80,
    }
});

const AboutComponent = () => (
    <SafeAreaView style={styles.container}>
        <Image style={styles.image} source={require('../src/assets/images/joss-icon.png')}/>
        <ScrollView style={styles.scrollView}>
            <Text style={styles.text}>
                <Text style={styles.accent}>
                    Sed ut perspiciatis, 
                </Text>
                unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit amet, consectetur, adipisci[ng] velit, sed quia non numquam [do] eius modi tempora inci[di]dunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?
            </Text>
        </ScrollView>
    </SafeAreaView>
);
export default {
    name: 'About',
    Component: AboutComponent,
};