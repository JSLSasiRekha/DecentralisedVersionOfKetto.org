import React, { useEffect ,useState} from "react";
import { ethers } from "ethers";


const CreateCampaign = (props) => {
    const [account, setAccount] = useState(props.currentAccount);
    const [fundraisingContract, setFundraisingContract] = useState(props.contractInstance);
  //  const [contributionAmount, setContributionAmount] = useState(0.001);
    const [goalAmount, setGoalAmount] = useState('');
    const [duration, setDuration] = useState('');
  //  const [projects, setProjects] = useState([]);
 // const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  
    useEffect(() => {
        if (props.contractInstance) {
          console.log("contract: ", props.contractInstance);
        }
      }, [props.contractInstance]);
    
      useEffect(() => {
        if (props.currentAccount) {
          console.log("currentAccount: ", props.currentAccount);
        }
      }, [props.currentAccount]);
      const handleCreateCampaign = async () => {
        console.log(fundraisingContract);
        if (props.contractInstance && goalAmount && duration) {
           console.log("entered");
          try {
            const goalAmountInWei = ethers.utils.parseEther(goalAmount.toString());
            const durationInDays = parseInt(duration, 10);
      
            const transaction = await props.contractInstance.createProject(goalAmountInWei, durationInDays, {
              gasLimit: 2000000, // Set an appropriate gas limit based on your network and contract complexity
            });
            
            // Wait for the transaction to be mined
            await transaction.wait();
      
            // Add logic to handle success
            console.log('Campaign created successfully!');
          } catch (error) {
            // Add logic to handle error
            console.error('Error creating campaign:', error);
          }
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
</div>

// {/*    
//     <h1>Connected Account:{props.currentAccount}</h1>
//      <h2>Create A Campaign</h2>
//        <div className="sm:col-span-3">
//               <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
//               GoalAmount:
//               </label>
//               <div className="mt-2">
//                 <input
//                   type="text"
//                   name="first-name"
//                   id="first-name"
//                   autoComplete="given-name"
//                   className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-900 sm:text-sm sm:leading-6"
//                 />
//               </div>
//             </div>
//      <label>Goal Amount (ETH): </label>
//       <input type="number" step="0.001" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} />
//       <label>Duration (Days): </label>
//       <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
//       <button onClick={handleCreateCampaign}>Create Campaign</button> */}


     
  );
};

export default CreateCampaign;