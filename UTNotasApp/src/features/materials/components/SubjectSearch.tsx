import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import type { Subject } from "@/src/features/materials/data/materialOptions";
import { styles } from "@/src/features/materials/screens/styles/MaterialCreate.styles";
import { normalizeText } from "@/src/utils/format";

export function SubjectSearch({
  value,
  subjects,
  selectedSubject,
  onSelect,
}: {
  value: string;
  subjects: Subject[];
  selectedSubject?: Subject;
  onSelect: (subject: Subject | null) => void;
}) {
  const [query, setQuery] = useState(value);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const filteredSubjects = useMemo(() => {
    if (!query.trim()) return subjects.slice(0, 10);
    const normalizedQuery = normalizeText(query);
    return subjects
      .filter((subject) => normalizeText(subject.nombre).includes(normalizedQuery))
      .slice(0, 10);
  }, [query, subjects]);

  const showSuggestions = focused && filteredSubjects.length > 0;

  return (
    <View>
      <View style={styles.searchInputWrap}>
        <TextInput
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            if (selectedSubject && text !== selectedSubject.nombre) onSelect(null);
          }}
          onFocus={() => setFocused(true)}
          placeholder="Ej: Analisis Matematico II"
          placeholderTextColor="#8a94a6"
          style={[styles.input, styles.searchInput]}
        />
        {query ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setQuery("");
              onSelect(null);
            }}
            style={styles.clearButton}
          >
            <Feather name="x" size={18} color="#667085" />
          </Pressable>
        ) : null}
      </View>

      {showSuggestions ? (
        <View style={styles.suggestions}>
          {filteredSubjects.map((subject) => (
            <Pressable
              key={subject.id}
              accessibilityRole="button"
              onPress={() => {
                setQuery(subject.nombre);
                setFocused(false);
                onSelect(subject);
              }}
              style={({ pressed }) => [
                styles.suggestionItem,
                pressed && styles.pressedSuggestion,
              ]}
            >
              <Text style={styles.suggestionText}>{subject.nombre}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
