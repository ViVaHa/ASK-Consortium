pragma solidity ^0.5.0;
// imagine a big integer counter that the whole world could share
contract Counter {
    uint public storedData;
    event Incremented(uint x);
    function initialize (uint x) public {
        storedData = x;
    }

    function get() view public returns (uint) {
        return storedData;
    }

    function increment (uint n) public {
        storedData = storedData + n;
        emit Incremented(storedData);
        return;
    }

    function decrement (uint n) public {
        storedData = storedData - n;
        return;
    }
}
