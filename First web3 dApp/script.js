async function connectWallet() {
    // Check if MetaMask is installed
    if (window.ethereum) {
        try {
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            const balance = await provider.getBalance(address);
            
            // Update the webpage
            document.getElementById("walletInfo").innerHTML = 
                `Connected: ${address}&lt;br&gt;Balance: ${ethers.utils.formatEther(balance)} ETH`;
        } catch (error) {
            alert("Error connecting: " + error.message);
        }
    } else {
        alert("Please install MetaMask!");
    }
}

// Link the button to our function
document.getElementById("connectButton").onclick = connectWallet;
// Send ETH function
document.getElementById("sendButton").onclick = async function() {
    const receiver = document.getElementById("receiverAddress").value;
    const amount = document.getElementById("sendAmount").value;

    if (!receiver || !amount) {
        alert("Fill all fields!");
        return;
    }

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        // Convert ETH to wei (1 ETH = 10^18 wei)
        const tx = await signer.sendTransaction({
            to: receiver,
            value: ethers.utils.parseEther(amount)
        });

        document.getElementById("transactionStatus").innerHTML = 
            `✅ Sent ${amount} ETH! &lt;a href="https://sepolia.etherscan.io/tx/${tx.hash}" target="_blank"&gt;View on Etherscan&lt;/a&gt;`;
    } catch (error) {
        document.getElementById("transactionStatus").innerHTML = 
            `❌ Error: ${error.message}`;
    }
};
async function resolveENS(name) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
        // Resolve ENS name to address (or return original input if it's already 0x...)
        const address = await provider.resolveName(name);
        return address || name; // Fallback to raw input if ENS fails
    } catch {
        return name; // Not an ENS name
    }
}
document.getElementById("sendButton").onclick = async function() {
    const receiverInput = document.getElementById("receiverInput").value;
    const amount = document.getElementById("sendAmount").value;
    
    if (!receiverInput || !amount) {
        alert("Fill all fields!");
        return;
    }

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        // Resolve ENS or use raw input
        const receiver = await resolveENS(receiverInput);

        const tx = await signer.sendTransaction({
            to: receiver,
            value: ethers.utils.parseEther(amount)
        });

        document.getElementById("transactionStatus").innerHTML = 
            `✅ Sent ${amount} ETH to ${receiverInput}! <a href="https://sepolia.etherscan.io/tx/${tx.hash}" target="_blank">View TX</a>`;
    } catch (error) {
        document.getElementById("transactionStatus").innerHTML = 
            `❌ Error: ${error.message}`;
    }
};
async function getGasPrices() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const feeData = await provider.getFeeData();
    const gasPriority = document.getElementById("gasPriority").value;
const gasPrices = await getGasPrices();
const tx = await signer.sendTransaction({
    to: receiver,
    value: ethers.utils.parseEther(amount),
    gasPrice: gasPrices[gasPriority] // Apply selected fee
});

    return {
        low: feeData.gasPrice.mul(90).div(100),    // 10% cheaper
        medium: feeData.gasPrice,                  // Current market rate
        high: feeData.gasPrice.mul(120).div(100)   // 20% priority
    };
}