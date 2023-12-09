import alchemylogo from "./alchemylogo.png";
import React from "react";
import {useEffect, useState} from "react";
import {
    helloWorldContract,
    connectWallet,
    updateMessage,
    loadCurrentMessage,
    getcampainginfo,
    getCurrentWalletConnected, donate,
} from "./util/interact.js";


const HelloWorld = () => {
    //state variables
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("No connection to the network."); //default message
    const [newMessage, setNewMessage] = useState("");
    const [campaignId, setCampaignId] = useState("");
    const [contractData, setContractData] = useState('');
    const [donatesum, setdonatesum] = useState('');
    const [response, setresponse] = useState('');



//called only once
    useEffect(() => {
        async function fetchMessage() {
            const message = await loadCurrentMessage();
            setMessage(message);
        }

        fetchMessage();

        async function fetchWallet() {
            const {address, status} = await getCurrentWalletConnected();
            setWallet(address);
            setStatus(status);
        }

        fetchWallet();
    }, []);

    function addSmartContractListener() { //TODO: implement

    }

    function addWalletListener() { //TODO: implement

    }

    const connectWalletPressed = async () => {
        const walletResponse = await connectWallet();
        setStatus(walletResponse.status);
        setWallet(walletResponse.address);
    };

    const onUpdatePressed = async () => {
        const response = await getcampainginfo(campaignId);
        setContractData(response)
    };
    const onUpdatePressed2 = async () => {
        const response = await donate(donatesum);
        setresponse(response)
    };

    //the UI of our component
    return (
        <div id="container">
            <img id="logo" src={alchemylogo}></img>
            <button id="walletButton" onClick={connectWalletPressed}>
                {walletAddress.length > 0 ? (
                    "Connected: " +
                    String(walletAddress).substring(0, 6) +
                    "..." +
                    String(walletAddress).substring(38)
                ) : (
                    <span>Connect Wallet</span>
                )}
            </button>

            <h2 style={{paddingTop: "50px"}}>Current numbers of campaigns: </h2>
            <p>{message}</p>

            <h2 style={{paddingTop: "18px"}}>Get information about any campaign by ID</h2>

            <div>
                <input
                    type="number"
                    placeholder="Numbers only!"
                    onChange={(e) => setCampaignId(e.target.value)}
                    value={campaignId}
                />
                <p id="status">{status}</p>

                <button id="publish" onClick={onUpdatePressed}>
                    Update
                </button>
                <div>
                    {Object.values(contractData).map((value, index) => (
                        <p key={index}>{value}</p>
                    ))}
                </div>
            </div>

            <h2 style={{paddingTop: "18px"}}>We accept only ETH donations at the moment</h2>

            <div>
                <input
                    type="text"
                    placeholder="Write correct amount of ETH"
                    onChange={(e) => setdonatesum(e.target.value)}
                    value={donatesum}
                />
                <p></p>
                <button  id="publish" style={{background: "#8a1520"}} onClick={onUpdatePressed2}>
                    Donate
                </button>
            </div>
        </div>
    )
};

export default HelloWorld;
