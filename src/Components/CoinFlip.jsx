import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './CoinFlip.css'; // Include this for animations

const CoinFlip = ({ setUpdatedBalance }) => {
  const [outcome, setOutcome] = useState('');
  const [isFlipping, setIsFlipping] = useState(false);
  const [isSelectedHead, setIsSelectedHead] = useState(null);
  const [betAmount, setBetAmount] = useState(''); // State for bet amount
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [error, setError] = useState('');
  const [win, setWin] = useState('');
  const [lost, setLost] = useState('');
  const[isLoading,setIsloading] = useState(false)

  const contractAddress = "0xacef25a70a2aa2e4e0f8247f0e06c0f39188983a";
  const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "won",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "CoinFlippedData",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "message",
          "type": "string"
        }
      ],
      "name": "ErrorOccurred",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "side",
          "type": "bool"
        }
      ],
      "name": "placeBet",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "newNum",
          "type": "uint256"
        }
      ],
      "name": "setNum",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "betAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getContractBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getPlayerBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "num",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "player",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "won",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
    ]
  useEffect(() => {
    const initContract = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contracts = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contracts);
        setProvider(provider);
        setSigner(signer);
      } catch (error) {
        console.error("Error initializing contract:", error);
        setError('Failed to initialize contract.');
      }
    };

    initContract();
  }, []);

  const flipCoin = async () => {
    if (isSelectedHead === null) {
      alert('Please Select either heads or tails');
      return;
    }
  
    if (!betAmount || parseFloat(betAmount) <= 0) {
      alert('Please enter a valid bet amount');
      return;
    }
  
    setOutcome('');
    setWin('');
    setLost('');
    setIsFlipping(true); // Start the animation
    setIsloading(true)
  
    try {
      const parsedBetAmount = ethers.parseEther(betAmount);
      const playerBalance = await contract.getPlayerBalance();
      const contractBalance = await contract.getContractBalance();
  
      console.log("Contract balance:", ethers.formatEther(contractBalance));
      console.log("Player balance:", ethers.formatEther(playerBalance));
  
      // Place the bet on the smart contract
      const tx = await contract.placeBet(isSelectedHead, { value: parsedBetAmount });
      await tx.wait(); // Wait for the transaction to be confirmed
  
      // Get the result from the contract
      const won = await contract.won();
  
      if (won) {
        setWin('You won this bet');
      } else {
        setLost('You lost this bet');
      }
  
      // Set outcome based on selection and result
      if (isSelectedHead === true && won) {
        setOutcome("HEADS");
      } else if (isSelectedHead === true && !won) {
        setOutcome("TAILS");
      } else if (isSelectedHead === false && won) {
        setOutcome("TAILS");
      } else if (isSelectedHead === false && !won) {
        setOutcome("HEADS");
      }

      const playerbalance = await contract.getPlayerBalance();
      const etherPlayerBalance  = ethers.formatEther(playerbalance)
      setUpdatedBalance(etherPlayerBalance)


    } catch (error) {
      console.error("Error placing bet: [please place a bet of 0.001 and try ] ", error);
      setError(`Failed to place bet. [please place a bet of 0.001 and try ]${error.message || 'Unknown error'}`);
    } finally {
      setIsFlipping(false); // Stop the animation
    setIsloading(false)

    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
     
   {
    !isLoading &&    <div
    className={`outcome w-[200px] h-[200px] bg-[#d8c322] mb-[50px] rounded-full border-dotted border-3 border-[#1c1c1c] flex items-center justify-center text-[32px] font-bold text-[#222] shadow-lg transition-transform duration-1000 ${
      isFlipping ? 'flip toss' : ''
    }`}
  >
    {outcome}
  </div>
   }

      {
        isLoading && <span className='loader w-[200px] h-[200px]  mb-[50px] rounded-full border-dotted border-3 border-[#1c1c1c]'></span>

      }


      <div className="flex space-x-4 mb-4">
        <button
          className={`py-2 px-4 text-white font-bold text-xs uppercase ${isSelectedHead === true ? 'bg-orange-500' : 'bg-transparent border border-orange-500'}`}
          onClick={() => setIsSelectedHead(true)}
        >
          Heads
        </button>
        <button
          className={`py-2 px-4 text-white font-bold text-xs uppercase ${isSelectedHead === false ? 'bg-orange-500' : 'bg-transparent border border-orange-500'}`}
          onClick={() => setIsSelectedHead(false)}
        >
          Tails
        </button>
      </div>
      <div className="mb-4">
        <input
          type="number"
          placeholder="Bet amount in ETH"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          className="py-2 px-4 text-black border border-gray-600 rounded"
        />
      </div>
      <button
        className="relative bg-transparent border-2 border-green-500 py-3 px-6 text-white uppercase font-bold tracking-widest text-xs cursor-pointer transition-transform duration-200 hover:before:height-full hover:scale-105"
        onClick={flipCoin}
      >
        Flip Coin
        <span className="absolute left-0 bottom-0 w-full h-0 bg-green-500 transition-all duration-200 z-[-1]"></span>
      </button>
      {
        
      }
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {win && <p className="text-green-500 mt-4">{win}</p>}
      {lost && <p className="text-red-600 mt-4">{lost}</p>}
    </div>
  );
};

export default CoinFlip;
