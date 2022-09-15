import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {
    View,
    ViewStyle,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Dimensions,
    TextInput,
    ScrollView,
    Modal,
} from 'react-native';
import {Header, MButton, Screen, Text, BtnBack} from '../../components';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {color} from '../../theme';
import CenterSpinner from "../../components/center-spinner/center-spinner";
import {formatDate, showToast} from "../../services";
import Ionicons from 'react-native-vector-icons/Ionicons';

import {useStores} from "../../models";
import QRCodeScanner from 'react-native-qrcode-scanner';
import DatePicker from 'react-native-date-picker'
import SelectDropdown from 'react-native-select-dropdown'
import { UnitOfWorkService } from '../../services/api/unitOfWork-service';
import { StorageKey } from '../../services/storage/index';


const ROOT: ViewStyle = {
    flex: 1,
};

const layout = Dimensions.get('window');

const _unitOfWork = new UnitOfWorkService()

export const DashboardScreen = observer(function DashboardScreen() {
    const {params}: any = useRoute();
    const navigation = useNavigation();
    const [dashboard, setDashboard] = useState<any>(null);
    const [isLoading, setLoading] = useState(false);
    const [isRefresh, setRefresh] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const isFocused = useIsFocused();
    const {loft3DiModel} = useStores();
    const [modalVisible, setModalVisible] = useState<any>({
        viewInfo_general: false,
        recall: false,
        date_recall: false,
        maintenance: false,
        chitiet_phanbo: false,
        chitiet_baoduong: false,
        chitiet_khauhao: false
    });
    const [date_recall, setDate_recall] = useState(new Date())
    const [isShow, setShow] = useState<any>({
        fromDate: false,
        toDate: false,
    });
    const [datetime, setDatetime] = useState<any>({
        fromDate: new Date(),
        toDate: new Date(),
    });
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
    const [masterData,setMasterData] = useState(null)
    const [masterDataForm,setMasterDataForm] = useState(null)

    useEffect(() => {
        FetchData()
    }, [isFocused,isRefresh]);

    const FetchData = async () => {
        setLoading(true)
        let newDate = new Date()
        let userId = await _unitOfWork.storage.getItem(StorageKey.USERID);
        let _masterDataForm = await _unitOfWork.user.getMasterDataAssetForm({})
        if(_masterDataForm?.statusCode == 200) setMasterDataForm(_masterDataForm)
        
        let payload = {
            "UserId":userId,
            "taisanId": "30"
          }
        let response = await _unitOfWork.user.getDetailDashboard(payload)
        if(response?.statusCode == 200) {
            await _unitOfWork.storage.setItem(StorageKey.TENTAISAN, response?.assetDetail?.tenTaiSan);
            await _unitOfWork.storage.setItem(StorageKey.MATAISAN, response?.assetDetail?.maTaiSan);
            await _unitOfWork.storage.setItem(StorageKey.TAISAN_ID, response?.assetDetail?.taiSanId);
            for(let i = 0; i < _masterDataForm?.listPhanLoaiTS?.length ; i++){
                if(_masterDataForm?.listPhanLoaiTS[i]?.categoryId == response?.assetDetail?.phanLoaiTaiSanId) response.assetDetail.phanLoaiTaiSan = _masterDataForm?.listPhanLoaiTS[i]?.categoryName
            }
            for(let i = 0; i < _masterDataForm?.listNuocSX?.length ; i++){
                if(_masterDataForm?.listNuocSX[i]?.categoryId == response?.assetDetail?.nuocSXId) response.assetDetail.nuocSX = _masterDataForm?.listNuocSX[i]?.categoryName
            }
            for(let i = 0; i < _masterDataForm?.listHangSX?.length ; i++){
                if(_masterDataForm?.listHangSX[i]?.categoryId == response?.assetDetail?.hangSXId) response.assetDetail.hangSX = _masterDataForm?.listHangSX[i]?.categoryName
            }
            let ti_le_KH_thang = Number((100 / response?.assetDetail?.thoiGianKhauHao).toFixed(2))
            let gia_tri_KH_thang = Number(((response?.assetDetail?.giaTriTinhKhauHao * ti_le_KH_thang) / 100).toFixed(2))
            let ti_le_KH_nam = Number((100 / (response?.assetDetail?.thoiGianKhauHao / 12)).toFixed(2))
            let gia_tri_KH_nam = Number(((response?.assetDetail?.giaTriTinhKhauHao * ti_le_KH_nam) / 100).toFixed(2))
            let startDate_KH = new Date(response?.assetDetail?.thoiDiemBDTinhKhauHao)
            let gia_tri_KH_luy_ke = Number((gia_tri_KH_thang * ( (newDate.getFullYear() - startDate_KH.getFullYear())*12 + (newDate.getMonth() - startDate_KH.getMonth()))))
            let gia_tri_con_lai = Number((response?.assetDetail?.giaTriTinhKhauHao - gia_tri_KH_luy_ke).toFixed(2))
            setMasterData(response)
            let _formData = {
                gia_tri_nguyen_gia: response?.assetDetail?.giaTriNguyenGia.toString(),
                gia_tri_tinh_KH: response?.assetDetail?.giaTriTinhKhauHao.toString(),
                thoi_gian_KH: response?.assetDetail?.thoiGianKhauHao.toString(),
                thoi_diem_start_KH: response?.assetDetail?.thoiDiemBDTinhKhauHao,
                thoi_diem_end_KH: response?.assetDetail?.thoiDiemBDTinhKhauHao,
                ti_le_KH_thang: ti_le_KH_thang.toString(),
                gia_tri_KH_thang: gia_tri_KH_thang.toString(),
                ti_le_KH_nam: ti_le_KH_nam.toString(),
                gia_tri_KH_nam: gia_tri_KH_nam.toString(),
                gia_tri_KH_luy_ke: gia_tri_KH_luy_ke.toString(),
                gia_tri_con_lai: gia_tri_con_lai.toString(),
            }
            setFormData(_formData)
            
        }
        setLoading(false)
        setRefresh(false)
    }

    const countries = ["Egypt", "Canada", "Australia", "Ireland"]

    const resetdata = () => {
        setMasterData(null)
    }

    const setChangeInput = (type, value) => {{
        let _formData = {...formData}
        _formData[type] = value
        setFormData(_formData)
    }}

    const onSuccess = (e) => {
        if(e?.data){
        //   setResult(e?.data)
        //   setShowScan(false)
        }
      }

      const setChangeModal = (type, value) => {
        let _modalVisible = {...modalVisible};
        _modalVisible[type] = value;
        setModalVisible(_modalVisible);
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


    const onRefresh = () => {
        setRefresh(true)
    };

    const goToPage = (page) => {
        navigation.navigate(page)
    }

    const topComponent = () => {        
        return (
            <>
              <View style={styles.container}>
                {!masterData ? 
                <View style={{marginTop: 120}}>
                    <QRCodeScanner
                    reactivate={true}
                    showMarker={true}
                    onRead={(e) => onSuccess(e)}
                    // flashMode={RNCamera.Constants.FlashMode.torch}   
                    />
                     <TouchableOpacity 
                        onPress={()=> {
                            FetchData()
                            setShowResult(true)
                        } }
                        style={{marginTop: 70, padding: 10, borderRadius:10, backgroundColor: color.green, alignItems:'center'}}>
                        <Text>Result</Text>
                     </TouchableOpacity>
                </View>
                : 
                <>
                  <ScrollView 
                  showsVerticalScrollIndicator={false}
                    style={{backgroundColor: color.primary}}>
                      <View style={styles.box}>
                         <View style={[styles.item, {justifyContent: "space-between", marginBottom: 10}]}>
                            <Text>Thông tin chung:</Text>
                            <TouchableOpacity onPress={() => setChangeModal('viewInfo_general', true)}>
                                <Text style={{color: color.error}}>Chi tiết</Text>
                            </TouchableOpacity>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 3}}>Tên tài sản:</Text>
                            <Text>{masterData?.assetDetail?.tenTaiSan}</Text>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 3}}>Mã tài sản:</Text>
                            <Text>{masterData?.assetDetail?.maTaiSan}</Text>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 3}}>Phân loại:</Text>
                            <Text>{masterData?.assetDetail?.phanLoaiTaiSan}</Text>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 3}}>Số serial:</Text>
                            <Text>{masterData?.assetDetail?.soSerial}</Text>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 3}}>Model:</Text>
                            <Text>{masterData?.assetDetail?.model}</Text>
                         </View>
                      </View>       
                      <View style={styles.box}>
                         <View style={[styles.item, {justifyContent: "space-between", marginBottom: 10}]}>
                            <Text>Thông tin phân bổ:</Text>
                            <TouchableOpacity onPress={() => setChangeModal('chitiet_phanbo', true)}>
                                <Text style={{color: color.error}}>Chi tiết</Text>
                            </TouchableOpacity>
                         </View>
                         {masterData?.assetDetail?.hienTrangTaiSan == 1 ?
                            <View>
                                <View style={styles.item}>
                                    <Text style={{width: layout.width/10 * 3}}>NV:</Text>
                                    <Text>{masterData?.listTaiSanPhanBo[0]?.hoVaTen}</Text>
                                </View>
                                <View style={styles.item}>
                                    <Text style={{width: layout.width/10 * 3}}>Phòng ban:</Text>
                                    <Text>{masterData?.listTaiSanPhanBo[0]?.phongBan}</Text>
                                </View>
                                <View style={styles.item}>
                                    <Text style={{width: layout.width/10 * 3}}>Vị trí làm việc:</Text>
                                    <Text>{masterData?.listTaiSanPhanBo[0]?.viTriLamViec}</Text>
                                </View>
                                <View style={{alignItems: 'center', marginTop: 15}}>
                                    <MButton
                                    onPress={() => setChangeModal('recall', true)}
                                    text='Thu hồi'
                                    style={{width: layout.width/10*4}}
                                    />
                                </View>
                            </View>
                         :
                            <View style={{alignItems: 'center'}}>
                                <Text>Tài sản hiện chưa cấp phát cho nhân viên nào</Text>
                                <View style={{alignItems: 'center', marginTop: 15}}>
                                    <MButton
                                    onPress={() => setChangeModal('recall', true)}
                                    text='Cấp phát'
                                    style={{width: layout.width/10*4}}
                                    />
                                </View>
                            </View>
                         }         
                      </View>
                      <View style={styles.box}>
                         <View style={[styles.item, {justifyContent: "space-between", marginBottom: 10}]}>
                            <Text>Bảo trì/bảo dưỡng:</Text>
                            <TouchableOpacity onPress={() => setChangeModal('chitiet_baoduong', true)}>
                                 <Text style={{color: color.error}}>Chi tiết</Text>
                            </TouchableOpacity>
                         </View>
                         {masterData?.listBaoDuong?.length > 0 ? 
                            <View>
                                <View style={[styles.item, {justifyContent:'space-between'}]}>
                                    <Text>Từ ngày:</Text>
                                    <Text>{formatDate(masterData?.listBaoDuong[0]?.tuNgay)}</Text>
                                    <Text>Đến ngày:</Text>
                                    <Text>{formatDate(masterData?.listBaoDuong[0]?.denNgay)}</Text>
                                </View>
                                <View style={styles.item}>
                                    <Text style={{width: '20%'}}>Lý do:</Text>
                                    <Text style={{width: '80%'}}>{masterData?.listBaoDuong[0]?.moTa}</Text>
                                </View>
                            </View>
                         : null }
                         
                         <View style={{alignItems: 'center', marginTop: 15}}>
                            <MButton
                            onPress={() => setChangeModal('maintenance',true)}
                            text='Thêm mới'
                            style={{width: layout.width/10*4}}
                            />
                         </View>                         
                      </View>
                      <View style={styles.box}>
                         <View style={[styles.item, {justifyContent: "space-between", marginBottom: 10}]}>
                            <Text>Thông tin khấu hao:</Text>
                            <TouchableOpacity onPress={() => setChangeModal('chitiet_khauhao', true)}>
                                 <Text style={{color: color.error}}>Chi tiết</Text>
                            </TouchableOpacity>
                           
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 4}}>Giá tính khấu hao:</Text>
                            <Text>{masterData?.assetDetail?.giaTriTinhKhauHao}</Text>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 4}}>Khấu hao luỹ kế:</Text>
                            <Text>------------</Text>
                         </View>
                      </View>

                      <View style={styles.box}>
                        <Text>Ghi chú</Text>
                        <TextInput style={{borderWidth: 1, marginTop: 10}}>
                        </TextInput>
                        <View style={{alignItems: 'flex-end', marginTop: 15}}>
                            <MButton 
                            text='Lưu'
                            style={{width: layout.width/10*4}}
                            />
                         </View>
                      </View>
                      <View style={styles.box}>
                        <Text>Dòng thời gian</Text>
                        <View style={{borderWidth: 1, borderColor: color.black, padding: 10 }}>
                            <View style={{flexDirection: 'row', borderBottomColor: color.black, borderBottomWidth: 1, paddingBottom: 10}}>
                                <Ionicons name={'person-circle-outline'} color="white" size={30}/>
                                <View>
                                    <Text>Admin</Text>
                                    <Text>Đã thêm ghi chú lúc 11:43 ngày 15/08/2022</Text>
                                </View> 
                            </View>
                            <Text style={{}}>Ghi chú 1</Text>
                        </View>
                      </View>
                  </ScrollView>
                </>}
              </View>
            </>
        );
    };
    const ItemView_phanbo = ({item, index}) => {
        return (
            <View>
                 <View style={[styles.box, {backgroundColor: color.green}]}>
                         <View style={[styles.item, {justifyContent: "space-between", marginBottom: 10}]}>
                            <Text>{formatDate(item?.ngayBatDau)} - {formatDate(item?.ngayKetThuc)}</Text>
                            <Text>{item?.loaiCapPhat}</Text>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 3}}>Họ tên NV:</Text>
                            <Text style={{width: layout.width/10 * 6}}>{item?.hoVaTen}</Text>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 3}}>Phòng ban:</Text>
                            <Text style={{width: layout.width/10 * 6}}>{item?.phongBan}</Text>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 3}}>Vị trí làm việc:</Text>
                            <Text style={{width: layout.width/10 * 6}}>{item?.viTriLamViec}</Text>
                         </View>     
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 3}}>{item?.loaiCapPhat == 'Cấp phát' ? 'Người cấp phát:' : 'Người thu hồi:'}</Text>
                            <Text style={{width: layout.width/10 * 6}}>{item?.nguoiCapPhat}</Text>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 3}}>Lý do:</Text>
                            <Text style={{width: layout.width/10 * 6}}>{item?.lyDo}</Text>
                         </View>
                      </View>
            </View>
        )
    }
    const ItemView_baotri = ({item,index}) => {
        return (
            <View>
                 <View style={[styles.box,{backgroundColor: color.green}]}>
                         <View style={{marginBottom: 10}}>
                            <Text>{formatDate(item?.tuNgay)} - {formatDate(item?.denNgay)}</Text>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 2}}>Phụ trách:</Text>
                            <Text style={{width: layout.width/10 * 7}}>{item?.nguoiPhuTrach}</Text>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 2}}>Lý do:</Text>
                            <Text style={{width: layout.width/10 * 7}}>{item?.moTa}</Text>
                         </View>
                      </View>
            </View>
        )
    }
    const topComponent_khauhao = () => {
        return (
            <View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16, marginBottom: 16,}}>
                    <TouchableOpacity style={styles.backWrapper} onPress={() => setChangeModal('chitiet_khauhao', false)}>
                        <Ionicons name='arrow-back-outline' color={color.white} size={30}/>
                    </TouchableOpacity>
                    <Text style={{fontSize: 17, textTransform: 'capitalize'}} fonts={'DemiBold'}>Khấu hao tài sản</Text>
                    <MButton text='Lưu' style={[styles.btnWrapper, {width: '25%'}]}/>
                </View>
                <View style={{}}>
                    <Text>Giá trị nguyên giá</Text>
                    <TextInput 
                       value={formData?.gia_tri_nguyen_gia.toString()}
                       onChangeText={(value) => {
                          setChangeInput('gia_tri_nguyen_gia', value)
                       }}
                       style={styles.input}
                    />
                    <Text>Giá trị tính KH*:</Text>
                    <TextInput 
                       value={formData?.gia_tri_tinh_KH.toString()}
                       onChangeText={(value) => {
                          setChangeInput('gia_tri_tinh_KH', value)
                       }}
                       style={styles.input}
                    />
                    <Text>Thời gian KH*:</Text>
                    <TextInput 
                       value={formData?.thoi_gian_KH.toString()}
                       onChangeText={(value) => {
                          setChangeInput('thoi_gian_KH', value)
                       }}
                       style={styles.input}
                    />
                    <Text>Thời điểm bắt đầu tính khấu hao</Text>
                    <TextInput 
                       value={formatDate(formData?.thoi_diem_start_KH) }
                       onChangeText={(value) => {
                          setChangeInput('thoi_diem_start_KH', value)
                       }}
                       style={styles.input}
                    />
                    <Text>Thời điểm kết thúc KH:</Text>
                    <TextInput 
                       value={"null"}
                       onChangeText={(value) => {
                          setChangeInput('thoi_diem_end_KH', value)
                       }}
                       style={styles.input}
                    />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{width: '48%'}}>
                            <Text>Tỉ lệ KH theo tháng(%)</Text>
                            <TextInput 
                                value={formData?.ti_le_KH_thang}
                                onChangeText={(value) => {
                                    setChangeInput('ti_le_KH_thang', value)
                                }}
                                style={styles.input}
                            />
                        </View>
                        <View style={{width: '48%'}}>
                            <Text>Giá trị KH theo tháng(%)</Text>
                            <TextInput 
                                value={formData?.gia_tri_KH_thang}
                                onChangeText={(value) => {
                                    setChangeInput('gia_tri_KH_thang', value)
                                }}
                                style={styles.input}
                            />
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                        <View style={{width: '48%'}}>
                            <Text>Tỉ lệ KH theo năm(%)</Text>
                            <TextInput 
                                value={formData?.ti_le_KH_nam}
                                onChangeText={(value) => {
                                    setChangeInput('ti_le_KH_nam', value)
                                }}
                                style={styles.input}
                            />
                        </View>
                        <View style={{width: '48%'}}>
                            <Text>Giá trị KH theo năm(%)</Text>
                            <TextInput 
                                value={formData?.gia_tri_KH_nam}
                                onChangeText={(value) => {
                                    setChangeInput('gia_tri_KH_nam', value)
                                }}
                                style={styles.input}
                            />
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                        <View style={{width: '48%'}}>
                            <Text>Giá trị KH luỹ kế</Text>
                            <TextInput 
                                value={formData?.gia_tri_KH_luy_ke}
                                onChangeText={(value) => {
                                    setChangeInput('gia_tri_KH_luy_ke', value)
                                }}
                                style={styles.input}
                            />
                        </View>
                        <View style={{width: '48%'}}>
                            <Text>Giá trị còn lại</Text>
                            <TextInput 
                                value={formData?.gia_tri_con_lai}
                                onChangeText={(value) => {
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

    const footerComponent = () => {
        return (
            <View style={{}}/>
        );
    };

    return (
        <>
            {isLoading && <CenterSpinner/>}
            <Screen style={[ROOT, {marginTop: 0}]} preset="fixed">
                <View style={{flex: 1}}>
                    <Header headerText='LOGO' onLeftPress={() => {
                        resetdata()
                        setShowResult(false)}}/>
                    <View style={{flex: 1}}>
                        <FlatList
                            contentContainerStyle={{flexGrow: 1}}
                            refreshing={isRefresh}
                            onRefresh={() => onRefresh()}
                            // showsVerticalScrollIndicator={false}
                            // showsHorizontalScrollIndicator={false}
                            style={{flex: 1}}
                            renderItem={null}
                            data={[]}
                            ListHeaderComponent={topComponent()}
                            ListFooterComponent={footerComponent()}
                            keyExtractor={(item, index) => 'dashboard-' + index + String(item)}
                        />
                    </View>
                </View>

                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={modalVisible?.viewInfo_general}
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
                                                <BtnBack title='Thông tin chung' goBack={() => setChangeModal('viewInfo_general', false)} />
                                                <View style={{paddingLeft: 10}}>
                                                    <Text style={{fontSize: 17, marginBottom: 7}}>Tên tài sản*</Text>
                                                    <Text style={styles.input_item}>{masterData?.assetDetail?.tenTaiSan}</Text>
                                                    <Text style={{fontSize: 17, marginBottom: 7}}>Mã tài sản*</Text>
                                                    <Text style={styles.input_item}>{masterData?.assetDetail?.maTaiSan}</Text>
                                                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                                        <View style={{width: '48%'}}>
                                                            <Text style={{fontSize: 17, marginBottom: 7}}>Phân loại</Text>
                                                            <Text style={styles.input_item}>{masterData?.assetDetail?.phanLoaiTaiSan}</Text>
                                                        </View>
                                                        <View style={{width: '48%'}}>
                                                            <Text style={{fontSize: 17, marginBottom: 7}}>Ngày vào sổ</Text>
                                                            <Text style={styles.input_item}>{formatDate(masterData?.assetDetail?.ngayVaoSo)}</Text>
                                                        </View>
                                                    </View>
                                                    <Text style={{fontSize: 17, marginBottom: 7}}>Số serial*</Text>
                                                    <Text style={styles.input_item}>{masterData?.assetDetail?.soSerial}</Text>
                                                    <Text style={{fontSize: 17, marginBottom: 7}}>Model*</Text>
                                                    <Text style={styles.input_item}>{masterData?.assetDetail?.model}</Text>
                                                    <Text style={{fontSize: 17, marginBottom: 7}}>Số hiệu*</Text>
                                                    <Text style={styles.input_item}>{masterData?.assetDetail?.soHieu}</Text>
                                                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                                        <View style={{width: '48%'}}>
                                                            <Text style={{fontSize: 17, marginBottom: 7}}>Nước sản xuất</Text>
                                                            <Text style={styles.input_item}>{masterData?.assetDetail?.nuocSX}</Text>
                                                        </View>
                                                        <View style={{width: '48%'}}>
                                                            <Text style={{fontSize: 17, marginBottom: 7}}>Hãng sản xuất</Text>
                                                            <Text style={styles.input_item}>{masterData?.assetDetail?.hangSX}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                                                        <View style={{width: '48%'}}>
                                                            <Text style={{fontSize: 17, marginBottom: 7}}>Năm sản xuất</Text>
                                                            <Text style={styles.input_item}>{masterData?.assetDetail?.namSX}</Text>
                                                        </View>
                                                        <View style={{width: '48%'}}>
                                                            <Text style={{fontSize: 17, marginBottom: 7}}>Ngày sản xuất</Text>
                                                            <Text style={styles.input_item}>{formatDate(masterData?.assetDetail?.ngayMua)}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                                                        <View style={{width: '48%'}}>
                                                            <Text style={{fontSize: 16, marginBottom: 7}}>Hạn bảo dưỡng(tháng)</Text>
                                                            <Text style={styles.input_item}>15/8/2023</Text>
                                                        </View>
                                                        <View style={{width: '48%'}}>
                                                            <Text style={{fontSize: 16, marginBottom: 7}}>Hạn bảo hành(tháng)</Text>
                                                            <Text style={styles.input_item}>12</Text>
                                                        </View>
                                                    </View>
                                                    <Text style={{fontSize: 17, marginBottom: 7}}>Mô tả tài sản</Text>
                                                    <Text style={styles.input_item}>{masterData?.assetDetail?.moTa}</Text>
                                                    <Text style={{fontSize: 17, marginBottom: 7}}>Thông tin nơi mua</Text>
                                                    <Text style={styles.input_item}>{masterData?.assetDetail?.thongTinNoiMua}</Text>
                                                    <Text style={{fontSize: 17, marginBottom: 7}}>Thông tin nơi bảo hành/bảo dưỡng</Text>
                                                    <Text style={styles.input_item}>{masterData?.assetDetail?.thongTinNoiBaoHanh}</Text>
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

                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={modalVisible?.chitiet_phanbo}
                    onRequestClose={() => {
                    }}
                >
                    <View style={styles.centeredView}>
                        <>
                            {/* {isLoading && <CenterSpinner/>} */}
                            <View style={styles.modalView}>
                                <View style={{marginVertical: 20}}>             
                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                        <TouchableOpacity style={styles.backWrapper} onPress={() => setChangeModal('chitiet_phanbo', false)}>
                                            <Ionicons name='arrow-back-outline' color={color.white} size={30}/>
                                        </TouchableOpacity>
                                        <Text style={{fontSize: 17, textTransform: 'capitalize', marginRight: 16}} fonts={'DemiBold'}>Lịch sử phân bổ</Text>
                                        <MButton text='Cấp phát' style={[styles.btnWrapper, {width: '25%'}]}/>
                                    </View> 
                                </View>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    style={{flex: 1}}
                                    renderItem={ItemView_phanbo}
                                    data={masterData?.listTaiSanPhanBo}     
                                    keyExtractor={(item, index) => 'view-info-general-' + index + String(item)}
                                />
                            </View>
                        </>
                    </View>
                </Modal>

                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={modalVisible?.chitiet_baoduong}
                    onRequestClose={() => {
                    }}
                >
                    <View style={styles.centeredView}>
                        <>
                            {/* {isLoading && <CenterSpinner/>} */}
                            <View style={styles.modalView}>
                                <View style={{marginVertical: 20}}>             
                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                        <TouchableOpacity style={styles.backWrapper} onPress={() => setChangeModal('chitiet_baoduong', false)}>
                                            <Ionicons name='arrow-back-outline' color={color.white} size={30}/>
                                        </TouchableOpacity>
                                        <Text style={{fontSize: 16, textTransform: 'capitalize', marginRight: 16}} fonts={'DemiBold'}>Lịch sử bảo trì/bảo dưỡng</Text>
                                        <MButton text='Thêm' style={[styles.btnWrapper, {width: '20%'}]}/>
                                    </View> 
                                </View>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    style={{flex: 1}}
                                    renderItem={ItemView_baotri}
                                    data={masterData?.listBaoDuong}     
                                    keyExtractor={(item, index) => 'view-info-general-' + index + String(item)}
                                />
                            </View>
                        </>
                    </View>
                </Modal>

                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={modalVisible?.chitiet_khauhao}
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
                                    ListHeaderComponent={topComponent_khauhao()}    
                                    keyExtractor={(item, index) => 'view-info-general-' + index + String(item)}
                                />
                            </View>
                        </>
                    </View>
                </Modal>

                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={modalVisible?.recall}
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
                                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, marginTop: 16, marginBottom: 16,}}>
                                                    <TouchableOpacity style={styles.backWrapper} onPress={() => setChangeModal('recall', false)}>
                                                        <Ionicons name='arrow-back-outline' color={color.white} size={30}/>
                                                    </TouchableOpacity>
                                                    <Text style={{fontSize: 17, textTransform: 'capitalize'}} fonts={'DemiBold'}>Thu hồi tài sản</Text>
                                                    <MButton text='Lưu' style={[styles.btnWrapper, {width: '20%'}]}/>
                                                </View>
                                                <View>
                                                    <Text>Tên tài sản:  Máy tính laptop dell</Text>
                                                    <Text>Mã tài sản:  VADND</Text>
                                                    <Text>Ngày thu hồi*:</Text>
                                                    <TouchableOpacity style={styles.inputDate} onPress={() => setChangeModal('date_recall', true)}>                                          
                                                        <Text>{formatDate(date_recall)}</Text>
                                                        <Ionicons name={'calendar-outline'} color="white" size={24}/>
                                                    </TouchableOpacity>
                                                    <DatePicker
                                                        mode="date"
                                                        modal
                                                        open={modalVisible?.date_recall}
                                                        date={date_recall}
                                                        onConfirm={(date) => {
                                                            setChangeModal('date_recall', false);
                                                            setDate_recall(date);               
                                                        }}
                                                        onCancel={() => {
                                                            setChangeModal('date_recall', false);
                                                        }}
                                                    />
                                                </View>
                                                <Text>Lý do thu hồi</Text>
                                                <TextInput style={{borderWidth: 1, marginTop: 10}} />
                                            </View>
                                        )
                                    }}
                                    keyExtractor={(item, index) => 'view-info-general-' + index + String(item)}
                                />
                            </View>
                        </>
                    </View>
                </Modal>

                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={modalVisible?.maintenance}
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
                                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, marginTop: 16, marginBottom: 16,}}>
                                                    <TouchableOpacity style={styles.backWrapper} onPress={() => setChangeModal('maintenance', false)}>
                                                        <Ionicons name='arrow-back-outline' color={color.white} size={30}/>
                                                    </TouchableOpacity>
                                                    <Text style={{fontSize: 17, textTransform: 'capitalize'}} fonts={'DemiBold'}>Bảo trì/Bảo dưỡng</Text>
                                                    <MButton text='Lưu' style={[styles.btnWrapper, {width: '20%'}]}/>
                                                </View>
                                                <View>
                                                    <Text>Tên tài sản:  Máy tính laptop dell</Text>
                                                    <Text>Mã tài sản:  VADND</Text>
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
                                                </View>
                                                <Text>Người phụ trách*:</Text>
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
                                                         buttonStyle={{width: '100%', backgroundColor: color.black, marginVertical: 10}}
                                                         buttonTextStyle={{color: color.white}}
                                                         search={true}
                                                         renderCustomizedButtonChild={(selectedItem, index) => {
                                                            return (
                                                                <Text>{selectedItem}</Text>
                                                            )
                                                         }}
                                                     />
                                                <Text>Lý do bảo trì/bảo dưỡng</Text>
                                                <TextInput style={{borderWidth: 1, marginTop: 10}} />
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
    container: {
        flex: 1,
      },
      btn: {
        padding: 10,
        backgroundColor: '#00FF00',
        borderRadius: 5
      },
    btnBlue: {
        backgroundColor: color.blue,
        maxWidth: layout.width / 2,
    },
    btnOrange: {
        backgroundColor: color.orange,
        maxWidth: layout.width / 2,
    },
    textWhite: {
        color: color.white
    },
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
        right: 0,
        borderRadius: 10,
    },
    appsWrapper: {
        backgroundColor: color.tabbar,
        marginTop: 16,
        marginHorizontal: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        paddingTop: 16,
        paddingBottom: 4
    },
    activityDetailWrapper: {
        borderColor: color.danger,
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 16,
        marginBottom: 16,
        borderRadius: 12
    },
    donationsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 4,
        marginHorizontal: -8
    },
    donationsItem: {
        width: '30%',
        marginHorizontal: '1.5%',
        borderWidth: 1,
        borderColor: color.danger,
        paddingHorizontal: 12,
        paddingVertical: 16,
        borderRadius: 12,
    },
    donationsText: {
        textAlign: 'center'
    },
    donationsValue: {
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 8,
        color: color.danger
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
        paddingRight: 16,
        paddingLeft: 10
    },
    input_item: {
        backgroundColor: color.black,
        paddingLeft: 10,
        paddingVertical: 7,
        marginBottom: 10
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
    input: {
        color: color.white, 
        backgroundColor: color.black, 
        marginVertical: 5
    }
});
