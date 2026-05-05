# Plan d'Implémentation : Application de Livestream

Ce document détaille le plan de développement basé sur l'architecture définie (Capacitor + Preact + SRS), en tenant compte du travail déjà accompli sur les branches `main` et `poc/camera-preview`.

## 1. Analyse de l'Existant

### Branche `main`
- Initialisation du projet hybride avec Preact, Vite et Capacitor.
- Présence initiale de TailwindCSS (qu'il faudra potentiellement remplacer par du Vanilla CSS pur selon la nouvelle directive).
- Structure de base d'une application single-page.

### Branche `poc/camera-preview`
- **Validation du Concept "Trou Transparent" (Étape 1)** :
  - Création du plugin natif Android (`CameraStreamPlugin.java`).
  - Implémentation de `TextureView` pour afficher la caméra en Z-Index 0 (derrière la WebView).
  - Gestion du redimensionnement dynamique (40% vs Fullscreen) avec Aspect Ratio 9:16 (CenterCrop).
  - Couche Web UI (`CameraPoC.tsx`) capable de "trouer" l'interface (`background-color: transparent`) pour laisser voir la caméra, tout en superposant des contrôles opaques.

*Bilan : L'affichage de la caméra locale est fonctionnel. Il manque la brique d'encodage/transport réseau et le lecteur spectateur.*

---

## 2. Outils et Bibliothèques à Installer

### Couche Mobile / Native (Capacitor - Vendeur)
- **Encodeur RTMP Android** : Pour l'Étape 2 (Transport RTMP).
  - *Bibliothèque recommandée* : `RootEncoder` (pedroSG94/RootEncoder) pour Android.
  - *Pourquoi* : Gère l'encodage matériel H.264 et AAC, s'intègre facilement avec une vue caméra existante, très performant pour le streaming direct (3 Mbps).
  - *Installation* : À ajouter dans `capacitor/android/app/build.gradle`.
- **Encodeur RTMP iOS (Future Proofing)** : `HaishinKit.swift` pour l'équivalent iOS plus tard.

### Couche Web (Preact - Acheteur)
- **hls.js** : Pour l'Étape 4 (Lecteur Vidéo Acheteur).
  - *Pourquoi* : Bien que Safari/iOS et certains Android lisent nativement le HLS dans une balise `<video>`, `hls.js` garantit une compatibilité et des performances optimales sur tous les navigateurs web modernes, indispensable pour l'UI de l'acheteur.
  - *Installation* : `npm install hls.js`

### Couche Serveur (Pipeline SRS)
- **Docker** : Le plus simple pour exécuter SRS localement.
  - *Image* : `ossrs/srs:5`
  - Aucun outil lourd côté frontend n'est requis. Un fichier `docker-compose.yml` sera ajouté au dépôt pour monter le serveur en un clic.

### Couche Backend (Golang - Business Logic & Webhooks)
- **Go (v1.21+)** : Langage principal pour la haute performance et la gestion des WebSockets.
- **Fiber** : Framework HTTP ultra-rapide inspiré par Express (Node.js) pour les API et les webhooks SRS.
- **Gorilla WebSocket** : Pour gérer la communication temps-réel (Chat, Enchères) avec le frontend.
- **Gorm** (Optionnel) : Pour la persistance des données (Produits, Historique des enchères).

---

## 3. Implémentation de la Structure du Code

Afin de faciliter l'ajout ultérieur du chat WebSocket, des enchères et du catalogue, le code Frontend sera structuré ainsi :

```text
/app
├── /components
│   ├── /seller
│   │   ├── SellerDashboard.tsx  (Interface opaque : Enchères, Liste produits)
│   ├── /buyer
│   │   ├── HlsPlayer.tsx        (Lecteur HTML5 + hls.js)
│   │   ├── BuyerOverlay.tsx     (UI en position: absolute par-dessus le flux)
│   ├── /shared
│   │   ├── LiveChat.tsx         (Composant commun pour les WebSockets)
├── /plugins
│   └── camera-stream.ts         (Mise à jour avec startStream/stopStream)
├── /screens
│   ├── SellerLiveScreen.tsx     (Assemble le Trou Transparent + SellerDashboard)
│   └── BuyerLiveScreen.tsx      (Assemble HlsPlayer + BuyerOverlay + LiveChat)
├── /services
│   ├── rtmp-config.ts           (Générateur de clés/URL SRS)
│   └── websocket.ts             (Liaison avec le backend Golang)
└── style.css                    (Refonte Vanilla CSS stricte)
```

### Structure du Backend (Golang)

```text
/backend
├── /cmd
│   └── main.go                  (Point d'entrée : Serveur HTTP & WS)
├── /internal
│   ├── /api
│   │   ├── srs_hooks.go         (Validation des flux on_publish)
│   │   └── handlers.go          (API REST produits/enchères)
│   ├── /websocket
│   │   ├── hub.go               (Gestionnaire de connexions)
│   │   └── client.go            (Logique individuelle de messagerie)
│   └── /models
│       └── stream.go            (Schémas de données)
├── go.mod
└── go.sum
```

### Intégration Backend ↔ SRS (Étape 3)
Le backend Golang servira de contrôleur d'accès pour SRS :
1. **Validation on_publish** : SRS appelle `POST /api/v1/srs/publish` avant de démarrer un flux. Golang vérifie la `stream_key` en base de données.
2. **Signalement d'arrêt** : SRS appelle `POST /api/v1/srs/unpublish` pour informer le backend que le live est terminé (mise à jour du statut en DB).

### Évolution de la Couche Native (Étape 2)
Dans `CameraStreamPlugin.java` :
1. **Ajout de méthodes** : `startStream(String rtmpUrl, String streamKey)` et `stopStream()`.
2. **Encodage** : Brancher le flux vidéo du capteur directement dans `RootEncoder`.
3. **Configuration** : Verrouiller à 720x1280 (HD vertical), H.264 (Baseline), AAC, ~3 Mbps, 30 FPS.
4. Gérer silencieusement la déconnexion réseau (auto-reconnect).

---

## 4. Stratégie de Tests

- **Tests d'Intégration Natifs (Mock)** : Créer une fonction de test dans Preact qui génère une `STREAM_KEY` aléatoire et ordonne au plugin Capacitor de diffuser sur un serveur SRS local pour vérifier si le trafic RTMP sort bien du téléphone.
- **Tests du Lecteur HLS (Unitaire/Visuel)** : Mettre en place un mock vidéo HLS statique. Le composant `HlsPlayer.tsx` sera testé pour s'assurer que l'overlay (Chat/Boutons) gère bien le Z-Index et le redimensionnement de la fenêtre.
- **Tests Serveur (SRS)** : Script bash automatisé de type "Health Check" pour vérifier que le port 1935 (RTMP) est ouvert et que le serveur HTTP (8080) distribue bien les fichiers `.m3u8` correspondants.

---

## 5. Documentation du Processus (À générer post-implémentation)

Une fois l'implémentation réalisée, les documents suivants seront produits :
1. **`srs-deployment.md`** : Guide complet du serveur (Le fichier `srs.conf`, la commande Docker run, le paramétrage de faible latence, les webhooks).
2. **`native-streaming.md`** : Explication de la liaison entre `TextureView` et `RootEncoder`, gestion des permissions Android et contournement du Bridge Capacitor.
3. **Mise à jour du README** : Comment lancer l'app en tant que Vendeur (mobile) et Acheteur (navigateur).
