// import React from 'react';
// import {
//   View,
// } from 'react-native';
// import {setLogout} from '../../services/authActions';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useIsFocused} from '@react-navigation/native';
// import {color} from '../../theme';
// import {useStores} from '../../models';
// import CenterSpinner from "../../components/center-spinner/center-spinner";

// // @ts-ignore
// const AuthLoadingScreen = ({navigation}) => {
//   const isFocused = useIsFocused();
//   const {loft3DiModel} = useStores();

//   // auth init function
//   const _bootstrapAsync = async () => {
//     // Fetch token from storage
//     const session = await loft3DiModel.getUserInfo();
//     // If session exists, validate it, else redirect to login screen
//     if (session) {
//       const sessionObj = session;
//       const currentTime = Math.floor(new Date().getTime() / 1000);
//       if (currentTime < sessionObj.exp) {
//         setLogout(() => navigation.navigate('LoginScreen'));
//         navigation.navigate('primaryStack');
//       } else {
//         navigation.navigate('LoginScreen');
//       }
//     } else {
//       navigation.navigate('LoginScreen');
//     }
//   };

  // React.useEffect(() => {
  //   isFocused && _bootstrapAsync();
  // }, [isFocused]);

//   return (
//     <View style={{flex: 1, backgroundColor: color.primary}}>
//       {/*<CenterSpinner/>*/}
//     </View>
//   );
// };

// export default AuthLoadingScreen;

import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Animated, Dimensions, FlatList, StyleSheet, View, ViewStyle} from 'react-native';
import {Header, Screen, Text} from '../../components';
import {useIsFocused, useNavigation} from "@react-navigation/native"
// import { useStores } from "../../models"
import {color} from '../../theme';
import CenterSpinner from '../../components/center-spinner/center-spinner';
import { useStores } from '../../models';
import {setLogout} from '../../services/authActions';

const layout = Dimensions.get('window');

const ROOT: ViewStyle = {
    backgroundColor: color.primary,
    flex: 1,
};

export const AuthLoadingScreen = observer(function AuthLoadingScreen() {
    const navigation = useNavigation();
    const [isLoading, setLoading] = useState(false);
    const isFocused = useIsFocused();
    const {loft3DiModel} = useStores();

    // useEffect(() => {
    //   fetchData();
    // }, []);
    // const fetchData = async () => {
    // };

    const _bootstrapAsync = async () => {
    // Fetch token from storage
        const session = await loft3DiModel.getUserInfo();
        // If session exists, validate it, else redirect to login screen
        if (session) {
          const sessionObj = session;
          const currentTime = Math.floor(new Date().getTime() / 1000);
          if (currentTime < sessionObj.exp) {
            setLogout(() => navigation.navigate('LoginScreen'));
            navigation.navigate('primaryStack');
          } else {
            navigation.navigate('LoginScreen');
          }
        } else {
          navigation.navigate('LoginScreen');
        }
  };

  React.useEffect(() => {
    isFocused && _bootstrapAsync();
  }, [isFocused]);

    return (
    <View style={{flex: 1, backgroundColor: color.primary}}>
      {/*<CenterSpinner/>*/}
    </View>
  );

});

const styles = StyleSheet.create({});
