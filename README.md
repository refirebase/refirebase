<p align="center">
  <a href="https://github.com/refirebase">
    <img src="https://avatars.githubusercontent.com/u/181779808?v=4" alt="Refirebase Logo" width="128" style="border-radius: 8px">
    <h1 align="center">
      Refirebase
    </h1>
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/refirebase">
    <img src="https://img.shields.io/npm/v/refirebase.svg">
  </a>
  <a href="https://github.com/refirebase/refirebase?tab=MIT-1-ov-file">
    <img src="https://img.shields.io/npm/l/refirebase.svg">
  </a>
</p>

Refirebase is a simple library that allows you to use Firebase Realtime Database, Firestore, Storage and Authentication as a state management solution in your JavaScript application.

## Installation

Use your favorite package manager to install Refirebase:

### NPM

```bash
npm install refirebase
```

### Yarn, PNPM, BUN

```bash
yarn add refirebase
```

```bash
pnpm add refirebase
```

```bash
bun add refirebase
```

## Usage

Import the `Refirebase` class:

```javascript
import { Refirebase } from 'refirebase';
```

You can use the `Refirebase` class to get the Firebase objects:

```javascript
const refirebase = new Refirebase({
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  databaseURL: 'YOUR_DATABASE_URL',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  measurementId: 'YOUR_MEASUREMENT_ID',
});
```

Or you can use destructuring to get other objects:

```javascript
const { db, auth } = new Refirebase({
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  databaseURL: 'YOUR_DATABASE_URL',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  measurementId: 'YOUR_MEASUREMENT_ID',
});
```

> If you prefer to copy empty strings to the `Refirebase` class:

```javascript
const refirebase = new Refirebase({
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: '',
});
```

## Examples

### Databases

#### Firestore Database Example

```javascript
// Import the Refirebase class
import { db } from '@/config/firebase';

// Get ALL data from the 'users' collection
const users = db.firestore.get("users");
```

#### Realtime Database Example

```javascript
// Import the Refirebase class
import { db } from '@/config/firebase';

// Get ALL data from the 'users' collection
const users = db.realtime.get("users");
```

#### Storage

```javascript
// Import the Refirebase class
import { db } from '@/config/firebase';

// Get a file from the storage
const file = db.storage.get("path/to/file");
```

### Features

#### Authentication Example

```javascript
// Import the Refirebase class
import { auth } from '@/config/firebase';

// Sign in with Google
const result = await auth.handleProviderSignIn("google");

if (!result) {
  // Handle error
}

const user = result.user;
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
