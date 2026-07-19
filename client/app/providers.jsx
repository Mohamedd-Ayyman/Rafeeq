"use client";

import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import { JourneyProvider } from "@/context/JourneyContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { NotificationProvider } from "@/context/NotificationContext";
import NotificationToast from "@/components/NotificationToast";

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <SocketProvider>
            <JourneyProvider>
              {children}
              <NotificationToast />
            </JourneyProvider>
          </SocketProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
