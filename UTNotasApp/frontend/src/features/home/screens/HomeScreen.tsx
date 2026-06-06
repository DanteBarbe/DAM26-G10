import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { homeStyles as styles } from "./styles/Home.styles";

export default function HomeScreen() {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    router.push({ pathname: "/search", params: { q: query.trim() } });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/profile")}
          style={({ pressed }) => [styles.profileButton, pressed && styles.pressed]}
        >
          <Feather name="user" size={18} color="#2f6f4e" />
          <Text style={styles.profileButtonText}>Mi perfil</Text>
        </Pressable>
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.brand}>UTNotas</Text>
          <Text style={styles.title}>Tu material de{"\n"}estudio, en un lugar</Text>
          <Text style={styles.subtitle}>
            Encontrá apuntes, parciales y resúmenes de la UTN FRLP.
          </Text>
        </View>

        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#746c61" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            placeholder="Materia, título o carrera..."
            placeholderTextColor="#9a9284"
            style={styles.searchInput}
          />
          {query.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => setQuery("")}
              style={styles.searchButton}
            >
              <Feather name="x" size={16} color="#ffffff" />
            </Pressable>
          ) : (
            <Pressable
              accessibilityRole="button"
              onPress={handleSearch}
              style={styles.searchButton}
            >
              <Feather name="arrow-right" size={16} color="#ffffff" />
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
