<section class='flex gap-7 justify-center items-center flex-wrap text-white px-8% py-20'>
   <img class='rounded-xl' src="/images/testnet/mantra.webp" alt="camiseta" />
   <div class='flex flex-col gap-4'>
   <h2 class='text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 from-10% via-primary via-30% to-green-600 font-semibold'>HOW TO INSTALL </h2>
   <p class='max-w-md'>


- **Updating packages**
      
```
sudo apt update && sudo apt upgrade -y
```
- **Install developer tools and necessary packages**
      
```
sudo apt install curl build-essential pkg-config libssl-dev git wget jq make gcc tmux chrony -y
```
- **Installing GO**
      
```
ver="1.20.3"
wget "https://golang.org/dl/go$ver.linux-amd64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$ver.linux-amd64.tar.gz"
rm "go$ver.linux-amd64.tar.gz"
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> $HOME/.bash_profile
source $HOME/.bash_profile
go version
```
      
### Node installation
      
- **Clone the project repository with the node, go to the project folder and collect the binary files**
      
```
cd $HOME
wget https://github.com/MANTRA-Finance/public/raw/main/mantrachain-testnet/mantrachaind-linux-amd64.zip
unzip mantrachaind-linux-amd64.zip
sudo mv mantrachaind /usr/local/bin
```
      
- **Checking the version**
      
```
mantrachaind version
#0.2.2
```
      
- **Creating Variables**
      
```
MONIKER_MANTRA=type in your name
CHAIN_ID_MANTRA=mantrachain-1
PORT_MANTRA=47
```
      
- **Save variables, reload .bash_profile and check variable values**
      
```
echo "export MONIKER_MANTRA="${MONIKER_MANTRA}"" >> $HOME/.bash_profile
echo "export CHAIN_ID_MANTRA="${CHAIN_ID_MANTRA}"" >> $HOME/.bash_profile
echo "export PORT_MANTRA="${PORT_MANTRA}"" >> $HOME/.bash_profile
source $HOME/.bash_profile
      
echo -e "\nmoniker_MANTRA > ${MONIKER_MANTRA}.\n"
echo -e "\nchain_id_MANTRA > ${CHAIN_ID_MANTRA}.\n"
echo -e "\nport_MANTRA > ${PORT_MANTRA}.\n"
```
      
- **Setting up the config**
      
```
mantrachaind config chain-id mantrachain-1
mantrachaind config keyring-backend test
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0uaum\"/" $HOME/.mantrachain/config/app.toml
```
- **Initialize the node**
```
mantrachaind init $MONIKER_MANTRA --chain-id $CHAIN_ID_MANTRA
```
      
- **Loading the genesis file and address book**
      
```
curl -Ls https://snapshots.revonode.xyz/mantra/genesis.json > $HOME/.mantrachain/config/genesis.json
curl -Ls https://snapshots.revonode.xyz/mantra/addrbook.json > $HOME/.mantrachain/config/addrbook.json
```
      
- **Adding seeds and peers**
      
```
PEERS="a435339f38ce3f973739a08afc3c3c7feb862dc5@35.192.223.187:26656"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" ~/.mantrachaind/config/config.toml
```
      
- **Setting up pruning**
      
```
PRUNING="custom"
PRUNING_KEEP_RECENT="100"
PRUNING_INTERVAL="19"
      
sed -i -e "s/^pruning *=.*/pruning = \"$PRUNING\"/" $HOME/.mantrachain/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \
\"$PRUNING_KEEP_RECENT\"/" $HOME/.mantrachain/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \
\"$PRUNING_INTERVAL\"/" $HOME/.mantrachain/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.mantrachain/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.mantrachain/config/config.toml
```
      
- **Create a service file**
      
```
sudo tee /etc/systemd/system/mantrachaind.service > /dev/null <<EOF
[Unit]
Description=mantrachaind testnet node
After=network-online.target
[Service]
User=$USER
ExecStart=$(which mantrachaind) start
Restart=always
RestartSec=3
LimitNOFILE=65535
[Install]
WantedBy=multi-user.target
EOF
```
- **Start the service and check the logs**
      
```
sudo systemctl daemon-reload && \
sudo systemctl enable mantrachaind && \
sudo systemctl restart mantrachaind && \
sudo journalctl -u mantrachaind -f -o cat
```
      
- **We are waiting for the end of synchronization, you can check the synchronization with the command**
      
```
mantrachaind status 2>&1 | jq .SyncInfo
```
      
If the output shows false, the sync is complete.
      
      
### Creating a wallet and validator
      
- **Create a wallet**
```
mantrachaind keys add $MONIKER_MANTRA
```
      
Save the mnemonic phrase in a safe place!
If you participated in previous testnets, restore the wallet with the command and enter the mnemonic phrase
      
```
mantrachaind keys add $MONIKER_MANTRA --recover
```
      
- **Create a variable with the address of the wallet and validator**
      
```
WALLET_MANTRA=$(mantrachaind keys show $MONIKER_MANTRA -a)
VALOPER_MANTRA=$(mantrachaind keys show $MONIKER_MANTRA --bech val -a)
      
echo "export WALLET_MANTRA="${WALLET_MANTRA}"" >> $HOME/.bash_profile
echo "export VALOPER_MANTRA="${VALOPER_MANTRA}"" >> $HOME/.bash_profile
source $HOME/.bash_profile
echo -e "\nwallet_MANTRA > ${WALLET_MANTRA}.\n"
echo -e "\nvaloper_MANTRA > ${VALOPER_MANTRA}.\n"
```
      
- **Checking your balance**
      
```
mantrachaind q bank balances $WALLET_MANTRA
```
      
- **After the synchronization is completed and the wallet is replenished, we create a validator**
      
```
mantrachaind tx staking create-validator \
--amount 1000000uself \
--pubkey $(mantrachaind tendermint show-validator) \
--moniker "MONIKER" \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id self-dev-1 \
--commission-rate="0.05" \
--commission-max-rate="0.20" \
--commission-max-change-rate="0.01" \
--min-self-delegation "1" \
--gas-prices="0.005uself" \
--gas="auto" \
--gas-adjustment="1.5" \
--from wallet \
-y
```
      
- **Deleting a node**
      
- **Before deleting a node, make sure that the files from the ~/.mantrachaind/config directory are saved
To remove a node, use the following commands**
      
```
sudo systemctl stop mantrachaind
sudo systemctl disable mantrachaind
sudo rm -rf $HOME/.mantrachaind
sudo rm -rf /etc/systemd/system/mantrachaind.service
sudo rm -rf /usr/local/bin/mantrachaind
sudo systemctl daemon-reload
```   
</p>
</div>
</section>

<style>
section {
 width: 100%;
 min-height: calc(100vh - 52px);
 background-color: black; /* Menambahkan background hitam */
 display: flex;
 flex-direction: column;
 justify-content: center;
 align-items: center;
 padding: 20px;
}
</style>