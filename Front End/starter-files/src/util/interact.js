//export const helloWorldContract;
const alchemyKey = "wss://eth-sepolia.g.alchemy.com/v2/YqwCCfxlCpq3UhKYrH6tu_Ifmn4fEdQy"
const {createAlchemyWeb3} = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require("../contract-abi.json");
const contractAddress = "0xb5b7de70e86f1c7b2b7eee31123cc6f421037ad9";

const accounts = await web3.eth.getAccounts();
const account = accounts[0];

//export const helloWorldContract;
export const helloWorldContract = new web3.eth.Contract(
    contractABI,
    contractAddress
);
export const loadCurrentMessage = async () => {
    const message = await helloWorldContract.methods.numCampaigns().call();
    return message;
};

export const getcampainginfo = async (campaignID) => {
    const message = await helloWorldContract.methods.getCampaignInfo(Number(campaignID)).call();
    return message;
};

export const donate = async (donatesum) => {
//set up transaction parameters
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        value: donatesum,
        from: account, // must match user's active address.
        data: helloWorldContract.methods.donate(donatesum).encodeABI(),
    };

//sign the transaction
    try {
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        });
        return {
            status: (
                <span>
          ✅{" "}
                    <a target="_blank" href={`https://sepolia.etherscan.io/tx/${txHash}`}>
            View the status of your transaction on Etherscan!
          </a>
          <br/>
          ℹ️ Once the transaction is verified by the network, the message will
          be updated automatically.
        </span>
            ),
        };
    } catch (error) {
        return {
            status: "😥 " + error.message,
        };
    }
}
export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const obj = {
                status: "👆🏽 Write a message in the text-field above.",
                address: addressArray[0],
            };
            return obj;
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
          <p>
            {" "}
              🦊{" "}
              <a target="_blank" href={`https://metamask.io/download`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
            ),
        };
    }
};

export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_accounts",
            });
            if (addressArray.length > 0) {
                return {
                    address: addressArray[0],
                    status: "👆🏽 Write an ID in the number-field above.",
                };
            } else {
                return {
                    address: "",
                    status: "🦊 Connect to Metamask using the top right button.",
                };
            }
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
          <p>
            {" "}
              🦊{" "}
              <a target="_blank" href={`https://metamask.io/download`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
            ),
        };
    }
};
export const updateMessage = async (address, message) => {

}


