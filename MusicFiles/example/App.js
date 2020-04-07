/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Button,
  TextInput,
  DeviceEventEmitter,
  ScrollView
} from "react-native";
import MusicFiles, { RNAndroidAudioStore } from "react-native-get-music-files";
import { ListItem } from 'react-native-elements';
import Sound from 'react-native-sound';
import { TouchableOpacity } from 'react-native';



type Props = {};
export default class App extends Component<Props> {
  constructor() {

    super();
    Sound.setCategory('Playback', true);
    this.requestPermission = async () => {
      try {
        const granted = await PermissionsAndroid.requestMultiple(
          [
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
          ],
          {
            title: "Permission",
            message: "Storage access is requiered",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          alert("You can use the package");
        } else {
          this.requestPermission();
        }
      } catch (err) {
        console.warn(err);
      }
    };

    this.getAll = () => {
      RNAndroidAudioStore.getAll({
        blured: false, // works only when 'cover' is set to true
        artist: true,
        duration: true, //default : true
        cover: false, //default : true,
        genre: true,
        title: true,
        cover: true,
        minimumSongDuration: 10000, // get songs bigger than 10000 miliseconds duration,
        batchNumber : 1,
        delay: 1000
      })
        .catch(er => alert(JSON.stringify(error)));
    };

    this.getAlbums = (artist='') => {
      RNAndroidAudioStore.getAlbums({ artist : artist })
        .then(f => {
          this.setState({ ...this.state, albums: f });
        })
        .catch(er => alert(JSON.stringify(error)));
    };

    this.getArtists = () => {
      RNAndroidAudioStore.getArtists({})
        .then(f => {
          this.setState({ ...this.state, artists: f });
        })
        .catch(er => alert(JSON.stringify(error)));
    };

    this.getSongs = (artist = '', album = '') => {
      RNAndroidAudioStore.getSongs({ artist, album })
        .then(f => {
          this.setState({ ...this.state, songs: f });
          console.log(this.state.songs);
        })
        .catch(er => alert(JSON.stringify(error)));
    };

    this.search = searchParam => {
      RNAndroidAudioStore.search({ searchParam })
        .then(f => {
          this.setState({ ...this.state, search: f });
        })
        .catch(er => alert(JSON.stringify(error)));
    };
    this.selectedItem = item => {
      console.log(item);
    }
    this.playSound = (item, index) =>{
      sound1 = new Sound(item.path, Sound.MAIN_BUNDLE, (e) => {
        if (e) {
          console.log('error', e);
        } else {
          console.log('duration', sound1.getDuration());
          sound1.play()
        }
      });
      sound1.play();
    }
  this.stopSound = (item, index) => {
      sound1.stop(() => {
        console.log('Stop');
      });
    }
    this.state = {
      getAlbumsInput: "",
      getSongsInput: {},
      searchParam: "",
      tracks: [],
      artists: [],
      albums: [],
      songs: [],
      search: [],
      totalDuration : 0
    };
  var sound1;
  }



  componentDidMount() {
    this.requestPermission();

    DeviceEventEmitter.addListener(
      'onBatchReceived',
      (params) => {
          this.setState({ ...this.state, tracks: [...this.state.tracks, params.batch] })
      }
  )

  DeviceEventEmitter.addListener(
    'onLastBatchReceived',
    (params) => {
        this.setState(alert('last batch sent'));
    }
)
  
  }

  componentWillUnmount(){
    DeviceEventEmitter.removeAllListeners();
  }
  render() {
    return (
      <View style={styles.container}>
        <Button title="getAll" onPress={this.getAll} />
        <ScrollView style={{height:100, width:'100%'}}>
            {
              this.state.tracks.map((l, i) => (
                <ListItem
                  key={i}
                  title={l.name}
                  bottomDivider
                />
              ))
            }
        </ScrollView>

        <Button title="getArtists" onPress={this.getArtists} />
        <ScrollView style={{height:100, width:'100%'}}>
        <Text style={styles.instructions}>
          results : {JSON.stringify(this.state.artists)}
        </Text>
        </ScrollView>
        <TextInput
          placeholder="author"
          onChangeText={v =>
            this.setState({ ...this.state, getAlbumsInput: v })
          }
        />
        <Button
          title="getAlbums"
          onPress={() => this.getAlbums( this.state.getAlbumsInput )}
        />
        <ScrollView style={{height:100, width:'100%'}}>
        <Text style={styles.instructions}>
          results : {JSON.stringify(this.state.albums)}
        </Text>
        </ScrollView>
        <TextInput
          placeholder="artist"
          onChangeText={v =>
            this.setState({
              ...this.state,
              getSongsInput: { ...this.state.getSongsInput, artist: v }
            })
          }
        />
        <TextInput
          placeholder="album"
          onChangeText={v =>
            this.setState({
              ...this.state,
              getSongsInput: { ...this.state.getSongsInput, album: v }
            })
          }
        />
        <Button
          title="getSongs"
          onPress={() =>
            this.getSongs(
              this.state.getSongsInput.artist,
              this.state.getSongsInput.album
            )
          }
        />
        <ScrollView style={{height:100, width:'100%'}}>
        {
            this.state.songs.map((item, index) => {
                return (
                  <View style={styles.feature} key={item.title}>
                    <Text style={{ flex: 1, fontSize: 14 }}>{item.title}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.playSound(item, index);
                      }}>
                      <Text style={styles.buttonPlay}>Play</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.stopSound(item, index);
                      }}>
                      <Text style={styles.buttonStop}>Stop</Text>
                    </TouchableOpacity>
                  </View>
                );
              })
              // this.state.songs.map((l, i) => (
              //   <ListItem
              //     key={i}
              //     title={l.title}
              //     bottomDivider
              //     onPress= {() => this.selectedItem(l)}
              //   />
              // ))
            }
        </ScrollView>
        <TextInput
          placeholder="search"
          onChangeText={v => this.setState({ ...this.state, searchParam: v })}
        />
        <Button
          title="search"
          onPress={() => this.search(this.state.searchParam)}
        />
        <ScrollView style={{height:100, width:'100%'}}>
        <Text style={styles.instructions}>
          results : {JSON.stringify(this.state.search)}
        </Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});