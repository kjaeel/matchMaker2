# Firestore Index Setup

## Issue
When querying chats with `array-contains` on `participants` and `orderBy('updatedAt')`, Firestore requires a composite index.

## Error Message
```
[firestore/failed-precondition] The query requires an index. You can create it here: 
https://console.firebase.google.com/v1/r/project/matchmaker-885f9/firestore/indexes?create_composite=...
```

## Solution Options

### Option 1: Create the Index (Recommended for Production)

1. **Click the link in the error message** - This will take you directly to Firebase Console with the index pre-configured
2. **Or manually create it**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project: `matchmaker-885f9`
   - Go to Firestore Database > Indexes
   - Click "Create Index"
   - Configure:
     - Collection ID: `chats`
     - Fields to index:
       - `participants` (Array)
       - `updatedAt` (Descending)
   - Click "Create"

3. **Wait for index to build** (usually takes a few minutes)

### Option 2: Use Fallback Query (Current Implementation)

The code has been updated to automatically fall back to a query without `orderBy` if the index doesn't exist. The results are then sorted in memory. This works but is less efficient for large datasets.

## Current Behavior

The app will:
1. Try to use `orderBy('updatedAt', 'desc')` with the query
2. If index error occurs, automatically fall back to query without `orderBy`
3. Sort results in memory by `updatedAt`
4. Display chats in the correct order

## Performance Note

- **With index**: Queries are fast and efficient, even with many chats
- **Without index (fallback)**: All chats are loaded, then sorted in memory. This works but may be slower with 100+ chats

## Recommendation

For production, create the Firestore index using Option 1. The fallback is fine for development and testing.




