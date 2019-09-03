const { createIframeClient } = remixPlugin
const devMode = { port: 8000 }
const client = createIframeClient({ devMode })

let latestCompilationResult = null
let fileName
let web3

contracts = []
let events = []
counter = 0

async function showContracts() {
  console.log("ahahaha i am a button and I am working")
  await client.onload()
  const compilationResult = await client.call('solidity', 'getCompilationResult')
  if (!compilationResult) throw new Error('no compilation result available');
  console.log('compilationResult', compilationResult)
  // const el = document.querySelector('div#results')
  // let event = compilationResult
  let eventsByContract = getEvents(compilationResult.data)
  addEventElements()
  // el.innerText = ''
}

function addEventElements() {
  console.log('called addEventElements with ', contracts)
  let contractList = document.createElement("ul")
  for (c of contracts) {
    // TODO There must be a smoother way to do this...
    console.log('created li for ', c.contractName)
    for (event of c.events) {
      var li = document.createElement('li')
      var liText = document.createTextNode(c.contractName + ":" + event.name)
      li.appendChild(liText)
      contractList.appendChild(li)
    }
  }
  contractList.setAttribute('id', 'cList')

  var item = document.getElementById('results')
  console.log('item ', item.childNodes[0] )
  // item.replaceChild(contractList, item.childNodes[0])
  item.replaceChild(contractList, document.getElementById('cList'))
}

function getEvents(data) {
  contracts = []
  for (windw in data.contracts) {
    console.log('window', windw)
    for (contract in data.contracts[windw]) {
      c = {contractName: contract}
      c.tab = windw
      // console.log('found contract titled', contract)
      c.events = data.contracts[windw][contract].abi.filter(e => e.type === "event")
      events.push(c.events)
      contracts.push(c)
    }
  }
  console.log('all contracts', contracts)
  // return contracts
}

async function printMyStuff () {
  await client.onload()
  console.log('glob variable events holds:', events)
  let bb = document.getElementById('scratch')
  counter += 1
  bb.innerHTML = "updated: " + counter
  console.log('counter', counter)

  let web3Provider
  if (window.ethereum) {
    console.log('eth is there!', window.ethereum)
    web3Provider = window.ethereum
    await window.ethereum.enable()
  } else if (window.web3) {
    console.log('legacy access!')
  } else {
    console.log('local network ganache!') //TODO
    web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
  }
  // web3 = new Web3(web3Provider)
  let endpoint
  const provider = await client.call('network', 'getNetworkProvider')
  console.log('provider ', provider )
  if (provider === 'vm')
    console.log('weire in a java simulation!!')
  if (provider === 'injected') {
    console.log('injected: trying to get endpoint...')
    // this does not really return an URL WHY?
    // endpoint = await client.call('network', 'getEndpoint')
    // console.log('endpoint says ', web3Provider )
  }
  console.log('provider ', web3Provider)
  web3 = new Web3(web3Provider)
  console.log('web3 ', web3)
  let bn = await web3.eth.getBlockNumber()
  console.log('bn ', bn )
}

async function getEvents(abi) {
  firedEvents = []
  return firedEvents
}

function getContractInstance (abi, contractAddress) {
  return new web3.eth.Contract(abi, contractAddress)
}

// this is not working: maybe i need to make sure this is only called after the client has made a handshake?
// Listen on new compilation result
// client.on(
//   'solidity',
//   'compilationFinished',
//   (file, source, languageVersion, data) => {
//     // fileName = file
//     // latestCompilationResult = { data, source }
//     console.log('latestCompilationResult ', latestCompilationResult )
//     showContracts()
//   },
// )



