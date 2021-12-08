import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  ActivityIndicator,
  I18nManager,
  SectionList,
} from 'react-native';
import { SearchBar } from 'react-native-elements';

import Contacts from 'react-native-contacts';
import AsyncStorage from '@react-native-community/async-storage';

import Header from '../components/Header';
import TabBar from '../components/TabBar';
import CustomListItem from '../components/CustomListItem';
import NoteBoard from '../components/NoteBoard';

export default class ContactsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showItems: [],
      pins: [],
      searchText: '',
      isLoading: false,
    };
    this.listItems = [];
  }

  componentDidMount() {
    AsyncStorage.getAllKeys((err, keys) => {
      this.setState({ pins: keys });
    });
    if (Platform.OS === 'ios') {
      Contacts.checkPermission((err, permission) => {
        if (permission === 'authorized') {
          this.getAllContacts()
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
            this.getAllContacts()
          }
          if (permission === 'denied') {
            console.log('permission denied')
          }
        })
      })
    }
  }

  getAllContacts = () => {
    Contacts.getAll((err, contacts) => {
      if (err === 'denied') {
        console.log("cannot access");
      } else {
        var uniques = [];
        contacts.forEach(contact => {
          if (contact.phoneNumbers.length > 0) {
            uniques.push(contact.displayName[0]);
          }
        });
        const dataUniques = uniques.filter(
          (item, index) => uniques.indexOf(item) === index,
        );
        dataUniques.sort();
        var sectionData = [];

        dataUniques.forEach(key => {
          var dataList = [];
          contacts.forEach(contact => {
            contact.phoneNumbers.map(phone => {
              var number = phone.number.replace(/ /g, '');
              const isAloneExist = dataList.findIndex(data => data.phoneNumber === number);
              if (isAloneExist === -1) {
                if (contact.displayName[0] === key) {
                  const isPinExist = this.state.pins.findIndex(pin => pin === number);
                  var item = {
                    id: phone.id,
                    name: contact.displayName,
                    phoneNumber: number,
                    showPin: false,
                    pinStatus: isPinExist !== -1 ? true : false,
                  };
                  dataList.push(item);
                }
              }
            })
          });
          var objectKeyBased = { title: key, data: dataList };
          sectionData.push(objectKeyBased);
        });

        this.setState(
          {
            showItems: sectionData,
            isLoading: true,
          },
          function () {
            this.listItems = this.state.showItems;
          }
        );
      }
    })
  }

  changeStatus = async (item) => {
    let newShowItems = [...this.state.showItems];
    let index = newShowItems.findIndex(section => section.title === item.name[0]);
    let subIndex = newShowItems[index].data.findIndex(data => data.id === item.id)

    if (item.showPin === true) {
      try {
        const note = await AsyncStorage.getItem(item.phoneNumber);
        if (note !== null) {
          newShowItems[index].data[subIndex] = {
            ...newShowItems[index].data[subIndex], pinStatus: true
          };
        } else {
          newShowItems[index].data[subIndex] = {
            ...newShowItems[index].data[subIndex], pinStatus: false
          };
        }
      } catch (error) {
        console.log(error);
      }
    }
    newShowItems[index].data[subIndex] = {
      ...newShowItems[index].data[subIndex], showPin: !item.showPin
    };
    this.setState({ showItems: newShowItems });
  }

  SearchFilterFunction(text) {
    var newData = [];
    this.listItems.forEach(section => {
      const newSectionData = section.data.filter(function (item) {
        const itemData = item.name ? item.name.toLowerCase() : ''.toLowerCase();
        const textData = text.toLowerCase();
        return itemData.indexOf(textData) > -1;
      });

      if (newSectionData.length > 0) {
        var objectKeyBased = { title: section.title, data: newSectionData };
        newData.push(objectKeyBased);
      }
    })

    this.setState({
      showItems: newData,
      searchText: text,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Header navigation={this.props.navigation} />
        <TabBar activeIndex={2} navigation={this.props.navigation} />
        {
          this.state.isLoading
            ?
            <View style={styles.body}>
              <SearchBar
                lightTheme
                containerStyle={styles.searchBar}
                inputContainerStyle={styles.searchInput}
                inputStyle={styles.input}
                searchIcon={false}
                clearIcon={false}
                onChangeText={text => this.SearchFilterFunction(text)}
                onClear={text => this.SearchFilterFunction('')}
                placeholder={I18nManager.isRTL ? 'חיפוש אנשי קשר' : 'Search'}
                value={this.state.searchText}
              />
              <SectionList
                sections={this.state.showItems}
                renderSectionHeader={({ section }) => (
                  <Text style={styles.sectionHeaderText}>{section.title}</Text>
                )}
                renderItem={({ item }) => (
                  <View>
                    <CustomListItem
                      item={item}
                      pressPin={item.showPin}
                      isContact={true}
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
  searchBar: {
    backgroundColor: '#ffffff',
    shadowColor: '#ffffff',
    height: 50,
    padding: 0,
    marginBottom: 10,
  },
  searchInput: {
    padding: 0,
    backgroundColor: '#ffffff',
  },
  input: {
    color: 'black',
    textAlign: I18nManager.isRTL ? 'right' : 'left'
  },
  sectionHeaderText: {
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