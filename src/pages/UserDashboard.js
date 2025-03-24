import React, { useState, useEffect } from "react";
import { web3, rideSharingContract } from "../web3";

function UserDashboard() {
  const [ride, setRide] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  // Convert numeric status to text
  const getStatusText = (status) => {
    const numericStatus = parseInt(status, 10);
    if (numericStatus === 0) return "Not Started";
    if (numericStatus === 1) return "Ongoing";
    if (numericStatus === 2) return "Completed";
    return "Unknown";
  };

  // Load only the single latest ride from the contract
  const loadLatestRide = async () => {
    console.log("Inside loadLatestRide in UserDashboard");
    try {
      // Ensure MetaMask accounts are requested
      await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("Requesting rideCount in UserDashboard...");
      const rideCount = await rideSharingContract.methods.rideCount().call();
      console.log("rideCount from contract (UserDashboard):", rideCount);

      if (parseInt(rideCount, 10) === 0) {
        console.log("No rides found on-chain; setting ride to null.");
        setRide(null);
      } else {
        // Fetch only the ride with ID = rideCount (the newest ride)
        const latestId = parseInt(rideCount, 10);
        console.log("Fetching the newest ride with ID =", latestId);
        const fetchedRide = await rideSharingContract.methods.rides(latestId).call();
        fetchedRide.amountEth = web3.utils.fromWei(fetchedRide.amount, "ether");
        console.log("Newest ride data:", fetchedRide);
        setRide(fetchedRide);
      }
    } catch (error) {
      console.error("Error loading ride in UserDashboard:", error);
      alert("Error in loadLatestRide (UserDashboard): " + error.message);
    }
  };

  useEffect(() => {
    loadLatestRide();
  }, []);

  // Handle selecting & paying for the ride
  const handleSelectRide = async () => {
    if (!ride) return;
    try {
      console.log("Selecting ride ID:", ride.id, "for wei:", ride.amount);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const user = accounts[0];

      await rideSharingContract.methods
        .selectRide(ride.id)
        .send({ from: user, value: ride.amount });

      setStatusMessage("Ride selected & paid successfully!");
      // After paying, the ride status changes to Ongoing on-chain
      loadLatestRide(); // Reload to see updated status
    } catch (error) {
      console.error("Error selecting ride:", error);
      setStatusMessage("Transaction failed or canceled.");
    }
  };

  // If there's a ride, check its status
  const rideStatusText = ride ? getStatusText(ride.status) : null;
  const isNotStarted = ride && parseInt(ride.status, 10) === 0;

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Dashboard - Latest Ride</h2>
      <button onClick={loadLatestRide}>Refresh Ride</button>
      {statusMessage && <p>{statusMessage}</p>}

      {!ride ? (
        <p>No rides found on-chain.</p>
      ) : (
        <div style={{ marginTop: "20px" }}>
          <strong>Source:</strong> {ride.source} |{" "}
          <strong>Destination:</strong> {ride.destination} |{" "}
          <strong>Seats:</strong> {ride.seats} |{" "}
          <strong>Amount:</strong> {ride.amountEth} ETH |{" "}
          <strong>Status:</strong> {rideStatusText}
          {isNotStarted && (
            <button style={{ marginLeft: "20px" }} onClick={handleSelectRide}>
              Select &amp; Pay
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
