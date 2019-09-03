const { createIframeClient } = remixPlugin
const devMode = { port: 8000 }
const client = createIframeClient({ devMode })

let latestCompilationResult = null
let fileName

async function showContracts() {
  console.log("ahahaha i am a button and I am working")
}

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

// async function getNetworkName() {
//   const network = await client.call('network', 'detectNetwork')
//   if (!network) {
//     throw new Error('no known network to verify against')
//   }
//   const name = network.name.toLowerCase()
//   // TODO : remove that when https://github.com/ethereum/remix-ide/issues/2017 is fixed
//   if (name === 'görli') return 'goerli'
//   return name
// }



