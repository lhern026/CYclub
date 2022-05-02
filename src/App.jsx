import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/App.css';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { ethers } from "ethers";
import YachtNFT from './utils/YachtNFT.json';
import mintcounter from './assets/components/mintcounter/mintcounter';
import Navbar from './assets/components/Navbar/Navbar';
import { motion } from 'framer-motion';

import Faq from "react-faq-component";

const {ethereum } = window;

const data = {
  title: "  ",
  rows: [
      {
          title: "Lorem ipsum dolor sit amet,",
          content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed tempor sem. Aenean vel turpis feugiat,
            ultricies metus at, consequat velit. Curabitur est nibh, varius in tellus nec, mattis pulvinar metus.
            In maximus cursus lorem, nec laoreet velit eleifend vel. Ut aliquet mauris tortor, sed egestas libero interdum vitae.
            Fusce sed commodo purus, at tempus turpis.`,
      },
      {
          title: "Nunc maximus, magna at ultricies elementum",
          content:
              "Nunc maximus, magna at ultricies elementum, risus turpis vulputate quam, vitae convallis ex tortor sed dolor.",
      },
      {
          title: "Curabitur laoreet, mauris vel blandit fringilla",
          content: `Curabitur laoreet, mauris vel blandit fringilla, leo elit rhoncus nunc, ac sagittis leo elit vel lorem.
          Fusce tempor lacus ut libero posuere viverra. Nunc velit dolor, tincidunt at varius vel, laoreet vel quam.
          Sed dolor urna, lobortis in arcu auctor, tincidunt mattis ante. Vivamus venenatis ultricies nibh in volutpat.
          Cras eu metus quis leo vestibulum feugiat nec sagittis lacus.Mauris vulputate arcu sed massa euismod dignissim. `,
      },
      {
          title: "What is the package version",
          content: <p>current version is 1.2.1</p>,
      },
  ],
};

const styles = {
  bgColor: 'transparent',
  titleTextColor: '#F6F3F6',
  rowTitleColor: '#F6F3F6',
  rowContentColor: '#F6F3F6',
  arrowColor: "snowball",
};

const config = {
  animate: true,
  arrowIcon: " ↓",
  tabFocus: true
};

const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 1000;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
 
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    let chainId = await ethereum.request({ method: 'eth_chainId' });
console.log("Connected to chain " + chainId);

// String, hex code of the chainId of the Rinkebey test network
const rinkebyChainId = "0x4"; 
if (chainId !== rinkebyChainId) {
  try{
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x4' }],
    });
  } catch (switchError){
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x4',
              chainName: 'ETH',
              rpcUrls: ['https://rinkeby.infura.io/v3/'] /* ... */,
            },
          ],
        });
      } catch (addError) {
        // handle "add" error
      }
    }
    // handle other "switch" errors
  }



  
}
    
    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      setupEventListener();
    } else {
      console.log("No authorized account found");
    }
  }

  /*
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
          

          // open the deeplink page 
          window.open("https://metamask.app.link/dapp/cy-club.vercel.app/")
          
          }
      }else{

        const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 

      setupEventListener();
        
      }

      /*
      * Fancy method to request access to account.
      */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 

      setupEventListener()
    } catch (error) {
      alert('getmetamask');
      
      console.log(error);
    }
  }

  // Setup our listener.
  const setupEventListener = async () => {
    // 
    const CONTRACT_ADDRESS = "0xFBfbA15309Dd2a48B2c05898326d3F603E794245";
  
    
    try {
      const { ethereum } = window;
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, YachtNFT.abi, signer);
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
    
      

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        
        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewYachtNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`);

          console.log('yo');
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  //mint function 

  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = "0xFBfbA15309Dd2a48B2c05898326d3F603E794245";
  
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, YachtNFT.abi, signer);
        
  
        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeYahctNFT();
  
        alert("Mining...please wait.")
        await nftTxn.wait();
        
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        console.log(`here is ur link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/`);
        
  
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Metamask
    </button>
  );


  /*
  * Added a conditional render! We don't want to show Connect to Wallet if we're already connected :).
  */
  return (
    <div className="App">
      
      <div class="menu-wrap">
    <input type="checkbox" class="toggler"/>
    <div class="hamburger"><div></div></div>
    <div class="menu">
      <div>
        <div>
          <ul>
            <li><a href="#home">Logo</a></li>
            <li><a href="#roadmap">Roadmap</a></li>
            <li><a href="#faq">Faq</a></li>
            <li><a href="#whitepaper">Whitepaper</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
      <div className="containers">
        
        
        {/* <Router>
          <Navbar />
          <Routes>
            <Route   />
            <Route   />
            <Route  />
            <Route  />
          </Routes>
      </Router> */}
      
        
     
        {/* <Navbar /> */}
        <div className="header-container">
        
          
          
          
          
          <div className="firstHeader">
         
            <h1 className="header gradient-text">Crypto <br></br > <span id="yacht">Yacht</span> <br></br> Club</h1>
          </div>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <div>
            <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
              
              Mint NFT 
            </button>
            
            </div>
            
           
          )}
        </div>
        <div>
          <h2  id="roadmap">Roadmap</h2>
          <div class="timeline">
  <div class="container left">
   
    <i class="icon fa fa-home"></i>
    <div class="content">
      <h2>Phase 1</h2>
      <p>
        Lorem ipsum dolor sit amet elit. Aliquam odio dolor, id luctus erat sagittis non. Ut blandit semper pretium.
      </p>
    </div>
  </div>
  <div class="container right">

    <i class="icon fa fa-gift"></i>
    <div class="content">
      <h2>Phase 2</h2>
      <p>
        Lorem ipsum dolor sit amet elit. Aliquam odio dolor, id luctus erat sagittis non. Ut blandit semper pretium.
      </p>
    </div>
  </div>
  <div class="container left">
   
    <i class="icon fa fa-user"></i>
    <div class="content">
      <h2>Phase 3</h2>
      <p>
        Lorem ipsum dolor sit amet elit. Aliquam odio dolor, id luctus erat sagittis non. Ut blandit semper pretium.
      </p>
    </div>
  </div>
  <div class="container right">
   
    <i class="icon fa fa-running"></i>
    <div class="content">
      <h2>Phase 4</h2>
      <p>
        Lorem ipsum dolor sit amet elit. Aliquam odio dolor, id luctus erat sagittis non. Ut blandit semper pretium.
      </p>
    </div>
  </div>
  <div class="container left">
    
    <i class="icon fa fa-cog"></i>
    <div class="content">
      <h2>Phase 5</h2>
      <p>
        Lorem ipsum dolor sit amet elit. Aliquam odio dolor, id luctus erat sagittis non. Ut blandit semper pretium.
      </p>
    </div>
  </div>
  <div class="container right">
    
    <i class="icon fa fa-certificate"></i>
    <div class="content">
      <h2>Phase 6</h2>
      <p>
        Lorem ipsum dolor sit amet elit. Aliquam odio dolor, id luctus erat sagittis non. Ut blandit semper pretium.
      </p>
    </div>
  </div>
</div>
          
          
        
              </div>
        {/* <Faqlist></Faqlist> */}
        <a name="faq"></a>
       < h2 >FAQ</h2>
       
        <div className="faqcont">
          
        
          <Faq className="faqlist"
                  data={data}
                  styles={styles}
                  config={config}
              />
       
        </div>
        <h2 >Whitepaper</h2>
        <div className="whitePaper">

          <a name="whitepaper"></a>
          <p></p>

          
        </div>
        
        
      </div>
    </div>
  );
};

export default App;