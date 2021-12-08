import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  I18nManager,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const windowHeight = Dimensions.get('window').height;

export default class NoteBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      note: {
        content: '',
        saveDate: '',
      },
      isFirst: false,
    }
  }

  componentDidMount = async () => {
    try {
      const note = await AsyncStorage.getItem(this.props.number);
      if (note !== null) {
        this.setState({ note: JSON.parse(note) });
      }
    } catch (error) {
      console.log(error);
    }
  }

  saveNote = async () => {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year

    if (date < 10) date = '0' + date.toString();
    if (month < 10) month = '0' + month.toString();

    const note = {
      content: this.state.note.content,
      saveDate: date + '.' + month + '.' + year,
    };

    try {
      await AsyncStorage.setItem(this.props.number, JSON.stringify(note));
      this.setState({ note: note });
      this.props.changeStatus();
    } catch (error) {
      console.log(error);
    }
  }

  deleteNote = async () => {
    try {
      await AsyncStorage.removeItem(this.props.number);
      this.setState({ note: { content: '', saveDate: '' } });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          multiline
          maxLength={500}
          style={styles.input}
          selection={!this.state.isFirst ? { start: 0, end: 0 } : null}
          onSelectionChange={()=> this.setState({ isFirst: true })}
          value={this.state.note.content}
          placeholder={I18nManager.isRTL ? 'הוסף הערה…' : 'Write something...'}
          placeholderTextColor="#b1b8ba"
          onChangeText={(text) => this.setState({ 
            note: { ...this.state.note, content: text }, 
            isFirst: true,
          })}
          onEndEditing={this.saveNote}
        />
        {
          this.state.note.saveDate === ''
            ?
            <View style={styles.footer}>
              <Text style={styles.date}>
                {
                  this.state.note.content === ''
                    ? '500'
                    : this.state.note.content.length
                }
                /500
                {I18nManager.isRTL ? 'תווים' : 'characters'}
              </Text>
            </View>
            :
            <View style={styles.footer}>
              <Text style={styles.date}>
                {this.state.note.content.length}
                /500
                {I18nManager.isRTL ? ' תווים' : ' characters'}{"\n"}
                {I18nManager.isRTL ? 'נשמר ב ' : 'Saved at '}
                {this.state.note.saveDate}
              </Text>
              <TouchableOpacity style={styles.btn} onPress={this.deleteNote}>
                <Image source={require('aCard/images/trash.png')} style={styles.btnImg} />
                <Text style={styles.btnText}>
                  {I18nManager.isRTL ? 'מחק הערה' : 'Delete note'}
                </Text>
              </TouchableOpacity>
            </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f4f4',
    borderTopColor: '#48a3c4',
    borderTopWidth: 1,
    height: windowHeight * 0.2,
  },
  input: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 16,
    color: '#30667a',
    padding: 10,
    textAlignVertical: 'top',
    height: windowHeight * 0.2 - 40,
  },
  footer: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 14,
    color: '#a2a2a2',
    textAlignVertical: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dd3939',
    padding: 10,
    borderRadius: 20,
    height: 20,
    marginRight: 10,
  },
  btnImg: {
    width: 9,
    height: 12,
    tintColor: '#dd3939',
  },
  btnText: {
    marginLeft: 5,
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 14,
    textAlign: 'left',
    color: '#dd3939',
  },
})