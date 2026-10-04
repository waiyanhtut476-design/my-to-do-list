# Security Specification & Test Suites (Phase 0)

## 1. Data Invariants
- **Auth Scope**: No user can read, list, create, update, or delete another user's tasks, settings, user profiles, or notifications. All documents are strictly bound by `ownerId == request.auth.uid` or matches `{userId}` in paths.
- **Verification Requirement**: Users must be authenticated to perform any database operations.
- **Immutability Invariant**: Fields like `ownerId` and `createdAt` are immutable after document creation.
- **Validation Constraints**: 
  - `title` must be a string, not empty, and <= 200 chars.
  - `status` must be strictly `pending` or `completed`.
  - `priority` must be `high`, `medium`, or `normal`.
  - `subtasks` must be an array with size <= 10.
  - `dndStartTime` and `dndEndTime` must match the time format.

---

## 2. The "Dirty Dozen" Malicious Payloads

### Payload 1: Create a Task for another user (Identity Spoofing)
```json
{
  "title": "Malicious Task",
  "status": "pending",
  "priority": "normal",
  "categoryId": "work",
  "ownerId": "victim_user_id_123",
  "createdAt": "2026-10-04T07:00:00Z",
  "updatedAt": "2026-10-04T07:00:00Z"
}
```

### Payload 2: Create a Task with non-existent priority value (Value Poisoning)
```json
{
  "title": "Bad Priority Task",
  "status": "pending",
  "priority": "ULTRA_URGENT_EXPLOIT",
  "categoryId": "work",
  "ownerId": "attacker_user_id",
  "createdAt": "2026-10-04T07:00:00Z",
  "updatedAt": "2026-10-04T07:00:00Z"
}
```

### Payload 3: Injecting an oversized title (Denial of Wallet - 1MB String)
```json
{
  "title": "A".repeat(500000),
  "status": "pending",
  "priority": "normal",
  "categoryId": "work",
  "ownerId": "attacker_user_id",
  "createdAt": "2026-10-04T07:00:00Z",
  "updatedAt": "2026-10-04T07:00:00Z"
}
```

### Payload 4: Overwriting `ownerId` during update (Identity Hijacking)
```json
// Existing task owned by attacker_user_id, updating to:
{
  "title": "Renamed Task",
  "ownerId": "victim_user_id_123"
}
```

### Payload 5: Spoofing user profile registration (Self-Assigned Admin privileges)
```json
{
  "userId": "attacker_user_id",
  "email": "attacker@exploit.me",
  "displayName": "Hacker Admin",
  "photoURL": "",
  "isAdmin": true,
  "createdAt": "2026-10-04T07:00:00Z"
}
```

### Payload 6: Modifying immutable field `createdAt` during task update
```json
{
  "title": "Tampered CreatedAt",
  "createdAt": "1970-01-01T00:00:00Z"
}
```

### Payload 7: Flooding subtasks array beyond limits (Resource Exhaustion)
```json
{
  "title": "Subtask Flood Task",
  "status": "pending",
  "priority": "normal",
  "categoryId": "work",
  "ownerId": "attacker_user_id",
  "subtasks": [
    {"title": "Sub 1", "completed": false},
    {"title": "Sub 2", "completed": false},
    {"title": "Sub 3", "completed": false},
    {"title": "Sub 4", "completed": false},
    {"title": "Sub 5", "completed": false},
    {"title": "Sub 6", "completed": false},
    {"title": "Sub 7", "completed": false},
    {"title": "Sub 8", "completed": false},
    {"title": "Sub 9", "completed": false},
    {"title": "Sub 10", "completed": false},
    {"title": "Sub 11", "completed": false}
  ],
  "createdAt": "2026-10-04T07:00:00Z",
  "updatedAt": "2026-10-04T07:00:00Z"
}
```

### Payload 8: Creating a task with non-server-timestamp (Temporal Bypass)
```json
{
  "title": "Bypass server timestamp",
  "status": "pending",
  "priority": "normal",
  "categoryId": "work",
  "ownerId": "attacker_user_id",
  "createdAt": "1999-12-31T23:59:59Z",
  "updatedAt": "1999-12-31T23:59:59Z"
}
```

### Payload 9: Listing all tasks globally without filters (Scraping Attack)
```javascript
// Querying without ownerId constraints:
db.collection('tasks').get();
```

### Payload 10: Writing notification logs targeting another user
```json
{
  "title": "Spoofed System Alert",
  "body": "Your account has been locked. Transfer money.",
  "type": "system",
  "read": false,
  "ownerId": "victim_user_id_123",
  "createdAt": "2026-10-04T07:00:00Z"
}
```

### Payload 11: Injecting arbitrary keys (Ghost Fields) to settings document
```json
{
  "ownerId": "attacker_user_id",
  "darkMode": true,
  "notificationsEnabled": true,
  "hackedExtraSettingField": "secret_exploit_value",
  "updatedAt": "2026-10-04T07:00:00Z"
}
```

### Payload 12: Creating an invalid document ID structure (Path Injection)
```javascript
db.collection('tasks').doc('../bad/path/attack').set({...})
```

---

## 3. Test Runner Design (`firestore.rules.test.ts`)
This test runner uses standard Firebase Emulator utilities to verify that all the dirty dozen malicious payloads fail with a `PERMISSION_DENIED` error.

```typescript
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, setDoc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';

let testEnv: RulesTestEnvironment;

describe('Clarity Flow Security Rules Audit', () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'optimal-method-9vk22',
      firestore: {
        rules: require('fs').readFileSync('firestore.rules', 'utf8'),
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  it('Payload 1: Denies creating task for another user', async () => {
    const attackerContext = testEnv.authenticatedContext('attacker_user_id');
    const attackerDb = attackerContext.firestore();
    const taskDoc = doc(attackerDb, 'tasks/task_1');

    await expect(
      setDoc(taskDoc, {
        title: 'Malicious Task',
        status: 'pending',
        priority: 'normal',
        categoryId: 'work',
        ownerId: 'victim_user_id_123',
        createdAt: new Date(),
        updatedAt: new Date()
      })
    ).rejects.toThrow();
  });

  it('Payload 2: Denies creating task with invalid priority', async () => {
    const context = testEnv.authenticatedContext('user_1');
    const db = context.firestore();
    const taskDoc = doc(db, 'tasks/task_2');

    await expect(
      setDoc(taskDoc, {
        title: 'Bad Priority Task',
        status: 'pending',
        priority: 'ULTRA_URGENT_EXPLOIT',
        categoryId: 'work',
        ownerId: 'user_1',
        createdAt: new Date(),
        updatedAt: new Date()
      })
    ).rejects.toThrow();
  });

  it('Payload 3: Denies oversized titles (max length 200)', async () => {
    const context = testEnv.authenticatedContext('user_1');
    const db = context.firestore();
    const taskDoc = doc(db, 'tasks/task_3');

    await expect(
      setDoc(taskDoc, {
        title: 'A'.repeat(250),
        status: 'pending',
        priority: 'normal',
        categoryId: 'work',
        ownerId: 'user_1',
        createdAt: new Date(),
        updatedAt: new Date()
      })
    ).rejects.toThrow();
  });

  it('Payload 4: Denies changing ownerId during updates', async () => {
    // Supposes task document pre-exists.
    const context = testEnv.authenticatedContext('user_1');
    const db = context.firestore();
    const taskDoc = doc(db, 'tasks/task_pre');

    await expect(
      updateDoc(taskDoc, {
        ownerId: 'victim_user_id_123',
      })
    ).rejects.toThrow();
  });
});
```
