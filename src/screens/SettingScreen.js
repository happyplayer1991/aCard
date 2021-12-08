import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  I18nManager,
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import Clipboard from '@react-native-community/clipboard';

import Header from '../components/Header';
import TabBar from '../components/TabBar';

export default class SettingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      vCardAlert: false,
      aCardAlert: false,
    }
  }

  visitaCard = () => {
    Linking.openURL("https://il.acard.app/me-" + global.currentUser)
      .catch((err) => console.error('An error occurred', err));
  }

  editaCard = () => {
    Linking.openURL("https://il.acard.app/dashboard")
      .catch((err) => console.error('An error occurred', err));
  }

  copyvCard = () => {
    Clipboard.setString('https://il.acard.app/vcard-' + global.currentUser);
    this.setState({ vCardAlert: true });
    setTimeout(() => { this.setState({ vCardAlert: false }) }, 2000);
  }

  copyaCard = () => {
    Clipboard.setString('https://il.acard.app/me-' + global.currentUser);
    this.setState({ aCardAlert: true });
    setTimeout(() => { this.setState({ aCardAlert: false }) }, 2000);
  }

  getSupport = () => {
    Linking.openURL("https://acard.co.il/support")
      .catch((err) => console.error('An error occurred', err));
  }

  logout = async () => {
    try {
      await AsyncStorage.removeItem('UserName');
    } catch (error) {
      console.log(error);
    }
    const resetAction = StackActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: 'LoginScreen' })],
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    return (
      <View style={styles.container}>
        <Header navigation={this.props.navigation} />
        <TabBar activeIndex={0} navigation={this.props.navigation} />
        <ScrollView style={styles.body}>
          <View style={styles.row}>
            <TouchableOpacity onPress={this.visitaCard} style={styles.item}>
              <Image source={require('aCard/images/phone-touch.png')} style={styles.itemImage} resizeMode="contain" />
              <Text style={styles.itemText}>
                {I18nManager.isRTL ? 'צפייה בכרטיס' : 'Visit aCard'}
              </Text>
              <Text style={styles.itemSubText}>
                {
                  I18nManager.isRTL
                    ? 'צפייה בכרטיס הביקור שלך.'
                    : 'Take a look at your online aCard.'
                }
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.editaCard} style={styles.item}>
              <Image source={require('aCard/images/edit-post.png')} style={styles.itemImage} resizeMode="contain" />
              <Text style={styles.itemText}>
                {I18nManager.isRTL ? 'עריכת כרטיס' : 'Edit aCard'}
              </Text>
              <Text style={styles.itemSubText}>
                {
                  I18nManager.isRTL
                    ? 'כולל עריכת הודעת וואטסאפ אוטומטית.'
                    : "Includes your's automatic WhatsApp message."
                }
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            {
              this.state.vCardAlert
                ?
                <View style={styles.itemAlert}>
                  <Image source={require('aCard/images/check.png')} style={styles.imgAlert} resizeMode="contain" />
                  <Text style={styles.txtAlert}>
                    {I18nManager.isRTL ? 'הועתק' : 'Copied'}
                  </Text>
                </View>
                :
                <TouchableOpacity onPress={this.copyvCard} style={styles.item}>
                  <Image source={require('aCard/images/add-user.png')} style={styles.itemImage} resizeMode="contain" />
                  <Text style={styles.itemText}>
                    {I18nManager.isRTL ? 'העתק קישור איש קשר' : 'Copy Contact file URL'}
                  </Text>
                  <Text style={styles.itemSubText}>
                    {
                      I18nManager.isRTL
                        ? 'העתק קישור לשמירת איש הקשר שלך על טלפון אחר.'
                        : 'Copy a link to save your contact to another phone.'
                    }
                  </Text>
                </TouchableOpacity>
            }
            {
              this.state.aCardAlert
                ?
                <View style={styles.itemAlert}>
                  <Image source={require('aCard/images/check.png')} style={styles.imgAlert} resizeMode="contain" />
                  <Text style={styles.txtAlert}>
                    {I18nManager.isRTL ? 'הועתק' : 'Copied'}
                  </Text>
                </View>
                :
                <TouchableOpacity onPress={this.copyaCard} style={styles.item}>
                  <Image source={require('aCard/images/add-card.png')} style={styles.itemImage} resizeMode="contain" />
                  <Text style={styles.itemText}>
                    {I18nManager.isRTL ? 'העתק קישור לכרטיס' : 'Copy aCard URL'}
                  </Text>
                  <Text style={styles.itemSubText}>
                    {
                      I18nManager.isRTL
                        ? 'העתק קישור על מנת לשתף את כרטיס הביקור שלך.'
                        : 'Copy your aCard URL and easily share it.'
                    }
                  </Text>
                </TouchableOpacity>
            }
          </View>
          <View style={styles.lastRow}>
            <TouchableOpacity onPress={this.getSupport} style={styles.item}>
              <Image source={require('aCard/images/support.png')} style={styles.itemImage} resizeMode="contain" />
              <Text style={styles.itemText}>
                {I18nManager.isRTL ? 'תמיכה ומרכז מידע' : 'Get Support'}
              </Text>
              <Text style={styles.itemSubText}>
                {
                  I18nManager.isRTL
                    ? 'זקוק לעזרה?' + "\n" + ' אין בעיה, בקר במרכז המידע שלנו.'
                    : 'Need help? No worries, visit our support center.'
                }
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.logout} style={styles.btnLogout}>
              <Text style={styles.btnLogoutText}>
                {I18nManager.isRTL ? 'התנתק' : 'Logout'}
              </Text>              
            </TouchableOpacity>
          </View>        
        </ScrollView>
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
  body: {
    flex: 1,
    backgroundColor: '#d1e2e7',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    marginTop: 10,
  },
  lastRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  item: {
    flex: 1,
    height: 135,
    alignItems: 'center',
    paddingVertical: 25,
    marginHorizontal: 5,
    backgroundColor: '#ffffff'
  },
  itemImage: {
    height: 25,
  },
  itemText: {
    color: '#222222',
    fontSize: 14,
    fontWeight: 'bold', //  '600',
    marginTop: 10,
  },
  itemSubText: {
    color: '#7c8081',
    fontSize: 10,
    textAlign: 'center',
    marginHorizontal: 10,
    marginTop: 5,
  },
  itemAlert: {
    flex: 1,
    height: 135,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    backgroundColor: '#292929'
  },
  imgAlert: {
    height: 12,
  },
  txtAlert: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  btnLogout: {
    flex: 1,
    height: 135,
    alignItems: 'center',
    justifyContent: 'center',  
    marginHorizontal: 5, 
    backgroundColor: '#c81f3b',        
  },
  btnLogoutText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold', //  '600',
  },
})