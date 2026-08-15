# Firestore Schema

All collections use the typed collection pattern — see frontend/src/lib/firebase/firestore.ts.
Security rules are in firebase/firestore.rules.

Every document must include a _schemaVersion field (currently 1) to enable lazy migration.

## users collection
Path: /users/{userId} — Owner-only (admins can read all)
Fields: uid, email, displayName, photoURL, role, createdAt, updatedAt, _schemaVersion
Created by AuthProvider on first sign-in. Hard-delete disabled (soft-delete via deletedAt).

## notes collection
Path: /notes/{noteId} — Owner-only
Fields: uid, title (1–200), body (<=10000), createdAt, updatedAt, _schemaVersion
