import React, { useEffect,useState } from "react";
import { ethers } from "ethers";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'

const Voting = (props) => {
    const [account, setAccount] = useState(props.currentAccount);
    const [fundraisingContract, setFundraisingContract] = useState(props.contractInstance);
    const [projects, setProjects] = useState([]);
    const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
    const [sufficientBalance,setSufficientBalance]=useState(true);
    const [success,setSuccess]=useState(false);
  
    useEffect(() => {
      const handleDocumentClick = () => {
        if (success) {
          setSuccess(false);
        }
      };
  
      document.addEventListener("click", handleDocumentClick);
  
      // Clean up the event listener when the component unmounts
      return () => {
        document.removeEventListener("click", handleDocumentClick);
      };
    }, [success]);
      
    useEffect(() => {
        if (props.contractInstance) {
            setFundraisingContract(props.contractInstance)
          fetchProjectDetails();
          getBalanceAccount();
        }

      }, [props.contractInstance]);
      console.log("contract: ", fundraisingContract);
    
      useEffect(() => {
        if (props.currentAccount) {
          console.log("currentAccount: ", props.currentAccount);
        }
      }, [props.currentAccount]);
     
      
    const fetchProjectDetails = async () => {
        console.log("contract",fundraisingContract)
        const projectsLength = (await props.contractInstance.getProjectsCount()).toNumber();  
        const fetchedProjects = [];
        console.log("length",projectsLength);
      
        for (let i = 0; i < projectsLength; i++) {
            const projectDetails = await props.contractInstance.getProjectDetails(i);
           console.log("project details",projectDetails);
            const ownerAddress = projectDetails[0];
            const goalAmountWei = projectDetails[1];
            const donatedAmountWei = projectDetails[2];
            // const newbal=ethers.utils.formatEther(projectDetails[6]);
            const numberOfVotes = projectDetails[4].toNumber();
          const time = projectDetails[7].toNumber();

            // Convert goal amount and donated amount from wei to Ether
            const goalAmount = ethers.utils.formatEther(goalAmountWei);
            const donatedAmount = ethers.utils.formatEther(donatedAmountWei);

            const formattedDetails = {
            OwnerAddress: ownerAddress,
            GoalAmount: goalAmount,
            DonatedAmount: donatedAmount,
            NoOfVotes: numberOfVotes,
            Time: time,
             };

          fetchedProjects.push(formattedDetails);
          console.log("project details:",formattedDetails); 
        }
      
        setProjects(fetchedProjects);
        //console.log("project details",projects); 
      };
      const getBalanceAccount = async () => {
        if (props.currentAccount) {
          const balance = await props.contractInstance.getBalance({
            gasLimit:2000000, // Add extra gas to the estimated gas limit
          });
          const newbal=ethers.utils.formatEther(balance);
          if(newbal<=0)
          setSufficientBalance(false);
          console.log("balance",sufficientBalance);
         ;
        }
      }

      const handleVote = async () => {
        getBalanceAccount();
        if (sufficientBalance &&fundraisingContract && selectedProjectIndex !== null)  {
          try {
            const transaction = await props.contractInstance.voteForProject(selectedProjectIndex,{
              gasLimit: 2000000,
            });
            // Wait for the transaction to be mined
            await transaction.wait();
            setSuccess(true);
            // Add logic to handle success
            console.log('Vote successful!');

          } catch (error) {
            // Add logic to handle error
            if(error.message.includes("You have already voted for this project"))
            console.log("Already voted");
            console.error('Error voting:', error);
          }
        
        }
      };
      
  return (
    <div className="voting-container"> {/* Apply the CSS class to the parent div */}
    <div className="space-y-15">
        <div className="ml-48 mt-20 border-gray-900/10 pb-24">
            <h2 className="text-4xl font-bold leading-7 text-gray-900 mb-4">Vote For a Campaign</h2>
            
            <div className="mt-12 gap-x-8 gap-y-8 sm:grid-cols-9">
                <div className="sm:col-span-2">
                    <label htmlFor="country" className="block text-base font-medium leading-6 text-gray-900">
                        Campaign:
                    </label>
                    <div className="mt-6">
                    <select 
                      className="block rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      style={{ width: "700px" }} // Set your desired width here
                      onChange={(e) => setSelectedProjectIndex(e.target.value)}
                  > 
                      <option value="" disabled>Select a Campaign</option>
                      {projects.map((project, index) => (
                          <option key={index} value={index}>
                              Campaign {index + 1} - Goal: {project.GoalAmount} Tokens, Raised: {project.DonatedAmount} Token, Duration Left: {project.Time}
                          </option>
                      ))}
                  </select>

                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className=" ml-52 flex items-center justify-left gap-x-3">
        <button
            className="rounded-md bg-indigo-900 px-32 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-800"
            onClick={handleVote}
        >
            Vote
        </button>
    </div>
    {!sufficientBalance?<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

  <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

      <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Insufficient Balance</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">You Don't have enough number of tokens to vote.Get tokens to vote.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button type="button"
           class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
           onClick={() => setSufficientBalance(true)}><span>ok</span></button>
        </div>
      </div>
    </div>
  </div>
    </div>:null}
    {success?<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

  <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

      <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <Alert
            status='success'
            variant='subtle'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            textAlign='center'
            height='200px'
          >
            <AlertIcon  color="green" boxSize='40px' mr={0} />
            <AlertTitle mt={4} mb={1} fontSize='lg'>
              You have successfully voted!
            </AlertTitle>
            <AlertDescription maxWidth='sm'>
              Thank you for Voting.
            </AlertDescription>
          </Alert>
      </div>
    </div>
  </div>
    </div>:null}
   

</div>

            // {/* <h1>Connected Account: {props.currentAccount}</h1>
            
            // <h2>Vote for a Campaign</h2>
            // <select onChange={(e) => setSelectedProjectIndex(e.target.value)}> 
            //     <option value="" disabled>Select a Campaign</option>
            //     {projects.map((project, index) => (
            //         <option key={index} value={index}>
            //             Campaign {index + 1} - Goal: {project.GoalAmount} ETH, Raised: {project.DonatedAmount} 
            //         </option>
            //     ))}
            // </select>
            // <button onClick={handleVote}>Vote</button>  */}
        
  );
};

export default Voting;