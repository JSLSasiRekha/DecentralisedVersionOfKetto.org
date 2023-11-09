import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {Link } from "react-router-dom";


const Home = (props) => {

  const [account, setAccount] = useState(props.currentAccount);
  const [fundraisingContract, setFundraisingContract] = useState(
    props.contractInstance
  );
  const [projects, setProjects] = useState([]);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
  const [contributionAmount, setContributionAmount] = useState(0.001);
  const [showContributionForm, setShowContributionForm] = useState(false);

  useEffect(()=>{
    if(selectedProjectIndex)
    setShowContributionForm(true);
  },[selectedProjectIndex]);
  useEffect(() => {
    if (props.contractInstance) {
      setFundraisingContract(props.contractInstance);
      fetchProjectDetails();
    }
  }, [props.contractInstance]);

  useEffect(() => {
    if (props.currentAccount) {
      setAccount(props.currentAccount);
    }
  }, [props.currentAccount]);

  const fetchProjectDetails = async () => {
    const projectsLength = (
      await props.contractInstance.getProjectsCount()
    ).toNumber();
    const fetchedProjects = [];

    for (let i = 0; i < projectsLength; i++) {
      const projectDetails = await props.contractInstance.getProjectDetails(i);
      console.log("project details",projectDetails);
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

      fetchedProjects.push(formattedDetails);
    }

    setProjects(fetchedProjects);
  };





  return (
    <div>
     
      <div className="campaigns">
        <h3 className=" mt-8 ml-12 text-3xl mb-2 font-semibold leading-7 text-gray-900">Available Campaigns </h3>
        <div className="ml-48 projects-container flex flex-wrap">
  {projects.map((project, index) => (
    <div className="w-1/2 px-4 py-6" key={index}>
      <div className=" px-44 py-6">
        <h3 className="text-2xl  font-semibold leading-7 text-gray-900">Campaign {index  + 1}</h3>
        <dl className="divide-y border-t  divide-gray-100">
          <div className="mt-2">
            <dt className=" text-xl font-medium text-gray-900">Goal Amount:</dt>
            <dd className="text-xl text-gray-700">{project.GoalAmount} ETH</dd>
          </div>
          <div className="mt-2">
            <dt className="text-xl font-medium text-gray-900">Raised Amount:</dt>
            <dd className="text-xl text-gray-700">{project.DonatedAmount} ETH</dd>
          </div>
          <div className="mt-2">
            <dt className="text-xl font-medium text-gray-900">Duration:</dt>
            <dd className="text-xl text-gray-700">{project.Time} days</dd>
          </div>
          <div className="mt-2">
            <dt className="text-xl font-medium text-gray-900">No Of Votes:</dt>
            <dd className="text-xl text-gray-700">{project.NoOfVotes}</dd>
          </div>
        </dl>
        <Link to={`/contribute/${index}`}>
          <button className="rounded-md bg-indigo-900 px-16 py-2 mt-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-800">
            Contribute
          </button>
        </Link>
      </div>
     
    </div>
  ))}
</div>

       
      </div>
    </div>
  );
};

export default Home;
