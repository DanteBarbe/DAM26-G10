import { Feather } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import { styles } from "./styles/OptionSheet.styles";
import { IconButton } from "@/src/components/IconButton";

type SelectOption<Value extends string | number> = {
  label: string;
  value: Value;
};

export function OptionSheet<Value extends string | number>({
  visible,
  title,
  options,
  selectedValue,
  emptyLabel,
  onClose,
  onSelect,
}: {
  visible: boolean;
  title: string;
  options: SelectOption<Value>[];
  selectedValue?: Value;
  emptyLabel?: string;
  onClose: () => void;
  onSelect: (value: Value) => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{title}</Text>
            <IconButton icon="x" onPress={onClose} />
          </View>

          {options.length === 0 ? (
            <Text style={styles.emptySheetText}>{emptyLabel}</Text>
          ) : (
            <ScrollView style={styles.sheetScroll}>
              {options.map((option) => {
                const selected = option.value === selectedValue;
                return (
                  <Pressable
                    key={String(option.value)}
                    accessibilityRole="button"
                    onPress={() => onSelect(option.value)}
                    style={({ pressed }) => [
                      styles.optionItem,
                      selected && styles.optionItemSelected,
                      pressed && styles.pressedSuggestion,
                    ]}
                  >
                    <Text
                      style={[styles.optionText, selected && styles.optionTextSelected]}
                      numberOfLines={2}
                    >
                      {option.label}
                    </Text>
                    {selected ? (
                      <Feather name="check" size={18} color="#1f63b5" />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
