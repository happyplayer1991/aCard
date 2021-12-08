import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
  ToastAndroid,
  Dimensions,
  Linking,
  I18nManager,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';

import axios from 'axios';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

  goMainPage = async () => {
    try {
      await AsyncStorage.setItem('UserName', this.state.username);
      global.currentUser = this.state.username;
      this.props.navigation.navigate('mainStack');
    } catch (error) {
      console.log(error);
    }
  }

  logIn = () => {
    if (this.state.username.trim() == '') {
      const msg = I18nManager.isRTL ? 'יש להזין שם משתמש.' : 'Please enter a username.';
      ToastAndroid.show(msg, 1000);
      return;
    }

    if (this.state.password == '') {
      const msg = I18nManager.isRTL ? 'יש להזין סיסמא.' : 'Please enter a password.';
      ToastAndroid.show(msg, 1000);
      return;
    }

    axios.post('https://il.acard.app/api/login', {
      username: this.state.username,
      password: this.state.password,
    })
      .then((response) => {
        let msg
        switch (response.data.st) {
          case 1:
            this.goMainPage();
            break;
          case 2:
            msg = I18nManager.isRTL ? 'שם משתמש לא קיים.' : 'User name does not exist.';
            ToastAndroid.show(msg, 1000);
            break;
          case 3:
            msg = I18nManager.isRTL ? 'סיסמא שגויה.' : 'Password is wrong.';
            ToastAndroid.show(msg, 1000);
            break;
          default:
            break;
        }
      })
      .catch((error) => {
        if (error.message == 'Network Error') {
          const msg = I18nManager.isRTL ? 'בעיה ברשת' : 'Network Error';
          ToastAndroid.show(msg, 1000);
        } else {
          console.log(error);
        }
      });
  }

  forgotPassword = () => {
    Linking.openURL("https://acard.co.il/forgotpass")
      .catch((err) => console.error('An error occurred', err));
  }

  signUp = () => {
    Linking.openURL("https://acard.co.il/signup")
      .catch((err) => console.error('An error occurred', err));
  }

  goTerms = () => {
    Linking.openURL("https://acard.co.il/tos")
      .catch((err) => console.error('An error occurred', err));
  }

  goPrivacy = () => {
    Linking.openURL("https://acard.co.il/privacy")
      .catch((err) => console.error('An error occurred', err));
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.markImg}
            source={require('aCard/images/mark.png')}
            resizeMode="contain"
          />
        </View>
        <LinearGradient
          colors={['#48a3c4', '#4ba3c4', '#3b819c']}
          style={styles.mainArea}
        >
          <View style={styles.descriptionArea}>
            <Text style={styles.description}>
              {
                I18nManager.isRTL
                  ?
                  'ברוכים הבאים לאפליקציה של aCard. ' +
                  'השימוש באפליקציה הינו ללקוחות המערכת בלבד.'
                  :
                  'Welcome to the aCard app' + "\n" +
                  'aCard app is available only for registered users'
              }
            </Text>
          </View>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              value={this.state.username}
              placeholder={I18nManager.isRTL ? 'שם משתמש' : 'Username'}
              placeholderTextColor="#6e6f72"
              textAlign={I18nManager.isRTL ? 'right' : 'left'}
              autoCapitalize="none"
              textContentType="username"
              onChangeText={(username) => this.setState({ username })} />
          </View>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              value={this.state.password}
              placeholder={I18nManager.isRTL ? 'סיסמא' : 'Password'}
              placeholderTextColor="#6e6f72"
              textAlign={I18nManager.isRTL ? 'right' : 'left'}
              autoCapitalize="none"
              textContentType="password"
              secureTextEntry
              onChangeText={(password) => this.setState({ password })} />
          </View>
          <View style={styles.btnLogin}>
            <Button
              title={I18nManager.isRTL ? 'כניסה למערכת' : 'Login'}
              color='#1e85ab'
              onPress={this.logIn}
            />
          </View>
          <TouchableOpacity onPress={this.forgotPassword}>
            <Text style={styles.btnForgot}>
              {I18nManager.isRTL ? 'שכחתי סיסמא' : 'Forgot Password'}
            </Text>
          </TouchableOpacity>
          <View style={styles.newCardArea}>
            <TouchableOpacity style={styles.newCard} onPress={this.signUp}>
              <View style={styles.newCardLeft}>
                <Text style={styles.lblNewCard}>
                  {I18nManager.isRTL ? 'עדיין אין לך חשבון?' : 'New here?'}
                </Text>
                <Text style={styles.btnNewCard}>
                  {I18nManager.isRTL ? 'לחץ להרשמה' : 'Click here to signup'}
                </Text>
              </View>
              <View style={styles.newCardRight}>
                <Image
                  style={styles.markMewCard}
                  source={require('aCard/images/mark.png')}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.footerArea}>
            <Text style={styles.versionText}>
              {
                I18nManager.isRTL
                  ? 'aCard.app כל הזכויות שמורות ל Ver.1.0'
                  : 'Ver 1.0. All rights reserved to aCard.app'
              }
            </Text>
            <View style={styles.underVersion}>
              <TouchableOpacity onPress={this.goTerms}>
                <Text style={styles.versionText}>
                  {I18nManager.isRTL ? 'תנאי שימוש' : 'Terms of Use'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.versionText}> | </Text>
              <TouchableOpacity onPress={this.goPrivacy}>
                <Text style={styles.versionText}>
                  {I18nManager.isRTL ? 'הצהרת פרטיות' : 'Privacy Statement'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'ios' ? 60 : 0,
  },
  header: {
    alignItems: I18nManager.isRTL ? 'flex-end' : 'flex-start',
  },
  markImg: {
    marginHorizontal: 20,
    alignItems: 'flex-start',
    width: windowWidth * 0.4,
    height: windowHeight * 0.1,
  },
  mainArea: {
    width: windowWidth,
    height: windowHeight * 0.9,
    alignItems: 'center'
  },
  descriptionArea: {
    marginVertical: 20,
    marginHorizontal: 40,
  },
  description: {
    fontSize: 18,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },
  inputWrap: {
    width: windowWidth - 40,
    marginVertical: 5,
  },
  input: {
    fontSize: 14,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  btnLogin: {
    width: windowWidth - 80,
    marginVertical: 10,
  },
  btnForgot: {
    marginTop: 10,
    marginBottom: 30,
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center',
    color: "#ffffff",
  },
  newCardArea: {
    borderTopWidth: 0.5,
    borderTopColor: '#bbd3dc',
  },
  newCard: {
    backgroundColor: '#2e302e',
    width: windowWidth - 20,
    flexDirection: "row",
    marginVertical: 10,
  },
  newCardLeft: {
    width: windowWidth * 0.5,
    marginLeft: 20,
    marginVertical: 10,
  },
  lblNewCard: {
    fontSize: 20,
    fontWeight: '800',
    fontStyle: 'normal',
    lineHeight: 25,
    letterSpacing: 0,
    color: '#ffffff',
  },
  btnNewCard: {
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 14,
    letterSpacing: 0,
    color: '#ecf696',
  },
  newCardRight: {
    margin: 10,
    width: windowWidth * 0.5 - 50,
    borderLeftWidth: 1,
    borderLeftColor: '#6e6f72',
    alignItems: "center"
  },
  markMewCard: {
    width: windowWidth * 0.3,
    height: windowHeight * 0.1 - 20,
  },
  footerArea: {
    position: 'absolute',
    width: windowWidth - 40,
    bottom: windowHeight * 0.1 - 20,
    borderTopWidth: 0.5,
    borderTopColor: '#bbd3dc',
    paddingTop: 10,
  },
  underVersion: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  versionText: {
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 15,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },
})