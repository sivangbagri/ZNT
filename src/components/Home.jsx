import React, { useEffect, useState } from "react";
import Web3 from "web3";
import znt from "../assets/znt_token.png"
function Home() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [clickCount, setClickCount] = useState(0);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const contractAddress = "0xb465de4991Ca217b3a8Fc337A8a4DaC5054AbB4f";
  const contractABI = [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "initialSupply",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "allowance",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "needed",
          type: "uint256",
        },
      ],
      name: "ERC20InsufficientAllowance",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "sender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "balance",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "needed",
          type: "uint256",
        },
      ],
      name: "ERC20InsufficientBalance",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "approver",
          type: "address",
        },
      ],
      name: "ERC20InvalidApprover",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "receiver",
          type: "address",
        },
      ],
      name: "ERC20InvalidReceiver",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "ERC20InvalidSender",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
      ],
      name: "ERC20InvalidSpender",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
      ],
      name: "allowance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      window.ethereum.enable().then((accounts) => {
        setAccount(accounts[0]);
        const contractInstance = new web3Instance.eth.Contract(
          contractABI,
          contractAddress
        );
        setContract(contractInstance);
      });
    } else {
      alert("Please install MetaMask!");
    }
    getBalance();
  }, []);
  const getBalance = async () => {
    if (contract) {
      const result = await contract.methods.balanceOf(account).call();
      setBalance(web3.utils.fromWei(result, "ether"));
    } else {
      console.log("no contract found ", contract);
    }
  };

  const handleClick = async () => {
    setClickCount((prevCount) => prevCount + 1);
    if (clickCount + 1 === 10) {
      setLoading(true);

      await sendZNT();
      setLoading(false);
    }
    if (clickCount > 10) setClickCount(0);
  };

  const sendZNT = async () => {
    const amount = web3.utils.toWei("1", "ether"); // Sending 1 ZNT
    try {
      await contract.methods.transfer(account, amount).send({ from: account });
      alert("1 ZNT sent to your wallet!");
    } catch (error) {
      alert(error);
    }
    setClickCount(0);

    getBalance();
  };
  return (
    <div className="flex flex-col items-center justify-center h-auto bg-slate-800 text-white p-10">
      <div className="mb-8 w-full max-w-md">
        <div className="bg-slate-700 p-6 rounded-lg shadow-md">
          <p className="text-lg">
            Wallet Address:
            <span className="font-extralight text-green-400"> {account}</span>
          </p>
          <p className="text-lg mt-4">
            ZNT Balance:
            <span className="font-extralight text-green-400 ml-2">
              {balance}{" "}
            </span>
            {balance ? "ether" : "💭"}
          </p>
        </div>
      </div>

      <button
        onClick={getBalance}
        className="bg-purple-500 p-3 rounded-lg text-white font-medium text-lg mt-4 w-full max-w-xs hover:bg-purple-600 transition duration-300"
      >
        Get Balance
      </button>

      <p className="text-lg my-7">Score: {clickCount}</p>

      {!loading && (
        <button
          onClick={handleClick}
          className="bg-purple-500 p-3 rounded-lg text-white font-medium text-lg w-full max-w-xs hover:bg-purple-600 transition duration-300"
        >
          Click me
        </button>
      )}
      {loading && "Check your metamask ... 🔃 "}

      <p className="font-light text-sm mt-3">
        {" "}
        10 clicks and you get a ZNT token. ✌️
      </p>

      <img src={znt} />
    </div>
  );
}

export default Home;
