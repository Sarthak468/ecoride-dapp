// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Transfer.sol";

contract RideSharing {
    enum RideStatus { NotStarted, Ongoing, Completed }

    struct Ride {
    uint id;
    address payable driver;
    string source;
    string destination;
    uint seats;
    uint amount; // in wei
    RideStatus status;
    address payable user;
}

uint public rideCount;
mapping(uint => Ride) public rides;

event RideProposed(
    uint indexed id,
    address indexed driver,
    string source,
    string destination,
    uint seats,
    uint amount
);
event RideSelected(uint indexed id, address indexed user);
event RideCompleted(uint indexed id);

// Reference to the Transfer contract
Transfer private transferContract;

// Constructor sets the Transfer contract's address (hardcoded)
constructor() {
    transferContract = Transfer(0x83bCa54E0689d3e2fBB8ca4BbBB497A2614dc55A);
}

function proposeRide(
    string memory _source,
    string memory _destination,
    uint _seats,
    uint _amount
) public {
    rideCount++;
    rides[rideCount] = Ride({
        id: rideCount,
        driver: payable(msg.sender),
        source: _source,
        destination: _destination,
        seats: _seats,
        amount: _amount,
        status: RideStatus.NotStarted,
        user: payable(address(0))
    });
    emit RideProposed(rideCount, msg.sender, _source, _destination, _seats, _amount);
}

function selectRide(uint _rideId) public payable {
    require(_rideId > 0 && _rideId <= rideCount, "Invalid ride ID");
    Ride storage ride = rides[_rideId];
    require(ride.status == RideStatus.NotStarted, "Ride not available");
    require(msg.value == ride.amount, "Incorrect amount sent");

    ride.user = payable(msg.sender);
    ride.status = RideStatus.Ongoing;
    emit RideSelected(_rideId, msg.sender);
}

function completeRide(uint _rideId) public {
    require(_rideId > 0 && _rideId <= rideCount, "Invalid ride ID");
    Ride storage ride = rides[_rideId];
    require(msg.sender == ride.driver, "Only driver can complete ride");
    require(ride.status == RideStatus.Ongoing, "Ride not ongoing");

    ride.status = RideStatus.Completed;
    // Use the Transfer contract to send ETH to the driver
    transferContract.transfer{ value: ride.amount }(ride.driver);
    emit RideCompleted(_rideId);
}
}

