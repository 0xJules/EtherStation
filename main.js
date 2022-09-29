// Normal calculator
const normal = document.querySelector("#normal");
const normalCalc = document.querySelector("#normal-calculator");
const submit1 = document.querySelector("#submit1");

// Custom calculator
const custom = document.querySelector("#custom");
const customCalc = document.querySelector("#custom-calculator");
const submit2 = document.querySelector("#submit2");

// Output
const usd = document.querySelector("#usd");
const ether = document.querySelector("#ether");
const Gwei = document.querySelector("#Gwei");
const wei = document.querySelector("#wei");
const output = document.querySelector("#output-table");
const ethPrice = document.querySelector("#ethprice");
const gasPrice = document.querySelector("#gasprice");

// Other
const etherPriceURL = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_market_cap=true";
const gasURL = "https://owlracle.info/eth/gas?apikey=3f1bbcd1cea64370ae4bac2a51743325";
const etherStationAPI = "YNP6DFWAQREN66A9MCXB5GN77IS4EHVKBB";

// Stats 
const nodeSize = document.querySelector("#node-size");
const nodeAmount = document.querySelector("#node-amount");

// Call functions that need to load when the page is loaded
getEthPrice();
getGasPrice();
getNodeSize();
getNodeAmount();

// When normal button is clicked, reveal normal calculator
normal.addEventListener("click", () => {
    normalCalc.style.display = "block";
    customCalc.style.display = "none";
    output.style.display = "none";
    // When normal button is clicked, inverse the background-color and color of the button
    custom.style.color = "#444";
    custom.style.backgroundColor = "white";
    normal.style.color = "white";
    normal.style.backgroundColor = "#444";
})

// When custom button is clicked, reveal custom calculator
custom.addEventListener("click", () => {
    normalCalc.style.display = "none";
    customCalc.style.display = "block";
    output.style.display = "none";
    // When custom button is clicked, inverse the background-color and color of the button
    normal.style.color = "#444";
    normal.style.backgroundColor = "white";
    custom.style.color = "white";
    custom.style.backgroundColor = "#444";
});

// Function to put the ETH price in the footer 
async function getEthPrice() {
    try {
        const response = await fetch(etherPriceURL);
        const data = await response.json();
        let etherPrice = data.ethereum.usd;
        console.log(etherPrice);
        ethPrice.innerText = etherPrice;
    } catch(err) {
        console.error(err);
    }
}

// Function to put the gasprice in the footer
async function getGasPrice() {
    try {
        const response = await fetch(gasURL);
        const data = await response.json();
        let gasPriceGwei = data.speeds[1]["gasPrice"];
        gasPrice.innerText = Math.round(gasPriceGwei);
    } catch(err) {
        console.error(err);
    }
}

// Function to get the gas cost of a transaction for the normal calculator
async function getGasCost1(i, j) {
    try {
        const response = await fetch(gasURL);
        const data = await response.json();
        const gasAmounts = [data.avgGas, 184523, 71645, 21000];
        const gasPrices = [];
        
        // Add the 4 types of transactions to the gasPrices array (slow, standard, fast, instant)
        for (price of data.speeds) {
            gasPrices.push(price.gasPrice);
        }

        async function gasCost(x, y) {
            const response = await fetch(etherPriceURL);
            const data = await response.json()
            let etherPrice = data.ethereum.usd;
            
            // Calculate the cost in Gwei
            const cost = gasAmounts[x] * gasPrices[y];

            // Output the values in the HTML file 
            usd.innerText = (cost * 1e-9 * etherPrice).toFixed(3);
            ether.innerText = (cost * 1e-9).toFixed(5);
            Gwei.innerText = cost;
            wei.innerText = (cost * 1e9).toExponential();
            output.style.display = "inline";
        }

        gasCost(i, j);
    } catch(err) {
        console.error(err);
    }
}

// Function to reveal the gas cost when sumbit1 is clicked
submit1.addEventListener("click", () => {
    const radioButtons1 = document.querySelectorAll('input[name="options1"]');
    const radioButtons2 = document.querySelectorAll('input[name="options2"]');
    let [i, j] = [0, 0];
    let gas = 10000;
    let gasFee = 10000;

    // Get the index that will be used in the getGasCost1 function to determine the gas amount
    while (!radioButtons1[i].checked) {
        i++;
    }
    
    gas = i;

    // Get the index that will be used in the getGasCost1 function to determine the gas fee
    while (!radioButtons2[j].checked) {
        j++;
    }

    gasFee = j;

    // Check if all input values are filled in
    if (gas == 10000 || gasFee == 10000) {
        alert("Please fill in all the input values.");
        return;
    }

    getGasCost1(gas, gasFee);
});

// Function to get the gas cost of a transaction for the custom calculator
async function getGasCost2(gas, priorityFee, baseFee) {
    try {
        const response = await fetch(etherPriceURL);
        const data = await response.json();
        let etherPrice = data.ethereum.usd;

        // Calculate the cost in Gwei
        const cost = gas * (priorityFee + baseFee); 

        // Output the values in the HTML file 
        usd.innerText = (cost * 1e-9 * etherPrice).toFixed(3);
        ether.innerText = (cost * 1e-9).toFixed(5);
        Gwei.innerText = cost;
        wei.innerText = (cost * 1e9).toExponential();
        output.style.display = "inline";
    } catch(err) {
        console.error(err);
    }
}

// Function to reveal the gas cost when submit2 is clicked
submit2.addEventListener("click", () => {
    const gas = parseInt(document.querySelector("#gasAmount").value);
    const priorityFee = parseInt(document.querySelector("#priorityFee").value);
    const baseFee = parseInt(document.querySelector("#baseFee").value);

    if (!gas || !priorityFee || !baseFee) {
        alert("Please fill in all the input values.")
        return;
    }

    getGasCost2(gas, priorityFee, baseFee);
});

// Function to display the size of an Ethereum node
async function getNodeSize() {
    const url = `https://api.etherscan.io/api?module=stats&action=chainsize&startdate=2019-02-01&enddate=2019-02-28&clienttype=geth&syncmode=default&sort=asc&apikey=${etherStationAPI}`
    const response = await fetch(url);
    const data = await response.json();
    nodeSize.innerText = (data.result[0].chainSize * 10**-9).toFixed(2);
 }

 // Function to display the number of discovarable Ethereum nodes
 async function getNodeAmount() {
    const url = `https://api.etherscan.io/api?module=stats&action=nodecount&apikey=${etherStationAPI}`;
    const response = await fetch(url);
    const data = await response.json();
    nodeAmount.innerText = data.result.TotalNodeCount;
 }
            
// TODO: Clean up UI
// TODO: Add information about transaction: amount burned, ...
// TODO: Add information page about Ethereum security => money needed to revert finalized blocks