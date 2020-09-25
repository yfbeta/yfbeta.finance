let abiERC20 = [
    {
        "constant":true,
        "inputs":[{"name":"_owner","type":"address"}],
        "name":"balanceOf",
        "outputs":[{"name":"balance","type":"uint256"}],
        "type":"function"
    },
    {
        "constant":true,
        "inputs":[{"name":"_owner","type":"address"}, {"name":"_spender","type":"address"}],
        "name":"allowance",
        "outputs":[{"name":"remaining","type":"uint256"}],
        "type":"function"
    },
    {
        "constant":true,
        "inputs":[{"name":"_spender","type":"address"}, {"name":"_value","type":"uint256"}],
        "name":"approve",
        "outputs":[],
        "type":"function"
    }
];
let abiVault = [
    {
        "constant":true,
        "inputs":[{"name":"_owner","type":"address"}],
        "name":"balanceOf",
        "outputs":[{"name":"balance","type":"uint256"}],
        "type":"function"
    },
    {
        "constant":true,
        "inputs":[],
        "name":"totalSupply",
        "outputs":[{"name":"balance","type":"uint256"}],
        "type":"function"
    },
    {
        "constant":true,
        "inputs":[],
        "name":"balanceToken",
        "outputs":[{"name":"balance","type":"uint256"}],
        "type":"function"
    },
    {
        "constant":true,
        "inputs":[],
        "name":"balanceVault",
        "outputs":[{"name":"balance","type":"uint256"}],
        "type":"function"
    },
    {
        "constant":true,
        "inputs":[],
        "name":"balanceProfits",
        "outputs":[{"name":"balance","type":"uint256"}],
        "type":"function"
    },
    {
        "constant":true,
        "inputs":[{"name":"amount","type":"uint256"}],
        "name":"deposit",
        "outputs":[],
        "type":"function"
    },
    {
        "constant":true,
        "inputs":[{"name":"numberOfShares","type":"uint256"}],
        "name":"withdraw",
        "outputs":[],
        "type":"function"
    }
];
let abiPool = [
    {
        "constant":true,
        "inputs":[{"name":"_owner","type":"address"}],
        "name":"balanceOf",
        "outputs":[{"name":"balance","type":"uint256"}],
        "type":"function"
    },
    {
        "constant":true,
        "inputs":[{"name":"_account","type":"address"}],
        "name":"earned",
        "outputs":[{"name":"balance","type":"uint256"}],
        "type":"function"
    },
    {
        "constant":true,
        "inputs":[],
        "name":"getReward",
        "outputs":[],
        "type":"function"
    },
    {
        "constant":true,
        "inputs":[],
        "name":"exit",
        "outputs":[],
        "type":"function"
    },
    {
        "constant":true,
        "inputs":[{"name":"amount","type":"uint256"}],
        "name":"stake",
        "outputs":[],
        "type":"function"
    },
    {
        "constant":true,
        "inputs":[{"name":"numberOfShares","type":"uint256"}],
        "name":"withdraw",
        "outputs":[],
        "type":"function"
    }
];

const REWARD_TOKEN_ADDRESS  = '0x89eE58Af4871b474c30001982c3D7439C933c838';
const REWARD_TOKEN_SYMBOL   = 'yfBETA';
const REWARD_TOKEN_DECIMALS = 18;

const USDT_ADDRESS  = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const USDT_SYMBOL   = 'USDT';
const USDT_DECIMALS = 6;
const USDC_ADDRESS  = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const USDC_SYMBOL   = 'USDC';
const USDC_DECIMALS = 6;
const DAI_ADDRESS  = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const DAI_SYMBOL   = 'DAI';
const DAI_DECIMALS = 18;



const USDT_VAULT_ADDRESS  = '0xA315f861788A59dd470C50093A1b08Ef820AB8b6';
const USDT_VAULT_SYMBOL   = 'yfUSDT';
const USDT_VAULT_DECIMALS = 6;
const USDC_VAULT_ADDRESS  = '0xcf22BEa5113e4FE38BABEFd6973B5383667cb5B3';
const USDC_VAULT_SYMBOL   = 'yfUSDC';
const USDC_VAULT_DECIMALS = 6;
const DAI_VAULT_ADDRESS  = '0x96724528fA59C5DF684d720F0f79ccf2190b8C01';
const DAI_VAULT_SYMBOL   = 'yfDAI';
const DAI_VAULT_DECIMALS = 18;

const USDT_POOL_ADDRESS     = '0x1F1Ef2D79641640B5fE8a294a7BBa95f571cDc4B';
const USDT_POOL_NAME        = 'USDT';
const USDC_POOL_ADDRESS     = '0x785690877Eca2bCfcd268d8C5E22C59A6cF14C55';
const USDC_POOL_NAME        = 'USDC';
const DAI_POOL_ADDRESS     = '0xe6db24ba51cEaE1AeD2e6e7A6fDBA5e4FE2a75c8';
const DAI_POOL_NAME        = 'DAI';