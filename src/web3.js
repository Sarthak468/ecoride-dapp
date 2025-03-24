// web3.js
import Web3 from "web3";
import RideSharingABI from "./RideSharing.json";

let web3;
let rideSharingContract;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);

  // Replace with your deployed RideSharing contract address
  const contractAddress = "0x41F65f1C22587F793cC3e7506d35F5B6E7aE5f2F";
  rideSharingContract = new web3.eth.Contract(RideSharingABI.abi, contractAddress);

  console.log("web3:", web3);
  console.log("rideSharingContract:", rideSharingContract);
} else {
  alert("MetaMask not detected!");
}

export { web3, rideSharingContract };
