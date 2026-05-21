# Conversación con Claude — Sistema de notificaciones Toast

**Proyecto:** UTNotasApp · Grupo 10 · DAM 2026
**Herramienta:** Claude (Haiku 4.5 / Opus 4.7)
**Fecha:** 2026-05-20 / 2026-05-21

---

## Tema 1 — Eliminar la 'puntuación' de MaterialCreateScreen

### Usuario
> Elimina la 'puntuación' de `/src/features/materials/screens/MaterialCreateScreen`

### Claude
Eliminé del archivo `MaterialCreateScreen.tsx`:

- Import de `PointsModal` desde `@/src/features/materials/components/PointsModal`
- Import de `buildPointsBreakdown` desde los helpers
- Import del tipo `PointsBreakdown`
- Estado local `pointsAlert` (`useState<PointsBreakdown | null>`)
- Llamada a `buildPointsBreakdown(form)` en `handleSubmit`
- Llamada a `setPointsAlert(null)` en `resetForm`
- Render del componente `<PointsModal points={pointsAlert} onClose={resetForm} />`

Resultado: el formulario sigue funcionando pero ya no muestra el modal de puntos al crear un material.

---

## Tema 2 — Sistema de mensajes rápidos (toast) + redirección post-creación

### Usuario
> 1) Agregar un sistema de mensajes rápidos que se muestren por 3 segundos y tengan una cruz para cerrar y arriba una barra que va acortándose a medida que pasa el tiempo (puedes utilizar alguna librería si es necesario). Con ese sistema agregar un mensaje de material de estudio creado exitosamente al terminar de crear un material.
>
> 2) al hacer click en subir el material, si no hay errores redirigir a `/material/[id]` con el id del material creado

### Claude

#### Arquitectura propuesta

Tres archivos nuevos + dos modificaciones, usando `react-native-reanimated` (ya disponible en dependencies) para la barra de progreso animada.

#### Archivos creados

**`src/contexts/ToastContext.tsx`** — Context + hook personalizado

```tsx
import React, { createContext, useCallback, useState } from "react";

export type ToastType = "success" | "error" | "info";

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
};

type ToastContextType = {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
};

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration: number = 3000) => {
      const id = Date.now().toString();
      const toast: Toast = { id, message, type, duration };
      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe ser utilizado dentro de ToastProvider");
  }
  return context;
}
```

**`src/components/Toast.tsx`** — Componente visual con barra de progreso animada

```tsx
import { Feather } from "@expo/vector-icons";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { colors, spacing, typography } from "@/src/styles/Colors";
import type { Toast as ToastData, ToastType } from "@/src/contexts/ToastContext";

const typeConfig: Record<ToastType, { bg: string; text: string; icon: string }> = {
  success: { bg: "rgba(36, 122, 72, 1)", text: colors.surface, icon: "check-circle" },
  error: { bg: "rgba(192, 57, 43, 1)", text: colors.surface, icon: "alert-circle" },
  info: { bg: "rgba(31, 99, 181, 1)", text: colors.surface, icon: "info" },
};

export function Toast({ toast, onClose }) {
  const config = typeConfig[toast.type];
  const progressWidth = useSharedValue(100);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      progressWidth.value = withTiming(0, { duration: toast.duration });
    }
  }, [toast.duration, progressWidth]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  // … render con icono, texto, botón X y Animated.View para la barra
}
```

**`src/components/ToastContainer.tsx`** — Contenedor con Modal de RN

```tsx
import { Modal, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();
  const insets = useSafeAreaInsets();
  const visible = toasts.length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => {}}
    >
      <View
        style={{ flex: 1, paddingTop: insets.top, backgroundColor: "transparent" }}
        pointerEvents="box-none"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </View>
    </Modal>
  );
}
```

#### Archivos modificados

**`src/app/_layout.tsx`** — Envolver app con ToastProvider

```tsx
import { Stack } from "expo-router";
import { ToastProvider } from "@/src/contexts/ToastContext";
import { ToastContainer } from "@/src/components/ToastContainer";

export default function RootLayout() {
  return (
    <ToastProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <ToastContainer />
    </ToastProvider>
  );
}
```

**`src/features/materials/screens/MaterialCreateScreen.tsx`** — Disparar toast + redirigir

```tsx
const { showToast } = useToast();

useEffect(() => {
  if (lastCreated) {
    showToast("Material de estudio creado exitosamente", "success", 2000);
    router.replace(`/material/${lastCreated.id}`);
  }
}, [lastCreated, showToast]);
```

---

## Tema 3 — Posicionamiento del toast (debugging)

### Usuario
> El toast queda debajo del contenido. haz que su posición sea al frente de todo

### Claude (Intento 1)
Agregué `position: absolute`, `zIndex: 9999`, `top/left/right/bottom: 0`, y `pointerEvents="box-none"`. Envolví el Stack y ToastContainer en un `<View style={{ flex: 1 }}>` en `_layout.tsx`.

### Usuario
> sigue quedando debajo de "UTNotas / Ver material" pero por arriba del resto

### Claude (Intento 2)
Creé un componente `ToastOverlay` para renderizar localmente dentro de cada pantalla, ya que el ToastContainer en `_layout.tsx` quedaba detrás del header de las pantallas del Stack.

### Usuario
> Sigue sin funcionar, piensa en otra solución. En caso de que el overlay y el zindex no tengan más sentido elimínalos

### Claude (Solución final)
**Cambio de raíz:** usar `Modal` de React Native con `transparent` y `statusBarTranslucent`. El Modal de RN se renderiza en una capa nativa separada que garantiza estar por encima de toda la jerarquía de UI, incluyendo los headers del Stack de expo-router.

- Reescribí `ToastContainer.tsx` para usar `<Modal>` en lugar de un `<View>` con `position: absolute`.
- Eliminé el archivo `ToastOverlay.tsx` (ya no necesario).
- Eliminé la importación y uso de `ToastOverlay` en `MaterialCreateScreen.tsx`.
- Removí el `pointerEvents="auto"` del Toast y el `zIndex` del container.

**Razón:** en React Native, los `Modal` se renderizan en una window nativa por encima de la ventana principal, lo que los hace inmunes a los problemas de z-index/composición de los Stack screens.

---

## Tema 4 — Opacidad del fondo del toast

### Usuario
> cambia la opacidad a 1

### Claude
Verifiqué con grep que `successLight`, `errorLight`, `infoLight` solo se usaban en `Toast.tsx`. Cambié directamente la config del toast (sin tocar `Colors.ts` para no afectar otros componentes):

```tsx
const typeConfig: Record<ToastType, { bg: string; text: string; icon: string }> = {
  success: { bg: "rgba(36, 122, 72, 1)", text: colors.surface, icon: "check-circle" },
  error: { bg: "rgba(192, 57, 43, 1)", text: colors.surface, icon: "alert-circle" },
  info: { bg: "rgba(31, 99, 181, 1)", text: colors.surface, icon: "info" },
};
```

Ahora el toast tiene fondo opaco (alpha 1) con texto e iconos blancos (`colors.surface`) para mantener buen contraste.

---

## Tema 5 — Bug visual: chips de filtros se estiran verticalmente

### Usuario
> Cuando no hay resultados en MaterialSearchScreen los badges de filtros se estiran verticalmente, eso no debería ocurrir

### Claude
**Diagnóstico:** el `ScrollView` horizontal de chips, cuando el padre tiene espacio sobrante (caso de `EmptyMaterialsState`), expande sus hijos verticalmente porque no tiene `alignItems` configurado.

**Correcciones aplicadas en `MaterialSearch.styles.ts`:**

```ts
activeChipsRow: {
  alignItems: "center",   // ← nuevo: alinea chips al centro vertical
  gap: 8,
  paddingVertical: 10,
},
activeChip: {
  alignItems: "center",
  alignSelf: "flex-start", // ← nuevo: mantiene altura intrínseca
  backgroundColor: colors.primary,
  borderRadius: 20,
  flexDirection: "row",
  gap: 6,
  paddingHorizontal: 12,
  paddingVertical: 6,
},
```

**Correcciones aplicadas en `MaterialSearchScreen.tsx`:**

```tsx
<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={searchStyles.activeChipsRow}
  style={{ flexGrow: 0 }}   // ← nuevo: no expande verticalmente
>
```

Tres correcciones en conjunto:
1. `alignItems: "center"` en contentContainer para alineación vertical
2. `alignSelf: "flex-start"` en chip individual para preservar altura intrínseca
3. `flexGrow: 0` en el ScrollView para que no expanda verticalmente cuando el padre tiene espacio sobrante

---

## Resumen de archivos afectados

| Archivo | Tipo de cambio |
|---|---|
| `src/contexts/ToastContext.tsx` | Creado |
| `src/components/Toast.tsx` | Creado |
| `src/components/ToastContainer.tsx` | Creado (varias iteraciones, versión final con `Modal`) |
| `src/app/_layout.tsx` | Modificado (agregar ToastProvider + ToastContainer) |
| `src/features/materials/screens/MaterialCreateScreen.tsx` | Modificado (eliminar PointsModal, integrar useToast, redirigir) |
| `src/features/materials/screens/MaterialSearchScreen.tsx` | Modificado (`flexGrow: 0` en ScrollView horizontal) |
| `src/features/materials/screens/styles/MaterialSearch.styles.ts` | Modificado (alineación chips) |

---

## Aprendizajes / decisiones técnicas

- **`Modal` de RN > `position: absolute` + zIndex** para overlays globales que deben estar sobre toda la app: los Stack screens de expo-router crean contextos de apilamiento propios que rompen los z-index normales.
- **`react-native-reanimated`** ya estaba en el proyecto vía `expo-router`, no hubo que instalar nada nuevo para la barra de progreso animada.
- **`useSharedValue` + `withTiming`** ofrecen animaciones de 60fps en el thread de UI nativo.
- **Filtrar dónde se usan los colores antes de modificarlos** evita romper otros componentes (técnica con `grep`).
- **`flexGrow: 0` + `alignSelf: flex-start`** previene que ScrollViews horizontales se estiren cuando el padre tiene espacio sobrante.
