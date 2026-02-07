let provider;
let signer;
let contract;

const contractAddress = "0x3B8bc83e98180a664F05176f27Bdc55F5601ecCc";

const contractABI = [
  {
    "inputs":[{"internalType":"string[]","name":"candidateNames","type":"string[]"}],
    "stateMutability":"nonpayable",
    "type":"constructor"
  },
  {
    "inputs":[{"internalType":"uint256","name":"candidateIndex","type":"uint256"}],
    "name":"vote",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "name":"candidates",
    "outputs":[
      {"internalType":"string","name":"name","type":"string"},
      {"internalType":"uint256","name":"voteCount","type":"uint256"}
    ],
    "stateMutability":"view",
    "type":"function"
  },
  {
    "inputs":[],
    "name":"getCandidatesCount",
    "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "stateMutability":"view",
    "type":"function"
  }
];

async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask not found");
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();

  const address = await signer.getAddress();
  document.getElementById("account").innerText =
    "Connected wallet: " + address;

  contract = new ethers.Contract(contractAddress, contractABI, signer);
}

async function vote(index) {
  try {
    const tx = await contract.vote(index);
    await tx.wait();
    alert("Vote submitted successfully!");
  } catch (err) {
    alert(err.reason || err.message);
  }
}

async function getResults() {
  const count = await contract.getCandidatesCount();
  let output = "";

  for (let i = 0; i < count; i++) {
    const candidate = await contract.candidates(i);
    output += `${candidate.name}: ${candidate.voteCount}<br>`;
  }

  document.getElementById("results").innerHTML = output;
}
