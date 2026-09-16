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
  const [refreshKey, setRefreshKey] = useState(0);
  const stompClientRef = useRef(null);

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    const rawBase = import.meta.env.VITE_API_BASE_URL || window.location.origin;
    const wsUrl = rawBase.startsWith('http') ? `${rawBase}/ws-moolya` : 'http://localhost:8080/ws-moolya';
    const socket = new SockJS(wsUrl);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log('STOMP:', str),
      reconnectDelay: 5000,
      onConnect: () => {
        setIsConnected(true);
        console.log('Connected to STOMP WebSocket');

        // Subscribe to public produce updates for real-time listing refresh
        stompClient.subscribe('/topic/produce-updates', () => {
          triggerRefresh();
        });

        stompClient.subscribe('/topic/deals', (message) => {
          triggerRefresh();
          try {
            if (message?.body) {
              const payload = JSON.parse(message.body);
              if (payload.type === 'PAYMENT_RECEIVED' && user?.role === 'ROLE_FARMER' && (!payload.farmerId || payload.farmerId === user.id)) {
                setDealNotification(payload);
                if (payload.spokenHindiText) {
                  speakText(payload.spokenHindiText, 'hi');
                }
              }
            }
          } catch (e) {
            console.error('Error parsing /topic/deals message:', e);
          }
        });

        if (user?.role === 'ROLE_FARMER') {
          // Subscribe to farmer deal topic
          stompClient.subscribe(`/topic/farmer-deals/${user.id}`, (message) => {
            const payload = JSON.parse(message.body);
            setDealNotification(payload);
            triggerRefresh();

            // Trigger instant Hindi audio TTS notification
            if (payload.spokenHindiText) {
              speakText(payload.spokenHindiText, 'hi');
            }
          });
        } else if (user?.role === 'ROLE_BUYER') {
          // Subscribe to buyer update topic
          stompClient.subscribe(`/topic/buyer-updates/${user.id}`, (message) => {
            const payload = JSON.parse(message.body);
            setBuyerNotification(payload);
            triggerRefresh();

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
      refreshKey,
      triggerRefresh,
      clearDealNotification,
      clearBuyerNotification,
      stompClient: stompClientRef.current
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
