import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createNft,
  mplTokenMetadata,
  fetchDigitalAsset
} from "@metaplex-foundation/mpl-token-metadata";
import {
  generateSigner,
  percentAmount,
  keypairIdentity,
  publicKey
} from "@metaplex-foundation/umi";
import * as fs from "fs";

// Metadata URI from our IPFS upload
const METADATA_URI = "https://gateway.pinata.cloud/ipfs/QmY3p5oZV7ffAu4u9cFRHD44qnfykMzP5ZH5MNPJN3NHTF";

async function main() {
  console.log("\n========================================");
  console.log("  MINTING: THE RESILIENT BLOOM NFT");
  console.log("========================================\n");

  // Create Umi instance for devnet
  const umi = createUmi("https://api.devnet.solana.com")
    .use(mplTokenMetadata());

  // Load wallet
  const walletPath = process.env.HOME + "/.config/solana/id.json";
  const secretKey = new Uint8Array(JSON.parse(fs.readFileSync(walletPath, "utf8")));
  const keypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
  umi.use(keypairIdentity(keypair));

  console.log("Wallet:", keypair.publicKey);
  console.log("Metadata URI:", METADATA_URI);

  // Generate mint address
  const mint = generateSigner(umi);
  console.log("Mint Address:", mint.publicKey);

  console.log("\nMinting NFT...\n");

  // Create the NFT
  const tx = await createNft(umi, {
    mint,
    name: "The Resilient Bloom",
    symbol: "MANSOUR",
    uri: METADATA_URI,
    sellerFeeBasisPoints: percentAmount(5), // 5% royalty
    creators: [
      {
        address: keypair.publicKey,
        verified: true,
        share: 100,
      },
    ],
    isMutable: true,
  }).sendAndConfirm(umi);

  console.log("✅ NFT Minted Successfully!\n");
  console.log("========================================");
  console.log("           NFT DETAILS");
  console.log("========================================");
  console.log("Mint Address:", mint.publicKey);
  console.log("Signature:", Buffer.from(tx.signature).toString("base64"));

  // Fetch the NFT to verify
  const asset = await fetchDigitalAsset(umi, mint.publicKey);

  console.log("\nOn-chain Metadata:");
  console.log("  Name:", asset.metadata.name);
  console.log("  Symbol:", asset.metadata.symbol);
  console.log("  URI:", asset.metadata.uri);
  console.log("  Royalty:", Number(asset.metadata.sellerFeeBasisPoints) / 100, "%");

  console.log("\n========================================");
  console.log("           EXPLORER LINKS");
  console.log("========================================");
  console.log("NFT:", `https://explorer.solana.com/address/${mint.publicKey}?cluster=devnet`);
  console.log("Token:", `https://explorer.solana.com/address/${mint.publicKey}/tokens?cluster=devnet`);

  console.log("\n========================================");
  console.log("         VIEW ON MARKETPLACES");
  console.log("========================================");
  console.log("Solscan:", `https://solscan.io/token/${mint.publicKey}?cluster=devnet`);

  console.log("\n\"The canvas stays with you; its soul travels the world.\"\n");
}

main().catch((err) => {
  console.error("Error minting NFT:", err);
  process.exit(1);
});
