# Guide de Création du Projet WatPlant

Ce document retrace toutes les étapes de la création de l'application **WatPlant**, depuis l'initialisation jusqu'aux fonctionnalités avancées.

## 1. Initialisation et Configuration

### Objectif

Mettre en place un environnement de développement moderne, typé et stylisé dès le départ.

### Réalisation

Nous avons choisi **Vite** avec le template **React TypeScript** et **TailwindCSS** pour une base solide.

**Commandes :**

```bash
# Création du projet avec le template React TypeScript
npx -y create-vite@latest . --template react-ts

# Installation des dépendances
npm install

# Installation de TailwindCSS v4.1
npm install tailwindcss@4.1 @tailwindcss/vite@4.1
```

**Configuration détaillée :**

1.  **Vite (`vite.config.ts`)** :
    Integration du plugin TailwindCSS officiel pour Vite.
    ```typescript
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'
    import tailwindcss from '@tailwindcss/vite'

    export default defineConfig({
      plugins: [react(), tailwindcss()],
    })
    ```

2.  **CSS (`src/index.css`)** :
    Nouvelle syntaxe Tailwind v4 avec `@import` et configuration du thème via CSS variables.
    ```css
    @import "tailwindcss";

    @theme {
      --color-bg: #f8fafc;
      --color-primary: #059669;
      /* ... autres couleurs ... */
    }
    ```

---

## 2. Configuration Linter & Prettier

### Objectif
Garantir la qualité du code et un formatage cohérent.

### Réalisation
**Fichiers de configuration :**

1.  **Prettier (`.prettierrc`)** :
    Règles de formatage (point-virgules, guillemets simples, etc.).
    ```json
    {
      "semi": true,
      "singleQuote": true,
      "tabWidth": 2,
      "trailingComma": "es5",
      "printWidth": 100
    }
    ```

2.  **ESLint (`eslint.config.js`)** :
    Configuration "Flat Config" combinant les recommandations JS, React, TypeScript et Prettier.
    ```javascript
    // ... imports
    export default defineConfig(
      tseslint.config(
        { extends: [js.configs.recommended, ...tseslint.configs.recommended] },
        // ... configuration React
        eslintConfigPrettier // Désactive les règles en conflit avec Prettier
      )
    )
    ```

**Commandes :**
```bash
# Installation
npm install -D prettier eslint-config-prettier typescript-eslint

# Scripts ajoutés au package.json
npm run lint    # Vérifie le code
npm run format  # Formate le code
```

---

## 3. Tests Unitaires et Fonctionnels

### Objectif
Assurer la stabilité de l'application via des tests automatisés.

### Réalisation
- **Outils** : Vitest (runner), React Testing Library (composants), JSDOM (environnement).
- **Tests Unitaires** :
    - `storage.test.ts` : Vérifie le CRUD et la persistance localStorage.
    - `image.test.ts` : Vérifie le redimensionnement d'image (mock FileReader/Canvas).
- **Tests de Composants** :
    - `AddPlantForm.test.tsx` : Vérifie le rendu et la soumission du formulaire.
    - `PlantList.test.tsx` : Vérifie l'affichage de la liste et des états vides.

**Commandes :**
```bash
npm test        # Lance les tests en mode watch
npm run test -- run # Lance les tests une seule fois
```

---

## 4. Développement des Fonctionnalités

### Objectif

Créer l'application de suivi d'arrosage avec une base de code robuste et maintenable.

### Réalisation

- **Modèle de données** : Définition immédiate des interfaces TypeScript (`Plant`, `Log`) pour garantir la cohérence des données.
- **Stockage** : Création d'un service `storage.ts` typé pour encapsuler la logique du `localStorage`.
- **UI** : Développement des composants (`PlantList`, `AddPlantForm`) en utilisant directement les classes utilitaires de Tailwind pour le style.

---

## 5. Gestion des Photos

### Objectif
Permettre à l'utilisateur d'associer une photo à chaque plante pour une identification visuelle rapide.

### Réalisation
- **Stockage** : Les images sont converties en **Base64** pour être stockées directement dans le JSON du `localStorage`.
- **Optimisation** : Création d'un utilitaire `resizeImage` (Canvas API) pour redimensionner les images (max 500px) et éviter de saturer le stockage du navigateur.
- **UI** : Ajout d'un champ `input type="file"` dans le formulaire.

---

## 6. Intégration de la Caméra

### Objectif
Offrir une expérience fluide sur mobile en permettant la prise de photo directe sans passer par la galerie.

### Réalisation
- **API** : Utilisation de `navigator.mediaDevices.getUserMedia` pour accéder au flux vidéo.
- **Composant** : Création de `CameraCapture.tsx` qui gère le flux vidéo et la capture sur un `<canvas>`.
- **UX** : Intégration modale pour une prise de vue rapide lors de l'ajout ou de l'édition.

---

## 7. Commandes de Développement

Pour travailler sur le projet au quotidien :

**Lancer le serveur de développement :**

```bash
npm run dev
```

**Construire pour la production :**

```bash
npm run build
```

**Prévisualiser la production :**

```bash
npm run preview
```
