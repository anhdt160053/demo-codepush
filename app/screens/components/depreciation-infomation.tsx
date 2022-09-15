import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Animated, Dimensions, FlatList, StyleSheet, TextInput, TouchableOpacity, View, ViewStyle} from 'react-native';
import {Header, MButton, Screen, Text} from '../../components';
import {useNavigation} from "@react-navigation/native"
// import { useStores } from "../../models"
import {color} from '../../theme';
import CenterSpinner from '../../components/center-spinner/center-spinner';
import Ionicons from "react-native-vector-icons/Ionicons";

const layout = Dimensions.get('window');

const ROOT: ViewStyle = {
    backgroundColor: color.primary,
    flex: 1,
};

export const DepreciationInfomation = observer(function DepreciationInfomation() {
    const navigation = useNavigation();
    // const {movesModel} = useStores();
    const [isLoading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        gia_tri_nguyen_gia: '',
        gia_tri_tinh_KH: '',
        thoi_gian_KH: '',
        thoi_diem_start_KH: '',
        thoi_diem_end_KH: '',
        ti_le_KH_thang: '',
        gia_tri_KH_thang: '',
        ti_le_KH_nam: '',
        gia_tri_KH_nam: '',
        gia_tri_KH_luy_ke: '',
        gia_tri_con_lai: ''
    })

    // useEffect(() => {
    //   fetchData();
    // }, []);
    // const fetchData = async () => {
    // };

    const goToPage = (page) => {
        navigation.navigate(page);
    };

    const setChangeInput = (type, value) => {{
        let _formData = {...formData}
        _formData[type] = value
        setFormData(_formData)
    }}

    const topComponent = () => {
        return (
            <View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, marginTop: 16, marginBottom: 16,}}>
                    <TouchableOpacity style={styles.backWrapper} onPress={() => goToPage('dashboardScreen')}>
                        <Ionicons name='arrow-back-outline' color={color.white} size={30}/>
                    </TouchableOpacity>
                    <Text style={{fontSize: 17, textTransform: 'capitalize'}} fonts={'DemiBold'}>Khấu hao tài sản</Text>
                    <MButton text='Lưu' style={[styles.btnWrapper, {width: '25%'}]}/>
                </View>
                <View style={{paddingHorizontal: 16}}>
                    <Text>Giá trị nguyên giá</Text>
                    <TextInput 
                       value={formData?.gia_tri_nguyen_gia}
                       onChange={(value) => {
                          setChangeInput('gia_tri_nguyen_gia', value)
                       }}
                       style={styles.input}
                    />
                    <Text>Giá trị tính KH*:</Text>
                    <TextInput 
                       value={formData?.gia_tri_tinh_KH}
                       onChange={(value) => {
                          setChangeInput('gia_tri_tinh_KH', value)
                       }}
                       style={styles.input}
                    />
                    <Text>Thời gian KH*:</Text>
                    <TextInput 
                       value={formData?.thoi_gian_KH}
                       onChange={(value) => {
                          setChangeInput('thoi_gian_KH', value)
                       }}
                       style={styles.input}
                    />
                    <Text>Thời điểm bắt đầu tính khấu hao</Text>
                    <TextInput 
                       value={formData?.thoi_diem_start_KH}
                       onChange={(value) => {
                          setChangeInput('thoi_diem_start_KH', value)
                       }}
                       style={styles.input}
                    />
                    <Text>Thời điểm kết thúc KH:</Text>
                    <TextInput 
                       value={formData?.thoi_diem_end_KH}
                       onChange={(value) => {
                          setChangeInput('thoi_diem_end_KH', value)
                       }}
                       style={styles.input}
                    />
                    <View style={{flexDirection: 'row'}}>
                        <View style={{width: '50%'}}>
                            <Text>Tỉ lệ KH theo tháng(%)</Text>
                            <TextInput 
                                value={formData?.ti_le_KH_thang}
                                onChange={(value) => {
                                    setChangeInput('ti_le_KH_thang', value)
                                }}
                                style={styles.input}
                            />
                        </View>
                        <View style={{width: '50%'}}>
                            <Text>Giá trị KH theo tháng(%)</Text>
                            <TextInput 
                                value={formData?.gia_tri_KH_thang}
                                onChange={(value) => {
                                    setChangeInput('gia_tri_KH_thang', value)
                                }}
                                style={styles.input}
                            />
                        </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{width: '50%'}}>
                            <Text>Tỉ lệ KH theo năm(%)</Text>
                            <TextInput 
                                value={formData?.ti_le_KH_nam}
                                onChange={(value) => {
                                    setChangeInput('ti_le_KH_nam', value)
                                }}
                                style={styles.input}
                            />
                        </View>
                        <View style={{width: '50%'}}>
                            <Text>Giá trị KH theo năm(%)</Text>
                            <TextInput 
                                value={formData?.gia_tri_KH_nam}
                                onChange={(value) => {
                                    setChangeInput('gia_tri_KH_nam', value)
                                }}
                                style={styles.input}
                            />
                        </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{width: '50%'}}>
                            <Text>Giá trị KH luỹ kế</Text>
                            <TextInput 
                                value={formData?.gia_tri_KH_luy_ke}
                                onChange={(value) => {
                                    setChangeInput('gia_tri_KH_luy_ke', value)
                                }}
                                style={styles.input}
                            />
                        </View>
                        <View style={{width: '50%'}}>
                            <Text>Giá trị còn lại</Text>
                            <TextInput 
                                value={formData?.gia_tri_con_lai}
                                onChange={(value) => {
                                    setChangeInput('gia_tri_con_lai', value)
                                }}
                                style={styles.input}
                            />
                        </View>
                    </View>

                </View>
            </View>
        );
    };

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
                        renderItem={null}
                        data={[]}
                        ListHeaderComponent={topComponent()}
                        keyExtractor={(item, index) => 'profile-' + index + String(item)}
                    />
                </View>
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
    btnWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        borderRadius: 10,
        marginLeft: layout.width - 120
    },
    input: {
        color: color.white, 
        backgroundColor: color.black, 
        marginVertical: 5
    }
});
