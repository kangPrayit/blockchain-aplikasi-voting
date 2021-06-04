//SPDX-License-Identifier: MIT
pragma solidity >= 0.5.0 < 0.7.0;

contract Voting {
    struct Kandidat {
        uint id;
        string nama;
        uint jumlahVote;
    }
    mapping(address=>bool) public paraPemilih;
    mapping(uint=>Kandidat) public paraKandidat;
    uint public jumlahKandidat;
    
    constructor() public {
        tambahKandidat("Kandidat 1");
        tambahKandidat("Kandidat 2");
    }      

    function tambahKandidat(string memory _nama) private {
        jumlahKandidat++;
        paraKandidat[jumlahKandidat] = Kandidat(jumlahKandidat, _nama, 0);
    }
    function vote(uint _kandidatId) public {
        require(!paraPemilih[msg.sender]);
        require(_kandidatId > 0 && _kandidatId <= jumlahKandidat);
        paraPemilih[msg.sender] = true;
        
        paraKandidat[_kandidatId].jumlahVote++; 
    }
}