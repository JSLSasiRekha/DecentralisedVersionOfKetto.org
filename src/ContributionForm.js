import React, { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";



const ContributeForm = (props) => {
    const { index } = useParams();
    const projectIndex = parseInt(index, 10);
  const [amountToContribute, setAmountToContribute] = useState("");
  const [projectDetails,setProjectDetails]=useState([]);
 

  useEffect(() => {
    if (props.contractInstance) {
        //setFundraisingContract(props.contractInstance)
      fetchProjectDetails();
    }

  }, [props.contractInstance]);
  console.log("contract: ", props.contractInstance);

  useEffect(() => {
    if (props.currentAccount) {
      console.log("currentAccount: ", props.currentAccount);
    }
  }, [props.currentAccount]);

  const fetchProjectDetails = async () => {

        const projectDetails = await props.contractInstance.getProjectDetails(projectIndex);
        const ownerAddress = projectDetails[0];
        const goalAmountWei = projectDetails[1];
        const donatedAmountWei = projectDetails[2];
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

      console.log("project details:",formattedDetails); 
      setProjectDetails(formattedDetails);
    }
  
  
    //console.log("project details",projects); 
  

  const handleContribute = async (e) => {
   e.preventDefault();
    
    if (props.contractInstance) {
        try {
          console.log("Entered");
            const amountInWei = ethers.utils.parseEther(amountToContribute.toString());
            const contributeTransaction = await props.contractInstance.contribute(projectIndex,amountInWei,{
                value: amountInWei,
                gasLimit: 2000000, 

            });
  
            // Wait for the contribution transaction to be mined
            await contributeTransaction.wait();
  
            // Add logic to handle success
            console.log('Contribution and contribution handling successful!');
        } catch (error) {
            // Add logic to handle error
            console.error('Error contributing:', error);
        }
    }
  };
    
  

  return (
    <div className="Form">
       <form  onSubmit={handleContribute}>
     
          <div className="space-y-15" key={index}>
        <div className=" ml-48 mt-20  border-gray-900/10 pb-24">
            <h2 className=" text-5xl font-bold leading-7 text-gray-900 mb-4">Contribute to Campaign {projectIndex + 1}</h2>
            <h3 className="mt-8 text-2xl font-medium leading-7 text-gray-900 mb-4">Campaign {projectIndex + 1} Details:</h3>
              <p className="mt-2 text-xl font-normal leading-7 text-gray-900 mb-4">Goal Amount: {projectDetails.GoalAmount} ETH</p>
              <p className="mt-2 text-xl font-normal leading-7 text-gray-900 mb-4">Raised Amount: {projectDetails.DonatedAmount} ETH</p>
              <p className="mt-2 text-xl font-normal leading-7 text-gray-900 mb-4">No of Votes: {projectDetails.NoOfVotes} </p>
              <p className="mt-2 text-xl font-normal leading-7 text-gray-900 mb-4">Duration: {projectDetails.Time} </p>
            <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                       Enter Amount To Contribute:
                    </label>
                    <div className="mt-2">
                        <input
                             type="number"
                             step="0.001"
                             value={amountToContribute}
                             onChange={(e) => setAmountToContribute(e.target.value)}
                             required
                            name="first-name"
                            id="first-name"
                            autoComplete="given-name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-900 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
            </div>
            </div>
     </div>
     <div className=" mt-0 ml-52 flex items-center justify-left gap-x-3">
        <button
            type="submit"
            className="rounded-md bg-indigo-900 px-32 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-800"
            
        >
            Contribute
        </button>
    </div>
      {/* <div className="project-card" >
              
              </div>
        <label>
          <span>Amount to Contribute (ETH):</span>
          <input
            type="number"
            step="0.001"
            value={amountToContribute}
            onChange={(e) => setAmountToContribute(e.target.value)}
            required */}
          {/* />
        </label>
        <button  type="submit">Contribute</button> */}
      </form>
    </div>
  );
};

export default ContributeForm;
