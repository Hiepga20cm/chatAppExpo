import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageContainer from '../components/PageContainer'
import { MaterialCommunityIcons, AntDesign, Ionicons } from '@expo/vector-icons'
import { FONTS, COLORS } from '../constants'
import { contacts } from '../constants/data'
import { getDatabase, ref, onValue, get } from 'firebase/database'
import { useEffect } from 'react'
import { Avatar } from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { auth, collection, database } from '../firebase/firebaseConfig'
import { doc, getDoc, getDocs } from 'firebase/firestore'
const db = getDatabase()
const Chats = ({ navigation }) => {
    const [search, setSearch] = useState('')
    const [allUsers, setAllUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const value = await AsyncStorage.getItem('userId')
                if (value !== null) {
                    const snapshot = await get(ref(db, 'users'))
                    const users = snapshot.val()
                    const usersArray = Object.values(users)
                    const filteredUsersArray = usersArray.filter(
                        (user) => user.uuid !== value
                    )
                    // const docRef = doc(
                    //     database,
                    //     'Chats',
                    //     '029SuvkAyyYeA8xwVaLy9G9JSBv1-UECvse08C9T9368dm5gP12wsAQn1'
                    // )
                    // const check = await getDoc(docRef)
                    // if (check.exists()) {
                    //     console.log('co ton tai')
                    // } else {
                    //     console.log('khồng tồn tại')
                    // }
                    setAllUsers(filteredUsersArray)
                    setFilteredUsers(filteredUsersArray)
                } else {
                    console.log('userID not found')
                }
            } catch (error) {
                console.error('Error:', error)
            }
        }
        fetchData()
    }, [])
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
    const getFirstKey = (str) => {
        if (str) {
            return str.split('')[0].toUpperCase()
        }
        return ''
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
                            uri: 'https://vnn-imgs-f.vgcloud.vn/2020/03/23/11/trend-avatar-1.jpg',
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
                    {item.lastSeen}
                </Text> */}
            </View>
        </TouchableOpacity>
    )
    return (
        <SafeAreaView style={{ flex: 1 }}>
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
                        <Text style={{ ...FONTS.h4, fontSize: 20, fontWeight:'bold'}}>Chats</Text>
                        {/* <View style={{ flexDirection: 'row' }}>
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
                        </View> */}
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
                        />
                    </View>
                </View>
            </PageContainer>
        </SafeAreaView>
    )
}

export default Chats
