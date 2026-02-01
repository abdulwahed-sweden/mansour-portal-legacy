# Security Documentation

> Security analysis and considerations for Mansour's Portal smart contract

**Author:** Abdulwahed Mansour
**Role:** Security Researcher & Smart Contract Auditor

---

## Overview

This document outlines the security measures, potential attack vectors, and mitigations implemented in the Mansour's Portal smart contract.

---

## Security Model

### Trust Assumptions

1. **Authority Trust**: The `authority` field represents the sole owner of the legacy. All sensitive operations require their signature.
2. **Solana Runtime Trust**: We trust the Solana runtime for accurate `Clock::get()` timestamps and account validation.
3. **PDA Security**: Program-derived addresses ensure deterministic, collision-resistant account derivation.

### Threat Model

| Actor | Capability | Threat Level |
|-------|------------|--------------|
| Anonymous User | Can call `update_visual_aura()` | Low |
| Anonymous User | Cannot modify protected fields | Mitigated |
| Authority | Full control over mutable fields | Trusted |
| Malicious Contract | Cannot invoke privileged functions | Mitigated |

---

## Security Features

### 1. Immutable Sacred Fields

Two fields are permanently locked after initialization:

```rust
pub sanctuary_location: String,  // Where grandmother rests - IMMUTABLE
pub is_enshrined: bool,          // Always true - IMMUTABLE
```

**Implementation**: These fields have no corresponding update functions. Once set in `initialize_legacy()`, they cannot be modified by any instruction.

**Rationale**: The physical painting never moves from grandmother's room. This is encoded as a permanent on-chain commitment.

### 2. Authority Checks

All sensitive functions use the `UpdateLegacy` account context:

```rust
#[derive(Accounts)]
pub struct UpdateLegacy<'info> {
    #[account(
        mut,
        seeds = [b"legacy", legacy_state.authority.as_ref()],
        bump = legacy_state.bump,
        has_one = authority @ LegacyError::Unauthorized
    )]
    pub legacy_state: Account<'info, LegacyState>,
    pub authority: Signer<'info>,
}
```

**Protection**: The `has_one = authority` constraint ensures only the designated authority can execute these functions.

### 3. Input Validation

All string inputs are length-validated:

```rust
const MAX_TITLE_LEN: usize = 64;
const MAX_NAME_LEN: usize = 64;
const MAX_CITY_LEN: usize = 128;
const MAX_HASH_LEN: usize = 128;
const MAX_DEDICATION_LEN: usize = 256;
const MAX_STATUS_LEN: usize = 128;
```

**Protection Against**:
- Storage bloat attacks (excessive rent costs)
- Memory exhaustion
- Denial of service through oversized inputs

### 4. PDA Derivation

The legacy account uses a program-derived address:

```rust
seeds = [b"legacy", authority.key().as_ref()]
```

**Benefits**:
- Deterministic: Same authority always produces same PDA
- Collision-resistant: Cannot create conflicting accounts
- One-per-authority: Enforces single legacy per wallet

### 5. Age Validation

```rust
require!(
    artist_age_at_creation > 0 && artist_age_at_creation <= 120,
    LegacyError::InvalidAge
);
```

**Rationale**: Prevents nonsensical values while allowing realistic ages.

### 6. Zero-Address Protection

```rust
require!(
    new_authority != Pubkey::default(),
    LegacyError::InvalidAuthority
);
```

**Protection**: Prevents accidental transfer to the zero address, which would permanently lock the account.

---

## Attack Vector Analysis

### 1. Reentrancy

**Status**: Not Applicable

**Analysis**: This contract does not perform cross-program invocations (CPIs) that could introduce reentrancy vulnerabilities. All operations are atomic within single instructions.

### 2. Integer Overflow/Underflow

**Status**: Mitigated

**Analysis**:
- Rust's default integer arithmetic panics on overflow in debug mode
- Solana BPF programs use checked arithmetic
- The Cairo hour calculation uses modular arithmetic which naturally handles overflow:

```rust
let cairo_timestamp = unix_timestamp + CAIRO_UTC_OFFSET_SECONDS;
let seconds_in_day = cairo_timestamp % 86400;
let hour = seconds_in_day / 3600;
```

### 3. Account Confusion

**Status**: Mitigated

**Analysis**: Anchor's account constraints ensure:
- Correct account types via discriminators
- Correct ownership via `Account<>` wrapper
- Correct derivation via `seeds` and `bump` constraints

### 4. Signer Verification

**Status**: Mitigated

**Analysis**: All privileged operations use `Signer<'info>` and `has_one` constraints.

### 5. PDA Seed Collisions

**Status**: Mitigated

**Analysis**: Seeds include the authority's public key, ensuring each wallet has a unique, non-colliding PDA.

### 6. Timestamp Manipulation

**Status**: Accepted Risk (Low Impact)

**Analysis**: The `update_visual_aura()` function relies on `Clock::get()` for timestamps. Validators could theoretically manipulate this by a few seconds, but:
- The aura changes on hourly boundaries
- Manipulation would require validator collusion
- Impact is purely cosmetic (aura display)
- No financial or access control implications

### 7. Front-Running

**Status**: Not Applicable

**Analysis**: No time-sensitive transactions exist. The aura is deterministic based on block time, and initialization is idempotent per authority.

### 8. Storage Exhaustion

**Status**: Mitigated

**Analysis**:
- Fixed `SPACE` allocation at account creation
- String length limits enforced on all inputs
- Account rent is paid upfront by authority

---

## Privileged Functions

| Function | Access | Modifies |
|----------|--------|----------|
| `initialize_legacy()` | Authority (once) | All fields |
| `update_visual_aura()` | Anyone | `current_aura`, `last_aura_update` |
| `get_journey_narrative()` | Anyone (view) | Nothing |
| `update_family_home()` | Authority | `current_family_home` |
| `update_story_hash()` | Authority | `story_hash` |
| `transfer_authority()` | Authority | `authority` |

---

## Upgrade Considerations

### Current Status: Non-Upgradeable

The program is deployed without upgrade authority by default. This ensures:
- Immutability of contract logic
- No risk of malicious upgrades
- Trust minimization

### If Upgradeability is Required

Should future upgrades be needed:
1. Deploy a new program version
2. Create migration instructions
3. Allow users to voluntarily migrate

---

## Incident Response

### If Authority Key is Compromised

1. **Immediate**: Transfer authority to a new secure wallet
2. **Assessment**: Review any unauthorized changes
3. **Recovery**: Only `current_family_home` and `story_hash` are mutable post-init

### If Contract Bug is Discovered

1. **Disclosure**: Responsible disclosure to the author
2. **Assessment**: Evaluate impact and exploitability
3. **Mitigation**: Deploy patched version if necessary
4. **Communication**: Notify users of any required actions

---

## Audit Checklist

- [x] All privileged functions have authority checks
- [x] Input validation on all string parameters
- [x] No unbounded loops or iterations
- [x] No external calls (reentrancy safe)
- [x] PDA seeds include unique identifiers
- [x] Custom error types for debugging
- [x] Immutable fields properly protected
- [x] Zero-address checks on authority transfer
- [x] Age validation with reasonable bounds
- [x] Fixed account space allocation

---

## Contact

For security inquiries or to report vulnerabilities:

**Abdulwahed Mansour**
GitHub: [@abdulwahed-sweden](https://github.com/abdulwahed-sweden)

---

*This security documentation reflects the contract state as of initial deployment. Future versions may have different security characteristics.*
