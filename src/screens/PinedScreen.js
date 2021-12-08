import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  PermissionsAndroid,
  ActivityIndicator,
  I18nManager,
} from 'react-native';
import Contacts from 'react-native-contacts';
import CallLogs from 'react-native-call-log';
import AsyncStorage from '@react-native-community/async-storage';

import Header from '../components/Header';
import TabBar from '../components/TabBar';
import CustomListItem from '../components/CustomListItem';
import NoteBoard from '../components/NoteBoard';

export default class PinedScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contacts: [],
      callLogs: [],
      pins: [],
      isLoading: false,
    };
  }

  componentDidMount() {
    AsyncStorage.getAllKeys((err, keys) => {
      this.setState({ pins: keys });
    });
    if (Platform.OS === 'ios') {
      Contacts.checkPermission((err, permission) => {
        if (permission === 'authorized') {
          this.getPinedContacts()
        }
      })
    } else if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts',
          message: 'This app would like to view your contacts.'
        }
      ).then(() => {
        Contacts.checkPermission((err, permission) => {
          if (err) {
            throw err;
          }

          if (permission === 'authorized') {
            this.getPinedContacts()
          }
          if (permission === 'denied') {
            console.log('permission denied')
          }
        })
      })      
    }
  }

  getPinedContacts = () => {
    Contacts.getAll((err, contacts) => {
      if (err === 'denied') {
        console.log("cannot access");
      } else {
        contacts.map(contact => {
          contact.phoneNumbers.map(phone => {
            var number = phone.number.replace(/ /g, '');
            const isExist = this.state.pins.findIndex(pin => pin === number);
            const isAloneExist = this.state.contacts.findIndex(contact => contact.phoneNumber === number);
            if (isExist !== -1  && isAloneExist === -1 ) {
              this.setState({
                contacts:
                  [
                    ...this.state.contacts,
                    {
                      id: phone.id,
                      name: contact.displayName,
                      phoneNumber: number,
                      showPin: false,
                      pinStatus: true,
                    }
                  ],
              });
            }
          })      
        });
        if (Platform.OS === 'ios') {
          this.getPinedCallLogs();
        } else if (Platform.OS === 'android') {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
            {
              title: 'Call Log Example',
              message: 'Access your call logs',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          ).then((res) => {
            if (res === PermissionsAndroid.RESULTS.GRANTED) {
              this.getPinedCallLogs();
            } else {
              console.log('Call Log permission denied');
            }
          })
        }
      }
    })
  }

  getPinedCallLogs = () => {
    CallLogs.load(10)
      .then((callLogs) => {
        var index = 0;
        callLogs.map(callLog => {
          var number = callLog.phoneNumber.replace(/ /g, '');
          const isExist = this.state.pins.findIndex(pin => pin === number);
          if (isExist !== -1) {
            const isExistOnContact = this.state.contacts.findIndex(contact => contact.phoneNumber === number);
            const isAloneExist = this.state.callLogs.findIndex(log => log.phoneNumber === number);
             if ( isExistOnContact === -1 && isAloneExist === -1) {
              this.setState({
                callLogs:
                  [
                    ...this.state.callLogs,
                    {
                      index: index,
                      name: callLog.name,
                      phoneNumber: number,
                      type: callLog.type,
                      dateTime: callLog.dateTime,
                      showPin: false,
                      pinStatus: true,
                    }
                  ],
              });
            }
          }
          index = index + 1;
        });
        this.setState({ isLoading: true, });
      });
  }

  changeContactStatus = (item) => {
    let tmpContacts = [...this.state.contacts];
    let index = tmpContacts.findIndex(contact => contact.id === item.id);

    if (item.showPin === true) {
      AsyncStorage.getAllKeys((err, keys) => {
        const isExist = keys.findIndex(key => key === item.phoneNumber);
        if (isExist === -1) {
          let newContacts = tmpContacts.filter(contact => contact.id !== item.id);
          this.setState({ pins: keys, contacts: newContacts });
        } else {
          tmpContacts[index] = { ...tmpContacts[index], showPin: !item.showPin };
          this.setState({ pins: keys, contacts: tmpContacts });
        }
      });
    } else {
      tmpContacts[index] = { ...tmpContacts[index], showPin: !item.showPin };
      this.setState({ contacts: tmpContacts });
    }
  }

  changeLogStatus = (item) => {
    let tmpCallLogs = [...this.state.callLogs];
    let index = tmpCallLogs.findIndex(callLog => callLog.phoneNumber === item.phoneNumber);

    if (item.showPin === true) {
      AsyncStorage.getAllKeys((err, keys) => {
        const isExist = keys.findIndex(key => key === item.phoneNumber);
        if (isExist === -1) {
          let newCallLogss = tmpCallLogs.filter(callLog => callLog.phoneNumber !== item.phoneNumber);
          this.setState({ pins: keys, callLogs: newCallLogss });
        } else {
          tmpCallLogs[index] = { ...tmpCallLogs[index], showPin: !item.showPin };
          this.setState({ pins: keys, callLogs: tmpCallLogs });
        }
      });
    } else {
      tmpCallLogs[index] = { ...tmpCallLogs[index], showPin: !item.showPin };
      this.setState({ callLogs: tmpCallLogs });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header navigation={this.props.navigation} />
        <TabBar activeIndex={3} navigation={this.props.navigation} />
        {
          this.state.isLoading
            ?
            <View style={styles.body}>
              {
                this.state.contacts.length > 0
                  ?
                  <View style={styles.contact}>
                    <Text style={styles.headerText}>
                      {I18nManager.isRTL ? 'אנשי קשר' : 'Contacts'}
                    </Text>
                    <FlatList
                      data={this.state.contacts}
                      renderItem={({ item }) => (
                        <View>
                          <CustomListItem
                            item={item}
                            isContact={true}
                            pressPin={item.showPin}
                            changeStatus={() => this.changeContactStatus(item)}
                          />
                          {
                            item.showPin
                              ?
                              <NoteBoard
                                changeStatus={() => this.changeContactStatus(item)}
                                number={item.phoneNumber}
                              />
                              : null
                          }
                        </View>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
                  : null
              }
              {
                this.state.callLogs.length > 0
                  ?
                  <View style={styles.calls}>
                    <Text style={styles.headerText}>
                      {I18nManager.isRTL ? 'שיחות' : 'Calls'}
                    </Text>
                    <FlatList
                      data={this.state.callLogs}
                      renderItem={({ item }) => (
                        <View>
                          <CustomListItem
                            item={item}
                            isContact={false}
                            pressPin={item.showPin}
                            changeStatus={() => this.changeLogStatus(item)}
                          />
                          {
                            item.showPin
                              ?
                              <NoteBoard
                                changeStatus={() => this.changeLogStatus(item)}
                                number={item.phoneNumber}
                              />
                              : null
                          }
                        </View>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
                  : null
              }
            </View>
            :
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
              <ActivityIndicator size="large" color="#b1c242" />
            </View>
        }
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
  contact: {
    flex: 1,
  },
  calls: {
    flex: 1,
  },
  headerText: {
    textAlign: 'left',
    marginVertical: 10,
    fontSize: 14,
    fontWeight: 'bold', //'800',   
    fontStyle: 'normal',
    lineHeight: 16,
    letterSpacing: 0,
    color: '#262626',
  },
})