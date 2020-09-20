let account;

const ethEnabled = () => {
    if (window.ethereum) {
        return true;
    }
    return false;
}

const initializeWeb3 = () => {
    window.web3 = new Web3(window.ethereum);
}

const connectWallet = async (callback) => {
    try {
        await window.ethereum.enable();
        web3.eth.getAccounts().then(e => {
            account = e[0];
            callback();
        });
    } catch (err) {
        console.log(err);
    }
}

const log = (message, tx_hash) => {
    console.log(message);
    if(tx_hash) {
        $('#log-container').append('tx sent: <a href="https://etherscan.io/tx/' + tx_hash + '" target="_blank">view on etherscan.io</a><br>');
    } else {
        $('#log-container').append(message + '<br>');
    }
}

const round = (value, decimals) => {
    value = value*(10**decimals);
    value = Math.round(value);
    value = value / (10**decimals);
    return value.toString();
}