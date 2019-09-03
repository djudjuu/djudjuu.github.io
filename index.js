const { createIframeClient } = remixPlugin
const devMode = { port: 8000 }
const client = createIframeClient({ devMode })

let latestCompilationResult = null
let fileName

async function showContracts() {
  console.log("ahahaha i am a button and I am working")
  await client.onload()
  const compilationResult = await client.call('solidity', 'getCompilationResult')
  if (!compilationResult) throw new Error('no compilation result available');
  console.log('compilationResult', compilationResult)
  // const el = document.querySelector('div#results')
  // let event = compilationResult
  let eventsByContract = getEvents(compilationResult.data)
  addEventElements(eventsByContract)
  // el.innerText = ''

}

function addEventElements(eventsByContract) {
  console.log('called addEventElements with ', eventsByContract)
  var newDiv = document.createElement("div");
  // var newContent = document.createTextNode('sdfsdfsdfdsf')
  // newDiv.append(newContent)
  let contractList = document.createElement("ul")
  for (c of eventsByContract) {
    // TODO There must be a smoother way to do this...
    console.log('created li for ', c.contractName)
    for (event of c.events) {
      var li = document.createElement('li')
      var liText = document.createTextNode(c.contractName + ":" + event.name)
      li.appendChild(liText)
      contractList.appendChild(li)
    }
  }
  newDiv.appendChild(contractList)
  var currentDiv = document.getElementById("div1")
  document.body.insertBefore(newDiv, currentDiv)
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
      contracts.push(c)
    }
  }
  console.log('all contracts', contracts)
  return contracts
}

// this is not working: maybe i need to make sure this is only called after the client has made a handshake?
// Listen on new compilation result
// client.on(
//   'solidity',
//   'compilationFinished',
//   (file, source, languageVersion, data) => {
//     fileName = file
//     latestCompilationResult = { data, source }
//     console.log('latestCompilationResult ', latestCompilationResult )
//   },
// )



