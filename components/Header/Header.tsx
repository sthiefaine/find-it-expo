import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

const Header = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const styles = StyleSheet.create({
    header: {
      height: 60,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#444' : '#ccc',
    },
    title: {
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#000',
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Find-it</Text>
    </View>
  );
};

export default Header;