# MatchmakingApp (React Native CLI)

A scaffolded Indian matchmaking (arranged marriage) mobile app featuring authentication, profile setup, bottom tabs, and mock match/search/chat UIs. Built with React Navigation and React Native Paper.

## Features
- Authentication flow: Login, Register, Forgot Password (UI-only)
- Encrypted session persistence via `react-native-encrypted-storage`
- Profile setup after registration
- Bottom tabs: Home, Search, Matches, Chat, Profile
- Clean UI using React Native Paper

## Prerequisites
- Node.js LTS, Java 17, Android Studio SDK and/or Xcode (for iOS)
- React Native CLI environment set up per official docs

## Getting Started

Option A: Use this repository as a base
1. Install dependencies:
```bash
npm install
```
2. iOS pods (on macOS):
```bash
npx pod-install
```
3. Start Metro:
```bash
npm start
```
4. Run on Android:
```bash
npm run android
```
5. Run on iOS (macOS):
```bash
npm run ios
```

Option B: Create a fresh RN project and copy `src/`, `App.js`, and install deps
```bash
npx @react-native-community/cli@latest init MatchmakingApp --version 0.74.5
cd MatchmakingApp
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-paper react-native-encrypted-storage react-native-vector-icons react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context react-native-image-picker
npx pod-install
# Copy ./src and App.js into your project root
```

## Notes
- Forgot Password is UI only (no backend).
- Image selection uses `react-native-image-picker` and saves the selected URI to local state/storage (mock save).
- This is a scaffold meant for quick start and extension.
