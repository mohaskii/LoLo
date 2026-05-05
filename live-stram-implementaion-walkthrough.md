# Walkthrough : Implémentation du Livestreaming

Nous avons transformé le PoC de caméra en une architecture de streaming complète.

## 1. Changements Majeurs

### Backend (Golang + Fiber)
- Création d'un serveur ultra-rapide avec **Fiber**.
- Préparation des Webhooks pour **SRS** (`/api/v1/srs/publish`) afin de valider les flux.
- [main.go](file:///home/loloskiiii/LoLo/backend/cmd/main.go)

### Frontend (Preact + Capacitor)
- **HlsPlayer** : Intégration de `hls.js` pour une lecture fluide du flux HLS sur Android et Web.
- **SellerLiveScreen** : Interface vendeur avec tableau de bord et prévisualisation.
- **BuyerLiveScreen** : Interface acheteur avec vidéo plein écran et overlay UI (Chat/Enchères).
- [BuyerLiveScreen.tsx](file:///home/loloskiiii/LoLo/app/screens/BuyerLiveScreen.tsx)
- [SellerLiveScreen.tsx](file:///home/loloskiiii/LoLo/app/screens/SellerLiveScreen.tsx)

### Natif (Android)
- Intégration de **RootEncoder** dans le plugin Capacitor.
- Implémentation de `startStream` et `stopStream` pour envoyer le flux RTMP directement au serveur SRS sans passer par la WebView.
- [CameraStreamPlugin.java](file:///home/loloskiiii/LoLo/capacitor/android/app/src/main/java/com/Lolo/app/plugins/CameraStreamPlugin.java)

### Infrastructure
- Fichier `docker-compose.yml` prêt pour lancer **SRS** (Simple Realtime Server) et le **Backend**.
- Configuration `srs.conf` optimisée pour la faible latence (HLS segments de 2s).

## 2. Comment tester ?

1. **Lancer le serveur** :
   ```bash
   docker-compose up -d
   ```

2. **Lancer le Backend (Local)** :
   ```bash
   cd backend && go run cmd/main.go
   ```

3. **Lancer l'App Web** :
   ```bash
   cd app && deno task dev
   ```

4. **Mobile** : Build le projet Android et testez le streaming RTMP vers l'IP de votre serveur.

## 3. Prochaines étapes
- Implémentation réelle de la logique d'enchères via WebSockets.
- Validation des clés de flux en base de données.
- Portage iOS (HaishinKit).
