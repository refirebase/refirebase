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
  apiKey: 'FIREBASE_API_KEY',
  authDomain: 'FIREBASE_AUTH_DOMAIN',
  databaseURL: 'FIREBASE_DATABASE_URL',
  projectId: 'FIREBASE_PROJECT_ID',
  storageBucket: 'FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'FIREBASE_MESSAGING_SENDER_ID',
  appId: 'FIREBASE_APP_ID',
  measurementId: 'FIREBASE_MEASUREMENT_ID',
});
```

Or you can use destructuring to get other objects:

```javascript
const { db, auth } = new Refirebase({
  apiKey: 'FIREBASE_API_KEY',
  authDomain: 'FIREBASE_AUTH_DOMAIN',
  databaseURL: 'FIREBASE_DATABASE_URL',
  projectId: 'FIREBASE_PROJECT_ID',
  storageBucket: 'FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'FIREBASE_MESSAGING_SENDER_ID',
  appId: 'FIREBASE_APP_ID',
  measurementId: 'FIREBASE_MEASUREMENT_ID',
});
```

If you prefer to use directly environment variables (from `.env` file), you can simply call the constructor without any parameters:

```yaml
FIREBASE_API_KEY
FIREBASE_AUTH_DOMAIN
FIREBASE_DATABASE_URL
FIREBASE_PROJECT_ID
FIREBASE_STORAGE_BUCKET
FIREBASE_MESSAGING_SENDER_ID
FIREBASE_APP_ID
FIREBASE_MEASUREMENT_ID
```

```javascript
const refirebase = new Refirebase();
```

## Examples

### Databases

#### Firestore Database Example
```javascript
// Import the Refirebase class
import { db } from '@/config/firebase';

// Get all data from the 'users' collection
const users = db.firestore.get("users");

// Get data with conditions
const users = db.firestore.get("users", {
  where: {
    name: "John",
  },
});

// Get data with conditions and index
const users = db.firestore.get("users", {
  where: {
    name: "John",
    lastName: { not: "Doe" },
  },
});

// Get data with conditions and not
const users = db.firestore.get("users", {
  where: {
    name: "John",
    age: { operator: ">=", value: 18 },
  },
});
```

> [!WARNING]  
> For more information about the limitations of the Firestore query, see [Firebase Firestore Query Limitations](https://firebase.google.com/docs/firestore/query-data/queries#query_limitations).

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
