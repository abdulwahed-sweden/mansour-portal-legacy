use anchor_lang::prelude::*;

declare_id!("DuusvRtdzX2epK2F2WGdDwCktWoCWHaLg6zWXjTmVPqA");

// =============================================================================
// MANSOUR'S PORTAL: FROM SWEDEN TO GAZA
// =============================================================================
// A Legacy NFT immortalizing a family painting's journey across continents.
//
// "In memory of our beloved Grandmother in Cairo.
//  You held this light when the world was dark.
//  The canvas stays with you; its soul travels the world."
// =============================================================================

/// Maximum length for string fields to prevent excessive storage costs
/// and potential DoS through oversized inputs
const MAX_TITLE_LEN: usize = 64;
const MAX_NAME_LEN: usize = 64;
const MAX_CITY_LEN: usize = 128;
const MAX_HASH_LEN: usize = 128;
const MAX_DEDICATION_LEN: usize = 256;
const MAX_STATUS_LEN: usize = 128;

/// Cairo timezone offset from UTC in seconds (UTC+2, accounting for Egypt's timezone)
const CAIRO_UTC_OFFSET_SECONDS: i64 = 2 * 60 * 60;

/// The visual aura states that reflect grandmother's observation:
/// "The painting looks different every time I gaze at it"
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum VisualAura {
    SereneDawn,      // 05:00 - 11:59 Cairo time
    GoldenRadiance,  // 12:00 - 16:59 Cairo time
    MysticalShadows, // 17:00 - 20:59 Cairo time
    SilentGuardian,  // 21:00 - 04:59 Cairo time
}

impl VisualAura {
    pub fn as_str(&self) -> &'static str {
        match self {
            VisualAura::SereneDawn => "Serene Dawn",
            VisualAura::GoldenRadiance => "Golden Radiance",
            VisualAura::MysticalShadows => "Mystical Shadows",
            VisualAura::SilentGuardian => "Silent Guardian",
        }
    }
}

impl Default for VisualAura {
    fn default() -> Self {
        VisualAura::SereneDawn
    }
}

/// The core state account holding the painting's legacy metadata.
/// This struct represents the digital soul of Sara's painting.
#[account]
#[derive(Default)]
pub struct LegacyState {
    /// The wallet address with authority over this legacy (owner's pubkey)
    pub authority: Pubkey,

    /// The painting's title: "The Resilient Bloom"
    pub title: String,

    /// The artist who created this masterpiece
    pub artist: String,

    /// Sara was 10 years old when she painted this
    pub artist_age_at_creation: u8,

    /// Where the journey began
    pub origin_city: String,

    /// Where the physical painting rests eternally - IMMUTABLE after init
    /// This field honors grandmother's memory; the painting stays with her
    pub sanctuary_location: String,

    /// Where the family now resides after surviving the siege
    pub current_family_home: String,

    /// Unix timestamp when this legacy was minted on-chain
    pub creation_timestamp: i64,

    /// IPFS/Arweave hash linking to the full story and high-res image
    pub story_hash: String,

    /// A tribute to grandmother
    pub dedication: String,

    /// Always true - the physical painting never moves from Cairo - IMMUTABLE
    pub is_enshrined: bool,

    /// Description of the physical painting's current state
    pub physical_status: String,

    /// Dynamic attribute reflecting the "changing" nature grandmother observed
    pub current_aura: VisualAura,

    /// Timestamp of last aura update (for rate limiting if needed)
    pub last_aura_update: i64,

    /// Bump seed for PDA derivation
    pub bump: u8,
}

impl LegacyState {
    /// Calculate the space needed for this account
    /// Using conservative estimates with max string lengths
    pub const SPACE: usize = 8  // discriminator
        + 32  // authority (Pubkey)
        + 4 + MAX_TITLE_LEN  // title (String: 4 bytes len + content)
        + 4 + MAX_NAME_LEN   // artist
        + 1   // artist_age_at_creation (u8)
        + 4 + MAX_CITY_LEN   // origin_city
        + 4 + MAX_CITY_LEN   // sanctuary_location
        + 4 + MAX_CITY_LEN   // current_family_home
        + 8   // creation_timestamp (i64)
        + 4 + MAX_HASH_LEN   // story_hash
        + 4 + MAX_DEDICATION_LEN  // dedication
        + 1   // is_enshrined (bool)
        + 4 + MAX_STATUS_LEN // physical_status
        + 1   // current_aura (enum, 1 byte for 4 variants)
        + 8   // last_aura_update (i64)
        + 1;  // bump (u8)
}

#[program]
pub mod mansour_portal {
    use super::*;

    /// Initialize the Legacy NFT with all metadata.
    /// This function can only be called once - it creates the permanent record
    /// of the painting's journey from Sweden to Gaza and back.
    ///
    /// # Security Considerations
    /// - The sanctuary_location is set permanently here and cannot be changed
    /// - The is_enshrined flag is hardcoded to true and immutable
    /// - All string inputs are validated for length to prevent storage attacks
    pub fn initialize_legacy(
        ctx: Context<InitializeLegacy>,
        title: String,
        artist: String,
        artist_age_at_creation: u8,
        origin_city: String,
        sanctuary_location: String,
        current_family_home: String,
        story_hash: String,
        dedication: String,
        physical_status: String,
    ) -> Result<()> {
        // Input validation - prevent oversized strings that could bloat storage
        require!(title.len() <= MAX_TITLE_LEN, LegacyError::TitleTooLong);
        require!(artist.len() <= MAX_NAME_LEN, LegacyError::ArtistNameTooLong);
        require!(origin_city.len() <= MAX_CITY_LEN, LegacyError::CityNameTooLong);
        require!(sanctuary_location.len() <= MAX_CITY_LEN, LegacyError::CityNameTooLong);
        require!(current_family_home.len() <= MAX_CITY_LEN, LegacyError::CityNameTooLong);
        require!(story_hash.len() <= MAX_HASH_LEN, LegacyError::HashTooLong);
        require!(dedication.len() <= MAX_DEDICATION_LEN, LegacyError::DedicationTooLong);
        require!(physical_status.len() <= MAX_STATUS_LEN, LegacyError::StatusTooLong);

        // Validate age is reasonable (Sara was 10)
        require!(artist_age_at_creation > 0 && artist_age_at_creation <= 120, LegacyError::InvalidAge);

        let legacy = &mut ctx.accounts.legacy_state;
        let clock = Clock::get()?;

        // Set authority to the signer - only they can perform sensitive operations
        legacy.authority = ctx.accounts.authority.key();

        // Store the painting's identity
        legacy.title = title;
        legacy.artist = artist;
        legacy.artist_age_at_creation = artist_age_at_creation;

        // The journey coordinates
        legacy.origin_city = origin_city;
        legacy.sanctuary_location = sanctuary_location;  // IMMUTABLE after this point
        legacy.current_family_home = current_family_home;

        // Timestamp and story reference
        legacy.creation_timestamp = clock.unix_timestamp;
        legacy.story_hash = story_hash;

        // The dedication to grandmother
        legacy.dedication = dedication;

        // These values are permanently set - the painting never moves
        legacy.is_enshrined = true;  // IMMUTABLE - always true
        legacy.physical_status = physical_status;

        // Initialize the aura based on current Cairo time
        let cairo_hour = get_cairo_hour(clock.unix_timestamp);
        legacy.current_aura = determine_aura(cairo_hour);
        legacy.last_aura_update = clock.unix_timestamp;

        // Store the bump for future PDA derivations
        legacy.bump = ctx.bumps.legacy_state;

        msg!("Legacy NFT initialized: {}", legacy.title);
        msg!("The painting's soul is now immortalized on the Solana blockchain");
        msg!("Sanctuary: {} - Forever enshrined", legacy.sanctuary_location);

        Ok(())
    }

    /// Update the visual aura based on the current time in Cairo.
    /// This simulates grandmother's observation that the painting
    /// "looks different every time she gazed at it."
    ///
    /// The aura changes throughout the day in Cairo timezone:
    /// - Morning (05:00-11:59): Serene Dawn
    /// - Afternoon (12:00-16:59): Golden Radiance
    /// - Evening (17:00-20:59): Mystical Shadows
    /// - Night (21:00-04:59): Silent Guardian
    ///
    /// # Security Note
    /// This function is permissionless by design - anyone can trigger an aura update.
    /// The aura is deterministic based on blockchain timestamp, so there's no
    /// security risk in allowing public updates. This lets the NFT remain "alive"
    /// even if the owner isn't actively maintaining it.
    pub fn update_visual_aura(ctx: Context<UpdateAura>) -> Result<()> {
        let legacy = &mut ctx.accounts.legacy_state;
        let clock = Clock::get()?;

        let cairo_hour = get_cairo_hour(clock.unix_timestamp);
        let new_aura = determine_aura(cairo_hour);

        let old_aura_str = legacy.current_aura.as_str();
        legacy.current_aura = new_aura;
        legacy.last_aura_update = clock.unix_timestamp;

        msg!(
            "Aura updated: {} -> {} (Cairo hour: {})",
            old_aura_str,
            legacy.current_aura.as_str(),
            cairo_hour
        );

        Ok(())
    }

    /// Returns the complete journey narrative of the painting.
    /// This is a view function that emits the story as program logs.
    ///
    /// "Born in Norrköping, Sweden. Gifted in Cairo, Egypt.
    ///  Survived the siege of Gaza. Returned as a digital legacy to Stockholm.
    ///  The original remains enshrined in Grandmother's room - untouched, unmoving, eternal."
    pub fn get_journey_narrative(ctx: Context<GetNarrative>) -> Result<()> {
        let legacy = &ctx.accounts.legacy_state;

        msg!("=== THE JOURNEY OF '{}' ===", legacy.title);
        msg!("");
        msg!("Artist: {}, age {} at creation", legacy.artist, legacy.artist_age_at_creation);
        msg!("");
        msg!("ORIGIN: {}", legacy.origin_city);
        msg!("The journey began with a child's brushstrokes in Sweden.");
        msg!("This painting won 1st place in a school art competition.");
        msg!("");
        msg!("SANCTUARY: {}", legacy.sanctuary_location);
        msg!("Gifted to grandmother - a woman Sara had never met.");
        msg!("She noticed the painting 'looked different every time she gazed at it.'");
        msg!("");
        msg!("THE SIEGE:");
        msg!("The family traveled to Gaza, then COVID-19 sealed the borders.");
        msg!("5 years trapped. Then October 7th. They survived.");
        msg!("");
        msg!("RETURN: {}", legacy.current_family_home);
        msg!("The family returned to Sweden. Grandmother passed away.");
        msg!("The original painting remains in her room in Cairo.");
        msg!("We choose NOT to move it. This NFT carries its soul.");
        msg!("");
        msg!("DEDICATION: {}", legacy.dedication);
        msg!("");
        msg!("Current Aura: {} (as grandmother would see it now)", legacy.current_aura.as_str());
        msg!("Physical Status: {}", legacy.physical_status);
        msg!("Enshrined: {}", if legacy.is_enshrined { "Forever" } else { "No" });
        msg!("");
        msg!("Full story: {}", legacy.story_hash);

        Ok(())
    }

    /// Update the family's current home location.
    /// Only the authority can call this - the family may move again someday.
    ///
    /// # Security
    /// - Requires authority signature
    /// - Cannot modify sanctuary_location or is_enshrined (those are sacred)
    pub fn update_family_home(
        ctx: Context<UpdateLegacy>,
        new_home: String,
    ) -> Result<()> {
        require!(new_home.len() <= MAX_CITY_LEN, LegacyError::CityNameTooLong);

        let legacy = &mut ctx.accounts.legacy_state;

        msg!("Family home updated: {} -> {}", legacy.current_family_home, new_home);
        legacy.current_family_home = new_home;

        Ok(())
    }

    /// Update the story hash if the narrative is expanded or moved.
    /// Only the authority can call this.
    pub fn update_story_hash(
        ctx: Context<UpdateLegacy>,
        new_hash: String,
    ) -> Result<()> {
        require!(new_hash.len() <= MAX_HASH_LEN, LegacyError::HashTooLong);

        let legacy = &mut ctx.accounts.legacy_state;

        msg!("Story hash updated: {} -> {}", legacy.story_hash, new_hash);
        legacy.story_hash = new_hash;

        Ok(())
    }

    /// Transfer authority to a new owner.
    /// This might be used to pass the legacy to the next generation.
    ///
    /// # Security
    /// - Requires current authority signature
    /// - New authority must be a valid pubkey (non-zero)
    pub fn transfer_authority(
        ctx: Context<UpdateLegacy>,
        new_authority: Pubkey,
    ) -> Result<()> {
        require!(
            new_authority != Pubkey::default(),
            LegacyError::InvalidAuthority
        );

        let legacy = &mut ctx.accounts.legacy_state;

        msg!(
            "Authority transferred: {} -> {}",
            legacy.authority,
            new_authority
        );
        legacy.authority = new_authority;

        Ok(())
    }
}

// =============================================================================
// ACCOUNT CONTEXTS
// =============================================================================

#[derive(Accounts)]
pub struct InitializeLegacy<'info> {
    #[account(
        init,
        payer = authority,
        space = LegacyState::SPACE,
        seeds = [b"legacy", authority.key().as_ref()],
        bump
    )]
    pub legacy_state: Account<'info, LegacyState>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateAura<'info> {
    #[account(
        mut,
        seeds = [b"legacy", legacy_state.authority.as_ref()],
        bump = legacy_state.bump
    )]
    pub legacy_state: Account<'info, LegacyState>,
    // No signer required - aura updates are permissionless by design
}

#[derive(Accounts)]
pub struct GetNarrative<'info> {
    #[account(
        seeds = [b"legacy", legacy_state.authority.as_ref()],
        bump = legacy_state.bump
    )]
    pub legacy_state: Account<'info, LegacyState>,
}

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

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/// Convert a Unix timestamp to the current hour in Cairo (UTC+2)
fn get_cairo_hour(unix_timestamp: i64) -> u8 {
    // Add Cairo offset and extract hour
    let cairo_timestamp = unix_timestamp + CAIRO_UTC_OFFSET_SECONDS;
    let seconds_in_day = cairo_timestamp % 86400;
    let hour = seconds_in_day / 3600;
    hour as u8
}

/// Determine the visual aura based on the hour in Cairo
/// This reflects grandmother's observation that the painting changed
fn determine_aura(cairo_hour: u8) -> VisualAura {
    match cairo_hour {
        5..=11 => VisualAura::SereneDawn,      // Morning light
        12..=16 => VisualAura::GoldenRadiance,  // Afternoon warmth
        17..=20 => VisualAura::MysticalShadows, // Evening mystery
        _ => VisualAura::SilentGuardian,        // Night watch (21-4)
    }
}

// =============================================================================
// CUSTOM ERRORS
// =============================================================================

#[error_code]
pub enum LegacyError {
    #[msg("Unauthorized: Only the authority can perform this action")]
    Unauthorized,

    #[msg("Title exceeds maximum length of 64 characters")]
    TitleTooLong,

    #[msg("Artist name exceeds maximum length of 64 characters")]
    ArtistNameTooLong,

    #[msg("City name exceeds maximum length of 128 characters")]
    CityNameTooLong,

    #[msg("Story hash exceeds maximum length of 128 characters")]
    HashTooLong,

    #[msg("Dedication text exceeds maximum length of 256 characters")]
    DedicationTooLong,

    #[msg("Physical status exceeds maximum length of 128 characters")]
    StatusTooLong,

    #[msg("Invalid age: must be between 1 and 120")]
    InvalidAge,

    #[msg("Invalid authority: cannot be the zero address")]
    InvalidAuthority,
}
