// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useState} from 'react';
import {View, ViewStyle, Image, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {HeaderProps} from './header.props';
import {Button} from '../button/button';
import {Text} from '../text/text';
import {color, spacing} from '../../theme';
import {translate} from '../../i18n/';
import {useNavigation} from '@react-navigation/native';
import {images} from '../../images';
import {observer} from 'mobx-react-lite';
import { UnitOfWorkService } from '../../services/api/unitOfWork-service';
import { async } from 'validate.js';

// static styles
const ROOT: ViewStyle = {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    alignItems: 'center',
    paddingTop: spacing[3],
    paddingBottom: spacing[3],
    justifyContent: 'flex-start',
};

const _unitOfWork = new UnitOfWorkService()
const layout = Dimensions.get('window');
const TITLE_MIDDLE: ViewStyle = {flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'};
const CENTER_IMG: any = {
    height: 24,
    resizeMode: 'contain',
};




/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */
export const Header = observer(function Header(props: HeaderProps) {
    const {
        onLeftPress,
        // onRightPress,
        headerText,
        headerTx,
        style, 
    } = props;
    const header = headerText || (headerTx && translate(headerTx)) || '';
    const navigation = useNavigation();
    const [showLogout, setShowlogout]=useState(false)

    // const goToPage = (page) => {
    //     navigation.navigate('MainScreen', {screen: page});
    // };

    // const codePushSync = () => {
    //     codePush.sync({
    //         // updateDialog: true,
    //         installMode: codePush.InstallMode.IMMEDIATE
    //     });
    // };
    // const onLeftPress = () => {
    //     navigation.navigate('dashboardScreen')
    // }

    const onRightPress = async () => {
        await _unitOfWork.storage.logout();
        navigation.navigate('LoginScreen')
    }


    if (header == 'LOGO') {
        return (
            <View style={[style, styles.wrapper]}>
                <View style={[ROOT]}>
                <Button style={styles.btnIcon} preset="link" onPress={onLeftPress}>
                   <Ionicons name={'qr-code-outline'} color="white" size={24}/>
                </Button>
                <View style={TITLE_MIDDLE}>
                    <Image source={images.logo} style={CENTER_IMG}/>
                    <Text>Loft3Di</Text>
                </View>
                <Button style={styles.btnIcon} preset="link" onPress={() => setShowlogout(!showLogout)}>
                    <Ionicons name={'person-circle-outline'} color="white" size={30}/>
                </Button>
                </View> 
                {showLogout && 
                <Button 
                  style={{position:'absolute',width: 100, marginLeft: layout.width - 140, marginTop: 40}}
                  onPress={onRightPress}>
                    <Text>Đăng xuất</Text>
                </Button> }     
            </View>
        );
    }
    return (
        <View style={[ROOT, style, styles.wrapper]}>
            <Button style={styles.btnIcon} preset="link" onPress={onLeftPress}>
                <Ionicons name={'arrow-back-outline'} color="white" size={24}/>
            </Button>
            <View style={TITLE_MIDDLE}>
                <Text fonts={'DemiBold'}>{header}</Text>
            </View>
            <Button style={styles.btnIcon} preset="link"/>
        </View>
    );


});

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: color.primary,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 1,
        zIndex: 99999
    },
    btnIcon: {
        width: 32, height: 32
    }
});
