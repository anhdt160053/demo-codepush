import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Animated, Dimensions, FlatList, Modal, StyleSheet, TouchableOpacity, View, ViewStyle, TextInput} from 'react-native';
import {Header, MButton, Screen, Text} from '../../components';
import {useNavigation} from "@react-navigation/native"
// import { useStores } from "../../models"
import {color} from '../../theme';
import CenterSpinner from '../../components/center-spinner/center-spinner';
import Ionicons from "react-native-vector-icons/Ionicons";
import SelectDropdown from 'react-native-select-dropdown'
import DatePicker from 'react-native-date-picker'
import { formatDate } from '../../services';

const layout = Dimensions.get('window');

const ROOT: ViewStyle = {
    backgroundColor: color.primary,
    flex: 1,
};

export const DispatchInformation = observer(function DispatchInformation() {
    const navigation = useNavigation();
    // const {movesModel} = useStores();
    const [isLoading, setLoading] = useState(false);
    const [model_capphat, setModel_capphat] = useState(false);
    const [isShow, setShow] = useState<any>({
        fromDate: false,
        toDate: false,
    });
    const [datetime, setDatetime] = useState<any>({
        fromDate: new Date(),
        toDate: new Date(),
    });

    const [test, setTest] = useState('Test');
    // useEffect(() => {
    //   fetchData();
    // }, []);
    // const fetchData = async () => {
    // };

    const data = [1,1,1,1]
    const countries = ["Egypt", "Canada", "Australia", "Ireland"]
    const goToPage = (page) => {
        navigation.navigate(page);
    };
    const setChangeShow = (type, value) => {
        let _isShow = {...isShow};
        _isShow[type] = value;
        setShow(_isShow);
    };
    const setChangeDatetime = (type, value) => {
        let _datetime = {...datetime};
        _datetime[type] = value;
        setDatetime(_datetime);
    };

    const topComponent = () => {
        return (
            <View>             
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, marginTop: 16, marginBottom: 16,}}>
                    <TouchableOpacity style={styles.backWrapper} onPress={() => goToPage('dashboardScreen')}>
                        <Ionicons name='arrow-back-outline' color={color.white} size={30}/>
                    </TouchableOpacity>
                    <Text style={{fontSize: 17, textTransform: 'capitalize'}} fonts={'DemiBold'}>Lịch sử phân bổ</Text>
                    <MButton text='Cấp phát' style={[styles.btnWrapper, {width: '25%'}]} onPress={() => setModel_capphat(true)}/>
                </View> 
            </View>
        );
    };

    const ItemView = () => {
        return (
            <View>
                 <View style={styles.box}>
                         <View style={[styles.item, {justifyContent: "space-between", marginBottom: 10}]}>
                            <Text>20/08/2022</Text>
                            <Text>Thu hồi</Text>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 3}}>Họ tên NV:</Text>
                            <Text style={{width: layout.width/10 * 6}}>BM123-Nguyễn Văn A</Text>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 3}}>Phòng ban:</Text>
                            <Text style={{width: layout.width/10 * 6}}>Phòng nhân sự</Text>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 3}}>Vị trí làm việc:</Text>
                            <Text style={{width: layout.width/10 * 6}}>B12</Text>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 3}}>Người thu hồi:</Text>
                            <Text style={{width: layout.width/10 * 6}}>Nguyễn Văn A</Text>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 3}}>Lý do:</Text>
                            <Text style={{width: layout.width/10 * 6}}>Thích thì thu, Thích thì thu, Thích thì thu, Thích thì thu</Text>
                         </View>
                      </View>
            </View>
        )
    }

    return (
        <>
            {isLoading && <CenterSpinner/>}
            <Screen style={ROOT} preset="fixed">
                <View style={{flex: 1}}>
                    <Header headerText='LOGO'/>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        style={{flex: 1}}
                        renderItem={ItemView}
                        data={data}
                        ListHeaderComponent={topComponent()}
                        keyExtractor={(item, index) => 'profile-' + index + String(item)}
                    />
                </View>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={model_capphat}
                    onRequestClose={() => {
                    }}
                >
                    <View style={styles.centeredView}>
                        <>
                            {/* {isLoading && <CenterSpinner/>} */}
                            <View style={styles.modalView}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    style={{flex: 1}}
                                    renderItem={null}
                                    data={[]}
                                    ListHeaderComponent={() => {
                                        return (
                                            <View>
                                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, marginTop: 16, marginBottom: 16}}>
                                                    <TouchableOpacity style={styles.backWrapper} onPress={() => setModel_capphat(false)}>
                                                        <Ionicons name='arrow-back-outline' color={color.white} size={30}/>
                                                    </TouchableOpacity>
                                                    <Text style={{fontSize: 17, textTransform: 'capitalize'}} fonts={'DemiBold'}>Cấp phát tài sản</Text>
                                                    <MButton text='Lưu' style={[styles.btnWrapper, {width: '20%'}]} onPress={() => setModel_capphat(true)}/>
                                                </View>

                                                <View>
                                                    <Text>Tên tài sản:  Máy tính laptop dell</Text>
                                                    <Text>Mã tài sản:  VANDN</Text>
                                                    <Text>Chọn nhân viên*</Text>
                                                    <SelectDropdown 
                                                        data={countries}
                                                        onSelect={(selectedItem, index) => {
                                                            console.log(selectedItem, index)
                                                        }}
                                                        renderDropdownIcon={() => {
                                                        return (
                                                            <Ionicons name='chevron-down-outline' size={20} color={color.white}/>
                                                        )
                                                        }}
                                                        defaultButtonText={'  '}
                                                        dropdownStyle={styles.dropdown}
                                                        buttonStyle={{width: '100%', backgroundColor: color.black, marginVertical: 10}}
                                                        buttonTextStyle={{color: color.white}}
                                                        search={true}
                                                        renderCustomizedButtonChild={(selectedItem, index) => {
                                                        return (
                                                            <Text>{selectedItem}</Text>
                                                        )
                                                        }}
                                                    />
                                                    <Text>Mục đích sử dụng*:</Text>
                                                    <SelectDropdown 
                                                         data={countries}
                                                         onSelect={(selectedItem, index) => {
                                                             console.log(selectedItem, index)
                                                         }}
                                                         renderDropdownIcon={() => {
                                                            return (
                                                                <Ionicons name='chevron-down-outline' size={20} color={color.white}/>
                                                            )
                                                         }}
                                                         defaultButtonText={'  '}
                                                         dropdownStyle={styles.dropdown}
                                                         buttonStyle={{width: '100%', backgroundColor: color.black, marginVertical: 10}}
                                                         buttonTextStyle={{color: color.white}}
                                                         search={true}
                                                         renderCustomizedButtonChild={(selectedItem, index) => {
                                                            return (
                                                                <Text>{selectedItem}</Text>
                                                            )
                                                         }}
                                                     />

                                                    <View style={{flexDirection: 'row'}}>
                                                        <View style={{width: '50%'}}>
                                                            <Text>Từ ngày</Text>
                                                            <View>
                                                                <TouchableOpacity style={styles.inputDate} onPress={() => setChangeShow('fromDate', true)}>
                                                                   <Text>{formatDate(datetime?.fromDate)}</Text>
                                                                   <Ionicons name={'calendar-outline'} color="white" size={24}/>
                                                                </TouchableOpacity>
                                                                <DatePicker
                                                                    mode="date"
                                                                    modal
                                                                    open={isShow?.fromDate}
                                                                    date={datetime?.fromDate}
                                                                    onConfirm={(date) => {
                                                                        setChangeShow('fromDate', false);
                                                                        setChangeDatetime('fromDate', date);               
                                                                    }}
                                                                    onCancel={() => {
                                                                        setChangeShow('fromDate', false);
                                                                    }}
                                                                />
                                                            </View>
                                                        </View>
                                                        <View style={{width: '50%'}}>
                                                            <Text>Đến ngày</Text>
                                                            <View>
                                                                <TouchableOpacity style={styles.inputDate} onPress={() => setChangeShow('toDate', true)}>
                                                                   {/* <Text>{datetime?.toDate}</Text> */}
                                                                   <Text>{formatDate(datetime?.toDate)}</Text>
                                                                   <Ionicons name={'calendar-outline'} color="white" size={24}/>
                                                                </TouchableOpacity>
                                                                <DatePicker
                                                                    mode="date"
                                                                    modal
                                                                    open={isShow?.toDate}
                                                                    date={datetime?.toDate}
                                                                    onConfirm={(date) => {
                                                                        setChangeShow('toDate', false);
                                                                        setChangeDatetime('toDate', date);               
                                                                    }}
                                                                    onCancel={() => {
                                                                        setChangeShow('toDate', false);
                                                                    }}
                                                                />
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <Text>Lý do cấp phát</Text>
                                                    <TextInput style={{borderWidth: 1, marginTop: 10}} />
                                                     
                                                </View>
  
                                            </View>
                                        )
                                    }}
                                    keyExtractor={(item, index) => 'view-info-general-' + index + String(item)}
                                />
                            </View>
                        </>
                    </View>
                </Modal>
            </Screen>
        </>
    );
});

const styles = StyleSheet.create({
    backWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
    },
    backText: {
        marginLeft: 4,
        color: color.green
    },
    btnWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        borderRadius: 10,
        marginLeft: layout.width - 120
    },
    box: {
        marginHorizontal: 10,
        marginVertical: 10,
        borderColor: color.black,
        borderWidth: 1,
        borderRadius: 15,
        padding: 10,
        backgroundColor: color.green
  
      },
    item: {
        flexDirection: 'row',
    },
    centeredView: {
        flex: 1,
    },
    modalView: {
        flex: 1,
        backgroundColor: color.primary,
        paddingHorizontal: 16,
    },
    dropdown: {
        
    },
    inputDate: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 8,
        // borderWidth: 1,
        borderColor: color.white,
        // paddingHorizontal: 12,
        backgroundColor: color.tabbar,
        paddingLeft: 16,
        paddingRight: 8,
        paddingVertical: 8,
        borderRadius: 4
    },
});
