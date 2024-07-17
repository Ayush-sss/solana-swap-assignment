const solanaWeb3 = require('@solana/web3.js');
const splToken = require('@solana/spl-token');

async function swapTokens() {

    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');
    
    const fromWallet = solanaWeb3.Keypair.generate();
    const toWallet = solanaWeb3.Keypair.generate();
    
    const airdropSignature = await connection.requestAirdrop(fromWallet.publicKey, solanaWeb3.LAMPORTS_PER_SOL);
    await connection.confirmTransaction(airdropSignature);

    const fromToken = await splToken.Token.createMint(
        connection,
        fromWallet,
        fromWallet.publicKey,
        null,
        9,
        splToken.TOKEN_PROGRAM_ID
    );

    const toToken = await splToken.Token.createMint(
        connection,
        toWallet,
        toWallet.publicKey,
        null,
        9,
        splToken.TOKEN_PROGRAM_ID
    );

    const fromTokenAccount = await fromToken.getOrCreateAssociatedAccountInfo(fromWallet.publicKey);
    const toTokenAccount = await toToken.getOrCreateAssociatedAccountInfo(toWallet.publicKey);

    await fromToken.mintTo(
        fromTokenAccount.address,
        fromWallet.publicKey,
        [],
        1000000
    );

    console.log('Swapping tokens...');

    await fromToken.transfer(
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        [],
        1000000
    );

    console.log('Tokens swapped successfully!');
}

swapTokens().catch(err => {
    console.error(err);
});
