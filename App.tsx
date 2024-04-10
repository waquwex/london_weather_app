import { StatusBar } from "expo-status-bar";
import { View, ImageBackground, StatusBar as RNStatusBar, useWindowDimensions, Image, ImageSourcePropType, Button } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Platform, SafeAreaView, StyleSheet, Text } from "react-native";
import { StrokeText } from "@charmy.tech/react-native-stroke-text";
import Weather from "./models/Weather";
import getWeather from "./requests/getWeather";
import weatherCodes from "./constants/weatherCodes";

// Images are 1536 * 1536
const weatherImages: { [key: number]: ImageSourcePropType } = {
  0: require("./assets/weather-images/0.jpg"),
  113: require("./assets/weather-images/113.jpg"),
  116: require("./assets/weather-images/116.jpg"),
  119: require("./assets/weather-images/119.jpg"),
  122: require("./assets/weather-images/122.jpg"),
  143: require("./assets/weather-images/143.jpg"),
  176: require("./assets/weather-images/176.jpg"),
  179: require("./assets/weather-images/179.jpg"),
  182: require("./assets/weather-images/182.jpg"),
  185: require("./assets/weather-images/185.jpg"),
  200: require("./assets/weather-images/200.jpg"),
  227: require("./assets/weather-images/227.jpg"),
  230: require("./assets/weather-images/230.jpg"),
  248: require("./assets/weather-images/248.jpg"),
  260: require("./assets/weather-images/260.jpg"),
  263: require("./assets/weather-images/263.jpg"),
  266: require("./assets/weather-images/266.jpg"),
  281: require("./assets/weather-images/281.jpg"),
  284: require("./assets/weather-images/284.jpg"),
  293: require("./assets/weather-images/293.jpg"),
  296: require("./assets/weather-images/296.jpg"),
  299: require("./assets/weather-images/299.jpg"),
  302: require("./assets/weather-images/302.jpg"),
  305: require("./assets/weather-images/305.jpg"),
  308: require("./assets/weather-images/308.jpg"),
  311: require("./assets/weather-images/311.jpg")
}


export default function App() {
  const dimensions = useWindowDimensions();
  const [weather, setWeather] = useState<Weather | null>();
  const [networkError, setNetworkError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getCurrentWeather = useCallback(() => {
    setLoading(true);
    const getWeather_async = async () => {
      try {
        const weather = await getWeather();
        setNetworkError(false);
        setWeather(weather);
        setLoading(false);
      } catch (err) {
        setNetworkError(true);
        setLoading(false);
      }
    }

    getWeather_async();
  }, [getWeather]);

  useEffect(() => {
    getCurrentWeather();
  }, [getWeather]);

  const handleRetryPress = () => {
    getCurrentWeather();
  }

  const weatherUi = <ImageBackground style={{
    height: dimensions.height > dimensions.width ? dimensions.width : undefined,
    flex: dimensions.height > dimensions.width ? 0 : 1,
  }} source={weather ? weatherImages[weather.weatherCode] : weatherImages[0]}
    imageStyle={{ resizeMode: "cover" }}>
    <SafeAreaView style={{
      flex: 1,
      paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "column"
    }}>
      <StrokeText
        text="London"
        fontSize={20}
        color="black"
        strokeColor="white"
        strokeWidth={2}
      />
      <View style={{
        flexDirection: "row"
      }}>
        <StrokeText
          text={weather?.temperature.toString() || "?"}
          fontSize={82}
          color="#ffffff"
          strokeColor="black"
          strokeWidth={3}
        />
        <View style={{
          position: "absolute",
          right: -28,
          top: 14
        }}>
          <StrokeText
            text="°"
            fontSize={82}
            color="#ffffff"
            strokeColor="black"
            strokeWidth={3}
          />
        </View>
      </View>
      <StrokeText
        text={weather ? weatherCodes[weather.weatherCode] : "?"}
        fontSize={22}
        color="white"
        strokeColor="black"
        strokeWidth={2}
      />
    </SafeAreaView>
    <View style={styles.weatherPropsGrid}>
      <View style={styles.weatherPropsRow}>
        <View style={styles.weatherPropCell}>
          <Image source={require("./assets/weather-props/feelslike.png")} style={styles.weatherPropImage}>
          </Image>
          <View>
            <Text style={{
              fontSize: 15
            }}>
              Feelslike
            </Text>
            <Text style={{
              fontSize: 15
            }}>
              {weather?.feelslike.toString() || "?"}°
            </Text>
          </View>
        </View>
        <View style={styles.weatherPropCell}>
          <Image source={require("./assets/weather-props/wind.png")} style={styles.weatherPropImage}>
          </Image>
          <View>
            <Text style={{
              fontSize: 15
            }}>
              Wind
            </Text>
            <Text style={{
              fontSize: 15
            }}>
              {weather?.wind.toString() || "?"} km/h
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.weatherPropsRow}>
        <View style={styles.weatherPropCell}>
          <Image source={require("./assets/weather-props/humidity.png")} style={styles.weatherPropImage}>
          </Image>
          <View>
            <Text style={{
              fontSize: 15
            }}>
              Humidity
            </Text>
            <Text style={{
              fontSize: 15
            }}>
              {weather?.humidity?.toString() || "?"}%
            </Text>
          </View>
        </View>
        <View style={styles.weatherPropCell}>
          <Image source={require("./assets/weather-props/pressure.png")} style={styles.weatherPropImage}>
          </Image>
          <View>
            <Text style={{
              fontSize: 15
            }}>
              Pressure
            </Text>
            <Text style={{
              fontSize: 15
            }}>
              {weather?.pressure.toString() || "?"} mBar
            </Text>
          </View>
        </View>
      </View>
    </View>
  </ImageBackground>

  const loadingUi = <SafeAreaView style={{
    flex: 1,
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
    alignItems: "center",
    flexDirection: "column"
  }}>
    <Text style={{
      color: "white",
      fontSize: 20,
      marginBottom: 40
    }}>Loading...</Text>
  </SafeAreaView>

  const networkErrorUi = <SafeAreaView style={{
    flex: 1,
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
    alignItems: "center",
    flexDirection: "column"
  }}>
    <Text style={{
      color: "white",
      fontSize: 20,
      marginBottom: 40
    }}>No internet connection</Text>
    <Button title="Retry?" onPress={handleRetryPress} />
  </SafeAreaView>

  return (
    <>
      <StatusBar translucent={true} style="auto" />
      <View style={styles.container}>
        { loading ? loadingUi : networkError ? networkErrorUi : weatherUi }
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  weatherPropsGrid: {
    flex: 0,
    padding: 6
  },
  weatherPropsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8
  },
  weatherPropCell: {
    backgroundColor: "#ffffff99",
    padding: 4,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center"
  },
  weatherPropImage: {
    width: 36,
    height: 36,
    resizeMode: "center",
    marginRight: 5
  }
});