import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
    container: {
        // height: 100,
        // borderWidth: 1,
        // borderColor: '#657b83',
        // margin: 16,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '$primaryColor'
    },
    text: {
        color: '$primaryText',
    },
    accent: {
        color: '$accentColor',
        fontWeight: 'bold',
    },
});