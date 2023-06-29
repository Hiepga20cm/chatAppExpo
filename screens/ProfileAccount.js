import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageContainer from '../components/PageContainer'
import { COLORS } from '../constants'
import { AntDesign } from '@expo/vector-icons'
import Input from '../components/Input'
import Button from '../components/Button'
import PageTitle from '../components/PageTitle'
import { Avatar } from 'react-native-elements'
import { useRoute } from '@react-navigation/native'

const ProfileAccount = ({ navigation }) => {
    const route = useRoute()
    const { username, userId, email, avatar } = route.params
    // console.log(avatar)
    const getFirst = (str) => {
        return str[0]
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <PageContainer>
                <PageTitle
                    title={`${username}`}
                    onPress={() => navigation.goBack()}
                />
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <View
                        style={{
                            width: 100,
                            height: 100,
                            backgroundColor: COLORS.secondaryWhite,
                            borderRadius: 50,
                            marginVertical: 48,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {avatar ? (
                            <Avatar
                                size={'xlarge'}
                                rounded
                                source={{ uri: avatar }}
                                containerStyle={{ backgroundColor: 'blue' }}
                            />
                        ) : (
                            <Avatar
                                size={'xlarge'}
                                rounded
                                title={`${getFirst(username)}`}
                                containerStyle={{ backgroundColor: 'blue' }}
                            />
                        )}
                    </View>

                    <View style={{ width: '100%', paddingHorizontal: 22 }}>
                        {/* <Input
                            id="firstName"
                            placeholder="First Name (Required) "
                        />
                        <Input
                            id="lastName"
                            placeholder="Last Name (Optional) "
                        />

                        <Button
                            title="Save"
                            style={{
                                width: '100%',
                                paddingVertical: 12,
                                marginBottom: 48,
                            }}
                            onPress={() =>
                                navigation.navigate('BottomTabNavigation')
                            }
                        /> */}
                        <View
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 20,
                                }}
                            >
                                {' '}
                                Username : {username}
                            </Text>
                            <Text style={{ fontSize: 20, margin: 5 }}>
                                Email : {email}
                            </Text>
                        </View>
                    </View>
                </View>
            </PageContainer>
        </SafeAreaView>
    )
}

export default ProfileAccount
