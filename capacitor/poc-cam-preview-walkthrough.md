# Documentation Technique : Superposition d'une Caméra Native sous une WebView Capacitor

Ce document explique en détail l'approche, l'architecture et les différentes étapes d'implémentation permettant d'afficher un flux vidéo natif en arrière-plan d'une application web Preact via Capacitor, en gérant le recadrage, la transparence et le changement dynamique de mode (40% vs Fullscreen).

---

## 1. Le Concept Fondamental : Z-Indexing Natif et Transparence Web

L'architecture hybride de Capacitor repose sur un concept simple : toute l'interface utilisateur web tourne au sein d'une `WebView` Android (généralement propulsée par Chromium). Par défaut, cette WebView agit comme une toile de fond opaque (souvent blanche) qui recouvre 100% de l'écran (le `CoordinatorLayout` racine).
Pour afficher un flux vidéo généré par le matériel (Hardware Camera), nous ne pouvons pas l'insérer *dans* le DOM web (ce serait trop lent ou passerait par WebRTC, limitant les performances). Il faut donc injecter la caméra directement dans l'arbre natif Android (View Hierarchy) et créer une illusion d'intégration.

Pour y parvenir, nous utilisons une stratégie sophistiquée en 4 couches (la **transparence traversante**) :

1. **Couche Native (Z-Index : 0) - La Caméra** : 
   Grâce au plugin Java, nous remontons jusqu'au parent direct de la `WebView` Capacitor. Nous y injectons dynamiquement la vue de la caméra (`TextureView`) à l'index `0`, ce qui force le système d'exploitation Android à la dessiner *en tout premier*, c'est-à-dire tout au fond, derrière la WebView.
   > **Réf:** Voir `parentView.addView(cameraWrapper, 0, wrapperParams);` dans [CameraStreamPlugin.java](file:///home/mohaskiiii/LoLo/capacitor/android/app/src/main/java/com/Lolo/app/plugins/CameraStreamPlugin.java#L107)

2. **Couche WebView (Z-Index : 1) - Transparence native** : 
   Même si l'application web devient transparente, la *fenêtre* de la WebView Android reste opaque par défaut. Nous disons dynamiquement à Android de rendre la WebView transparente au moment exact où la caméra démarre.
   > **Réf:** Transparence forcée dynamiquement via `getBridge().getWebView().setBackgroundColor(android.graphics.Color.TRANSPARENT);` dans [CameraStreamPlugin.java](file:///home/mohaskiiii/LoLo/capacitor/android/app/src/main/java/com/Lolo/app/plugins/CameraStreamPlugin.java#L110).
   *(Note : Il n'est pas nécessaire de configurer `backgroundColor` dans `capacitor.config.json`, car la modification dynamique via Java est suffisante et meilleure pour les performances au lancement de l'application).*

3. **Couche DOM globale (CSS) - Transparence Web** : 
   Maintenant que la fenêtre native est transparente, nous devons nous assurer que la structure HTML n'a pas de fond. Tous les éléments racines (`<html>`, `<body>`, `#app`) sont configurés pour être totalement transparents.
   > **Réf:** Voir la règle `html, body { background-color: transparent !important; }` dans [style.css](file:///home/mohaskiiii/LoLo/app/style.css#L13).

4. **Masquage UI (CSS) - L'Effet de "Trou"** : 
   La caméra tournant en permanence en arrière-plan, c'est l'interface web (React/Preact) qui décide de ce qui est caché ou montré, comme un cache en carton troué.
   - Là où nous voulons **voir** la caméra, nous appliquons un fond transparent (la `.camera-zone`).
   - Là où nous voulons **cacher** la caméra, nous appliquons un conteneur opaque avec une couleur unie (ex: `#111` pour la `.controls-zone`).
   > **Réf:** Logique gérée dans [style.css](file:///home/mohaskiiii/LoLo/app/style.css#L54) et appliquée conditionnellement dans [CameraPoC.tsx](file:///home/mohaskiiii/LoLo/app/screens/CameraPoC.tsx#L46).

### Pourquoi `TextureView` au lieu de `SurfaceView` ?
Initialement, nous avons utilisé un `SurfaceView`. Cependant, `SurfaceView` crée une fenêtre matérielle complètement isolée qui "perce" l'interface de l'OS. Elle ne participe pas à l'arbre de rendu classique (View Hierarchy), ce qui cause d'énormes problèmes de Z-Ordering avec les éléments de la WebView et crée parfois des fonds blancs persistants (Z-fighting). 
Nous avons migré vers `TextureView` qui se comporte comme un composant d'interface standard Android : il se laisse recouvrir, animer, et s'intègre de manière prévisible dans notre Z-Index natif.
> **Réf:** Déclaration du `cameraTextureView` dans [CameraStreamPlugin.java](file:///home/mohaskiiii/LoLo/capacitor/android/app/src/main/java/com/Lolo/app/plugins/CameraStreamPlugin.java#L35).

---

## 2. Implémentation Étape par Étape

### Étape A : Préparation de la Transparence DOM (CSS)
Avant d'injecter la caméra, il faut s'assurer que notre application web (React/Preact) permet de voir à travers elle.
Dans `style.css`, nous forçons le DOM à être transparent :
```css
html, body, #app {
    background-color: transparent !important;
}
```

### Étape B : Injection Native de la Caméra
Dans [CameraStreamPlugin.java](file:///home/mohaskiiii/LoLo/capacitor/android/app/src/main/java/com/Lolo/app/plugins/CameraStreamPlugin.java), nous récupérons le conteneur parent (un `CoordinatorLayout`) de la WebView générée par Capacitor :
```java
parentView = (ViewGroup) getBridge().getWebView().getParent();
```
Lors de l'appel à `startCamera()`, nous générons dynamiquement nos vues et nous les injectons avec l'index `0` pour nous assurer qu'elles se placent **derrière** la WebView :
```java
// parentView est le parent de la WebView
parentView.addView(cameraWrapper, 0, wrapperParams);
// On force la WebView Android à être transparente
getBridge().getWebView().setBackgroundColor(android.graphics.Color.TRANSPARENT);
```

### Étape C : Logique de Recadrage (Aspect Ratio 9:16 strict)
Pour éviter la distorsion (l'effet étiré/écrasé) tout en garantissant un format TikTok (9:16) quelle que soit la hauteur (40% ou Plein Écran), nous enveloppons le `TextureView` dans un `FrameLayout` (`cameraWrapper`).
- **Le Wrapper** prend 100% de la largeur de l'écran et la hauteur demandée (40% ou 100%).
- **Le TextureView** à l'intérieur de ce wrapper est contraint de manière programmatique à mesurer très exactement une proportion de 9 (largeur) par 16 (hauteur).
- Le tout est centré horizontalement :
```java
// Extrait de updateLayoutForMode() dans CameraStreamPlugin.java
int textureWidth = (int) (wrapperHeight * 9.0f / 16.0f);
int textureHeight = wrapperHeight;

// Si le ratio 9:16 déborde de l'écran en largeur (cas du Fullscreen sur les écrans modernes 9:20)
if (textureWidth > screenWidth) {
    textureWidth = screenWidth;
    textureHeight = (int) (screenWidth * 16.0f / 9.0f);
}
```

De plus, nous appliquons une matrice mathématique de `CenterCrop` via `TextureView.setTransform(matrix)` pour que le flux matériel de l'appareil photo remplisse ce conteneur rectangulaire sans aucune déformation.

### Étape D : Optimisation de la Qualité Vidéo
Au moment de lancer la caméra (`Camera.open()`), nous interrogeons le capteur pour sélectionner automatiquement la meilleure résolution matérielle disponible (jusqu'à la limite du 1080p, pour préserver la batterie et la fluidité) et nous activons l'Autofocus Vidéo Continu (`FOCUS_MODE_CONTINUOUS_VIDEO`).

### Étape E : Redimensionnement Dynamique sans coupure (Smooth Mode Transition)
Le changement dynamique du mode "40%" vers "Fullscreen" et inversement ne doit **surtout pas** couper le capteur de la caméra (qui met 1 à 2 secondes à s'initialiser matériellement).

Côté Preact ([CameraPoC.tsx](file:///home/mohaskiiii/LoLo/app/screens/CameraPoC.tsx)), nous appelons le plugin avec un paramètre d'options :
```tsx
await CameraStream.startCamera({ mode: 'fullscreen' });
```

Côté natif, si la caméra tourne déjà (`isCameraPreviewShowing == true`), nous interceptons l'appel. Nous évitons de redémarrer le capteur et nous nous contentons de mettre à jour dynamiquement les `LayoutParams` (hauteur et largeur du TextureView et de son conteneur). Android recalcule le rendu instantanément en arrière-plan, offrant une transition sans "flicker" :
```java
if (isCameraPreviewShowing) {
    getActivity().runOnUiThread(() -> {
        updateLayoutForMode(mode); // Modifie les LayoutParams sans toucher à l'API Camera
        call.resolve();
    });
    return;
}
```

### Étape F : L'Interface Web avec Trous CSS (Preact)
Le fichier CSS ([style.css](file:///home/mohaskiiii/LoLo/app/style.css)) est responsable de dessiner le "trou" dans l'UI.
```css
.camera-zone.on {
    background-color: transparent; /* Laisse passer le flux caméra natif du fond */
}
.controls-zone {
    background-color: #111; /* Masque la caméra pour afficher les boutons web */
}
```
En plein écran, la `camera-zone` s'étend à `100vh`, et la `controls-zone` se transforme en "Absolute Overlay" (calque flottant en surimpression) par-dessus le flux transparent grâce au sélecteur parent `.fullscreen-mode`.

---

## Conclusion
Cette architecture allie la fluidité et le contrôle du matériel natif Android (Hardware Camera) avec l'agilité d'une interface web Capacitor (React/Preact), permettant un rendu sans lag ("Z-Index stacking") et une gestion intelligente de l'Aspect Ratio propre aux contraintes des applications de Livestream modernes.
