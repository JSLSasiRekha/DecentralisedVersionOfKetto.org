import React, { useEffect } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Home from "./Home";
import constants from "./constants";
import { ethers } from "ethers";
import Voting from "./Voting";
import CreateCampaign from "./createCampaign";
import ContributeForm from "./ContributionForm";
import HeaderComponent from "./Header";
import Account from "./Account";;

function App() {
  const [currentAccount, setCurrentAccount] = React.useState("");
  const [contractInstance, setContractInstance] = React.useState(null);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            constants.contractAddress,
            constants.contractABI,
            signer
          );
          setContractInstance(contract);

          // Function to update the current account
          const updateAccounts = async () => {
            const accounts = await provider.listAccounts();
            setCurrentAccount(accounts[0]);
          };

          // Initial account load
          updateAccounts();

          // Listen for account changes
          window.ethereum.on("accountsChanged", updateAccounts);
        } catch (error) {
          console.error("Error loading blockchain data:", error);
        }
      } else {
        window.alert("Please install MetaMask");
      }
    };

    loadBlockchainData();
  }, []); // Runs only once on component mount

 

  return (
    <>
    <HeaderComponent  currentAccount={currentAccount}contractInstance={contractInstance}/>
   
    <BrowserRouter>
      <div>

        <Routes>
          <Route path="/" element={<Home currentAccount={currentAccount}contractInstance={contractInstance}/>} />
          <Route path="/voting" element={<Voting currentAccount={currentAccount}contractInstance={contractInstance} />} />
          <Route path="/contribute/:index" element={<ContributeForm  currentAccount={currentAccount}contractInstance={contractInstance}/>} />
          <Route path="/createCampaign" element={<CreateCampaign currentAccount={currentAccount}contractInstance={contractInstance}/>} />
        </Routes>
      </div>
    </BrowserRouter>
    </>
  );
}

export default App;