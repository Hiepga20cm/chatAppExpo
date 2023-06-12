import React, { useContext, useEffect, useState } from 'react'
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native'

import CustomButton from '../components/CustomButton'
import { Ionicons } from '@expo/vector-icons'

import { AuthContext, AuthProvider } from '../context/AuthContext'

const LoginScreen = ({ navigation }) => {
    const [userName, setUserName] = useState(null)
    const [passWord, setPassWord] = useState(null)
    const [userNameError, setUserNameError] = useState(null)
    const [passwordError, setPasswordError] = useState(null)
    const [showPassword, setShowPassword] = useState(false)

    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const context = useContext(AuthContext)
    const userToken = context.userToken

    const login = context.login

    const validateEmail = (email) => {
        // Kiểm tra đúng định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const validatePassword = (password) => {
        // Kiểm tra mật khẩu có chữ và số, chữ viết hoa, kí tự đặc biệt, độ dài tối thiểu 6
        const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{6,}(?![\'\"<>;])$/

        console.log(11111, passwordRegex.test(password))
        return passwordRegex.test(password)
    }

    useEffect(() => {
        if (passwordError !== null && userNameError !== null) {
            if (
                !userName ||
                userName.trim().length === 0 ||
                !validateEmail(userName)
            ) {
                setUserNameError('Please enter a valid email')
            } else {
                setUserNameError('')
            }

            if (
                !passWord ||
                passWord.trim().length === 0 ||
                !validatePassword(passWord)
            ) {
                console.log(passWord)
                setPasswordError(
                    'Password must contain at least one lowercase letter, one uppercase letter, one number, one special character and at least 6 characters, and contain no prohibited characters'
                )
            } else {
                console.log(passWord)
                setPasswordError('')
            }
        }
    }, [userName, passWord])

    const handleLogin = () => {
        console.log('hello')
        let isValid = true

        if (
            !userName ||
            userName.trim().length === 0 ||
            !validateEmail(userName)
        ) {
            setUserNameError('Please enter a valid email')
            isValid = false
        } else {
            setUserNameError(null)
        }

        if (
            !passWord ||
            passWord.trim().length === 0 ||
            !validatePassword(passWord)
        ) {
            setPasswordError(
                'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 6 characters long, and not contain < > & " ;'
            )
            isValid = false
        } else {
            setPasswordError(null)
        }

        if (isValid) {
            login(userName, passWord)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ paddingHorizontal: 25 }}>
                <Text
                    style={{
                        fontSize: 28,
                        fontWeight: '500',
                        color: '#333',
                        marginBottom: 30,
                    }}
                >
                    Login
                </Text>
                <View style={{ marginBottom: 20 }}>
                    <Text
                        style={{
                            marginBottom: 2,
                            paddingLeft: 2,
                            fontWeight: '600',
                        }}
                    >
                        Email
                    </Text>
                    <TextInput
                        style={{
                            borderBottomColor: '#ccc',
                            borderBottomWidth: 1,
                            padding: 10,

                            color: 'gray',
                        }}
                        value={userName}
                        onChangeText={(text) => setUserName(text)}
                    />
                    {userNameError && (
                        <Text style={{ color: 'red', marginTop: 5 }}>
                            {userNameError}
                        </Text>
                    )}
                </View>

                <View
                    style={{
                        marginBottom: 20,
                        borderBottomColor: '#ccc',
                        borderBottomWidth: 1,
                    }}
                >
                    <Text
                        style={{
                            marginBottom: 2,
                            paddingLeft: 2,
                            fontWeight: '600',
                        }}
                    >
                        Password
                    </Text>
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                        <TextInput
                            style={{
                                flex: 1,
                                color: 'gray',
                                padding: 10,
                            }}
                            value={passWord}
                            onChangeText={setPassWord}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={toggleShowPassword}>
                            <Ionicons
                                name={showPassword ? 'eye-off' : 'eye'}
                                size={24}
                                color="gray"
                                style={{ marginHorizontal: 5 }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                {passwordError && (
                    <Text
                        style={{
                            color: 'red',
                            marginTop: -15,
                            marginBottom: 20,
                        }}
                    >
                        {passwordError}
                    </Text>
                )}

                <CustomButton label={'Login'} onPress={handleLogin} />

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginBottom: 30,
                    }}
                >
                    <Text>New to the app?</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('RegisterScreen')}
                    >
                        <Text style={{ color: '#AD40AF', fontWeight: '700' }}>
                            {' '}
                            Register
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default LoginScreen
