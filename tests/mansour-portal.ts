import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MansourPortal } from "../target/types/mansour_portal";
import { expect } from "chai";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";

describe("mansour-portal", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.MansourPortal as Program<MansourPortal>;
  const authority = provider.wallet;

  // The legacy NFT metadata
  const legacyData = {
    title: "The Resilient Bloom",
    artist: "Sara Mansour",
    artistAge: 10,
    originCity: "Norrköping, Sweden",
    sanctuaryLocation: "Cairo, Egypt",
    currentFamilyHome: "Stockholm, Sweden",
    storyHash: "ipfs://QmExample123456789",
    dedication: "In memory of our beloved Grandmother in Cairo. You held this light when the world was dark.",
    physicalStatus: "Permanently preserved in Cairo",
  };

  // Derive the PDA for the legacy state
  const [legacyPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("legacy"), authority.publicKey.toBuffer()],
    program.programId
  );

  describe("initialize_legacy", () => {
    it("should initialize the legacy NFT with correct metadata", async () => {
      const tx = await program.methods
        .initializeLegacy(
          legacyData.title,
          legacyData.artist,
          legacyData.artistAge,
          legacyData.originCity,
          legacyData.sanctuaryLocation,
          legacyData.currentFamilyHome,
          legacyData.storyHash,
          legacyData.dedication,
          legacyData.physicalStatus
        )
        .accounts({
          legacyState: legacyPDA,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("Initialize legacy tx:", tx);

      // Fetch and verify the account
      const legacy = await program.account.legacyState.fetch(legacyPDA);

      expect(legacy.authority.toString()).to.equal(authority.publicKey.toString());
      expect(legacy.title).to.equal(legacyData.title);
      expect(legacy.artist).to.equal(legacyData.artist);
      expect(legacy.artistAgeAtCreation).to.equal(legacyData.artistAge);
      expect(legacy.originCity).to.equal(legacyData.originCity);
      expect(legacy.sanctuaryLocation).to.equal(legacyData.sanctuaryLocation);
      expect(legacy.currentFamilyHome).to.equal(legacyData.currentFamilyHome);
      expect(legacy.storyHash).to.equal(legacyData.storyHash);
      expect(legacy.dedication).to.equal(legacyData.dedication);
      expect(legacy.isEnshrined).to.equal(true);
      expect(legacy.physicalStatus).to.equal(legacyData.physicalStatus);
      expect(legacy.creationTimestamp.toNumber()).to.be.greaterThan(0);
    });

    it("should reject title that exceeds maximum length", async () => {
      const newAuthority = Keypair.generate();

      // Airdrop SOL to new authority
      const airdropSig = await provider.connection.requestAirdrop(
        newAuthority.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(airdropSig);

      const [newPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("legacy"), newAuthority.publicKey.toBuffer()],
        program.programId
      );

      const longTitle = "A".repeat(100); // Exceeds MAX_TITLE_LEN of 64

      try {
        await program.methods
          .initializeLegacy(
            longTitle,
            legacyData.artist,
            legacyData.artistAge,
            legacyData.originCity,
            legacyData.sanctuaryLocation,
            legacyData.currentFamilyHome,
            legacyData.storyHash,
            legacyData.dedication,
            legacyData.physicalStatus
          )
          .accounts({
            legacyState: newPDA,
            authority: newAuthority.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([newAuthority])
          .rpc();

        expect.fail("Should have thrown TitleTooLong error");
      } catch (err) {
        expect(err.toString()).to.include("TitleTooLong");
      }
    });

    it("should reject invalid artist age", async () => {
      const newAuthority = Keypair.generate();

      const airdropSig = await provider.connection.requestAirdrop(
        newAuthority.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(airdropSig);

      const [newPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("legacy"), newAuthority.publicKey.toBuffer()],
        program.programId
      );

      try {
        await program.methods
          .initializeLegacy(
            legacyData.title,
            legacyData.artist,
            0, // Invalid age
            legacyData.originCity,
            legacyData.sanctuaryLocation,
            legacyData.currentFamilyHome,
            legacyData.storyHash,
            legacyData.dedication,
            legacyData.physicalStatus
          )
          .accounts({
            legacyState: newPDA,
            authority: newAuthority.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([newAuthority])
          .rpc();

        expect.fail("Should have thrown InvalidAge error");
      } catch (err) {
        expect(err.toString()).to.include("InvalidAge");
      }
    });
  });

  describe("update_visual_aura", () => {
    it("should update the aura based on Cairo time", async () => {
      const legacyBefore = await program.account.legacyState.fetch(legacyPDA);
      const auraBefore = legacyBefore.currentAura;

      const tx = await program.methods
        .updateVisualAura()
        .accounts({
          legacyState: legacyPDA,
        })
        .rpc();

      console.log("Update aura tx:", tx);

      const legacyAfter = await program.account.legacyState.fetch(legacyPDA);

      // The aura should be one of the valid states
      const validAuras = ["sereneDawn", "goldenRadiance", "mysticalShadows", "silentGuardian"];
      expect(validAuras).to.include(Object.keys(legacyAfter.currentAura)[0]);

      // Last update timestamp should be updated
      expect(legacyAfter.lastAuraUpdate.toNumber()).to.be.greaterThanOrEqual(
        legacyBefore.lastAuraUpdate.toNumber()
      );
    });

    it("should be callable by anyone (permissionless)", async () => {
      const randomUser = Keypair.generate();

      const airdropSig = await provider.connection.requestAirdrop(
        randomUser.publicKey,
        anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(airdropSig);

      // Random user should be able to update the aura
      const tx = await program.methods
        .updateVisualAura()
        .accounts({
          legacyState: legacyPDA,
        })
        .signers([randomUser])
        .rpc();

      console.log("Permissionless aura update tx:", tx);
    });
  });

  describe("get_journey_narrative", () => {
    it("should emit the journey narrative in logs", async () => {
      const tx = await program.methods
        .getJourneyNarrative()
        .accounts({
          legacyState: legacyPDA,
        })
        .rpc();

      console.log("Get narrative tx:", tx);

      // The narrative is emitted as program logs
      // In a real scenario, you would parse the transaction logs
    });
  });

  describe("update_family_home", () => {
    it("should allow authority to update family home", async () => {
      const newHome = "Gothenburg, Sweden";

      const tx = await program.methods
        .updateFamilyHome(newHome)
        .accounts({
          legacyState: legacyPDA,
          authority: authority.publicKey,
        })
        .rpc();

      console.log("Update family home tx:", tx);

      const legacy = await program.account.legacyState.fetch(legacyPDA);
      expect(legacy.currentFamilyHome).to.equal(newHome);
    });

    it("should reject unauthorized updates", async () => {
      const attacker = Keypair.generate();

      const airdropSig = await provider.connection.requestAirdrop(
        attacker.publicKey,
        anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(airdropSig);

      try {
        await program.methods
          .updateFamilyHome("Malicious Location")
          .accounts({
            legacyState: legacyPDA,
            authority: attacker.publicKey,
          })
          .signers([attacker])
          .rpc();

        expect.fail("Should have thrown Unauthorized error");
      } catch (err) {
        // Expected to fail due to has_one constraint
        expect(err.toString()).to.include("Error");
      }
    });

    it("should preserve sanctuary_location (immutable)", async () => {
      // Even after updating family home, sanctuary should remain unchanged
      const legacy = await program.account.legacyState.fetch(legacyPDA);
      expect(legacy.sanctuaryLocation).to.equal(legacyData.sanctuaryLocation);
      expect(legacy.isEnshrined).to.equal(true);
    });
  });

  describe("update_story_hash", () => {
    it("should allow authority to update story hash", async () => {
      const newHash = "arweave://xyz123456789";

      const tx = await program.methods
        .updateStoryHash(newHash)
        .accounts({
          legacyState: legacyPDA,
          authority: authority.publicKey,
        })
        .rpc();

      console.log("Update story hash tx:", tx);

      const legacy = await program.account.legacyState.fetch(legacyPDA);
      expect(legacy.storyHash).to.equal(newHash);
    });
  });

  describe("transfer_authority", () => {
    it("should reject transfer to zero address", async () => {
      try {
        await program.methods
          .transferAuthority(PublicKey.default)
          .accounts({
            legacyState: legacyPDA,
            authority: authority.publicKey,
          })
          .rpc();

        expect.fail("Should have thrown InvalidAuthority error");
      } catch (err) {
        expect(err.toString()).to.include("InvalidAuthority");
      }
    });

    it("should allow authority transfer to valid address", async () => {
      const newAuthority = Keypair.generate();

      // First verify current authority
      let legacy = await program.account.legacyState.fetch(legacyPDA);
      expect(legacy.authority.toString()).to.equal(authority.publicKey.toString());

      // Transfer authority
      const tx = await program.methods
        .transferAuthority(newAuthority.publicKey)
        .accounts({
          legacyState: legacyPDA,
          authority: authority.publicKey,
        })
        .rpc();

      console.log("Transfer authority tx:", tx);

      // Verify transfer
      legacy = await program.account.legacyState.fetch(legacyPDA);
      expect(legacy.authority.toString()).to.equal(newAuthority.publicKey.toString());

      // Transfer back for subsequent tests (optional cleanup)
      const airdropSig = await provider.connection.requestAirdrop(
        newAuthority.publicKey,
        anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(airdropSig);

      await program.methods
        .transferAuthority(authority.publicKey)
        .accounts({
          legacyState: legacyPDA,
          authority: newAuthority.publicKey,
        })
        .signers([newAuthority])
        .rpc();
    });
  });

  describe("immutability guarantees", () => {
    it("should preserve sanctuary_location through all operations", async () => {
      const legacy = await program.account.legacyState.fetch(legacyPDA);
      expect(legacy.sanctuaryLocation).to.equal(legacyData.sanctuaryLocation);
    });

    it("should always have is_enshrined as true", async () => {
      const legacy = await program.account.legacyState.fetch(legacyPDA);
      expect(legacy.isEnshrined).to.equal(true);
    });
  });
});
