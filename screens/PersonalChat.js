import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useCallback, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES, FONTS } from '../constants'
import { StatusBar } from 'expo-status-bar'
import { MaterialIcons, FontAwesome } from '@expo/vector-icons'
import { GiftedChat, Send, Bubble } from 'react-native-gifted-chat'
import { useNavigation, useRoute } from '@react-navigation/native'
import { auth, database } from '../firebaseConfig'

import { AuthContext, AuthProvider } from '../context/AuthContext'
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    getDocs,
    orderBy,
    onSnapshot,
} from 'firebase/firestore'

import AsyncStorage from '@react-native-async-storage/async-storage'

const PersonalChat = () => {
    const context = useContext(AuthContext)
    const userUID = context.userId
    const [userId, setUserId] = useState(userUID)

    const navigation = useNavigation()
    const route = useRoute()
    const { friend } = route.params

    const [messages, setMessages] = useState([])
    useEffect(() => {
        AsyncStorage.getItem('userId')
            .then((value) => {
                if (value !== null) {
                    if (userId) {
                        console.log('userID:', userId)
                    } else {
                        setUserId(value)
                        console.log('Value:', value)
                    }
                } else {
                    console.log('userID not found')
                }
            })
            .catch((error) => {
                console.error('Error getting userID:', error)
            })
    }, [])

    const getAllMessages = async () => {
        console.log('friend', friend)
        console.log('userId', userId)
        const chatid =
            friend > userId ? userId + '-' + friend : friend + '-' + userId
        const messagesRef = collection(database, 'Chats', chatid, 'messages')
        const messagesQuery = query(messagesRef, orderBy('createdAt', 'desc'))

        // const check = onSnapshot(messagesQuery, (querySnapshot) => {
        //     const messages111 = []
        //     querySnapshot.forEach((doc) => {
        //         messages.push(doc.data())
        //     })
        //     // Do something with the updated messages array
        //     console.log('Do something with the updated messages array')
        //     console.log(messages111)
        // })

        const msgSnapshot = await getDocs(messagesQuery)
        const allTheMsgs = msgSnapshot.docs.map((docSnap) => {
            return {
                ...docSnap.data(),
                createdAt: docSnap.data().createdAt.toDate(),
            }
        })
        setMessages(allTheMsgs)
    }

    useEffect(() => {
        // const chatid =
        //     friend > userId ? userId + '-' + friend : friend + '-' + userId
        // const unsubscribe = onSnapshot(
        //     query(
        //         collection(database, 'Chats', chatid, 'messages'),
        //         orderBy('timestamp', 'desc')
        //     ),
        //     (snapshot) =>
        //         setMessages(
        //             snapshot.docs.map((doc) => ({
        //                 id: doc.id,
        //                 data: doc.data(),
        //             }))
        //         )

        // )
        // return unsubscribe;
        getAllMessages()
        console.log(123123)
    }, [])

    // useEffect(()=>{

    // },[])

    const onSend = (msgArray) => {
        const msg = msgArray[0]
        const usermsg = {
            ...msg,
            sentBy: userId,
            sentTo: friend,
            createdAt: new Date(),
        }

        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, usermsg)
        )

        const docid =
            friend > userId ? userId + '-' + friend : friend + '-' + userId

        const docRef = addDoc(
            collection(database, 'Chats', docid, 'messages'),
            {
                ...usermsg,
                createdAt: serverTimestamp(),
            }
        )

        console.log('Document written with ID: ', docRef.id)
    }

    // const renderSend = (props) => {
    //     return (
    //         <Send {...props}>
    //             <View
    //                 style={{
    //                     height: 36,
    //                     alignItems: 'center',
    //                     justifyContent: 'center',
    //                     width: 36,
    //                     borderRadius: 18,
    //                     backgroundColor: COLORS.primary,
    //                     marginRight: 5,
    //                     marginBottom: 5,
    //                 }}
    //             >
    //                 <FontAwesome name="send" size={12} color={COLORS.white} />
    //             </View>
    //         </Send>
    //     )
    // }

    // customize sender messages
    // const renderBubble = (props) => {
    //     return (
    //         <Bubble
    //             {...props}
    //             wrapperStyle={{
    //                 right: {
    //                     backgroundColor: COLORS.primary,
    //                 },
    //             }}
    //             textStyle={{
    //                 right: {
    //                     color: COLORS.white,
    //                 },
    //             }}
    //         />
    //     )
    // }
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
                        onPress={() => navigation.navigate('Contacts')}
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
                ></View>
            </View>

            <GiftedChat
                style={{ flex: 1 }}
                messages={messages}
                onSend={(text) => onSend(text)}
                user={{
                    _id: userId,
                }}
            />
        </SafeAreaView>
    )
}

export default PersonalChat
