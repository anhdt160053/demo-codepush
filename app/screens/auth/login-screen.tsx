// @ts-ignore
import jwtDecoder from 'jwt-decode';
import React, {useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {
    Animated,
    Dimensions, FlatList, Image,
    StyleSheet,
    TouchableOpacity, View,
    ViewStyle, Modal, Alert
} from 'react-native';
import {MButton, Input, Screen, Text} from '../../components';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {color} from '../../theme';
import {regexString, showToast} from '../../services';
import CenterSpinner from '../../components/center-spinner/center-spinner';
import {useStores} from '../../models';
import { UnitOfWorkService } from '../../services/api/unitOfWork-service';
import { StorageKey } from '../../services/storage/index';

const ROOT: ViewStyle = {
    backgroundColor: color.primary,
    flex: 1,
};

const _unitOfWork = new UnitOfWorkService()

const layout = Dimensions.get('window');

const IMAGE_HEIGHT = Dimensions.get('window').width / 2.5;
const IMAGE_HEIGHT_SMALL = Dimensions.get('window').width / 5;

export const LoginScreen = observer(function LoginScreen() {
    const [isLoading, setLoading] = useState(false);
    const [isSubmit, setSubmit] = useState(false);
    const isFocused = useIsFocused()
    const [tabIndex, setTabIndex] = useState(0);
    const [registe_mobile, setRegiste_mobile]=useState(false)
    const [confirmModal, setConfirmModal]=useState(false)
    const [toggleCheckBox, setToggleCheckBox] = useState(false)
    
    const [formData, setFormData] = useState<any>({
        username: '',
        password: '',
        passwordSecure: true,
    });
    const navigation = useNavigation();
    const {loft3DiModel} = useStores();
    const [imageHeight, setImageHeight] = useState(new Animated.Value(IMAGE_HEIGHT));

    const ref_input_password = useRef();

    

    useEffect(() => {
        fetchUserInfo
    }, [isFocused]);

    const fetchUserInfo = async () => {
        // await _unitOfWork.storage.setItem(StorageKey.PHONE, "012345");
        // await _unitOfWork.storage.setItem(StorageKey.PASSWORD, "n8@123456");
        let username = await _unitOfWork.storage.getItem(StorageKey.USERNAME);
        let password = await _unitOfWork.storage.getItem(StorageKey.PASSWORD);
        let payload = {
            "User": {
                "UserId": null,
                "Password": password,
                "UserName": username,
                "EmployeeId": "",
                "Disabled": false,
                "CreatedById": "DE2D55BF-E224-4ADA-95E8-7769ECC494EA",
                "CreatedDate": null,
                "UpdatedById": null,
                "UpdatedDate": null,
                "Active": true
            }
        }
        if (username && password) {
          setLoading(true)
          let response = await _unitOfWork.user.login(payload)
          setLoading(false)
          if (response.data.StatusCode != 200) {
            Alert.alert("Thông báo", "Số điện thoại hoặc mật khẩu không chính xác!")
          } else {
            console.log(response?.data?.currentUser);
            
            await _unitOfWork.storage.setItem(StorageKey.USERNAME, formData?.username);
            await _unitOfWork.storage.setItem(StorageKey.PASSWORD, formData?.password);
            // await _unitOfWork.storage.setItem(StorageKey.ISNEWNOTIFICATION, response.data.IsNewNotification);
            // await _unitOfWork.storage.setItem(StorageKey.NUMBERNOTI, response.data.NumberNewNotification);
            await _unitOfWork.storage.setItem(StorageKey.USERID, response?.data?.currentUser?.userId);
            await _unitOfWork.storage.setItem(StorageKey.JWT_TOKEN, response?.data?.currentUser.token);
            goToPage('dashboardScreen')
          }
        }
      }

    const resetFormData = (isLogin) => {
        if (isLogin) {
            setFormData({
                username: '',
                password: '',
                passwordSecure: true,
            });
        }
        setSubmit(false);
    };

    const setChangeText = (type, value) => {
        let _formData = {...formData};
        _formData[type] = value;
        setFormData(_formData);
    };

    const checkSubmit = () => {
        console.log(formData);
        
        setSubmit(true);
        if (regexString(formData?.username)) {
            showToast('error', 'username cannot be empty');
            return false;
        }
        if (regexString(formData?.password)) {
            showToast('error', 'password cannot be empty');
            return false;
        }
        return true;
    };

    const goToPage = (page) => {
        navigation.navigate(page);
    };

    const topComponent = () => {    
        return (
            <View style={styles.container}>  
                <View style={{alignItems: 'center'}}> 
                    <View style={{marginBottom: 16}}>
                        <Text style={{fontSize: 37}}>Loft3Di</Text>
                    </View>
                    <Input
                        // onSubmitEditing={() => ref_input_password.current?.focus()}
                        blurOnSubmit={false}
                        placeholder='Tên đăng nhập' type='email-address'
                        status={isSubmit && regexString(formData?.username) ? 'danger' : ''}
                        value={formData?.username}
                        onChangeText={(value) => setChangeText('username', value)}/>
                    <Input
                        innerRef={ref_input_password}
                        // onSubmitEditing={() => submit()}
                        blurOnSubmit={false}
                        placeholder='Mật khẩu'
                        secureTextEntry={formData?.passwordSecure}
                        onChangeSecure={() => setChangeText('passwordSecure', !formData?.passwordSecure)}
                        status={isSubmit && regexString(formData?.password) ? 'danger' : ''}
                        value={formData?.password}
                        onChangeText={(value) => setChangeText('password', value)}/>
                    <View style={{flexDirection: 'row',width: layout.width * 3 / 4}}>
                        <Text>Ghi nhớ tài khoản</Text>
                    </View>
                    <MButton styleText={{fontSize: 18}} style={{width: layout.width/10*4}} text='Đăng nhập' onPress={submit}/>
                </View>
            </View>
        );
    };

    const submit = async () => {
        let payload = {
            "User": {
                "UserId": null,
                "Password": formData?.password,
                "UserName": formData?.username,
                "EmployeeId": "",
                "Disabled": false,
                "CreatedById": "DE2D55BF-E224-4ADA-95E8-7769ECC494EA",
                "CreatedDate": null,
                "UpdatedById": null,
                "UpdatedDate": null,
                "Active": true
            }
        }
        let response = await _unitOfWork.user.login(payload)
       
        if (response?.data?.statusCode != 200) {
            Alert.alert("Thông báo", "Tên tài khoản hoặc mật khẩu không chính xác!")
          } else {
            await _unitOfWork.storage.setItem(StorageKey.USERNAME, formData?.username);
            await _unitOfWork.storage.setItem(StorageKey.PASSWORD, formData?.password);
            // await _unitOfWork.storage.setItem(StorageKey.ISNEWNOTIFICATION, response.data.IsNewNotification);
            // await _unitOfWork.storage.setItem(StorageKey.NUMBERNOTI, response.data.NumberNewNotification);
            await _unitOfWork.storage.setItem(StorageKey.USERID, response?.data?.currentUser?.userId);
            await _unitOfWork.storage.setItem(StorageKey.JWT_TOKEN, response?.data?.currentUser.token);
            goToPage('dashboardScreen')
          }
    
        // if (checkSubmit()) {
        //     console.log("Ok");
            
        //     setLoading(true);
        //     const successCallback = async (response) => {
        //         resetFormData(true);
        //         setLoading(false);
        //         let {user, messageCode, message} = response;
        //         if (!tabIndex) {
        //         const decodedToken = jwtDecoder(user?.token);
        //         await loft3DiModel.setUserInfo({
        //             username: formData?.username,
        //             // password: formData?.password,
        //             token: user?.refreshToken,
        //             surname: user?.Surname,
        //             forename: user?.Forename,
        //             id: user?.User_ID,
        //             exp: decodedToken?.exp,
        //             email: user?.User_Email,
        //             phone: user?.User_Phone_Number,
        //             avatar: user?.User_Avatar,
        //             createdDate: user?.Created_Date,
        //         });

        //         } else {
        //             showToast('success', message);
        //         }
        //         // if(!user?.Is_Mobile_App_User && user?.Is_Web_App_User){
        //         //     setRegiste_mobile(true)
        //         // }
        //         goToPage('dashboardScreen');
        //     };
        //     const errorCallback = (e) => {
        //         setLoading(false);
        //         if(e?.isExistsWeb){
        //             setConfirmModal(true)
        //         }else{
        //             showToast('error', e.message);
        //         }
        //     };
        //     if (tabIndex) {
        //         signup(formData?.forename, formData?.surname, formData?.email, formData?.phone, formData?.password, successCallback, errorCallback);
        //     } else {
        //         if(!registe_mobile){
        //             login(formData?.username, formData?.password, successCallback, errorCallback, false);
        //         }
        //         else{
        //             login(formData?.username, formData?.password, successCallback, errorCallback, true);
        //         }
        //     }
        // }
    };

    return (
        <>
            {isLoading && <CenterSpinner/>}
            <Screen style={ROOT} preset="fixed">
                <FlatList
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={{flex: 1, zIndex: 1}}
                    renderItem={null}
                    data={[]}
                    ListHeaderComponent={topComponent()}
                    keyExtractor={(item, index) => 'login-' + index + String(item)}
                />
            </Screen>
        </>
    );
});

const styles = StyleSheet.create({
    login_1: {
        marginBottom: 32,
        resizeMode: 'contain',
    },
    login_2: {
        position: 'absolute',
        width: layout.width,
        bottom: -32,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    forgotPasswordWrapper: {
        marginBottom: 16,
        alignItems: 'center',
    },
    forgotPasswordText: {
        color: color.danger,
    },
    signUpText: {
        color: color.danger,
    },
    passDescription: {
        width: layout.width * 3 / 4,
        marginBottom: 16,
        fontSize: 12,
        marginTop: -8,
        color: color.danger,
        textAlign: 'center'
    },
    centeredView: {
        marginTop: layout.height/10*3,
        width: layout.width / 10 * 8,
        height: layout.height/10*3,
        alignItems:'center',
        marginLeft: layout.width / 10 - 5

    },
    modalView: {
        flex: 1,
        backgroundColor: color.white,
        paddingVertical: 15,
        paddingHorizontal: 15
    },
});
