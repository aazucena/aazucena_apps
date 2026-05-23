# Rin OS — Gamified Authentication Screen

📍 **Parent:** [Rin OS](./rin-os.md)

## Status: 💡 **IDEATION** (Blocked — Rin OS prerequisites incomplete)

**Estimated Effort:** ~2 weeks  
**Priority:** FIRST screen to build within Rin OS — but Rin OS itself is blocked  
**Dependencies:** All [Rin OS prerequisites](./rin-os.md#-prerequisites-in-order) must be met first

### Direct dependencies for this screen specifically

| Prerequisite            | Dependency                                                                                                                 |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Rive animations for Rin | `RinHostLayer.tsx` needs Rin's sprite/animation set — placeholder acceptable for dev, but Rive defines the motion language |
| Phaser error page games | Pixel art aesthetic + 8-bit sound library shared with the corridor game visual language                                    |
| Persona Selection       | Rin's dialogue lines (`INTRO`, `SUCCESS`, `FAILURE` etc.) draw from Rin's persona rules                                    |

---

## 🎯 Overview

The auth screen is the entry point for Rin OS and the first feature to build. It combines two approaches:

- **Option A — Rin's Challenge:** Rin appears as host, presents the lock, reacts to outcomes with personality
- **Option C — Retro Minigame:** An 8-bit corridor game where the player dodges security bots and collects the ACCESS KEY

The Face ID / biometric call is not a separate step — it is the game's climax. Collecting the ACCESS KEY IS authenticating. The game wraps the Passkey call; it cannot be bypassed to skip it.

---

## 🔐 Authentication Architecture — Passkeys (WebAuthn)

### Why Passkeys over TOTP

The existing web auth (`/api/auth`) is single-factor: `ADMIN_PASSWORD` compared directly, session stored as an `httpOnly` cookie. Cookies don't work in native apps (apps use JWT), so the mobile auth layer is new regardless. Passkeys are the right choice to build from scratch in 2026:

|                     | TOTP (Option 1)            | Passkeys (Option 2)           |
| ------------------- | -------------------------- | ----------------------------- |
| Daily friction      | Open separate app for code | Face ID only                  |
| Security            | Strong                     | Stronger (phishing-resistant) |
| Passwords to manage | Yes                        | None                          |
| Recovery            | TOTP backup codes          | Re-enroll on new device       |
| 2026 standard       | Standard                   | Current best practice         |

Passkeys are **2FA by design** — the private key is device-bound (something you have) and biometric-gated (something you are). No TOTP app. No passwords. One gesture.

### Backend endpoints (new — additive, does not touch existing auth)

```
POST /api/auth/passkey/register    → store public key (setup, once per device)
POST /api/auth/passkey/challenge   → issue WebAuthn challenge (every login attempt)
POST /api/auth/passkey/verify      → verify signed challenge → return JWT
```

The existing `POST /api/auth` (password + cookie) stays untouched for the web analytics dashboard. Two clients, same backend, appropriate auth per surface.

### Session model

```
First setup:   register passkey (device generates key pair, public key stored server-side)
Daily use:     Face ID → device signs challenge → server verifies → JWT issued
JWT storage:   expo-secure-store (encrypted Keychain / Keystore)
JWT expiry:    7 days (matching existing COOKIE_MAX_AGE)
New device:    passkey re-enrollment (Face ID on new device + server challenge)
```

---

## 🎮 The Gamified Auth Experience

### Full narrative flow

```
App opens
    ↓
Rin appears (trust-tier-appropriate intro line)
    ↓
8-bit retro corridor game starts
Player navigates corridor, dodges security bots
    ↓
Player reaches ACCESS KEY at corridor end
    ↓
Rin: "Almost... prove it."
Face ID / biometric prompt fires HERE
    ↓
Biometric SUCCESS          │  Biometric FAILURE
Door opens + confetti      │  Game resets, bots pushed back
Rin: "Identity confirmed.  │  Rin: "Hmm. That doesn't
Welcome back, Aldrin."     │  look right. Try again."
App unlocks                │  Attempt counter increments
```

### Game design

**Setting:** A retro pixel art security corridor — the player character moves right, dodging incoming security bots, heading toward a glowing ACCESS KEY / door at the end.

**Controls:**

- Tap to jump (dodge bots)
- Swipe up for higher jump
- The corridor auto-scrolls — no left/right movement needed, keeps it frictionless

**Difficulty:**

- Bots speed up slightly on each retry after a biometric failure
- Rin comments on difficulty mid-game if the player dies more than once
- Intentionally beatable in under 10 seconds on first attempt — the game is not the friction point

**Rin's role:**

- Rin sprite overlaid above or beside the game (not inside it)
- Rin reacts in real time: winces on bot hit, leans forward near the key
- Rin's dialogue is contextual — the host, not a passive observer

---

## 🗂️ Full Narrative States

| State               | Game behavior                               | Rin line                                                            |
| ------------------- | ------------------------------------------- | ------------------------------------------------------------------- |
| First install       | Full intro cutscene, Rin explains rules     | _"New device detected. Let's set up your access."_                  |
| Daily open (tier 1) | Full game, opening line                     | _"Oh? Someone's trying to get in... let's see if it's really you."_ |
| Daily open (tier 2) | Shorter game (6–8s), no intro               | _"Back again. Show me."_                                            |
| Daily open (tier 3) | Rin appears, one-liner, Face ID immediately | _"I still trust you. Go ahead."_                                    |
| Player dies in-game | Respawn immediately                         | _"Careful. Those bots are no joke."_                                |
| Face ID success     | Door opens, unlock animation                | _"Identity confirmed. Welcome back, Aldrin."_                       |
| Face ID fail (1×)   | Game resets                                 | _"Hmm. That doesn't look right. Try again."_                        |
| Face ID fail (2×)   | Game resets, bots slightly faster           | _"Still not convinced. Once more."_                                 |
| Face ID fail (3×)   | Cooldown screen, Rin suspicious             | _"I'm going to need a moment before I let you try again."_          |
| Middle of the night | Rin sleepy, slower bot speed                | _"...you again? At this hour?"_                                     |
| Tier 3 unlocked     | Face ID directly, Rin satisfied             | _"You've earned fast access. I still trust you."_                   |
| Shake to replay     | Full game re-triggered                      | _"Feeling nostalgic? Fine. Show me again."_                         |

---

## ⏱️ Trust Tier System

A 10-second game every single open gets old. The trust tier system balances security with daily usability.

```
Tier 1 (first 3 opens):
  Full experience — Rin intro + full corridor game + Face ID

Tier 2 (regular daily use):
  Shorter corridor (6s) + Face ID
  No intro line unless it's been 24h+ since last open

Tier 3 (unlocked after 7 consecutive successful days):
  Rin appears → one-liner → Face ID immediately
  No game

Reset to Tier 1:
  Shake the phone from the auth screen to replay the full experience
  Rin: "Feeling nostalgic? Fine. Show me again."

Tier drops back to Tier 2:
  Any biometric failure resets the consecutive day count
  3× failures in one session drops to Tier 1 + 5-minute cooldown
```

**Persistence:** Trust tier state stored in `AsyncStorage` (not `expo-secure-store` — it's not sensitive, and AsyncStorage survives app restarts without biometric unlock).

---

## 🎵 Haptic Language

The haptic patterns form a physical vocabulary that your hands learn independently of the screen:

| Event                           | Pattern                 | expo-haptics call                           |
| ------------------------------- | ----------------------- | ------------------------------------------- |
| Bot hit / player damage         | Short sharp buzz        | `ImpactFeedbackStyle.Light`                 |
| Player dies                     | Two quick taps          | `ImpactFeedbackStyle.Medium` × 2            |
| Approaching ACCESS KEY          | Subtle increasing pulse | `ImpactFeedbackStyle.Light` × 3, escalating |
| Key collected → Face ID trigger | Medium confident pulse  | `ImpactFeedbackStyle.Medium`                |
| Face ID success                 | Long warm rumble        | `NotificationFeedbackType.Success`          |
| Face ID failure                 | Two sharp jolts         | `NotificationFeedbackType.Error`            |
| Rin speaks (each word group)    | Subtle tick             | `ImpactFeedbackStyle.Light`                 |
| Cooldown activated              | Slow heavy pulse × 3    | `ImpactFeedbackStyle.Heavy` × 3             |

Success vs. failure teaches your hands to recognize the outcome before your eyes register it. That's native-only — not achievable in the web Phaser games.

---

## 🏗️ Technical Architecture

### Directory structure

```
apps/mobile/src/
├── screens/
│   └── AuthScreen.tsx              ← orchestrator: game state → biometric → unlock
│
├── components/auth/
│   ├── RinHostLayer.tsx            ← Rin sprite + dialogue bubbles (Reanimated)
│   ├── RetroGame.tsx               ← game-engine game loop + world
│   ├── GameEntities.tsx            ← player, bots, key, corridor (entity defs)
│   ├── GameSystems.tsx             ← movement, collision, win detection (pure fns)
│   ├── AccessKeyEntity.tsx         ← the Face ID trigger point
│   └── AuthResultOverlay.tsx       ← success/fail animation overlay (Reanimated)
│
└── hooks/
    ├── useGameAuth.ts              ← ties game win event → expo-local-authentication
    └── useTrustTier.ts             ← tracks consecutive sessions → tier 1/2/3 logic
```

### State machine

```
IDLE
  ↓ (app opens)
INTRO (Rin line plays)
  ↓
PLAYING (game loop running)
  ↓ (player collects key)
PENDING_BIOMETRIC (Face ID prompt active)
  ↓                    ↓
SUCCESS              FAILURE
  ↓                    ↓
UNLOCKED           RESET → PLAYING (attempt < 3)
                       ↓ (attempt === 3)
                   COOLDOWN
```

### Key dependency chain

```
react-native-game-engine    game loop + entity/system architecture
react-native-reanimated     Rin animations, overlays, dialogue
react-native-skia           pixel art rendering (GPU-accelerated)
expo-local-authentication   Face ID / Touch ID / fingerprint
expo-haptics               rumble patterns on all key events
expo-av                    8-bit SFX + optional Rin voice lines
expo-secure-store          JWT storage (encrypted Keychain/Keystore)
AsyncStorage               trust tier state persistence
```

### AuthScreen.tsx — key logic sketch

```typescript
export function AuthScreen() {
  const [phase, setPhase] = useState<AuthPhase>('INTRO');
  const { tier } = useTrustTier();

  // Game win → trigger biometric
  const handleKeyCollected = useCallback(async () => {
    setPhase('PENDING_BIOMETRIC');
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Confirm your identity',
      disableDeviceFallback: false,
    });
    if (result.success) {
      const jwt = await verifyPasskeyChallenge();
      await SecureStore.setItemAsync('az_jwt', jwt);
      setPhase('SUCCESS');
    } else {
      setPhase('FAILURE');
    }
  }, []);

  // Tier 3: skip game, go straight to biometric
  if (tier === 3) {
    return <RinDirectAuth onAuth={handleKeyCollected} />;
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <RetroGame
        duration={tier === 1 ? 10 : 6}
        onKeyCollected={handleKeyCollected}
      />
      <RinHostLayer phase={phase} tier={tier} />
      {phase === 'SUCCESS' && <AuthResultOverlay success />}
      {phase === 'FAILURE' && <AuthResultOverlay success={false} />}
    </View>
  );
}
```

---

## 🎨 Visual Connection to Web Phaser Games

The corridor aesthetic shares the same **visual DNA** as the planned error page games on the web (Breakout, Sokoban — see [phaser-error-games.md](./phaser-error-games.md)):

- Same pixel art style
- Same atmospheric color palette from `@aazucena/design-system` tokens
- Same 8-bit sound design language

Anyone who plays Breakout on the 404 page and later sees the mobile auth screen recognizes the universe immediately. Two different features, one coherent design language across platforms.

---

## ✅ v1 Scope (What "done" means)

```
✅ Auth screen renders on app open
✅ Rin appears with opening line (trust tier 1)
✅ Retro corridor game runs at stable FPS
✅ Player character moves (tap to jump / swipe controls)
✅ At least 2 bot types as obstacles
✅ ACCESS KEY entity at end of corridor
✅ Key collection triggers Face ID (expo-local-authentication)
✅ Passkey verify endpoint wired — JWT stored in expo-secure-store
✅ Success → unlock animation + Rin success line
✅ Failure → game reset + Rin failure line
✅ All haptic patterns on key events
✅ Trust tier 1/2/3 logic persisted to AsyncStorage
✅ 5-minute cooldown on 3× biometric failures
✅ Night-mode Rin state (slower bots, sleepy dialogue)
```

**Explicitly out of scope for v1:**

```
❌ All other Rin OS screens
❌ Full Rin emotion system (4–5 fixed lines per state is sufficient)
❌ Full pixel art asset set (placeholder sprites acceptable)
❌ Sound design (add after visuals locked)
❌ Push notifications
❌ Backend Passkey endpoints (mock the JWT locally during dev, wire server last)
❌ AR business card
```

---

## 📅 Build Sequence

```
Week 1 — Game foundation
  Day 1: Expo project in apps/mobile/, game-engine running, blank corridor renders
  Day 2: Player entity + tap/swipe jump controls
  Day 3: Bot entities + collision detection (player dies, respawns)
  Day 4: ACCESS KEY entity + win condition trigger
  Day 5: Face ID wired to win condition, success/fail state transitions

Week 2 — Rin + polish
  Day 1: Rin sprite layer over the game (Reanimated)
  Day 2: Dialogue system — 4–5 lines per trust tier, 2 outcome lines
  Day 3: Trust tier logic + AsyncStorage persistence
  Day 4: Haptic patterns on all events
  Day 5: Visual polish + edge cases (cooldown screen, night mode detection)
```

### Why build this first

1. Forces the hardest architectural problems early — game loop + biometric + Reanimated + Rin's character layer. Everything else in the app is easier after this.
2. Establishes Rin's motion language, dialogue system, sprite setup, and haptic vocabulary once — reused on every other screen.
3. Immediately demoable — hand someone the phone, they understand the entire app concept in 10 seconds.
4. **Zero backend dependency during development** — `expo-local-authentication` talks directly to the device OS. Mock the JWT locally and wire the Passkey server endpoints last.

---

## ⚠️ Important Constraints

```
❌ Game must NOT be skippable — Face ID is required to unlock, not optional
❌ Do not store JWT in AsyncStorage — expo-secure-store only (encrypted)
❌ Cooldown screen must clearly communicate wait time (not just a locked UI)
❌ Tier 3 shortcut must still require Face ID — Rin going straight to biometric is not no-auth
✅ Player dying in the game is fine — respawn immediately, no retry limit on the game itself
✅ Trust tier can be manually reset by shaking the phone from auth screen
✅ Test on older devices — game must run at acceptable FPS on iPhone XS / Pixel 4 equivalent
```

---

**Last Updated:** 2026-05-23  
**Status:** Ideation — no code written  
**Next Step:** Scaffold `apps/mobile/` after Phase 5 completion
