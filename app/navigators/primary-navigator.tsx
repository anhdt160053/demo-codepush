import React, {useEffect, useState} from 'react';
import {
    createDrawerNavigator,
} from '@react-navigation/drawer';
import {ApolloProvider} from 'react-apollo';
import {useBackButtonHandler} from './navigation-utilities';
import makeApolloClient from '../services/apollo';
import CenterSpinner from '../components/center-spinner/center-spinner';
import {
    HomeScreen,
    DashboardScreen,
    DispatchInformation,
    MaintenanceInformation,
    DepreciationInfomation,
} from '../screens';
const Drawer = createDrawerNavigator();

export function PrimaryNavigator() {
    const [client, setClient] = useState<any>(null);
    useBackButtonHandler(canExit);

    useEffect(() => {
        fetchSession();
    }, []);
    const fetchSession = async () => {
        const client = await makeApolloClient();
        setClient(client);
    };

    if (!client) {
        return <CenterSpinner/>;
    }

    return (
        <ApolloProvider client={client}>
            <Drawer.Navigator
                initialRouteName="HomeScreen"
                screenOptions={{
                    headerShown: false,
                    swipeEdgeWidth: 0,
                }}
            >
                <Drawer.Screen name="HomeScreen" component={HomeScreen}/>
                <Drawer.Screen name="dashboardScreen" component={DashboardScreen}/>
                <Drawer.Screen name="dispatchInformation" component={DispatchInformation}/>
                <Drawer.Screen name="maintenanceInformation" component={MaintenanceInformation}/>
                <Drawer.Screen name="depreciationInfomation" component={DepreciationInfomation}/>
            </Drawer.Navigator>
     </ApolloProvider>
    );
}

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ['Trang chủ'];
export const canExit = (routeName: string) => exitRoutes.includes(routeName);
