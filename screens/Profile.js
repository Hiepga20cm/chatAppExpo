import { View, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageContainer from '../components/PageContainer'
import { COLORS, images } from '../constants'
import { useState, useEffect } from 'react'
import { AntDesign } from '@expo/vector-icons'
import Input from '../components/Input'
import Button from '../components/Button'
import PageTitle from '../components/PageTitle'
import { Avatar } from 'react-native-elements'
import { useRoute } from '@react-navigation/native'
import { AuthContext, AuthProvider } from '../context/AuthContext'
import { getDatabase, ref as Ref, onValue, get, set } from 'firebase/database'
import { storage } from '../firebase/firebaseConfig'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { TextInput } from 'react-native'
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import * as Updates from 'expo-updates'
const Profile = ({ navigation }) => {
    const db = getDatabase()
    const profileChange = 'Change Profile'
    const [userProfile, setUserProfile] = useState({})

    const [image, setImage] = useState(null)
    const [imageDisplay, setImageDisplay] = useState(null)
    const [url, setUrl] = useState(null)
    const [name, setName] = useState(null)
    const [userId, setUserId] = useState(null)
    const [email, setEmail] = useState(null)
    const [publicKey, setPublicKey] = useState(null)

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.1,
            })

            // console.log(result)

            if (!result.cancelled) {
                setImageDisplay(result.uri)
                setImage(result.uri)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (image !== null) {
            submitData()
            setImage(null)
        }
    }, [image])

    const submitData = async () => {
        try {
            const blobImage = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest()
                xhr.onload = function () {
                    resolve(xhr.response)
                }
                xhr.onerror = function (e) {
                    reject(new TypeError('Network request failed'))
                }
                xhr.responseType = 'blob'
                xhr.open('GET', image, true)
                xhr.send(null)
            })

            // Create the file metadata
            /** @type {any} */
            const metadata = {
                contentType: 'image/jpeg',
            }

            // Upload file and metadata to the object 'images/mountains.jpg'
            const storageRef = ref(storage, 'images/' + Date.now())
            const uploadTask = uploadBytesResumable(
                storageRef,
                blobImage,
                metadata
            )

            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    console.log('Upload is ' + progress + '% done')
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused')
                            break
                        case 'running':
                            console.log('Upload is running')
                            break
                    }
                },
                (error) => {
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break
                        case 'storage/canceled':
                            // User canceled the upload
                            break

                        // ...

                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break
                    }
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                            console.log('File available at', downloadURL)
                            setUrl(downloadURL)
                        }
                    )
                }
            )
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId')

                if (userId) {
                    const userRef = Ref(db, 'users/' + userId)
                    const data = await get(userRef)
                    if (data.exists()) {
                        const userData = data.val()
                        setUserProfile(userData)
                        setUserId(userData.uuid)
                        setEmail(userData.email)
                        setPublicKey(userData.publicKey)
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
        getUserProfile()
    }, [])

    // console.log(111111111, userProfile.uuid)
    // console.log(33331, userProfile)

    const writeUserData = (userId, name, email, url, publicKey) => {
        set(Ref(db, 'users/' + userId), {
            username: name,
            email: email,
            uuid: userId,
            profile_picture: url,
            publicKey: publicKey,
        })
    }

    const handleSave = () => {
        writeUserData(userId, name, email, url, publicKey)
        setTimeout(() => {
            Updates.reloadAsync()
        }, 500)
        navigation.navigate('More')
    }

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
                        {imageDisplay ? (
                            <Avatar
                                size={'xlarge'}
                                source={{
                                    uri: imageDisplay,
                                }}
                                rounded
                            />
                        ) : (
                            <Avatar
                                size={'xlarge'}
                                source={{
                                    uri: userProfile.profile_picture,
                                }}
                                rounded
                            />
                        )}

                        <TouchableOpacity onPress={pickImage}>
                            <MaterialCommunityIcons
                                name="camera-plus"
                                size={40}
                                color="black"
                            />
                        </TouchableOpacity>
                    </View>

                    <View
                        style={{
                            width: '100%',
                            paddingHorizontal: 22,
                            paddingBottom: 30,
                        }}
                    >
                        <TextInput
                            style={{ paddingVertical: 6 }}
                            id="firstName"
                            placeholder="Name"
                            value={name}
                            onChangeText={(text) => setName(text)}
                        />

                        <Button
                            title="Save"
                            style={{
                                width: '100%',
                                paddingVertical: 12,
                                marginTop: 18,
                            }}
                            onPress={() => handleSave()}
                        />
                    </View>
                </View>
            </PageContainer>
        </SafeAreaView>
    )
}

export default Profile
