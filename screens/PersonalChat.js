import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useCallback, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES, FONTS } from '../constants'
import { StatusBar } from 'expo-status-bar'
import { MaterialIcons, FontAwesome } from '@expo/vector-icons'
import {
    GiftedChat,
    Send,
    Bubble,
    Avatar,
    InputToolbar,
} from 'react-native-gifted-chat'
import { useNavigation, useRoute } from '@react-navigation/native'
import { auth, database } from '../firebase/firebaseConfig'
import Loading from '../components/Loading'
import { AuthContext, AuthProvider } from '../context/AuthContext'
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    getDocs,
    orderBy,
    onSnapshot,
    limit,
} from 'firebase/firestore'
import CryptoJS from 'react-native-crypto-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRef } from 'react'
import { p, g } from '@env'
const PersonalChat = () => {
    const [isLoading, setIsLoading] = useState(true)
    const context = useContext(AuthContext)
    const userUID = context.userId
    const [userId, setUserId] = useState(userUID)
    const navigation = useNavigation()
    const route = useRoute()
    const { friend, username, email, publicKey } = route.params
    const [key, setKey] = useState(null)

    const [messages, setMessages] = useState([])
    useEffect(() => {
        const powerMod = (base, exponent, modulus) => {
            let result = 1
            base = base % modulus

            while (exponent > 0) {
                if (exponent % 2 === 1) {
                    result = (result * base) % modulus
                }
                exponent = Math.floor(exponent / 2)
                base = (base * base) % modulus
            }

            return result
        }
        AsyncStorage.getItem('secretKey')
            .then((value) => {
                if (value !== null) {
                    // console.log('publickey', publicKey)
                    // console.log('secretKey:', value)
                    // console.log('p', p)
                    const keyEncrypter = powerMod(publicKey, value, p)
                    //console.log('keyEncrypter:', keyEncrypter)
                    setKey(keyEncrypter)
                } else {
                    console.log('secretKey not found')
                }
            })
            .catch((error) => {
                console.error('Error getting userID:', error)
            })
    }, [])

    useEffect(() => {
        AsyncStorage.getItem('userId')
            .then((value) => {
                if (value !== null) {
                    if (userId) {
                        console.log('userID:', userId)
                    } else {
                        setUserId(value)
                        console.log('UserId:', value)
                    }
                } else {
                    console.log('userID not found')
                }
            })
            .catch((error) => {
                console.error('Error getting userID:', error)
            })
    }, [])

    useEffect(() => {
        const getAllMessages = async () => {
            const chatId =
                friend > userId ? userId + '-' + friend : friend + '-' + userId
            const messagesRef = collection(
                database,
                'Chats',
                chatId,
                'messages'
            )
            const messagesQuery = query(
                messagesRef,
                orderBy('createdAt', 'desc'),
                limit(20)
            )
            const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
                // console.log('key', key)
                const allTheMsgs = querySnapshot.docs.map((docSnap) => {
                    const data = docSnap.data()
                    try {
                        const decryptedText = CryptoJS.AES.decrypt(
                            data.text,
                            `${key}`
                        ).toString(CryptoJS.enc.Utf8)
                        //console.log('giai ma khi onsnapshot', decryptedText)
                        data.text = decryptedText
                    } catch (error) {
                        console.log(error)
                    }

                    // data.text = decryptedText

                    const createdAt = data.createdAt
                        ? new Date(data.createdAt.seconds * 1000)
                        : null

                    return {
                        ...data,
                        createdAt,
                    }
                })
                if (!querySnapshot.metadata.hasPendingWrites) {
                    setMessages(allTheMsgs)
                }
            })
            return unsubscribe
        }

        if (userId) {
            getAllMessages()
            setIsLoading(false)
        }
    }, [key, userId])

    const onSend = async (msgArray) => {
        const msg = msgArray[0]
        // console.log('key in onsend', key)
        const usermsg = {
            ...msg,
            sentBy: userId,
            sentTo: friend,
            createdAt: new Date(),
        }

        // usermsg.text = encryptedText
        //console.log('usermes.text:', usermsg.text)
        const encryptedText = CryptoJS.AES.encrypt(
            msg.text,
            `${key}`
        ).toString()
        // console.log(encryptedText)
        // try {
        //     console.log(
        //         'giai max:',
        //         CryptoJS.AES.decrypt(encryptedText, `${key}`).toString(
        //             CryptoJS.enc.Utf8
        //         )
        //     )
        // } catch (error) {
        //     console.log(error)
        // }

        usermsg.text = encryptedText

        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, usermsg)
        )

        const docid =
            friend > userId ? userId + '-' + friend : friend + '-' + userId

        try {
            await addDoc(collection(database, 'Chats', docid, 'messages'), {
                ...usermsg,
                createdAt: serverTimestamp(),
            })
        } catch (error) {
            console.error('Error adding document: ', error)
        }
    }
    const deleteMessage = async (messageId) => {
        const docid =
            friend > userId ? userId + '-' + friend : friend + '-' + userId
        const messageRef = collection(database, 'Chats', docid, 'messages')
        try {
            await messageRef.doc(messageId).delete()
        } catch (error) {
            console.error('Error deleting message: ', error)
        }
    }
    return (
        <SafeAreaView style={{ flex: 1, color: COLORS.secondaryWhite }}>
            <StatusBar style="light" backgroundColor={COLORS.white} />
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 22,
                    backgroundColor: COLORS.white,
                    height: 60,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Chats')}
                    >
                        <MaterialIcons
                            name="keyboard-arrow-left"
                            size={24}
                            color={COLORS.black}
                        />
                    </TouchableOpacity>

                    <Text
                        style={{
                            ...FONTS.h4,
                            marginLeft: 10,
                            textAlign: 'center',
                        }}
                    >
                        Chats
                    </Text>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('ProfileAccount', {
                                username: username,
                                userId: userId,
                                email: email,
                            })
                        }
                    >
                        <Text
                            style={{
                                ...FONTS.h4,
                                textAlign: 'center',
                                float: 'right',
                            }}
                        >
                            {username}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {isLoading ? (
                <Loading /> // Hiển thị thành phần Loading nếu isLoading là true
            ) : (
                <GiftedChat
                    style={{ flex: 1 }}
                    messages={messages}
                    onSend={(text) => onSend(text)}
                    user={{
                        _id: userId,
                    }}
                    renderInputToolbar={(props) => (
                        <InputToolbar
                            {...props}
                            renderLoading={() => (
                                <ActivityIndicator size="small" color="black" />
                            )}
                        />
                    )}
                />
            )}
        </SafeAreaView>
    )
}

export default PersonalChat
