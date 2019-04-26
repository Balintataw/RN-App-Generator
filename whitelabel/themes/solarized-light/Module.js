// This and any themes/Module.js are being deprecated
import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '$primaryColor'
    },
    text: {
        color: '$primaryText',
        fontSize: 22
    },
    accent: {
        color: '$accentColor',
        fontWeight: 'bold',
        fontSize: 22
    },
});