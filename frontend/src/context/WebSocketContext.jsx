import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';
import { speakText } from '../services/voiceService';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [dealNotification, setDealNotification] = useState(null);
  const [buyerNotification, setBuyerNotification] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const stompClientRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const socket = new SockJS('http://localhost:8080/ws-moolya');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log('STOMP:', str),
      reconnectDelay: 5000,
      onConnect: () => {
        setIsConnected(true);
        console.log('Connected to STOMP WebSocket');

        if (user.role === 'ROLE_FARMER') {
          // Subscribe to farmer deal topic
          stompClient.subscribe(`/topic/farmer-deals/${user.id}`, (message) => {
            const payload = JSON.parse(message.body);
            setDealNotification(payload);

            // Trigger instant Hindi audio TTS notification
            if (payload.spokenHindiText) {
              speakText(payload.spokenHindiText, 'hi');
            }
          });
        } else if (user.role === 'ROLE_BUYER') {
          // Subscribe to buyer update topic
          stompClient.subscribe(`/topic/buyer-updates/${user.id}`, (message) => {
            const payload = JSON.parse(message.body);
            setBuyerNotification(payload);

            if (payload.spokenHindiText) {
              speakText(payload.spokenHindiText, 'hi');
            }
          });
        }
      },
      onDisconnect: () => {
        setIsConnected(false);
      }
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [user]);

  const clearDealNotification = () => setDealNotification(null);
  const clearBuyerNotification = () => setBuyerNotification(null);

  return (
    <WebSocketContext.Provider value={{
      isConnected,
      dealNotification,
      buyerNotification,
      clearDealNotification,
      clearBuyerNotification,
      stompClient: stompClientRef.current
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
