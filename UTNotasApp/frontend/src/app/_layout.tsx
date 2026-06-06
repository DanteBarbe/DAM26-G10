import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { ToastContainer } from "@/src/components/ToastContainer";
import { AuthProvider } from "@/src/features/auth/AuthContext";
import { ToastProvider } from "@/src/contexts/ToastContext";

const queryClient = new QueryClient();

export default function RootLayout() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<ToastProvider>
					<Stack screenOptions={{ headerShown: false }} />
					<ToastContainer />
				</ToastProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
}
