import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, Connection, clusterApiUrl } from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

// Load IDL
const idlPath = path.join(__dirname, "../target/idl/mansour_portal.json");
const idl = JSON.parse(fs.readFileSync(idlPath, "utf8"));

const PROGRAM_ID = new PublicKey("DuusvRtdzX2epK2F2WGdDwCktWoCWHaLg6zWXjTmVPqA");

async function main() {
  // Connect to devnet
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Load wallet
  const walletPath = process.env.HOME + "/.config/solana/id.json";
  const walletKeypair = anchor.web3.Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(walletPath, "utf8")))
  );

  const wallet = new anchor.Wallet(walletKeypair);
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  anchor.setProvider(provider);

  const program = new anchor.Program(idl, provider) as any;

  console.log("\n========================================");
  console.log("  MANSOUR'S PORTAL: FROM SWEDEN TO GAZA");
  console.log("========================================\n");
  console.log("Program ID:", PROGRAM_ID.toString());
  console.log("Authority:", wallet.publicKey.toString());

  // Derive PDA
  const [legacyPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("legacy"), wallet.publicKey.toBuffer()],
    PROGRAM_ID
  );
  console.log("Legacy PDA:", legacyPDA.toString());

  // Check if already initialized
  let legacy: any;
  try {
    legacy = await program.account.legacyState.fetch(legacyPDA);
    console.log("\n✅ Legacy NFT already initialized!");
  } catch {
    console.log("\n📝 Initializing Legacy NFT...\n");

    // Initialize the legacy
    const tx = await program.methods
      .initializeLegacy(
        "The Resilient Bloom",
        "Sara Mansour",
        10,
        "Norrköping, Sweden",
        "Cairo, Egypt",
        "Stockholm, Sweden",
        "ipfs://placeholder_for_testing",
        "In loving memory of Grandmother",
        "Permanently preserved in Cairo"
      )
      .accounts({
        legacyState: legacyPDA,
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Legacy initialized! Tx:", tx);
    console.log("   Explorer: https://explorer.solana.com/tx/" + tx + "?cluster=devnet\n");

    // Fetch the account
    legacy = await program.account.legacyState.fetch(legacyPDA);
  }

  // Display legacy info
  console.log("\n========================================");
  console.log("        THE PAINTING'S LEGACY");
  console.log("========================================");
  console.log(`Title: ${legacy.title}`);
  console.log(`Artist: ${legacy.artist}, age ${legacy.artistAgeAtCreation}`);
  console.log(`Origin: ${legacy.originCity}`);
  console.log(`Sanctuary: ${legacy.sanctuaryLocation}`);
  console.log(`Family Home: ${legacy.currentFamilyHome}`);
  console.log(`Enshrined: ${legacy.isEnshrined ? "Forever" : "No"}`);
  console.log(`Dedication: ${legacy.dedication}`);

  // Update visual aura
  console.log("\n🌅 Updating Visual Aura based on Cairo time...\n");

  const auraTx = await program.methods
    .updateVisualAura()
    .accounts({
      legacyState: legacyPDA,
    })
    .rpc();

  console.log("✅ Aura updated! Tx:", auraTx);

  // Fetch updated state
  const updatedLegacy = await program.account.legacyState.fetch(legacyPDA);

  // Determine aura name
  const auraKey = Object.keys(updatedLegacy.currentAura)[0];
  const auraNames: Record<string, string> = {
    sereneDawn: "Serene Dawn (Morning Light)",
    goldenRadiance: "Golden Radiance (Afternoon Sun)",
    mysticalShadows: "Mystical Shadows (Evening Mystery)",
    silentGuardian: "Silent Guardian (Night Watch)",
  };

  console.log(`\n🎨 Current Visual Aura: ${auraNames[auraKey] || auraKey}`);

  // Calculate Cairo time
  const now = new Date();
  const cairoOffset = 2; // UTC+2
  const cairoHour = (now.getUTCHours() + cairoOffset) % 24;
  console.log(`   Cairo Time: ${cairoHour}:${now.getUTCMinutes().toString().padStart(2, '0')}`);

  // Get journey narrative (view function)
  console.log("\n========================================");
  console.log("       THE JOURNEY NARRATIVE");
  console.log("========================================");

  const narrativeTx = await program.methods
    .getJourneyNarrative()
    .accounts({
      legacyState: legacyPDA,
    })
    .rpc();

  console.log("\n📖 Journey Narrative emitted in tx logs:");
  console.log("   https://explorer.solana.com/tx/" + narrativeTx + "?cluster=devnet");

  // Final summary
  console.log("\n========================================");
  console.log("           DEPLOYMENT COMPLETE");
  console.log("========================================");
  console.log(`✅ Program ID: ${PROGRAM_ID.toString()}`);
  console.log(`✅ Legacy PDA: ${legacyPDA.toString()}`);
  console.log(`✅ Current Aura: ${auraNames[auraKey] || auraKey}`);
  console.log(`✅ Explorer: https://explorer.solana.com/address/${PROGRAM_ID.toString()}?cluster=devnet`);
  console.log("\n\"The canvas stays with you; its soul travels the world.\"\n");
}

main().catch(console.error);
