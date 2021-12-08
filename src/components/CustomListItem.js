import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  PermissionsAndroid,
  Linking,
  I18nManager,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import Contacts from 'react-native-contacts';

export default class CustomListItem extends Component {
  constructor(props) {
    super(props);
  }

  goPhoneCall(number) {
    Linking.openURL('tel:${' + number + '}')
      .catch((err) => console.error('An error occurred', err));
  }

  addContact(number) {
    if (Platform.OS === 'ios') {
      Contacts.checkPermission((err, permission) => {
        if (permission === 'authorized') {
          this.goContact(number);
        }
      })
    } else if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts',
          message: 'This app would like to view your contacts.'
        }
      ).then((res) => {
        Contacts.checkPermission((err, permission) => {
          if (err) {
            throw err;
          }

          if (permission === 'authorized') {
            this.goContact(number)
          }
          if (permission === 'denied') {
            console.log('permission denied')
          }
        })
      })
    }
  }

  goContact = (number) => {
    var newPerson = {
      phoneNumbers: [{
        label: 'mobile',
        number: number,
      }],
    }

    Contacts.openContactForm(newPerson, (err, contact) => {
      if (err) throw err;
      // contact has been saved
    })
  }

  goWhatsApp(number) {
    const url = "https://il.acard.app/whatsapp-" + global.currentUser + "?phone=" + number;
    Linking.openURL(url)
      .catch((err) => console.error('An error occurred', err));
  }

  render() {
    const item = this.props.item;
    const isContact = this.props.isContact;
    return (
      <ListItem
        title={item.name === '' || item.name === null ? item.phoneNumber : item.name}
        titleStyle={
          isContact
            ? styles.contact
            : item.type === 'MISSED' || item.type === 'UNKNOWN' ? styles.missCall : styles.call
        }
        subtitle={isContact ? null : item.dateTime}
        subtitleStyle={isContact ? null : styles.subtitle}
        leftElement={
          isContact
            ? null
            :
            item.type === 'INCOMING'
              ?
              <Image
                style={styles.callTypeImg}
                source={
                  I18nManager.isRTL
                    ? require('aCard/images/in-call-rtl.png')
                    : require('aCard/images/in-call-ltr.png')
                }
                resizeMode='contain'
              />
              : item.type === 'OUTGOING'
                ?
                <Image
                  style={styles.callTypeImg}
                  source={
                    I18nManager.isRTL
                      ? require('aCard/images/out-call-rtl.png')
                      : require('aCard/images/out-call-ltr.png')
                  }
                  resizeMode='contain'
                />
                : item.type === 'MISSED' || item.type === 'UNKNOWN'
                  ?
                  <Image
                    style={styles.callTypeImg}
                    source={require('aCard/images/miss-call.png')}
                    resizeMode='contain'
                  />
                  : null
        }
        rightElement={
          item.name === '' || item.name === null
            ?
            <View style={styles.right}>
              <TouchableOpacity onPress={() => this.addContact(item.phoneNumber)}>
                <Image
                  style={styles.imgAddContact}
                  source={require('aCard/images/add-contact.png')}
                  resizeMode='contain'
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.changeStatus()}>
                <View
                  style={
                    this.props.pressPin || item.pinStatus
                      ? styles.btnPin
                      : styles.btnUnPin
                  }
                >
                  <Image
                    style={styles.imgPin}
                    source={require('aCard/images/pin.png')}
                    resizeMode='contain'
                  />
                </View>
                {
                  this.props.pressPin
                    ?
                    <Image
                      style={styles.underPin}
                      source={require('aCard/images/under-pin-call.png')}
                      resizeMode='contain'
                    />
                    : null
                }
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.goWhatsApp(item.phoneNumber)}>
                <View style={styles.btnWhatsApp}>
                  <Image
                    style={styles.imgPin}
                    source={require('aCard/images/whatsapp.png')}
                    resizeMode='contain'
                  />
                </View>
              </TouchableOpacity>
            </View>
            :
            <View style={styles.right}>
              <TouchableOpacity onPress={() => this.props.changeStatus()}>
                <View
                  style={
                    this.props.pressPin || item.pinStatus
                      ? styles.btnPin
                      : styles.btnUnPin
                  }
                >
                  <Image
                    style={styles.imgPin}
                    source={require('aCard/images/pin.png')}
                    resizeMode='contain'
                  />
                </View>
                {
                  this.props.pressPin
                    ?
                    <Image
                      style={styles.underPin}
                      source={require('aCard/images/under-pin-call.png')}
                      resizeMode='contain'
                    />
                    : null
                }
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.goWhatsApp(item.phoneNumber)}>
                <View style={styles.btnWhatsApp}>
                  <Image
                    style={styles.imgPin}
                    source={require('aCard/images/whatsapp.png')}
                    resizeMode='contain'
                  />
                </View>
              </TouchableOpacity>
            </View>
        }
        bottomDivider
        onPress={() => this.goPhoneCall(item.phoneNumber)}
      />
    );
  }
}

const styles = StyleSheet.create({
  contact: {    
    fontSize: 14,    
    textAlign: 'left',
  },
  call: {
    fontSize: 15,
    lineHeight: 15,
    textAlign: 'left',
  },
  missCall: {
    color: '#c81f3b',
    textAlign: 'left',
  },
  callTypeImg: {
    width: 15,
    height: 15,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: -5,
    textAlign: 'left',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgAddContact: {
    width: 20,
    height: 20,
  },
  btnUnPin: {
    backgroundColor: '#9bb1b7',
    marginLeft: 10,
    borderRadius: 20,
  },
  btnPin: {
    backgroundColor: '#48a3c4',
    marginLeft: 10,
    borderRadius: 20,
  },
  imgPin: {
    margin: 10,
    width: 15,
    height: 15,
  },  
  underPin: {
    position: 'absolute',
    bottom: -21,
    right: 8,
    width: 20,
    height: 30,
  },
  btnWhatsApp: {
    backgroundColor: '#25d366',
    marginLeft: 10,
    borderRadius: 20,
  },
})