# Mansour's Portal: The Resilient Bloom

<div align="center">

![Solana](https://img.shields.io/badge/Solana-Devnet-9945FF?style=for-the-badge&logo=solana&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-Anchor-000000?style=for-the-badge&logo=rust&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A Legacy NFT immortalizing a family painting's journey from Sweden to Gaza**

[View NFT](https://explorer.solana.com/address/GdSW2Drudy2VxYb1ZtHm9AmjsvJ9artaeSRmYqTxUX8m?cluster=devnet) | [View Painting](https://gateway.pinata.cloud/ipfs/QmbmreB8fSVruYEGZZqdnxxyvdEyibiBp21nG84qtKca3F) | [View Metadata](https://gateway.pinata.cloud/ipfs/QmY3p5oZV7ffAu4u9cFRHD44qnfykMzP5ZH5MNPJN3NHTF)

</div>

---

<div align="center">

*"In memory of our beloved Grandmother in Cairo.*
*You held this light when the world was dark.*
*The canvas stays with you; its soul travels the world."*

</div>

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

## On-Chain Details

<div align="center">

| Component | Address | Link |
|-----------|---------|------|
| **NFT Mint** | `GdSW2Drudy2VxYb1ZtHm9AmjsvJ9artaeSRmYqTxUX8m` | [Explorer](https://explorer.solana.com/address/GdSW2Drudy2VxYb1ZtHm9AmjsvJ9artaeSRmYqTxUX8m?cluster=devnet) |
| **Program ID** | `DuusvRtdzX2epK2F2WGdDwCktWoCWHaLg6zWXjTmVPqA` | [Explorer](https://explorer.solana.com/address/DuusvRtdzX2epK2F2WGdDwCktWoCWHaLg6zWXjTmVPqA?cluster=devnet) |
| **Legacy PDA** | `ELicsGcPhTS65YGXFEX8Uv8y8WGit9FXReKXGKP9sjE1` | [Explorer](https://explorer.solana.com/address/ELicsGcPhTS65YGXFEX8Uv8y8WGit9FXReKXGKP9sjE1?cluster=devnet) |
| **Network** | Solana Devnet | - |

</div>

### IPFS Storage

| Asset | CID | Gateway |
|-------|-----|---------|
| **Painting** | `QmbmreB8fSVruYEGZZqdnxxyvdEyibiBp21nG84qtKca3F` | [View Image](https://gateway.pinata.cloud/ipfs/QmbmreB8fSVruYEGZZqdnxxyvdEyibiBp21nG84qtKca3F) |
| **Metadata** | `QmY3p5oZV7ffAu4u9cFRHD44qnfykMzP5ZH5MNPJN3NHTF` | [View JSON](https://gateway.pinata.cloud/ipfs/QmY3p5oZV7ffAu4u9cFRHD44qnfykMzP5ZH5MNPJN3NHTF) |

---

## The Dynamic Aura

Grandmother noticed the painting "looked different every time she gazed at it." This contract honors that observation with a dynamic `VisualAura` attribute that changes based on the current time in Cairo (UTC+2):

| Cairo Time | Aura | Description |
|------------|------|-------------|
| 05:00 - 11:59 | **Serene Dawn** | Morning light bathes the painting in tranquility |
| 12:00 - 16:59 | **Golden Radiance** | Afternoon sun paints it with golden warmth |
| 17:00 - 20:59 | **Mystical Shadows** | Evening shadows bring mystery and depth |
| 21:00 - 04:59 | **Silent Guardian** | Night watch - the painting guards grandmother's memory |

---

## Tech Stack

<div align="center">

| Layer | Technology |
|-------|------------|
| **Smart Contract** | Rust + Anchor Framework |
| **Blockchain** | Solana |
| **NFT Standard** | Metaplex Token Metadata |
| **Storage** | IPFS (Pinata) |
| **Frontend** | Next.js 16 + TypeScript |
| **Styling** | Tailwind CSS |
| **Wallet** | Solana Wallet Adapter |

</div>

---

## Project Structure

```
mansour-portal-legacy/
├── programs/
│   └── mansour-portal/
│       └── src/
│           └── lib.rs              # Anchor smart contract
├── frontend/
│   ├── app/
│   │   ├── page.tsx                # Main page with dynamic aura
│   │   ├── layout.tsx              # Root layout
│   │   ├── providers.tsx           # Wallet providers
│   │   └── globals.css             # Global styles
│   ├── next.config.ts              # Next.js config
│   └── package.json                # Frontend dependencies
├── scripts/
│   └── mint-nft.ts                 # Metaplex NFT minting script
├── tests/
│   └── mansour-portal.ts           # Integration tests
├── Anchor.toml                     # Anchor configuration
├── Cargo.toml                      # Rust dependencies
└── README.md                       # This file
```

---

## Smart Contract Features

| Function | Description |
|----------|-------------|
| `initialize_legacy()` | Mint the NFT with complete metadata about the painting's journey |
| `update_visual_aura()` | Dynamic attribute that changes based on Cairo timezone |
| `get_journey_narrative()` | Returns the complete story of the painting |
| `update_family_home()` | Update the family's current location (authority only) |
| `transfer_authority()` | Pass the legacy to the next generation |

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
    story_hash: String,             // IPFS link
    dedication: String,             // Memorial text
    is_enshrined: bool,             // Always true (IMMUTABLE)
    physical_status: String,        // Current physical state
    current_aura: VisualAura,       // Dynamic time-based attribute
    last_aura_update: i64,          // Last aura change timestamp
}
```

---

## Security

- **Immutable Sacred Fields**: `sanctuary_location` and `is_enshrined` cannot be modified
- **Authority Checks**: All sensitive functions require the authority's signature
- **Input Validation**: All string inputs are length-validated
- **PDA Derivation**: Uses program-derived addresses for deterministic account creation

See [SECURITY.md](./SECURITY.md) for complete security documentation.

---

## Getting Started

### Prerequisites

- [Rust](https://rustup.rs/) (stable)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) (v2.1+)
- [Anchor](https://www.anchor-lang.com/docs/installation) (v0.32+)
- [Node.js](https://nodejs.org/) (v18+)

### Build & Deploy

```bash
# Build smart contract
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Run frontend
cd frontend && npm install && npm run dev
```

---

## The Journey

```
Born in Norrköping, Sweden
        ↓
Gifted to Grandmother in Cairo, Egypt
        ↓
Survived 5 years in Gaza
        ↓
Family returned to Stockholm, Sweden
        ↓
Immortalized on Solana blockchain
```

---

## Author

**Abdulwahed Mansour**

[![GitHub](https://img.shields.io/badge/GitHub-abdulwahed--sweden-181717?style=flat&logo=github)](https://github.com/abdulwahed-sweden)

---

## License

MIT License - See [LICENSE](./LICENSE) for details.

---

<div align="center">

*The physical painting remains in grandmother's room in Cairo.*
*This NFT is its digital soul—forever traveling, forever remembering.*

</div>
