# Persistence contracts

The adjacent `bookkeys-v1-contracts.ts` records the v1 browser-storage shapes and key constructors from the preservation audit. It is a type/validation boundary only: it does not open IndexedDB, write localStorage, migrate records, or alter the active reader.

The production reader remains the compatibility oracle until fixtures from its current backup, IndexedDB and localStorage paths are replayed against a future implementation.
