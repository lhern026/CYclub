import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/App.css';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { ethers } from "ethers";
import YachtNFT from './utils/YachtNFT.json';
import mintcounter from './assets/components/mintcounter/mintcounter';
import Navbar from './assets/components/Navbar/Navbar';
import Burgerstyled from './assets/components/Burger/Burgerstyled';

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
	alert("You are not connected to the Rinkeby Test Network!");
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
      setupEventListener()
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

      setupEventListener()
        
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
          
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
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
  
        console.log("Mining...please wait.")
        await nftTxn.wait();
        
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        console.log(`here is ur link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/`)
  
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
      
      
      <div className="container">
      <div className='navBar'>
            <ul>
                
                <li className='navs'><a href='#home'>logo</a></li>
                <a name="home"></a>
                <li className='navs'><a href='#roadmap'>Roadmap</a></li>
                <li className='navs'><a href='#faq'>Faq</a></li>
                <li className='navs'><a href='#whitepaper'>Whitepaper</a></li>
            </ul>
  </div>
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
            <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
           
          )}
        </div>
        <div>
          <h2 class="header gradient-text" id="roadmap">Roadmap</h2>
          <div className="roadmap">
              <div className="phase1"><h1>Phase 1</h1><div className="phases"><p>dd</p></div></div>
              <div className="phase2"><h1>Phase 2</h1><div className="phases"><p>dd</p></div></div>
              <div className="phase3"><h1>Phase 3</h1><div className="phases"><p>dd</p></div></div>
           
          </div>
          <div className="roadmap">
              <a name="roadmap"></a>
              <div className="phase1"><h1>Phase 4</h1><div className="phases"><p>dd</p></div></div>
              <div className="phase2"><h1>Phase 5</h1><div className="phases"><p>dd</p></div></div>
              <div className="phase3"><h1>Phase 6</h1><div className="phases"><p>dd</p></div></div>
           
          </div>
          
          <div className="containerOcean">
                
                <div class = "ocean">
                  <span class = "waves" id ="wave1"></span>
                  <span class = "waves" id ="wave2"></span>
                  <span class = "waves" id ="wave3"></span>
                  <span class = "waves" id ="wave4"></span>
                  <span class = "waves" id ="wave5"></span>
                  <span class = "waves" id ="wave6"></span> 
                  <span class = "waves" id ="wave7"></span>
                  <span class = "waves" id ="wave8"></span>
                  <span class = "waves" id ="wave9"></span>
                  <span class = "waves" id ="wave10"></span>
                  <span class = "waves" id ="wave11"></span>
                  <span class = "waves" id ="wave12"></span>
                  <span class = "waves" id ="wave13"></span>
                  <span class = "waves" id ="wave14"></span>
                  <span class = "waves" id ="wave15"></span>
                  <span class = "waves" id ="wave16"></span>
                  <span class = "waves" id ="wave17"></span>
                  <span class = "waves" id ="wave18"></span> 
                  <span class = "waves" id ="wave19"></span>
                  <span class = "waves" id ="wave20"></span>
                  <span class = "waves" id ="wave21"></span>
                  <span class = "waves" id ="wave22"></span>
                  <span class = "waves" id ="wave23"></span>
                  <span class = "waves" id ="wave24"></span> 
                  <span class = "waves" id ="wave25"></span>
                  <span class = "waves" id ="wave26"></span>
                  <span class = "waves" id ="wave27"></span>
                  <span class = "waves" id ="wave28"></span>
                  <span class = "waves" id ="wave29"></span>
                  <span class = "waves" id ="wave30"></span> 
                  <span class = "waves" id ="wave31"></span>
                  <span class = "waves" id ="wave32"></span>
                  <span class = "waves" id ="wave33"></span>
                  <span class = "waves" id ="wave34"></span>
                  <span class = "waves" id ="wave35"></span>
                  <span class = "waves" id ="wave36"></span> 
                  <span class = "waves" id ="wave37"></span>
                  <span class = "waves" id ="wave38"></span>
                  <span class = "waves" id ="wave39"></span>
                  <span class = "waves" id ="wave40"></span>
                 
                  
                    </div>
                    <div class = "sky"></div>
              </div>
              </div>
        {/* <Faqlist></Faqlist> */}
        <a name="faq"></a>
       < h2 className="header gradient-text">FAQ</h2>
       
        <div className="faqcont">
          
        
          <Faq className="faqlist"
                  data={data}
                  styles={styles}
                  config={config}
              />
       
        </div>
        <div className="whitePaper">
          <h2 className="header gradient-text">Whitepaper</h2>
          <a name="whitepaper"></a>
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iure 
            aperiam reprehenderit tenetur aliquid, iusto illum possimus voluptatibus animi 
            odio deleniti necessitatibus quos rem autem, quidem, fugiat at porro nemo nisi.</p>

          
        </div>
        
        <div className='navBar'>
            <ul>
                
                <li className='navs'>logo</li>
                <li className='navs'><a href='#roadmap'>Roadmap</a></li>
                <li className='navs'><a href='#faq'>Faq</a></li>
                <li className='navs'><a href='#whitepaper'>Whitepaper</a></li>
            </ul>
  
          
          
          
          
          
          
          
        </div>
      </div>
    </div>
  );
};

export default App;