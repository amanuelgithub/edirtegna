import { useOnboarding } from '@/context/OnboardingContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Dimensions,
  Animated,
  ImageRequireSource,
  TouchableOpacity,
} from 'react-native';
import type { PagerViewOnPageScrollEventData } from 'react-native-pager-view';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';

const data = [
  {
    type: 'Solidarity',
    imageUri: require('../../assets/urbanears_blue.png'),
    heading: 'Together, We Rise',
    description:
      'Build a stronger community by contributing and receiving support when it matters most.',
    key: 'first',
    // color: '#9dcdfa',
    color: '#00d63d',
  },
  {
    type: 'Mutual Aid',
    imageUri: require('../../assets/urbanears_pink.png'),
    heading: 'Helping Hands, Always There',
    description:
      'A simple way to give and receive support in times of need. Stay connected, stay supported.',
    key: 'second',
    // color: '#db9efa',
    color: '#ecff1b',
  },
  {
    type: 'Digital Edir',
    imageUri: require('../../assets/urbanears_grey.png'),
    heading: 'Edir, Reimagined for Today',
    description:
      'Experience the tradition of Edir with the ease of digital payments and instant updates.',
    key: 'third',
    // color: '#999',
    color: '#ff0505',
  },
];
const { width, height } = Dimensions.get('window');
const LOGO_WIDTH = 220;
const LOGO_HEIGHT = 40;
const DOT_SIZE = 40;
const TICKER_HEIGHT = 40;
const CIRCLE_SIZE = width * 0.6;

const Circle = ({
  scrollOffsetAnimatedValue,
}: {
  scrollOffsetAnimatedValue: Animated.Value;
}) => {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.circleContainer]}>
      {data.map(({ color }, index) => {
        const inputRange = [0, 0.5, 0.99];
        const inputRangeOpacity = [0, 0.5, 0.99];
        const scale = scrollOffsetAnimatedValue.interpolate({
          inputRange,
          outputRange: [1, 0, 1],
          extrapolate: 'clamp',
        });

        const opacity = scrollOffsetAnimatedValue.interpolate({
          inputRange: inputRangeOpacity,
          outputRange: [0.2, 0, 0.2],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.circle,
              {
                backgroundColor: color,
                opacity,
                transform: [{ scale }],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const Ticker = ({
  scrollOffsetAnimatedValue,
  positionAnimatedValue,
}: {
  scrollOffsetAnimatedValue: Animated.Value;
  positionAnimatedValue: Animated.Value;
}) => {
  const inputRange = [0, data.length];
  const translateY = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue
  ).interpolate({
    inputRange,
    outputRange: [0, data.length * -TICKER_HEIGHT],
  });
  return (
    <View style={styles.tickerContainer}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        {data.map(({ type }, index) => {
          return (
            <Text key={index} style={styles.tickerText}>
              {type}
            </Text>
          );
        })}
      </Animated.View>
    </View>
  );
};

const Item = ({
  imageUri,
  heading,
  description,
  scrollOffsetAnimatedValue,
}: {
  imageUri: ImageRequireSource;
  description: string;
  heading: string;
  scrollOffsetAnimatedValue: Animated.Value;
  positionAnimatedValue: Animated.Value;
}) => {
  const inputRange = [0, 0.5, 0.99];
  const inputRangeOpacity = [0, 0.5, 0.99];
  const scale = scrollOffsetAnimatedValue.interpolate({
    inputRange,
    outputRange: [1, 0, 1],
  });

  const opacity = scrollOffsetAnimatedValue.interpolate({
    inputRange: inputRangeOpacity,
    outputRange: [1, 0, 1],
  });

  return (
    <View style={styles.itemStyle}>
      <Animated.Image
        source={imageUri}
        style={[
          styles.imageStyle,
          {
            transform: [{ scale }],
          },
        ]}
      />
      <View style={styles.textContainer}>
        <Animated.Text
          style={[
            styles.heading,
            {
              opacity,
            },
          ]}
        >
          {heading}
        </Animated.Text>
        <Animated.Text
          style={[
            styles.description,
            {
              opacity,
            },
          ]}
        >
          {description}
        </Animated.Text>
      </View>
    </View>
  );
};

const Pagination = ({
  scrollOffsetAnimatedValue,
  positionAnimatedValue,
}: {
  scrollOffsetAnimatedValue: Animated.Value;
  positionAnimatedValue: Animated.Value;
}) => {
  const inputRange = [0, data.length];
  const translateX = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue
  ).interpolate({
    inputRange,
    outputRange: [0, data.length * DOT_SIZE],
  });

  return (
    <View style={[styles.pagination]}>
      <Animated.View
        style={[
          styles.paginationIndicator,
          {
            position: 'absolute',
            transform: [{ translateX: translateX }],
          },
        ]}
      />
      {data.map((item) => {
        return (
          <View key={item.key} style={styles.paginationDotContainer}>
            <View
              style={[styles.paginationDot, { backgroundColor: item.color }]}
            />
          </View>
        );
      })}
    </View>
  );
};

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

// export default function HeadphonesCarouselExample() {
export default function IndexPage() {
  const scrollOffsetAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = React.useRef(new Animated.Value(0)).current;

  const [pageIndex, setPageIndex] = React.useState(0);
  const router = useRouter();
  const { completeOnboarding } = useOnboarding();

  const handleSkipOrGetStarted = () => {
    // console.log('Skip Pressed');
    completeOnboarding('true');
    router.replace('/auth/signin');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Circle scrollOffsetAnimatedValue={scrollOffsetAnimatedValue} />
        <AnimatedPagerView
          initialPage={0}
          style={{ width: '100%', height: '100%' }}
          onPageScroll={Animated.event<PagerViewOnPageScrollEventData>(
            [
              {
                nativeEvent: {
                  offset: scrollOffsetAnimatedValue,
                  position: positionAnimatedValue,
                },
              },
            ],
            {
              listener: ({ nativeEvent: { offset, position } }) => {
                console.log(`Position: ${position} Offset: ${offset}`);
                setPageIndex(position);
              },
              useNativeDriver: true,
            }
          )}
        >
          {data.map(({ key, ...item }, index) => (
            <View collapsable={false} key={index}>
              <Item
                key={key}
                {...item}
                scrollOffsetAnimatedValue={scrollOffsetAnimatedValue}
                positionAnimatedValue={positionAnimatedValue}
              />
            </View>
          ))}
        </AnimatedPagerView>

        <View className="absolute bottom-0 left-0 right-0 p-4 flex-row justify-between">
          {/* get started */}
          {pageIndex === 2 && (
            <TouchableOpacity
              onPress={handleSkipOrGetStarted}
              className="shadow-sm w-1/3"
            >
              <View className="flex-1 flex-row gap-2 justify-center items-center border border-green-900 bg-white rounded-lg p-1">
                <Text className="text-green-900 text-lg font-bold text-center ">
                  Get Started
                </Text>

                <MaterialIcons
                  name="arrow-forward-ios"
                  size={16}
                  color="green"
                  style={{ alignSelf: 'center' }}
                />
              </View>
            </TouchableOpacity>
          )}
          {/* skip */}
          {pageIndex !== 2 && (
            <TouchableOpacity
              onPress={handleSkipOrGetStarted}
              className="shadow-sm w-1/3"
            >
              <View className="flex-1 flex-row gap-2 justify-center items-center border border-gray-600 bg-white rounded-lg p-1">
                <Text className="text-gray-900 text-lg font-bold text-center ">
                  skip
                </Text>

                <MaterialIcons
                  name="arrow-forward-ios"
                  size={16}
                  color="gray"
                  style={{ alignSelf: 'center' }}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* <Image
        style={styles.logo}
        source={require('../../assets/ue_black_logo.png')}
      /> */}
        <Pagination
          scrollOffsetAnimatedValue={scrollOffsetAnimatedValue}
          positionAnimatedValue={positionAnimatedValue}
        />
        <Ticker
          scrollOffsetAnimatedValue={scrollOffsetAnimatedValue}
          positionAnimatedValue={positionAnimatedValue}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemStyle: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: width * 0.75,
    height: width * 0.75,
    resizeMode: 'contain',
    flex: 1,
  },
  textContainer: {
    alignItems: 'flex-start',
    alignSelf: 'flex-end',
    flex: 0.5,
  },
  heading: {
    color: '#444',
    textTransform: 'uppercase',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 5,
  },
  description: {
    color: '#ccc',
    fontWeight: '600',
    textAlign: 'left',
    width: width * 0.75,
    marginRight: 10,
    fontSize: 16,
    lineHeight: 16 * 1.5,
  },
  logo: {
    opacity: 0.9,
    height: LOGO_HEIGHT,
    width: LOGO_WIDTH,
    resizeMode: 'contain',
    position: 'absolute',
    left: 10,
    bottom: 10,
    transform: [
      { translateX: -LOGO_WIDTH / 2 },
      { translateY: -LOGO_HEIGHT / 2 },
      { rotateZ: '-90deg' },
      { translateX: LOGO_WIDTH / 2 },
      { translateY: LOGO_HEIGHT / 2 },
    ],
  },
  pagination: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    flexDirection: 'row',
    height: DOT_SIZE,
  },
  paginationDot: {
    width: DOT_SIZE * 0.3,
    height: DOT_SIZE * 0.3,
    borderRadius: DOT_SIZE * 0.15,
  },
  paginationDotContainer: {
    width: DOT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationIndicator: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  tickerContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    overflow: 'hidden',
    // overflow: 'visible',
    height: TICKER_HEIGHT,
  },
  tickerText: {
    fontSize: TICKER_HEIGHT,
    lineHeight: TICKER_HEIGHT,
    textTransform: 'uppercase',
    flexWrap: 'nowrap',
    fontWeight: '800',
  },

  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    position: 'absolute',
    top: '15%',
  },
});
