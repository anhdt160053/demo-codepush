
/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
 import React, {useEffect, useState} from 'react';
 import {useColorScheme} from 'react-native';
 import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
 import {createNativeStackNavigator} from '@react-navigation/native-stack';
 import {
   LoginScreen,
   DashboardScreen,
   DispatchInformation,
   MaintenanceInformation,
   DepreciationInfomation,
 } from '../screens';
 import {AuthLoadingScreen} from "../screens/auth/auth-loading-screen";
 import {navigationRef} from './navigation-utilities';
 import {PrimaryNavigator} from './primary-navigator';

 /**
  * This type allows TypeScript to know what routes are defined in this navigator
  * as well as what properties (if any) they might take when navigating to them.
  *
  * If no params are allowed, pass through `undefined`. Generally speaking, we
  * recommend using your MobX-State-Tree store(s) to keep application state
  * rather than passing state through navigation params.
  *
  * For more information, see this documentation:
  *   https://reactnavigation.org/docs/params/
  *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
  */
 export type NavigatorParamList = {
   primaryStack: undefined
   loading: undefined
   LoginScreen: undefined
   dashboardScreen: undefined
   dispatchInformation: undefined
   maintenanceInformation: undefined
   depreciationInfomation: undefined
   // ForgotPasswordScreen: undefined
   // VerifyTokenScreen: undefined
   // ResetPasswordScreen: undefined
 }
 
 interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {
 }
 
 // Documentation: https://reactnavigation.org/docs/stack-navigator/
 const Stack = createNativeStackNavigator<NavigatorParamList>();
 
//  const linking = {
//    prefixes: ['movesapp://', 'movesapp.com'],
//    config: {
//      screens:{
//        primaryStack: "apps/code",
//      },
//    },
//  };
 
 export const AppNavigator = (props: NavigationProps) => {
   const colorScheme = useColorScheme();
   return (
     <NavigationContainer
      //  linking={linking}
       ref={navigationRef}
       theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
       {...props}
     >
       <Stack.Navigator
         screenOptions={{
           headerShown: false,
         }}
         initialRouteName="LoginScreen"
       >
         <Stack.Screen name="primaryStack" component={PrimaryNavigator}/>
         <Stack.Screen name="loading" component={AuthLoadingScreen}/>
         <Stack.Screen name="LoginScreen" component={LoginScreen}/>
         <Stack.Screen name="dashboardScreen" component={DashboardScreen}/>
         <Stack.Screen name="dispatchInformation" component={DispatchInformation}/>
         <Stack.Screen name="maintenanceInformation" component={MaintenanceInformation}/>
         <Stack.Screen name="depreciationInfomation" component={DepreciationInfomation}/>
         {/* <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen}/> */}
         {/* <Stack.Screen name="VerifyTokenScreen" component={VerifyTokenScreen}/> */}
         {/* <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen}/> */}
       </Stack.Navigator>
     </NavigationContainer>
   );
 };
 
 AppNavigator.displayName = 'AppNavigator';
 
 /**
  * A list of routes from which we're allowed to leave the app when
  * the user presses the back button on Android.
  *
  * Anything not on this list will be a standard `back` action in
  * react-navigation.
  *
  * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
  */
 const exitRoutes = ['welcome'];
 export const canExit = (routeName: string) => exitRoutes.includes(routeName);
 