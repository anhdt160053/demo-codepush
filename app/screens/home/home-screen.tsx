import React, {useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {View, ViewStyle, StyleSheet, Text} from 'react-native';
import {Screen} from '../../components';
import {useStores} from '../../models';
import {color} from '../../theme';
import {DashboardScreen} from "../dashboard/dashboard-screen";
import {useQuery} from "@apollo/react-hooks";
import {FETCH_refreshToken} from "../profile/profile-service";

const ROOT: ViewStyle = {
    backgroundColor: color.primary,
    flex: 1,
};

export const HomeScreen = observer(function HomeScreen() {
    // const [tabIndex, setTabIndex] = useState(1);
    const {loft3DiModel} = useStores();

    const {refetch} = useQuery(FETCH_refreshToken);

    useEffect(() => {
        ;(async () => {
            if (refetch) {
                let token = await loft3DiModel.getUserInfoByKey('token');
                let {data: {refreshToken: {user: {refreshToken}, message, messageCode}}} = await refetch({
                    refreshToken: token
                });
                if (messageCode == 200) {
                    await loft3DiModel.setUserInfo({
                        token: refreshToken
                    })
                }
            }
        })();
        console.log("Home");
        
    }, []);

    return (
        <Screen style={ROOT} preset="fixed">
            <View style={{flex: 1}}>
                <DashboardScreen/>
            </View>
        </Screen>
    );
});

const styles = StyleSheet.create({
    bottomTab: {
        position: 'absolute',
        bottom: 0,
    },
});
