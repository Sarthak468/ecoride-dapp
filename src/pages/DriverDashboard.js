import React, { useState, useEffect } from "react";
import { web3, rideSharingContract } from "../web3";

const DriverDashboard = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [seats, setSeats] = useState("");
  const [amount, setAmount] = useState("");
  const [latestRide, setLatestRide] = useState(null); 
  const [statusMessage, setStatusMessage] = useState("");

  console.log("DriverDashboard loaded!");

  // Convert numeric status to text
  const getStatusText = (status) => {
    const numericStatus = parseInt(status, 10);
    if (numericStatus === 0) return "Not Started";
    if (numericStatus === 1) return "Ongoing";
    if (numericStatus === 2) return "Completed";
    return "Unknown";
  };

  // Load only the single newest ride (ID = rideCount)
  const loadLatestRide = async () => {
    console.log("Fetching only the newest ride in DriverDashboard");
    try {
      const rideCount = await rideSharingContract.methods.rideCount().call();
      console.log("rideCount in DriverDashboard:", rideCount);

      if (parseInt(rideCount, 10) === 0) {
        // No rides exist on-chain
        console.log("No rides found on-chain");
        setLatestRide(null);
      } else {
        // Fetch the ride with ID = rideCount
        const newestId = parseInt(rideCount, 10);
        console.log("Fetching ride with ID =", newestId);
        const ride = await rideSharingContract.methods.rides(newestId).call();
        ride.amountEth = web3.utils.fromWei(ride.amount, "ether");
        console.log("Newest ride data:", ride);
        setLatestRide(ride);
      }
    } catch (error) {
      console.error("Error loading latest ride in DriverDashboard:", error);
      alert("Error in loadLatestRide (DriverDashboard): " + error.message);
    }
  };

  useEffect(() => {
    loadLatestRide();
  }, []);

  // Propose a new ride
  const handleProposeRide = async () => {
    if (!source || !destination || !seats || !amount) {
      alert("Please fill in all fields!");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const driver = accounts[0];
      const amountInWei = web3.utils.toWei(amount, "ether");

      const receipt = await rideSharingContract.methods
        .proposeRide(source, destination, parseInt(seats, 10), amountInWei)
        .send({ from: driver });

      setStatusMessage("Ride proposed successfully!");

      // Attempt an optimistic update if the event is present
      if (receipt.events && receipt.events.RideProposed) {
        const event = receipt.events.RideProposed.returnValues;
        const newRide = {
          id: event.id,
          driver: event.driver,
          source: event.source,
          destination: event.destination,
          seats: event.seats,
          amount: event.amount,
          amountEth: web3.utils.fromWei(event.amount, "ether"),
          status: "0",
          user: "0x0000000000000000000000000000000000000000"
        };
        setLatestRide(newRide);
      } else {
        // fallback: reload from chain after short delay
        setTimeout(loadLatestRide, 2000);
      }

      // Clear form
      setSource("");
      setDestination("");
      setSeats("");
      setAmount("");
    } catch (error) {
      console.error("Error proposing ride:", error);
      setStatusMessage("Error proposing ride.");
    }
  };

  // Complete an ongoing ride
  const handleCompleteRide = async (rideId) => {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      await rideSharingContract.methods.completeRide(rideId).send({ from: accounts[0] });
      setStatusMessage("Ride completed successfully!");
      loadLatestRide();
    } catch (error) {
      console.error("Error completing ride:", error);
      setStatusMessage("Error completing ride.");
    }
  };

  // Decide which section to show the single newest ride in
  let proposedRide = null;
  let ongoingRide = null;
  let completedRide = null;

  if (latestRide) {
    const rideStatus = parseInt(latestRide.status, 10);
    if (rideStatus === 0) {
      proposedRide = latestRide;
    } else if (rideStatus === 1) {
      ongoingRide = latestRide;
    } else if (rideStatus === 2) {
      completedRide = latestRide;
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Driver Dashboard (Latest Ride Only)</h2>

      <section style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
        <h3>Propose a Ride</h3>
        <label>
          Source: <br />
          <input type="text" value={source} onChange={(e) => setSource(e.target.value)} />
        </label>
        <br />
        <label>
          Destination: <br />
          <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} />
        </label>
        <br />
        <label>
          Seats Available: <br />
          <input type="number" value={seats} onChange={(e) => setSeats(e.target.value)} />
        </label>
        <br />
        <label>
          Amount (ETH): <br />
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <br />
        <button onClick={handleProposeRide}>Propose Ride</button>
        {statusMessage && <p>{statusMessage}</p>}
      </section>

      <section style={{ marginBottom: "1rem" }}>
        <h3>Rides Proposed (Not Started)</h3>
        {!proposedRide ? (
          <p>No proposed rides.</p>
        ) : (
          <ul>
            <li>
              <strong>Source:</strong> {proposedRide.source} |{" "}
              <strong>Destination:</strong> {proposedRide.destination} |{" "}
              <strong>Seats:</strong> {proposedRide.seats} |{" "}
              <strong>Amount:</strong> {proposedRide.amountEth} ETH |{" "}
              <strong>Status:</strong> {getStatusText(proposedRide.status)}
            </li>
          </ul>
        )}
      </section>

      <section style={{ marginBottom: "1rem" }}>
        <h3>Ongoing Rides</h3>
        {!ongoingRide ? (
          <p>No ongoing rides.</p>
        ) : (
          <ul>
            <li>
              <strong>Source:</strong> {ongoingRide.source} |{" "}
              <strong>Destination:</strong> {ongoingRide.destination} |{" "}
              <strong>Seats:</strong> {ongoingRide.seats} |{" "}
              <strong>Amount:</strong> {ongoingRide.amountEth} ETH |{" "}
              <strong>Status:</strong> {getStatusText(ongoingRide.status)}{" "}
              <button onClick={() => handleCompleteRide(ongoingRide.id)}>Complete</button>
            </li>
          </ul>
        )}
      </section>

      <section style={{ marginBottom: "1rem" }}>
        <h3>Completed Rides</h3>
        {!completedRide ? (
          <p>No completed rides.</p>
        ) : (
          <ul>
            <li>
              <strong>Source:</strong> {completedRide.source} |{" "}
              <strong>Destination:</strong> {completedRide.destination} |{" "}
              <strong>Seats:</strong> {completedRide.seats} |{" "}
              <strong>Amount:</strong> {completedRide.amountEth} ETH |{" "}
              <strong>Status:</strong> {getStatusText(completedRide.status)}
            </li>
          </ul>
        )}
      </section>

      <button onClick={loadLatestRide}>Refresh Ride</button>
    </div>
  );
};

export default DriverDashboard;
