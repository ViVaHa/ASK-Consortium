pragma solidity ^0.5.0;
contract Consortium{
    address payable public chairperson;
    struct Airline{
        bytes32 name;
        bool isActive;
        uint256 escrowAmount;
    }
    mapping(address => bytes32) public requests;
    mapping(address => bytes32) public responses;
    mapping(address => Airline) public airlines;
    event Registered(address airline, string data);
    event Unregistered(address airline, uint data);
    event RequestRecorded(address airline, string data);
    event ResponseRecorded(address airline, string data);
    event Settled(address lender, address borrower);
    constructor() payable public{
        chairperson = msg.sender;
    }
    modifier onlyChairperson(address sender){
        require(sender==chairperson, "Only chairperson can register");
        _;
    }
    modifier isNotActive(address airline){
        require(!airlines[airline].isActive, "Airline already present");
        _;
    }
    modifier isActive(address airline){
        require(airlines[airline].isActive, "Airline not active yet");
        _;
    }
    function registerAirline()payable public isNotActive(msg.sender){
        airlines[msg.sender].isActive=true;
        //airlines[msg.sender].name = name;
        airlines[msg.sender].escrowAmount = msg.value;
        emit Registered(msg.sender, "Airline Registered");
    }
    function unregisterAirline(address payable airline) payable public onlyChairperson(msg.sender) isActive(airline){
        require(airlines[airline].escrowAmount>=0, "You have pending balances, you cannot leave the consortium");
        airlines[airline].isActive=false;
        uint amount = airlines[airline].escrowAmount;
        airlines[airline].escrowAmount=0;
        airline.transfer(amount);
        emit Unregistered(msg.sender, amount);
    }
    function recordRequests(address to, bytes32 details) public isActive(msg.sender) isActive(to){
        require(msg.sender!=to, "Sender cannot be same as receiver");
        bytes32 hash = keccak256(abi.encodePacked(to, details));
        requests[msg.sender] = hash;
        emit RequestRecorded(to, "Recorded Successfully");
    }
    function recordResponses(address to, bytes32 details) public isActive(msg.sender) isActive(to){
        require(msg.sender!=to, "Sender cannot be same as receiver");
        bytes32 hash = keccak256(abi.encodePacked(to, details));
        responses[msg.sender] = hash;
        emit ResponseRecorded(to, "Recorded Successfully");
    }
    function settleBalances(address lender, uint amount) public isActive(msg.sender) isActive(lender){
        require(airlines[msg.sender].escrowAmount>=amount, "Insufficient Balance");
        airlines[msg.sender].escrowAmount-=amount;
        airlines[lender].escrowAmount+=amount;
        emit Settled(msg.sender, lender);
    }


}
