/**
 * @fileoverview A React Native component that renders a "Not Found" screen for non-existent routes.
 * 
 * This component is part of the Expo Router navigation system and displays when a requested
 * route doesn't exist in the application. It provides a simple error message and a link
 * to navigate back to the home screen.
 * 
 * @component NotFoundScreen
 * @returns {JSX.Element} A screen with an error message and a home navigation link
 * 
 * @example
 * // This screen is automatically rendered by Expo Router when a route is not found
 * <NotFoundScreen />
 * 
 * Features:
 * - Custom navigation stack header with "Oops!" title
 * - Centered container layout
 * - Error message text
 * - Navigation link to home screen
 * - Responsive styling with React Native StyleSheet
 * 
 * @dependencies
 * - expo-router
 * - react-native
 * 
 * @copyright RYAN SHELBY (2025)
 */
import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.text}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 600,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
