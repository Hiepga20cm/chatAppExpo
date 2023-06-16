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
import { AuthContext, AuthProvider } from '../context/AuthContext'
import { getDatabase, ref, onValue, get } from 'firebase/database'

const Profile = ({ navigation }) => {
    const db = getDatabase();
    const profileChange = 'Change Profile'
    const [userProfile, setUserProfile] = useState({})
  

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
            <PageContainer>
                <PageTitle
                    title={`${profileChange}`}
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

                    <View style={{ width: '100%', paddingHorizontal: 22, paddingBottom: 30, }}>
                        <Input
                            id="firstName"
                            placeholder="Name"
                        />

                        <Button
                            title="Save"
                            style={{
                                width: '100%',
                                paddingVertical: 12,
                                marginTop: 18,
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
