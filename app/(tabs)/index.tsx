import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '@/components/Header/Header';

const HomeScreen = () => {
  const router = useRouter();
  return (
    <View>
      <Header />
      <Text>Bienvenue dans find-it</Text>
      <Text>Trouvez le personnage spécifique parmi la foule</Text>
      <Button title="Démarrer le jeu" onPress={() => router.push('/(tabs)/game')} />
    </View>
  );
};

export default HomeScreen;