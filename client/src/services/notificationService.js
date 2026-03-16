import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const NotificationService = {
  /**
   * Obtiene la llave pública VAPID del servidor
   */
  async getPublicKey() {
    const response = await axios.get(`${API_URL}/notifications/vapid-key`);
    return response.data.publicKey;
  },

  /**
   * Registra la suscripción en el servidor
   */
  async saveSubscription(email, subscription) {
    return await axios.post(`${API_URL}/notifications/subscribe`, {
      email,
      subscription
    });
  },

  /**
   * Solicita permiso y suscribe al usuario
   */
  async subscribeUser(email) {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push messaging is not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Obtener llave pública
      const publicKey = await this.getPublicKey();
      const applicationServerKey = urlBase64ToUint8Array(publicKey);

      // Suscribir
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      });

      // Guardar en servidor
      await this.saveSubscription(email, subscription);
      console.log('User is subscribed for push notifications');
      return true;
    } catch (error) {
       if (Notification.permission === 'denied') {
        console.warn('Permission for notifications was denied');
      } else {
        console.error('Failed to subscribe the user: ', error);
      }
      return false;
    }
  },

  /**
   * Verifica si el usuario ya está suscrito
   */
  async checkSubscription() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return !!subscription;
  }
};
