App = {
    loading: false,
    web3Provider: null,
    contracts: {},
  
    load: async ()=> {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
    },
  
    loadWeb3: async ()=> {
      if(window.ethereum){
        App.web3Provider = window.ethereum
      }
    },
  
    loadAccount: async ()=> {
      App.account = await ethereum.request({ method: 'eth_accounts' });
    },
  
    loadContract: async ()=> {
      const votingJson = await $.getJSON('Voting.json')
      App.contracts.Voting = TruffleContract(votingJson)
      App.contracts.Voting.setProvider(App.web3Provider)
      App.Voting = await App.contracts.Voting.deployed()    
    },
  
    render: async ()=> {
      if(App.loading) { return }
      App.setLoading(true)
  
      console.log(App.account[0])
      $('#accountAddress').html("Alamat Akun: " + App.account[0])
  
      await App.renderVote()
  
      App.setLoading(false)
  
    },
  
    setLoading: (boolean)=> {
      App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if(boolean){
        loader.show()
        content.hide()
      }else{
        loader.hide()
        content.show()
      }
    },
  
    renderVote: async ()=> {
      const jumlahKandidat = await App.Voting.jumlahKandidat()
  
      $("#candidatesResults").empty()
      for(var i=1; i <= jumlahKandidat; i++){
        const kandidat = await App.Voting.paraKandidat(i)
        const kandidatId = kandidat[0]
        const kandidatNama = kandidat[1]
        const kandidatJumlahVote = kandidat[2]
        var candidateTemplate = "<tr><th>" + kandidatId + "</th><td>" + kandidatNama + "</td><td>" + kandidatJumlahVote + "</td></tr>"
        $("#candidatesResults").append(candidateTemplate)
      }
  
      const isVote = await App.Voting.voters(App.account[0])
      if(isVote){
        $('#btnVote').prop("disabled", true);
        $('#voteStatus').html("You already Vote!")
      }
    },
  
    castVote: async ()=> {
      var kandidatId = await $('#candidatesSelect').val();
      await App.Voting.vote(kandidatId, { from: App.account[0] });
      window.location.reload();
    }
}
  
$(document).ready(function(){
    App.load()
    ethereum.on('accountsChanged', function(accounts){
        window.location.reload()
    });
});