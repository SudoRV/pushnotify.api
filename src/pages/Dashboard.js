import React, { useState, useEffect } from "react";
import { FaSyncAlt } from "react-icons/fa";
import { RefreshCw } from "lucide-react";

import { jwtDecode } from "jwt-decode";
import generateTestToken from "../functions/generateTestToken";
import UsageGraph from "../components/ApiStats";

import "../styles/Dashboard.scss";

const BASE_URL = "https://xnzd52zoqyuu7zkv5i5r42uiua0jzapk.lambda-url.eu-north-1.on.aws/";

let dummyData = {
  "xKeys":["0","09","10","11","14","16"],
  "usage":[{"xKey":"0","time":"00:00:00","floatXKey":0,"calls":0}
  ]
};


const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [testToken, setTestToken] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [tokenExpiry, setTokenExpiry] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    try {
      const storedData = JSON.parse(localStorage.getItem("creds"));
      const transactionData = JSON.parse(localStorage.getItem("t_data"));

      if (storedData) setUserData(storedData);
      if (transactionData) {
        if (transactionData["transaction-id"]) {
          setTransaction(transactionData);
        }
        if (transactionData["access-token"]) setAccessToken(transactionData["access-token"]);
        setTestToken(transactionData["test-token"]);
        updateTokenExpiry(transactionData["test-token"]);
      }
    } catch (error) {
      console.error("Error parsing local storage data:", error);
    }
  }, []);
  
  
  
  //experiment 
// Add at the top inside Dashboard component
const [deviceList, setDeviceList] = useState([]);
const [range, setRange] = useState("1d");
const [apiMeta, setApiMeta] = useState({});
const [graphData, setGraphData] = useState(dummyData);

let lastFilter;

useEffect(()=>{
  if(userData) fetchAPIMeta();
},[range, userData])

// Function to fetch metadata and devices
const fetchAPIMeta = async () => {
  try {   
    const today = new Date().getDate();     
    const urlReq = `${BASE_URL}?req=api-stats&range=${range}&day=${today}&user-id=${userData["user-id"]}`;
         
    const response = await fetch(urlReq); 
        
    const data = await response.json();        
    const rawGraph = data.usage; 
                         
    if(data["access-token"]) {
        const temp = data;
        delete temp["usage"];
        setApiMeta(temp);
    }                        
    if(Object.keys(rawGraph).length <= 0){  
      setGraphData(dummyData);     
      return;
    };
           
    let graph = {};        
    if(range==="1d"){                
      const graphData = generateGraphData(rawGraph[today]); 
      
      //add 0th dummy data 
      const dummy = {
        xKey: 0,          
        time: "00:00:00",
        floatXKey : 0.0,       
        calls: 0,
      }      
      graphData.unshift(dummy);
           
      let xKeys = [...new Set(graphData.map((item) => item["xKey"]))];
      xKeys = xKeys.sort((a, b) => parseInt(a) - parseInt(b)); 
      xKeys.push((parseInt(xKeys[xKeys.length - 1]) + 1).toString().padStart(2, '0'));          
                   
      graph = {
        xKeys: xKeys,
        usage: graphData,
      } 
                         
    } else {          
      const xKeys = Object.keys(rawGraph);             
            
      let mergedRawGraph = [];
      xKeys.forEach((day)=>{
        mergedRawGraph.push(...rawGraph[day]);
      })                 
      xKeys.unshift(1);
                         
      const graphData = generateGraphDataMonth(mergedRawGraph); 
      
      //add 0th dummy data 
      const dummy = {
        xKey: 1,          
        time: "00:00:00",
        floatXKey : 0,       
        calls: 0,
      }      
      graphData.unshift(dummy);
            
      graph = {
        xKeys: xKeys,
        usage: graphData,
      }                
    }              
    
    setGraphData(graph);
    //setDeviceList(data.devices);
  } catch (error) {
    console.error("Failed to fetch API metadata", error);
  }
};



function generateGraphData(rawGraph) {
  let index = 0;
  let lastHour = 0;
  return rawGraph.map(item => {
    const date = new Date(item.timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    if(lastHour !== hours){
        index++;
        lastHour = hours;
    };           

    return {
      xKey: hours.toString().padStart(2, '0'),          
      time: date.toLocaleTimeString('en-US',  { hour12: false }),
      floatXKey : parseFloat(`${index}.${((hours + minutes / 60 + seconds / 3600).toFixed(6)).split(".")[1]}`),       
      calls: item.calls,      
    };             
  });    
}


function generateGraphDataMonth(rawGraph) {
  let index = -1;
  let lastDay = null;

  return rawGraph.map(item => {
    const date = new Date(item.timestamp);
    const day = date.getDate();
    
    if (lastDay !== day) {
      index++;
      lastDay = day;
    }

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const timeFraction = (hours + minutes / 60 + seconds / 3600) / 24;

    return {
      xKey: day.toString(),
      time: date.toLocaleTimeString('en-US', { hour12: false }), 
      floatXKey: parseFloat(`${index}.${(timeFraction.toFixed(6).split(".")[1])}`),     
      calls: item.calls,
    };
  });
}


  // Function to update token expiry & start timer
  const updateTokenExpiry = (token) => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      const expiryTime = decoded.exp * 1000; // Convert to milliseconds
      setTokenExpiry(expiryTime);
    } catch (error) {
      console.error("Invalid token:", error);
    }
  };

  // Timer Effect
  useEffect(() => {
    if (!tokenExpiry) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now >= tokenExpiry) {
        setTimeLeft("Expired");
        clearInterval(interval);
      } else {
        const remainingTime = Math.max(0, (tokenExpiry - now) / 1000);
        const minutes = Math.floor(remainingTime / 60);
        const seconds = Math.floor(remainingTime % 60);
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tokenExpiry]);

  const generateAccessToken = async () => {
    if (!localStorage.getItem("creds")) {
      await alert("Please login first.");
      window.open("/login?close=auto");
      return;
    } else if (accessToken) {
      navigator.clipboard.writeText(accessToken);
    } else {
      //get access token

      // Construct URL for generating a new test token              
      const url = `${BASE_URL}?req=access-token&user=${userData["user-id"]}`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        if (!data["access-token"]) throw new Error("Invalid response");

        // Save new test token in local storage        
        setAccessToken(data["access-token"]);

        localStorage.setItem("t_data", JSON.stringify({
          ...JSON.parse(localStorage.getItem("t_data") || "{}"),
          "access-token": data["access-token"]
        }));

        return { error: null, token: data["access-token"] };
      } catch (error) {
        console.error("Error fetching access token:", error);
        return { error: "Failed to fetch access token" };
      }
    }
  };

  const makePayment = async () => {
    await alert("Redirecting to Payment Page");
    const paymentWindow = window.open("/payment?amt=100", "_blank");
    const checkPageClosed = setInterval(() => {
      if (paymentWindow.closed) {
        clearInterval(checkPageClosed);
        window.location.reload();
      }
    }, 500);
  };

  return (        
    <div className="dashboard w100 fg1">
        <h2>User Dashboard</h2>

        {/* User Info */}
        <div className="user-info card">
          <h3>👤 User Information</h3>
          {userData ? (
            <ul>
              <li><strong>Username:</strong> {userData.username}</li>
              <li><strong>Email:</strong> {userData.email}</li>
              <li><strong>User ID:</strong> {userData["user-id"]}</li>
            </ul>
          ) : (
            <p className="error">No user data found. <a href="/login">Please login</a></p>
          )}
        </div>

        {/* Transaction History */}
        <div className="transaction-history card">
          <h3>💳 Transaction History</h3>
          {transaction ? (
            <ul>
              <li><strong>Amount:</strong> ₹{transaction.amount || "N/A"}</li>
              <li><strong>Time:</strong> {new Date(transaction["timestamp"]).toLocaleString()}</li>
              <li><strong>Transaction ID:</strong> {transaction["transaction-id"]}</li>
            </ul>
          ) : (
            <p className="error">
              No transactions found. <button style={{ all: "unset", color: "blue", textDecoration: "underline" }} onClick={makePayment}>Make Payment</button>
            </p>
          )}
        </div>

        {/* Test Token Section */}
        <div className="access-token-section card">
          <span style={{ float: "left", fontSize: "14px", color: timeLeft === "Expired" ? "red" : "green", fontWeight: "bold" }}>Expiry : {timeLeft || "..."}</span>
          <h3>🔑 Test Token</h3>
          <p>{testToken ? testToken : "No test token generated yet"}</p>

          <button
            className="generate-btn"
            onClick={async () => {
              const result = await generateTestToken(testToken);
              console.log(result)
              setTestToken(result.token);
              updateTokenExpiry(result.token);
              navigator.clipboard.writeText(result.token);
            }}
          >
            {timeLeft === "Expired" ? "Regenerate Token" : (testToken ? "Copy Token" : "Generate Token")}
          </button>
        </div>

        {/* Access Token Section */}
        <div className="access-token-section card">
          <h3>🔑 Access Token</h3>
          <p>{accessToken ? accessToken : "No access token generated yet"}</p>

          <div style={{ gap: "8px" }} className="flex jcc aic ">
            <button className="generate-btn" onClick={generateAccessToken}>
              {accessToken ? "Copy Token" : "Get Access Token"}
            </button>

            {accessToken ? (<button onClick={() => window.open("/payment?close=auto&amt=1")} className="buy-premium generate-btn">
              {transaction?.amount ? (transaction?.amount < 1 ? "Extend Limit" : "Unlimited") : "Extend Limit"}
            </button>) : ""}
          </div>
        </div>
        

{/* Professional API Stats UI */}
<div className="api-stats">
      <div className="flex jcsb aic">
        <h2>API Statistics</h2>
        <button className="refresh-btn" onClick={()=>{fetchAPIMeta()}} title="Refresh">
          <RefreshCw size={22} strokeWidth={1.4} />
        </button>
      </div>
      

      <div className="token-info">
        <div className="token-line">
          <span>Access Token:</span>
          <code>{apiMeta['access-token']}</code>          
        </div>

        <div className="created-line">
          <div>
            <span>Created At:</span> <strong>{new Date(apiMeta["api-created-at"]).toLocaleDateString('en-GB')}</strong>
          </div>
          <div>
            <span>Time:</span> <strong>{new Date(apiMeta["api-created-at"]).toLocaleTimeString()}</strong>
          </div>
        </div>
        
        <div className="created-line">
          <div>
            <span>Refresh At:</span> <strong>{new Date(apiMeta["api-refreshed-at"]).toLocaleDateString('en-GB')}</strong>
          </div>
          <div>
            <span>Time:</span> <strong>{new Date(apiMeta["api-refreshed-at"]).toLocaleTimeString()}</strong>
          </div>
        </div>  
            
      </div>
            
      <div className="quota-info">
        <div className="flex fdc text-center">
          <span>Quota</span> <strong>1000</strong>
        </div>
        
        <div className="flex fdc text-center">
          <span>Used</span> <strong>{1000-(apiMeta.calls || 0)}</strong>
        </div>
        
        <div className="flex fdc text-center">
          <span>Remaining</span><strong>{apiMeta.calls}</strong>
        </div>
      </div>

      <div className="filter-buttons">
        <button onClick={() => setRange("1d")} className={range === "1d" ? "active" : ""}>Day</button>
        <button onClick={() => setRange("1w")} className={range === "1w" ? "active" : ""}>Week</button>
        <button onClick={() => setRange("1m")} className={range === "1m" ? "active" : ""}>Month</button>
      </div>

      <div className="graph">
        <h4>API Usage ({range})</h4>
        
        <UsageGraph data={graphData} />
        
      </div>
    </div>
        

    </div>
  );
};

export default Dashboard;

