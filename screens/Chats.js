import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
    RefreshControl,
    ScrollView,
} from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageContainer from '../components/PageContainer'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { FONTS, COLORS } from '../constants'
import { contacts } from '../constants/data'
import { getDatabase, ref, onValue, get } from 'firebase/database'
import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Loading from '../components/Loading'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { database } from '../firebase/firebaseConfig'

const db = getDatabase()
const Chats = ({ navigation }) => {
    const [search, setSearch] = useState('')
    const [allUsers, setAllUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [userCurrentId, setUserCurrentId] = useState('')

    const [refreshing, setRefreshing] = useState(false)

    const onRefresh = useCallback(() => {
        setRefreshing(true)
    }, [])

    const checkConversation = async (chatId) => {
        try {
            const messagesRef = collection(
                database,
                'Chats',
                chatId,
                'messages'
            )

            const q = query(messagesRef, orderBy('createdAt', 'desc'))

            const msgSnapshot = await getDocs(q)

            if (msgSnapshot) {
                const allTheMsgs = msgSnapshot.docs
                if (allTheMsgs.length > 0) {
                    return true
                } else {
                    return false
                }
            } else {
                console.log('error')
            }
        } catch (error) {
            console.log(error)
        }
        return false
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const value = await AsyncStorage.getItem('userId')
                if (value !== null) {
                    setUserCurrentId(value)
                    const snapshot = await get(ref(db, 'users'))
                    const users = snapshot.val()
                    const usersArray = Object.values(users)
                    const filteredUsersArray = usersArray.filter(
                        (user) => user.uuid !== value
                    )
                    // console.log(filteredUsersArray)
                    let array = []
                    for (let i = 0; i < filteredUsersArray.length; i++) {
                        const chatId =
                            filteredUsersArray[i].uuid > value
                                ? value + '-' + filteredUsersArray[i].uuid
                                : filteredUsersArray[i].uuid + '-' + value
                        const check = await checkConversation(chatId)
                        if (check) {
                            array.push(filteredUsersArray[i])
                        }
                    }

                    setAllUsers(array)
                    setFilteredUsers(array)
                    setIsLoading(false)
                    setRefreshing(false)
                } else {
                    console.log('userID not found')
                }
            } catch (error) {
                console.error('Error:', error)
            }
        }
        fetchData()
    }, [refreshing])
    const componentDidMount = async () => {
        try {
            const db = getDatabase()
            await get(ref(db, 'users')).then((snapshot) => {
                const users = snapshot.val()
            })
        } catch (error) {
            alert(error)
        }
    }

    const handleSearch = (text) => {
        setSearch(text)
        const filteredData = allUsers.filter((user) =>
            user.username.toLowerCase().includes(text.toLowerCase())
        )
        setFilteredUsers(filteredData)
    }

    const renderItem = ({ item, index }) => (
        <TouchableOpacity
            key={index}
            onPress={() =>
                navigation.navigate('PersonalChat', {
                    username: item.username,
                    userId: item.uuid,
                    friend: item.uuid,
                    email: item.email,
                    publicKey: item.publicKey,
                    avatar: item.profile_picture,
                })
            }
            style={[
                {
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 22,
                    borderBottomColor: COLORS.secondaryWhite,
                    borderBottomWidth: 1,
                },
                index % 2 !== 0
                    ? {
                          backgroundColor: COLORS.tertiaryWhite,
                      }
                    : null,
            ]}
        >
            <View
                style={{
                    paddingVertical: 15,
                    marginRight: 22,
                }}
            >
                {item.isOnline && item.isOnline == true && (
                    <View
                        style={{
                            height: 14,
                            width: 14,
                            borderRadius: 7,
                            backgroundColor: COLORS.green,
                            borderColor: COLORS.white,
                            borderWidth: 2,
                            position: 'absolute',
                            top: 14,
                            right: 2,
                            zIndex: 1000,
                        }}
                    ></View>
                )}

                {item.profile_picture ? (
                    <Image
                        source={{ uri: item.profile_picture }}
                        resizeMode="contain"
                        style={{
                            height: 50,
                            width: 50,
                            borderRadius: 25,
                        }}
                    />
                ) : (
                    <Image
                        source={{
                            uri: 'https://w7.pngwing.com/pngs/754/2/png-transparent-samsung-galaxy-a8-a8-user-login-telephone-avatar-pawn-blue-angle-sphere-thumbnail.png',
                        }}
                        resizeMode="contain"
                        style={{
                            height: 50,
                            width: 50,
                            borderRadius: 25,
                        }}
                    />
                )}
            </View>
            <View
                style={{
                    flexDirection: 'column',
                }}
            >
                <Text style={{ ...FONTS.h4, marginBottom: 4 }}>
                    {item.username}
                </Text>
                {/* <Text style={{ fontSize: 14, color: COLORS.secondaryGray }}>
                    LastMessage
                </Text> */}
            </View>
        </TouchableOpacity>
    )
    return (
        <SafeAreaView style={{ flex: 1 }}>
            {isLoading ? (
                <Loading /> // Hiển thị thành phần Loading nếu isLoading là true
            ) : (
                // <ScrollView
                //     showsVerticalScrollIndicator={false}
                //     refreshControl={
                //         <RefreshControl
                //             refreshing={refreshing}
                //             onRefresh={onRefresh}
                //         />
                //     }
                // >
                <PageContainer>
                    <View style={{ flex: 1 }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginHorizontal: 22,
                                marginTop: 22,
                            }}
                        >
                            <Text style={{ ...FONTS.h4 }}>Chats</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    onPress={() => console.log('Add contacts')}
                                >
                                    <MaterialCommunityIcons
                                        name="message-badge-outline"
                                        size={20}
                                        color={COLORS.secondaryBlack}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        marginLeft: 12,
                                    }}
                                    onPress={() => componentDidMount()}
                                >
                                    <MaterialCommunityIcons
                                        name="playlist-check"
                                        size={20}
                                        color={COLORS.secondaryBlack}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View
                            style={{
                                marginHorizontal: 22,
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: COLORS.secondaryWhite,
                                height: 48,
                                marginVertical: 22,
                                paddingHorizontal: 12,
                                borderRadius: 20,
                            }}
                        >
                            <Ionicons
                                name="ios-search-outline"
                                size={24}
                                color={COLORS.black}
                            />

                            <TextInput
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    marginHorizontal: 12,
                                }}
                                value={search}
                                onChangeText={handleSearch}
                                placeholder="Search contact..."
                            />
                        </View>

                        <View
                            style={{
                                paddingBottom: 100,
                            }}
                        >
                            <FlatList
                                data={filteredUsers}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.uuid}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                    />
                                }
                            />
                        </View>
                    </View>
                </PageContainer>
            )}
        </SafeAreaView>
    )
}

export default Chats
