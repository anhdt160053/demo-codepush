import Toast from 'react-native-toast-message';

const padTo2Digits = (num) => {
    return num.toString().padStart(2, "0")
};

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export const showToast = (type, text1, text2 = null, visibilityTime = 2500) => {
    let params: any;
    if (text1) {
        params = {
            type,
            text1,
            text2,
            visibilityTime,
        };
    } else {
        params = {
            type,
            text1,
            visibilityTime,
        };
    }
    Toast.show(params);
};

export const regexString = (string: string) => {
    if (string?.trim() == '') {
        return true
    }
    return false
};

export const formatDate = (date, type = null) => {
    if (date == null) {
        return ''
    }
    date = new Date(date);
    // if (Platform.OS === "ios") {
    //
    // } else {
    //     date.setHours(date.getHours() - 7)
    // }
    if (type == "dd/MM/YYYY hh:mm") {
        return `${padTo2Digits(date.getDate())}/${padTo2Digits(date.getMonth() + 1)}/${date.getFullYear()} ${padTo2Digits(date.getHours())}:${padTo2Digits(date.getMinutes())}`
    } else if (type == "hh:mm") {
        return `${padTo2Digits(date.getHours())}:${padTo2Digits(date.getMinutes())}`
    } else if (type == "dd MM YYYY") {
        return `${padTo2Digits(date.getDate())} ${monthNames[date.getMonth()]} ${date.getFullYear()}`
    } else if (type == "MM YYYY") {
        return `${monthNames[date.getMonth()]} ${date.getFullYear()}`
    }else if (type == "dd/MM/YY hh:mm") {
        return `${padTo2Digits(date.getDate())}/${padTo2Digits(date.getMonth() + 1)}/${date.getFullYear()?.toString().substr(-2)} ${padTo2Digits(date.getHours())}:${padTo2Digits(date.getMinutes())}`
    }else if (type == "hh:mm:ss") {
        return `${padTo2Digits(date.getHours())}:${padTo2Digits(date.getMinutes())}:${padTo2Digits(date.getSeconds())}`
    }
    
    return [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
    ].join("/")
};