# Mansour's Portal: From Sweden to Gaza

> *A Legacy NFT immortalizing a family painting's journey across continents*

---

## The Painting's Soul

**"In memory of our beloved Grandmother in Cairo.**
**You held this light when the world was dark.**
**The canvas stays with you; its soul travels the world."**

---

## The Story

### Origin: Norrköping, Sweden

In the quiet town of Norrköping, Sweden, a 10-year-old girl named **Sara Mansour** picked up her brushes and created something she couldn't fully understand at the time. The painting—later titled **"The Resilient Bloom"**—won first place in her school's art competition.

But Sara had a greater purpose for it.

### The Gift: Cairo, Egypt

Sara had never met her grandmother—a woman who lived in Cairo, Egypt, separated by continents and circumstance. When the opportunity came, Sara gifted her painting to this grandmother she'd only heard stories about.

The grandmother hung it in her room. And then she noticed something peculiar:

> *"The painting looks different every time I gaze at it."*

Morning light gave it serenity. Afternoon sun painted it with golden warmth. Evening shadows brought mystery. And in the silent hours of night, it watched over her like a guardian.

### The Siege: Gaza

The family traveled to Gaza to visit relatives. It was meant to be a short trip.

Then COVID-19 struck. Borders closed. Five years passed.

Then came October 7th.

The family survived the war. They survived the siege. They finally made their way back to Stockholm, Sweden—forever changed.

### The Loss: Cairo

During those five years, grandmother passed away. Her room in Cairo remains untouched. The painting hangs where she left it.

**We choose NOT to move it.**

The physical canvas stays with grandmother—untouched, unmoving, eternal.

This NFT carries its soul.

---

## The Journey Narrative

```
Born in Norrköping, Sweden. Gifted in Cairo, Egypt.
Survived the siege of Gaza. Returned as a digital legacy to Stockholm.
The original remains enshrined in Grandmother's room - untouched, unmoving, eternal.
```

---

## Technical Overview

This is a Solana smart contract built with the **Anchor framework** that creates a dynamic Legacy NFT representing the painting's journey.

### Smart Contract Features

| Feature | Description |
|---------|-------------|
| `initialize_legacy()` | Mint the NFT with complete metadata about the painting's journey |
| `update_visual_aura()` | Dynamic attribute that changes based on Cairo timezone |
| `get_journey_narrative()` | Returns the complete story of the painting |
| `update_family_home()` | Update the family's current location (authority only) |
| `transfer_authority()` | Pass the legacy to the next generation |

### The Dynamic Aura

Grandmother noticed the painting "looked different every time she gazed at it." This contract honors that observation with a dynamic `VisualAura` attribute that changes based on the current time in Cairo (UTC+2):

| Cairo Time | Aura |
|------------|------|
| 05:00 - 11:59 | Serene Dawn |
| 12:00 - 16:59 | Golden Radiance |
| 17:00 - 20:59 | Mystical Shadows |
| 21:00 - 04:59 | Silent Guardian |

### LegacyState Account

```rust
pub struct LegacyState {
    authority: Pubkey,              // Owner's wallet
    title: String,                  // "The Resilient Bloom"
    artist: String,                 // "Sara Mansour"
    artist_age_at_creation: u8,     // 10
    origin_city: String,            // "Norrköping, Sweden"
    sanctuary_location: String,     // "Cairo, Egypt" (IMMUTABLE)
    current_family_home: String,    // "Stockholm, Sweden"
    creation_timestamp: i64,        // On-chain timestamp
    story_hash: String,             // IPFS/Arweave link
    dedication: String,             // Memorial text
    is_enshrined: bool,             // Always true (IMMUTABLE)
    physical_status: String,        // Current physical state
    current_aura: VisualAura,       // Dynamic time-based attribute
    last_aura_update: i64,          // Last aura change timestamp
}
```

---

## Security Design

This contract was designed with security-first principles. See [SECURITY.md](./SECURITY.md) for the complete security audit documentation.

### Key Security Features

- **Immutable Sacred Fields**: `sanctuary_location` and `is_enshrined` cannot be modified after initialization
- **Authority Checks**: All sensitive functions require the authority's signature
- **Input Validation**: All string inputs are length-validated to prevent storage attacks
- **PDA Derivation**: Uses program-derived addresses for deterministic account creation
- **Custom Errors**: Descriptive error types for debugging and security monitoring

---

## Project Structure

```
mansour-portal-legacy/
├── README.md                 # This file
├── LICENSE                   # MIT License
├── SECURITY.md               # Security documentation
├── Anchor.toml               # Anchor configuration
├── Cargo.toml                # Rust dependencies
├── programs/
│   └── mansour-portal/
│       ├── Cargo.toml
│       └── src/
│           └── lib.rs        # Main contract
├── tests/
│   └── mansour-portal.ts     # Integration tests
└── migrations/
    └── deploy.ts             # Deployment script
```

---

## Getting Started

### Prerequisites

- [Rust](https://rustup.rs/) (stable)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) (v1.18+)
- [Anchor](https://www.anchor-lang.com/docs/installation) (v0.30+)
- [Node.js](https://nodejs.org/) (v18+)

### Build

```bash
anchor build
```

### Test

```bash
anchor test
```

### Deploy

```bash
# Deploy to devnet
anchor deploy --provider.cluster devnet

# Deploy to mainnet (when ready)
anchor deploy --provider.cluster mainnet-beta
```

---

## Initialization Example

```typescript
await program.methods
  .initializeLegacy(
    "The Resilient Bloom",
    "Sara Mansour",
    10,
    "Norrköping, Sweden",
    "Cairo, Egypt",
    "Stockholm, Sweden",
    "ipfs://Qm...",  // Link to full story
    "In loving memory of Grandmother",
    "Permanently preserved in Cairo"
  )
  .accounts({
    legacyState: legacyPDA,
    authority: wallet.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

---

## The Dedication

```
In memory of our beloved Grandmother in Cairo.
You held this light when the world was dark.
The canvas stays with you; its soul travels the world.
```

---

## Author

**Abdulwahed Mansour** ([@abdulwahed-sweden](https://github.com/abdulwahed-sweden))

Security Researcher | Smart Contract Auditor

---

## License

MIT License - See [LICENSE](./LICENSE) for details.

---

*The physical painting remains in grandmother's room in Cairo. This NFT is its digital soul—forever traveling, forever remembering.*
