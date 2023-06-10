// import { View, Text, TouchableOpacity } from 'react-native'
// import React, { useEffect, useState, useContext } from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { COLORS, FONTS } from '../constants'
// import { StatusBar } from 'expo-status-bar'
// import { MaterialIcons, FontAwesome } from '@expo/vector-icons'
// import { GiftedChat, Send, Bubble } from 'react-native-gifted-chat'
// import { useNavigation, useRoute } from '@react-navigation/native'
// import {
//     collection,
//     addDoc,
//     serverTimestamp,
//     query,
//     getDocs,
//     orderBy,
//     onSnapshot,
// } from 'firebase/firestore'
// import { auth, database } from '../firebaseConfig'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import CryptoES from 'crypto-es';


// const PersonalChat = () => {
//     const [userId, setUserId] = useState(null)
//     const [messages, setMessages] = useState([])
//     const navigation = useNavigation()
//     const route = useRoute()
//     const { friend } = route.params
//     const privateKey = 'dsadasdsadasdadasdadasdasdasda'

//     useEffect(() => {
//         AsyncStorage.getItem('userId')
//             .then((value) => {
//                 if (value !== null) {
//                     if (userId) {
//                         console.log('userID:', userId)
//                     } else {
//                         setUserId(value)
//                         console.log('Value:', value)
//                     }
//                 } else {
//                     console.log('userID not found')
//                 }
//             })
//             .catch((error) => {
//                 console.error('Error getting userID:', error)
//             })
//     }, [])

//     useEffect(() => {
//         const getAllMessages = async () => {
//             const chatId = friend > userId ? userId + '-' + friend : friend + '-' + userId;
//             const messagesRef = collection(database, 'Chats', chatId, 'messages');
//             const messagesQuery = query(messagesRef, orderBy('createdAt', 'desc'));
//             const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
//                 const allTheMsgs = querySnapshot.docs.map((docSnap) => {
//                     const data = docSnap.data();
        
//                     // Giải mã nội dung tin nhắn sử dụng AES decryption với privateKey
//                     const decryptedText = CryptoES.AES.decrypt(data.text, privateKey).toString(CryptoES.enc.Utf8);
        
//                     // Cập nhật nội dung tin nhắn với phiên bản đã giải mã
//                     data.text = decryptedText;
        
//                     const createdAt = data.createdAt ? new Date(data.createdAt.seconds * 1000) : null;
//                     return {
//                         ...data,
//                         createdAt,
//                     };
//                 });
        
//                 if (!querySnapshot.metadata.hasPendingWrites) {
//                     setMessages(allTheMsgs);
//                 }
//             });
        
//             return unsubscribe;
//         };

//         if (userId) {
//             getAllMessages()
//         }

//     }, [userId])

//     const onSend = async (messages) => {
//         const message = messages[0];
//         const userMessage = {
//             ...message,
//             sentBy: userId,
//             sentTo: friend,
//             createdAt: new Date(),
//         };
    
//         // Mã hóa nội dung tin nhắn sử dụng AES encryption với privateKey
//         const encryptedText = CryptoES.AES.encrypt(message.text, privateKey).toString();
    
//         // Cập nhật nội dung tin nhắn với phiên bản đã mã hóa
//         userMessage.text = encryptedText;
    
//         setMessages((previousMessages) =>
//             GiftedChat.append(previousMessages, userMessage)
//         );
    
//         const chatId =
//             friend > userId ? userId + '-' + friend : friend + '-' + userId;
    
//         try {
//             await addDoc(collection(database, 'Chats', chatId, 'messages'), {
//                 ...userMessage,
//                 createdAt: serverTimestamp(),
//             });
//         } catch (error) {
//             console.error('Error adding document: ', error);
//         }
//     };

//     const renderSend = (props) => {
//         return (
//             <Send {...props}>
//                 <View
//                     style={{
//                         height: 36,
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         width: 36,
//                         borderRadius: 18,
//                         backgroundColor: COLORS.primary,
//                         marginRight: 5,
//                         marginBottom: 5,
//                     }}
//                 >
//                     <FontAwesome name="send" size={12} color={COLORS.white} />
//                 </View>
//             </Send>
//         )
//     }

//     // customize sender messages
//     const renderBubble = (props) => {
//         return (
//             <Bubble
//                 {...props}
//                 wrapperStyle={{
//                     right: {
//                         backgroundColor: COLORS.primary,
//                     },
//                 }}
//                 textStyle={{
//                     right: {
//                         color: COLORS.white,
//                     },
//                 }}
//             />
//         )
//     }
//     return (
//         <SafeAreaView style={{ flex: 1, color: COLORS.secondaryWhite }}>
//             <StatusBar style="light" backgroundColor={COLORS.white} />
//             <View
//                 style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     paddingHorizontal: 22,
//                     backgroundColor: COLORS.white,
//                     height: 60,
//                 }}
//             >
//                 <View
//                     style={{
//                         flexDirection: 'row',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                     }}
//                 >
//                     <TouchableOpacity
//                         onPress={() => navigation.navigate('Contacts')}
//                     >
//                         <MaterialIcons
//                             name="keyboard-arrow-left"
//                             size={24}
//                             color={COLORS.black}
//                         />
//                     </TouchableOpacity>
//                     <Text
//                         style={{
//                             ...FONTS.h4,
//                             marginLeft: 10,
//                             textAlign: 'center',
//                         }}
//                     >
//                         Chats
//                     </Text>
//                 </View>

//                 <View
//                     style={{
//                         flexDirection: 'row',
//                         alignItems: 'center',
//                     }}
//                 ></View>
//             </View>

//             <GiftedChat
//                 style={{ flex: 1 }}
//                 messages={messages}
//                 onSend={(text) => onSend(text)}
//                 user={{
//                     _id: userId,
//                 }}
//             />
//         </SafeAreaView>
//     )
// }

// export default PersonalChat