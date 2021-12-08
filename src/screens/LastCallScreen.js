import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  SectionList,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import Contacts from 'react-native-contacts';
import CallLogs from 'react-native-call-log';
import AsyncStorage from '@react-native-community/async-storage';

import Header from '../components/Header';
import TabBar from '../components/TabBar';
import CustomListItem from '../components/CustomListItem';
import NoteBoard from '../components/NoteBoard';

export default class LastCallScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showItems: [],
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
          this.getContacts()
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
            this.getContacts()
          }
          if (permission === 'denied') {
            console.log('permission denied')
          }
        })
      })
    }
  }

  getContacts = () => {
    Contacts.getAll((err, contacts) => {
      if (err === 'denied') {
        console.log("cannot access");
      } else {
        contacts.map(contact => {
          contact.phoneNumbers.map(phone => {
            this.setState({
              contacts:
                [
                  ...this.state.contacts,
                  {
                    id: phone.id,
                    name: contact.displayName,
                    phoneNumber: phone.number.replace(/ /g, ''),
                  }
                ],
            });
          })
        });
        if (Platform.OS === 'ios') {
          this.getCallLogs();
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
              this.getCallLogs();
            } else {
              console.log('Call Log permission denied');
            }
          })
        }
      }
    })
  }

  getCallLogs = () => {
    CallLogs.load(100)
      .then((callLogs) => {
        var index = 0;
        callLogs.map(callLog => {
          var number = callLog.phoneNumber.replace(/ /g, '');
          const isPinExist = this.state.pins.findIndex(pin => pin === number);
          const isExistOnContact = this.state.contacts.findIndex(contact => contact.phoneNumber === number);
          this.setState({
            callLogs:
              [
                ...this.state.callLogs,
                {
                  index: index,
                  name: (isExistOnContact !== -1) ? this.state.contacts[isExistOnContact].name : callLog.name,
                  phoneNumber: number,
                  type: callLog.type,
                  dateTime: callLog.dateTime,
                  showPin: false,
                  pinStatus: (isPinExist !== -1) ? true : false,
                }
              ],
          });
          index = index + 1;
        });
        this.setState({
          showItems: [{ title: 'key', data: this.state.callLogs }],
          isLoading: true,
        });
      });
  }

  changeStatus = (item) => {
    let newCallLogs = [...this.state.callLogs];
    if (item.showPin === true) {
      AsyncStorage.getAllKeys((err, keys) => {
        const isPinExist = keys.findIndex(key => key === item.phoneNumber);
        newCallLogs[item.index] = {
          ...newCallLogs[item.index],
          pinStatus: isPinExist !== -1 ? true : false,
          showPin: !item.showPin,
        };
        this.setState({ 
          pins: keys, 
          callLogs: newCallLogs,
          showItems: [{title: 'key', data: newCallLogs}] ,
        });
      });

    } else {
      newCallLogs[item.index] = { ...newCallLogs[item.index], showPin: !item.showPin };
      this.setState({ callLogs: newCallLogs, showItems: [{title: 'key', data: newCallLogs}] });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header navigation={this.props.navigation} />
        <TabBar activeIndex={1} navigation={this.props.navigation} />
        {
          this.state.isLoading
            ?
            <View style={styles.body}>
              <SectionList
                sections={this.state.showItems}
                renderItem={({ item }) => (
                  <View>
                    <CustomListItem
                      item={item}
                      pressPin={item.showPin}
                      isContact={false}
                      changeStatus={() => this.changeStatus(item)}
                    />
                    {
                      item.showPin
                        ?
                        <NoteBoard
                          changeStatus={() => this.changeStatus(item)}
                          number={item.phoneNumber}
                        />
                        : null
                    }
                  </View>
                )}
                keyExtractor={(item, index) => index}
              />              
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
})