---
'@aazucena/animations': patch
---

`AnimationParticles` no longer throws `this._cancelResize is not a function` when it unmounts or its props change while PixiJS is still initializing. `ParticleSystem` defers tearing down the app until `init()` resolves, skips resizing before then, and a failed init (no WebGL) is logged instead of left unhandled.
