import React, { Component } from "react";
import {
  Alert,
  View,
  Text,
  Vibration,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import { MaterialIcons } from "@expo/vector-icons";
import { StackActions } from "@react-navigation/native";

class QRCodeScanner extends Component {
  constructor(props) {
    super(props);

    this.onBarCodeRead = this.onBarCodeRead.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
    this.scannedCode = null;

    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      captures: [],
    };
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    await this.setState({ hasCameraPermission: status === "granted" });
    await this.resetScanner();
  }

  onBarCodeRead({ type, data }) {
    if (
      (type === this.state.scannedItem.type &&
        data === this.state.scannedItem.data) ||
      data === null
    ) {
      return;
    }

    Vibration.vibrate();
    this.setState({ scannedItem: { data, type } });

    if (type.startsWith("org.iso.QRCode")) {
      // Do samething for QRCode
      console.log(`QRCode scanned: ${data}`);

      this.props.navigation.navigate("OthersStatus", { ean: data });
    }
  }

  renderMessage() {
    if (this.state.scannedItem && this.state.scannedItem.type) {
      const { type, data } = this.state.scannedItem;
      return (
        <Text style={styles.scanScreenMessage}>
          {`Scanned \n ${type} \n ${data}`}
        </Text>
      );
    }
    return (
      <Text style={styles.scanScreenMessage}>Focus the barcode to scan.</Text>
    );
  }

  handleShortCapture = async () => {
    const photoData = await this.camera.takePictureAsync();
    this.setState({
      capturing: false,
      captures: [photoData, ...this.state.captures],
    });

    console.log(photoData);
  };

  resetScanner() {
    this.scannedCode = null;
    this.setState({
      scannedItem: {
        type: null,
        data: null,
      },
    });
  }

  render() {
    const { hasCameraPermission } = this.state;
    const { navigation } = this.props;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          {/* <Camera style={StyleSheet.absoluteFill} type={this.state.type}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                  });
                }}
              >
                <Text style={styles.text}> Flip </Text>
              </TouchableOpacity>
            </View>
          </Camera> */}

          <Camera
            style={styles.camera}
            type={this.state.type}
            ref={(ref) => {
              this.camera = ref;
            }}
          >
            <View style={styles.cameraFiller} />
            <View style={styles.cameraContent}>
              <TouchableOpacity
                style={styles.buttonFlipCamera}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                  });
                }}
              >
                <MaterialIcons name="flip" size={25} color="#e8e827" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonCamera}
                onPress={this.handleShortCapture}
              >
                <MaterialIcons name="camera" size={50} color="#e8e827" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonCloseCamera}
                onPress={() => {
                  navigation.navigate("Home");
                }}
              >
                <MaterialIcons name="close" size={25} color="#e8e827" />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
});

export default QRCodeScanner;
