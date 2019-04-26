import EStyleSheet from 'react-native-extended-stylesheet';
import { Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');

export default EStyleSheet.create({
    // app button
    appButtonContainer: {
        margin: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: "$accentColor",
        borderRadius: 30,
        width: width/1.2,
        paddingVertical: 15,
        paddingHorizontal: 5,
    },
    appButtonText: {
        color: '$primaryText',
        fontSize: 20,
    },
});