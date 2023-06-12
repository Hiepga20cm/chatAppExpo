import React, { useState, useEffect } from 'react'
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TextInput,
    Alert,
    TouchableOpacity,
} from 'react-native'
import { getDatabase, ref, set } from 'firebase/database'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { auth } from '../firebase/firebaseConfig'
import { Ionicons } from '@expo/vector-icons'

import InputField from '../components/InputField'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { p, g } from '@env'
import CustomButton from '../components/CustomButton'
const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassWord] = useState(null)
    const [userNameError, setUserNameError] = useState(null)
    const [passwordError, setPasswordError] = useState(null)
    const [nameError, setNameError] = useState(null)

    const [showPassword, setShowPassword] = useState(false)
  

    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const validateName = (name) => {
        // Kiểm tra không có kí tự đặc biệt và có ít nhất 3 kí tự
        const nameRegex = /^[a-zA-Z0-9]{3,}$/
        return nameRegex.test(name)
      }

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
        if (passwordError !== null && userNameError !== null, nameError != null) {
            if (
                !email ||
                email.trim().length === 0 ||
                !validateEmail(email)
            ) {
                setUserNameError('Please enter a valid email')
            } else {
                setUserNameError('')
            }

            if (
                !name ||
                name.trim().length === 0 ||
                !validateName(name)
            ) {
                setNameError('Please enter name with at least 3 characters and no special characters')
            } else {
                setNameError('')
            }

            if (
                !password ||
                password.trim().length === 0 ||
                !validatePassword(password)
            ) {
                console.log(password)
                setPasswordError(
                    'Password must contain at least one lowercase letter, one uppercase letter, one number, one special character and at least 6 characters, and contain no prohibited characters'
                )
            } else {
                console.log(password)
                setPasswordError('')
            }
        }
    }, [email, password, name])

    const handleSignUp = async () => {
        console.log('hello')
        let isValid = true

        if (
            !email ||
            email.trim().length === 0 ||
            !validateEmail(email)
        ) {
            setUserNameError('Please enter a valid email')
            isValid = false
        } else {
            setUserNameError(null)
        }
        if (
            !name ||
            name.trim().length === 0 ||
            !validateName(name)
        ) {
            setNameError('Please enter name with at least 3 characters and no special characters')
            isValid = false
        } else {
            setUserNameError('')
        }

        if (
            !password ||
            password.trim().length === 0 ||
            !validatePassword(password)
        ) {
            setPasswordError(
                'Password must contain at least one lowercase letter, one uppercase letter, one number, one special character and at least 6 characters, and contain no prohibited characters'
            )
            isValid = false
        } else {
            setPasswordError(null)
        }

        if (isValid) {
            try {
                const res = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                )
                const uid = res.user.uid
                const secretKey = Math.floor(Math.random() * 100) + 1
                console.log('secretKey', secretKey)
                await AsyncStorage.setItem('secretKey', secretKey.toString())
                const publicKey = g ** secretKey % p
                console.log('publicKey', publicKey)
                await writeUserData(uid, name, email, '', publicKey)

                await updateProfile(auth.currentUser, {
                    displayName: name,
                })

                alert('User created successfully')
                navigation.navigate('LoginScreen')
            } catch (err) {
                console.log(err)
                alert(err)
            }
        } else {
           console.log('bug regis')
        }
    }

    const writeUserData = (userId, name, email, imageUrl, publicKey) => {
        const db = getDatabase()
        set(ref(db, 'users/' + userId), {
            username: name,
            email: email,
            profile_picture: imageUrl,
            uuid: userId,
            publicKey: publicKey,
        })
    }

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ paddingHorizontal: 25 }}
            >
                <View style={{ alignItems: 'center' }}></View>

                <Text
                    style={{
                        fontSize: 28,
                        fontWeight: '500',
                        color: '#333',
                        marginBottom: 30,
                    }}
                >
                    Register
                </Text>
                <View style={{ marginBottom: 20 }}>
                    <Text
                        style={{
                            marginBottom: 2,
                            paddingLeft: 2,
                            fontWeight: '600',
                        }}
                    >
                        Name
                    </Text>
                    <TextInput
                        style={{
                            borderBottomColor: '#ccc',
                            borderBottomWidth: 1,
                            padding: 10,

                            color: 'gray',
                        }}
                        value={name}
                        onChangeText={(text) => setName(text)}
                    />
                    {nameError && (
                        <Text style={{ color: 'red', marginTop: 5 }}>
                            {nameError}
                        </Text>
                    )}
                </View>

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
                        value={email}
                        onChangeText={(text) => setEmail(text)}
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
                            value={password}
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

                {/* <InputField label={'Confirm Password'} inputType="password" /> */}

                <CustomButton
                    label={'Register'}
                    onPress={() => {
                        handleSignUp()
                    }}
                />

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginBottom: 30,
                    }}
                >
                    <Text>Already registered?</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('LoginScreen')}
                    >
                        <Text style={{ color: '#AD40AF', fontWeight: '700' }}>
                            {' '}
                            Login
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default RegisterScreen
