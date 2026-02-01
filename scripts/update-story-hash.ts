import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

const idlPath = path.join(__dirname, "../target/idl/mansour_portal.json");
const idl = JSON.parse(fs.readFileSync(idlPath, "utf8"));

const PROGRAM_ID = new PublicKey("DuusvRtdzX2epK2F2WGdDwCktWoCWHaLg6zWXjTmVPqA");
const METADATA_URI = "ipfs://QmY3p5oZV7ffAu4u9cFRHD44qnfykMzP5ZH5MNPJN3NHTF";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

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

  const [legacyPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("legacy"), wallet.publicKey.toBuffer()],
    PROGRAM_ID
  );

  console.log("\n========================================");
  console.log("  UPDATING STORY HASH ON-CHAIN");
  console.log("========================================\n");
  console.log("Program ID:", PROGRAM_ID.toString());
  console.log("Legacy PDA:", legacyPDA.toString());
  console.log("New URI:", METADATA_URI);

  // Update story hash
  const tx = await program.methods
    .updateStoryHash(METADATA_URI)
    .accounts({
      legacyState: legacyPDA,
      authority: wallet.publicKey,
    })
    .rpc();

  console.log("\n✅ Story hash updated!");
  console.log("Transaction:", tx);
  console.log("Explorer: https://explorer.solana.com/tx/" + tx + "?cluster=devnet");

  // Verify update
  const legacy = await program.account.legacyState.fetch(legacyPDA);
  console.log("\n========================================");
  console.log("  VERIFICATION");
  console.log("========================================");
  console.log("On-chain story_hash:", legacy.storyHash);
  console.log("\n✅ Contract updated successfully!\n");
}

main().catch(console.error);
