import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Clipboard,
  Alert,
  Image,
  Dimensions,
  Button,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Permissions } from "expo-permissions";
import { Camera } from "expo-camera";
import generateRandomAnimalName from "random-animal-name-generator";
import { ScreenOrientation } from "expo-screen-orientation";
import Pusher from "pusher-js/react-native";

class ShareScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: "Share Photos",
      headerTransparent: true,
      headerRight: (
        <Button
          title="Finish"
          color="#333"
          onPress={() => params.finishSharing()}
        />
      ),
      headerTintColor: "#333",
    };
  };

  state = {
    hasCameraPermission: null, // whether the user has allowed the app to access the device's camera
    cameraType: Camera.Constants.Type.front, // which camera to use? front or back?
    isCameraVisible: false, // whether the camera UI is currently visible or not
    latestImage: null, // the last photo taken by the user
  };

  constructor(props) {
    super(props);
    // generate unique username
    const animalName = generateRandomAnimalName()
      .replace(" ", "_")
      .toLowerCase();
    const min = 10;
    const max = 99;
    const number = Math.floor(Math.random() * (max - min + 1)) + min;
    const username = animalName + number;
    this.username = username;

    // initialize pusher
    // this.pusher = null;
    this.pusher = new Pusher("fbb5bd2aebf2cb3a5967", {
      authEndpoint: "YOUR_NGROK_URL/pusher/auth",
      cluster: "us2",
      encrypted: true, // false doesn't work, you need to always use https for the authEndpoint
    });
    this.user_channel = null;
  }

  async componentDidMount() {
    const { navigation } = this.props;

    navigation.setParams({
      finishSharing: this.finishSharing,
    });

    // subscribe to channel
    //this.user_channel = this.pusher.subscribe(`private-user-${this.username}`);

    // ask user to access device camera

    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    await this.setState({ hasCameraPermission: status === "granted" });
    await this.resetScanner();
  }

  render() {
    return (
      <View style={styles.container}>
        {!this.state.isCameraVisible && (
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.mainContent}>
              <TouchableOpacity onPress={this.copyUsernameToClipboard}>
                <View style={styles.textBox}>
                  <Text style={styles.textBoxText}>{this.username}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={this.openCamera}>
                  <MaterialIcons name="camera-alt" size={40} color="#1083bb" />
                </TouchableOpacity>
              </View>

              {this.state.latestImage && (
                <Image
                  style={styles.latestImage}
                  resizeMode={"cover"}
                  source={{ uri: this.state.latestImage }}
                />
              )}
            </View>
          </ScrollView>
        )}

        {this.state.isCameraVisible && (
          <Camera
            style={styles.camera}
            type={this.state.cameraType}
            ref={(ref) => {
              this.camera = ref;
            }}
          >
            <View style={styles.cameraFiller} />
            <View style={styles.cameraContent}>
              <TouchableOpacity
                style={styles.buttonFlipCamera}
                onPress={this.flipCamera}
              >
                <MaterialIcons name="flip" size={25} color="#e8e827" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonCamera}
                onPress={this.takePicture}
              >
                <MaterialIcons name="camera" size={50} color="#e8e827" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonCloseCamera}
                onPress={this.closeCamera}
              >
                <MaterialIcons name="close" size={25} color="#e8e827" />
              </TouchableOpacity>
            </View>
          </Camera>
        )}
      </View>
    );
  }
}

export default function (props) {
  const navigation = useNavigation();
  return <ShareScreen {...props} navigation={navigation} />;
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  scroll: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 70,
  },
  mainContent: {
    flex: 1,
  },
  textBox: {
    borderStyle: "dashed",
    borderWidth: 3,
    borderColor: "#4e4e4e",
    backgroundColor: "#FFF",
    padding: 5,
  },
  textBoxText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  latestImage: {
    width: 150,
    height: 150,
    marginTop: 10,
    borderWidth: 5,
    borderColor: "#FFF",
    alignSelf: "center",
  },
  camera: {
    flex: 1,
  },
  cameraFiller: {
    flex: 8,
  },
  cameraContent: {
    flex: 2,
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  buttonFlipCamera: {
    flex: 3,
    padding: 10,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  buttonTextFlipCamera: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e8e827",
  },
  buttonCamera: {
    flex: 4,
    alignSelf: "center",
    alignItems: "center",
  },
  buttonCloseCamera: {
    flex: 3,
    padding: 10,
    alignSelf: "flex-end",
    alignItems: "center",
  },
};
