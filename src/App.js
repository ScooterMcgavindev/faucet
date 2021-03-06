import detectEthereumProvider from '@metamask/detect-provider';
import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import "./App.css";
import { loadContract } from './utils/load-contract';

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    isProviderLoaded: false,
    web3: null,
    contract: null
  })
  
  const [balance, setBalance] = useState(null)
  const [account, setAccount] = useState(null)
  const [shouldReload, reload] = useState(false)



  const canConnectToContract = account && web3Api.contract
  // wrap reloadEffect in a callback function to toggle false true and reload onlywhen value changes
  const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload])
  // reexucted whenever account changes
  const setAccountListener = (provider) => {
    provider.on('accountsChanged', _ => window.location.reload())
    provider.on('chainChanged', _ => window.location.reload())
    // provider.on('accountsChanged', (accounts) => setAccount(accounts[0]))
    // provider._jsonRpcConnection.events.on('notification', (payload) => {
    //   const { method } = payload
    //   // when you lock your metamask account / signout
    //   if (method === 'metamask_unlockStateChanged') {
    //     setAccount(null)
    //   }
    // })
  }
  /**
   * with metamask we have an access to window.ethereum & to window.web3
   * metamask injects a global API into website
   * this API allows websites to request users, accounts, read data to blockchain
   * sign messages and transactions
   */
  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider()
      
      if (provider) {
        const contract = await loadContract('Faucet', provider)
        setAccountListener(provider)
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
          isProviderLoaded: true
        })
      } else {
        //setWeb3Api({...web3Api, isProviderLoaded: true}) g> gave error that useEffect hook had missing dependency
        // callbackfunction to set web3api, inside recieves current state of web3
        setWeb3Api(api => ({...api, isProviderLoaded: true}))
        console.error("Please, install Metamask.")
      }
    }

    loadProvider()
  }, [])

  /** Get balance useEffect function
   * 
   */
  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api
      const balance = await web3.eth.getBalance(contract.address)
      setBalance(web3.utils.fromWei(balance, 'ether'))
    }
    web3Api.contract && loadBalance()
  }, [web3Api, shouldReload])
  /** 
   * get accounts only when web3Api is loaded
   * function called from ethApi to get acccounts
   * set to state account funccctoin with 1st item from account
   * reexecute component to get new account number
  */
  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts()
      setAccount(accounts[0])
    }

    web3Api.web3 && getAccount()
  }, [web3Api.web3])

  /**
   * Add funds function
   * call via browser 
   */
  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei('1', 'ether')
    })
    // reload browser
    //window.location.reload()
    reloadEffect()
  }, [web3Api, account, reloadEffect])

  /**
   * Withdraw funds function 
   */
  const withdraw = async () => {
    const { contract, web3 } = web3Api
    const withdrawAmount = web3.utils.toWei('0.1', 'ether')
    await contract.withdraw(withdrawAmount,{
      from: account
    })
    reloadEffect()
  }

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          { web3Api.isProviderLoaded ? 
            <div className="is-flex is-align-items-center">
              <span>
                <strong className="mr-2">Account: </strong>
              </span>
                { account ?
                  <div>{account}</div> :
                  !web3Api.provider ? 
                  <>
                    <div className='notification is-warning is-size-6 is-rounded'>
                      Wallet is not dectected! {` `}
                      <a 
                        rel="noreferrer"
                        target='_blank' 
                        href='https://docs.metamask.io'>
                          Install Metamaask
                      </a>
                    </div>
                  </> :
                  <button
                    className="button is-small"
                    onClick={() =>
                      web3Api.provider.request({method: "eth_requestAccounts"}
                    )}
                  >
                    Connect Wallet
                  </button>
                }
            </div> :
            <span>Looking for Web3...</span>
          }
          <div className="balance-view is-size-2 my-4">
            Current Balance: <strong>{balance}</strong> ETH
          </div>
          {
            !canConnectToContract && 
            <i className='is-block'>
              Connect to Ganache
            </i>
          }
          <button
            disabled={!canConnectToContract}
            onClick={addFunds}
            className="button is-link mr-2"
          >
              Donate: 1 eth
          </button>
          <button
            disabled={!canConnectToContract}
            onClick={withdraw}
            className="button is-primary">Withdraw 0.1 eth</button>
        </div>
      </div>
    </>
  );
}

export default App;

// Private key 32 byte 
//2922cfafcc980449731a4651b1f0bdca245a2475b164766dcde5f387c8d58b61

// public key 64vyte number uncompressed
//041428eb7e3a6d6520ee1d30230b009fad14b98b05d53d2ef5297054cc40d68ad8f14c3a1ec6fb3dd9603611a461a93a801c7d98618f4e327836cb81a12ac648c6

// public key32byte # compressed
//021428eb7e3a6d6520ee1d30230b009fad14b98b05d53d2ef5297054cc40d68ad8
