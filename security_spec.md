# FRND FOBIA Security Specification

## 1. Data Invariants
1. **Zero Secret Leakage**: The correct answers (`/challenges/{challengeId}/secret/answers`) MUST NEVER be readable by unauthorized client requests. No public read access is granted to the `secret` subcollection.
2. **Challenge Integrity**: Once created, challenge questions cannot be altered by anonymous visitors or competing friends.
3. **Attempt Immutability**: Submitted friend attempts cannot be modified, edited, or overwritten after creation (`allow update: if false`).
4. **ID Poisoning Guard**: All path variables ({challengeId}, {attemptId}) must conform to `^[a-zA-Z0-9_\-]+$` and be under 128 characters.
5. **Payload Bounded Sizes**: All string fields like `creatorName` and `friendName` must be constrained to safe lengths (1–50 characters) to prevent Denial of Wallet.
6. **Expiration Enforced**: Challenges expire after `durationHours` (default 24h, optional 48h). Expired challenges block new attempt submissions.

## 2. The "Dirty Dozen" Payloads (Adversarial Security Test Cases)

1. **Attempting Public Read of Secret Answers**:
   - `GET /challenges/chal_123/secret/answers`
   - Target: Reading creator's answer key.
   - Result: `PERMISSION_DENIED`.

2. **Shadow Field Injection on Challenge**:
   - Payload: `{ id: "chal_1", creatorName: "Alex", isVerifiedAdmin: true, questions: [...] }`
   - Target: Injecting privilege fields.
   - Result: `PERMISSION_DENIED`.

3. **Gigantic String / Denial-of-Wallet on Friend Name**:
   - Payload: `{ friendName: "A".repeat(100000), score: 5, ... }`
   - Target: Storage and memory exhaustion.
   - Result: `PERMISSION_DENIED` (strictly bounded by `.size() <= 50`).

4. **Negative or Overflow Score Hack**:
   - Payload: `{ score: 9999, totalQuestions: 5, percentage: 99999 }`
   - Target: Rigging scoreboards.
   - Result: `PERMISSION_DENIED` (must be within valid 0–5 bounds).

5. **Attempt Tampering / Score Modification After Submit**:
   - `UPDATE /challenges/chal_1/attempts/att_1` with `{ score: 5 }`
   - Target: Overriding low score after the fact.
   - Result: `PERMISSION_DENIED` (attempts are append-only/immutable).

6. **Forged Document ID with Path Traversal**:
   - Path: `/challenges/../../../etc/passwd` or `/challenges/chal_1/attempts/%00null`
   - Target: File path injection and unescaped characters.
   - Result: `PERMISSION_DENIED` (enforced via `isValidId()`).

7. **Attempting to Overwrite or Delete Someone Else's Challenge**:
   - `DELETE /challenges/chal_target`
   - Target: Destructive vandalism by an unauthenticated competitor.
   - Result: `PERMISSION_DENIED`.

8. **Blanket Query Scraping on All Challenges**:
   - Query: `db.collection('challenges').get()` without ID lookup
   - Target: Harvesting user challenge databases and scraping names.
   - Result: Only individual document `get` is permitted; indiscriminate wildcard reads are blocked.

9. **Spoofing Attempt Author / Duplicate Rigging**:
   - Submitting an attempt without valid challenge linkage or missing required schema keys.
   - Result: `PERMISSION_DENIED`.

10. **Altering Challenge Expiration to Stay Active Forever**:
    - `UPDATE /challenges/chal_1` with `{ expiresAt: "2099-01-01" }`
    - Target: Bypassing 24h/48h lifespan limits.
    - Result: `PERMISSION_DENIED`.

11. **Malicious Empty Object Injection**:
    - Payload: `{}` sent to `create`
    - Result: `PERMISSION_DENIED` (missing required keys).

12. **Secret Answers Modification from Client**:
    - `POST /challenges/chal_1/secret/answers` with arbitrary creatorKey or changing answers
    - Result: Direct client write to `secret` subcollection is forbidden unless through authenticated backend service or initial atomic creation gate.
