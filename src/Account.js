import { ethers } from "ethers";
import React,{useEffect, useState} from "react";

const Account = (props) => {

    console.log("props",props);
    const [balance, setBalance] = useState(0);
    useEffect(() => {
        if (props.currentAccount) {
            getBalanceAccount();
            }
        }, [props.currentAccount]);
        const getBalanceAccount = async () => {
            if (props.currentAccount) {
                const balance = await props.contractInstance.getBalance({
                    gasLimit: 2000000, // Adjust this value as needed
                  });
                  
              const newbal=ethers.utils.formatEther(balance);
              console.log("balance",newbal);
               setBalance(newbal);
            }
          }
        const handleTokens = async () => {
            if (props.contractInstance) {
                try {
                    console.log("contract");
                    // Convert the value to a string before passing it to parseEther
                    const valueInEther = "0.00000001";
                    const valueInWei = ethers.utils.parseEther(valueInEther);
        
                    const transaction = await props.contractInstance.receiveTokens({
                        value: valueInWei,
                        gasLimit: 2000000,
                    });
        
                    // Wait for the transaction to be mined
                    await transaction.wait();
        
                    // Add logic to handle success
                    console.log('Tokens received successfully!');
                } catch (error) {
                    // Add logic to handle error
                    console.error('Error receiving tokens:', error);
                }
            }
        };
        
    return (
        // <div className="p-4 max-w-full border border-gray-300 rounded-lg flex flex-col items-center">
        // <h3 className="text-lg font-semibold mb-2">Connected Account:</h3>
        // <p className="text-sm mb-4">{props.currentAccount}</p>
        // <p className="text-sm mb-4">Your balance is: {balance}</p>
        // <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        // >
        //     Receive Tokens
        // </button>
        <div className="p-4 flex flex-col items-start">
            <h3 className="text-lg font-semibold mb-2">Connected Account:</h3>
            <p className="text-sm font-medium mb-2 w-48">{props.currentAccount}</p>
            <p className="text-sm font-medium mb-2">Your balance: {balance}</p>
            <button className="w-full bg-indigo-900 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
            onClick={handleTokens}>
                Receive Tokens
            </button>
        </div>
    

    );
    };

export default Account;