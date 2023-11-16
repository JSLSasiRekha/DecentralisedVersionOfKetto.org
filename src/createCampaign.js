import React, { useEffect ,useState} from "react";
import { ethers } from "ethers";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'


const CreateCampaign = (props) => {
    const [account, setAccount] = useState(props.currentAccount);
    const [fundraisingContract, setFundraisingContract] = useState(props.contractInstance);
  //  const [contributionAmount, setContributionAmount] = useState(0.001);
    const [goalAmount, setGoalAmount] = useState('');
    const [duration, setDuration] = useState('');
    const [success,setSuccess]=useState(false);
    const [sufficientBalance,setSufficientBalance]=useState(true);
  //  const [projects, setProjects] = useState([]);
 // const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
    
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
      setFundraisingContract(props.contractInstance);
    getBalanceAccount();
  }

}, [props.contractInstance]);
    
      useEffect(() => {
        if (props.currentAccount) {
          console.log("currentAccount: ", props.currentAccount);
        }
      }, [props.currentAccount]);

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

      const handleCreateCampaign = async () => {
        if (props.currentAccount) {
          const balance = await props.contractInstance.getBalance({
            gasLimit:2000000, // Add extra gas to the estimated gas limit
          });
          const newbal=ethers.utils.formatEther(balance);
          if(newbal>0){
            if (props.contractInstance && goalAmount && duration) {
              console.log("entered");
             try {
               const goalAmountInWei = ethers.utils.parseEther(goalAmount.toString());
               const durationInDays = parseInt(duration, 10);
         
               const transaction = await props.contractInstance.createProject(goalAmount, durationInDays, {
                 gasLimit: 2000000, // Set an appropriate gas limit based on your network and contract complexity
               });
               
               // Wait for the transaction to be mined
               await transaction.wait();
              setSuccess(true);
               // Add logic to handle success
               console.log('Campaign created successfully!');
             } catch (error) {
               // Add logic to handle error
               console.error('Error creating campaign:', error);
             }
           }
          }
          else
          setSufficientBalance(false);
         ;
        }
        
       
      };
    
  return (
    <div>
    <div className="space-y-15">
        <div className=" ml-48 mt-20  border-gray-900/10 pb-24">
            <h2 className=" text-5xl font-bold leading-7 text-gray-900 mb-4">Create Campaign</h2>

            <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                        Goal Amount:
                    </label>
                    <div className="mt-2">
                        <input
                            name="first-name"
                            id="first-name"
                            autoComplete="given-name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-900 sm:text-sm sm:leading-6"
                            type="number" step="0.001" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            
            <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                        Duration of Campaign (In days):
                    </label>
                    <div className="mt-2">
                        <input
                            name="last-name"
                            id="last-name"
                            autoComplete="family-name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-900 sm:text-sm sm:leading-6"
                            type="number" 
                            value={duration} onChange={(e) => setDuration(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className="mt-4 ml-52 flex items-center justify-left gap-x-3">
        <button
            className="rounded-md bg-indigo-900 px-32 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-800"
            onClick={handleCreateCampaign}
        >
            Create
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
              Campaign Created Successfully!
            </AlertTitle>
            <AlertDescription maxWidth='sm'>
              You have created a campaign.
            </AlertDescription>
          </Alert>
      </div>
    </div>
  </div>
    </div>:null}
</div>




     
  );
};

export default CreateCampaign;