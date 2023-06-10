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

const Profile = ({ navigation }) => {
    const route = useRoute()
    // const { username, userId, email } = route.params
    const username = 'username'
    const userId = 1
    const email = 'email'

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
                        <Avatar
                            size={'xlarge'}
                            rounded
                            title={`H`}
                            containerStyle={{ backgroundColor: 'blue' }}
                        />
                    </View>

                    <View style={{ width: '100%', paddingHorizontal: 22 }}>
                        <Input
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
                        />
                        {/* <View
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Text>Username : {username}</Text>
                            <Text>Email : {email}</Text>
                        </View> */}
                    </View>
                </View>
            </PageContainer>
        </SafeAreaView>
    )
}

export default Profile
