import { View, Text, TouchableOpacity, Alert, ScrollView, RefreshControl } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageContainer from '../components/PageContainer'
import { COLORS, FONTS } from '../constants'
import { AuthContext, AuthProvider } from '../context/AuthContext'
import { database } from '../firebase/firebaseConfig'
import { getDatabase, ref, onValue, get } from 'firebase/database'
import {
    AntDesign,
    MaterialIcons,
    MaterialCommunityIcons,
    Ionicons,
    Entypo,
} from '@expo/vector-icons'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { Avatar } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
const db = getDatabase()
const More = () => {
    const context = useContext(AuthContext)
    const userToken = context.userToken
    const logout = context.logout
    const navigation = useNavigation()
    const [userProfile, setUserProfile] = useState({})
    const [refreshing, setRefreshing] = useState(false)

    const handleLogout = () => {
        logout()
    }

    const onRefresh = () => {
        setRefreshing(true)
        // Xử lý các hoạt động cần thiết khi refresh trang
        // Sau khi hoàn tất, gọi setRefreshing(false) để kết thúc quá trình refresh
        setRefreshing(false)
    }

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId')

                if (userId) {
                    const userRef = ref(db, 'users/' + userId)
                    const data = await get(userRef)
                    if (data.exists()) {
                        const userData = data.val()
                        setUserProfile(userData)
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
        getUserProfile()
    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <PageContainer>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginHorizontal: 22,
                            marginVertical: 22,
                        }}
                    >
                        <Text style={{ ...FONTS.h4 }}>More</Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',

                            marginHorizontal: 22,
                        }}
                    >
                        <View
                            style={{
                                height: 60,
                                width: 60,
                                borderRadius: 30,
                                backgroundColor: COLORS.secondaryWhite,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {userProfile.profile_picture ? (
                                <Avatar
                                    size={'medium'}
                                    rounded
                                    source={{
                                        uri: userProfile.profile_picture,
                                    }}
                                    containerStyle={{ backgroundColor: 'blue' }}
                                />
                            ) : (
                                <AntDesign
                                    name="user"
                                    size={24}
                                    color={COLORS.black}
                                />
                            )}
                        </View>
                        <View
                            style={{
                                flexDirection: 'column',
                                marginHorizontal: 22,
                            }}
                        >
                            <Text style={{ ...FONTS.h4, marginVertical: 6 }}>
                                {userProfile.username}
                            </Text>
                            <Text
                                style={{ ...FONTS.body3, color: COLORS.gray }}
                            >
                                {userProfile.email}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            marginTop: 32,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('Profile', {
                                    username: userProfile.username,
                                    email: userProfile.email,
                                    avatar: userProfile.profile_picture,
                                })
                            }
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginHorizontal: 22,
                                paddingVertical: 12,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <AntDesign
                                    name="user"
                                    size={24}
                                    color={COLORS.black}
                                />
                                <Text style={{ ...FONTS.h4, marginLeft: 12 }}>
                                    {' '}
                                    Account
                                </Text>
                            </View>
                            <MaterialIcons
                                name="keyboard-arrow-right"
                                size={24}
                                color={COLORS.black}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                console.log('Pressed')
                            }}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginHorizontal: 22,
                                paddingVertical: 12,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Entypo
                                    name="light-down"
                                    size={24}
                                    color={COLORS.black}
                                />
                                <Text style={{ ...FONTS.h4, marginLeft: 12 }}>
                                    {' '}
                                    Appearance
                                </Text>
                            </View>
                            <MaterialIcons
                                name="keyboard-arrow-right"
                                size={24}
                                color={COLORS.black}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                console.log('Pressed')
                            }}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginHorizontal: 22,
                                paddingVertical: 12,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Ionicons
                                    name="help-circle-outline"
                                    size={24}
                                    color={COLORS.black}
                                />
                                <Text style={{ ...FONTS.h4, marginLeft: 12 }}>
                                    Help
                                </Text>
                            </View>
                            <MaterialIcons
                                name="keyboard-arrow-right"
                                size={24}
                                color={COLORS.black}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handleLogout()}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginHorizontal: 22,
                                paddingVertical: 12,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <AntDesign
                                    name="setting"
                                    size={24}
                                    color="black"
                                />
                                <Text style={{ ...FONTS.h4, marginLeft: 12 }}>
                                    Logout
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </PageContainer>
            </ScrollView>
        </SafeAreaView>
    )
}

export default More
