import React, { Component } from "react";
import { View, Text, Button } from "react-native";
import Pusher from "pusher-js/react-native";
import { useNavigation } from "@react-navigation/native";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.pusher = new Pusher("fbb5bd2aebf2cb3a5967", {
      authEndpoint: "YOUR_NGROK_URL/pusher/auth",
      cluster: "us2",
      encrypted: true, // false doesn't work, you need to always use https for the authEndpoint
    });
  }

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.mainText}>What to do?</Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Share"
            color="#1083bb"
            onPress={() => {
              navigation.navigate("Share", {
                pusher: this.pusher,
              });
            }}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="View"
            color="#2f9c0a"
            onPress={() => {
              navigation.navigate("View", {
                pusher: this.pusher,
              });
            }}
          />
        </View>
      </View>
    );
  }
}

export default function (props) {
  const navigation = useNavigation();
  return <HomeScreen {...props} navigation={navigation} />;
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    justifyContent: "center",
    alignItems: "center",
  },
  mainText: {
    fontSize: 25,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 30,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
};
