import React, { useState } from 'react';
import { ethers } from 'ethers';
import Navbar from './NavBar';


function Connection() {
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);

    async function handleConnect() {
        if (!window.ethereum) {
            alert('Kindly install MetaMask');
            return;
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        const provider = new ethers.BrowserProvider(window.ethereum);
        const balanceInWei = await provider.getBalance(accounts[0]);
        const balanceInEther = ethers.formatEther(balanceInWei);

        setBalance(balanceInEther);
    }

    return (
        <div>
            <Navbar account={account} balance={balance} onConnect={handleConnect} />
            {!balance && (
                <main className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white flex items-center justify-center h-screen">
                    <div className="bg-white bg-opacity-10 backdrop-blur-3xl p-8 rounded-2xl shadow-xl border border-gray-700 text-center max-w-md mx-auto">
                        <h1 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">Connect Your Wallet</h1>
                        <p className="mb-8 text-lg">To interact with the application, please connect your MetaMask wallet.</p>
                        <button 
                            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                            onClick={handleConnect}
                        >
                            Connect MetaMask
                        </button>
                    </div>
                </main>
            )}
            {balance && (
                <main className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white flex items-center justify-center h-screen">
                    {/* Coin flip game logic goes here */}
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">Welcome to the Coin Flip Game!</h1>
                        {/* Add coin flip game UI and logic here */}
                    </div>
                </main>
            )}
        </div>
    );
}

export default Connection;
