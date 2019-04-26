import { Dimensions } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
const {height, width} = Dimensions.get('window');

export default EStyleSheet.create({
    textInput: {
        height: 50,
        width: width/1.2,
        borderColor: '$accentColor',
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 8,
        color: '$primaryText',
        fontSize: 18,
    }
});
