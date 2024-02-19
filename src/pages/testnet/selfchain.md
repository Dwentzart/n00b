<section class='flex gap-7 justify-center items-center flex-wrap text-white px-8% py-20'>
   <img class='rounded-xl' src="/images/testnet/selfchain.webp" alt="camiseta" />
   <div class='flex flex-col gap-4'>
   <h2 class='text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 from-10% via-primary via-30% to-green-600 font-semibold'>HOW TO INSTALL </h2>
   <h4></h4>
   <p class='max-w-md'>
   
### Server preparation

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
ver="1.20"
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
wget https://snapshots.indonode.net/selfchain/selfchaind
sudo chmod +x selfchaind
sudo mv selfchaind /usr/local/bin
```

- **Checking the version**

```
selfchaind version
#0.2.2
```

- **Creating Variables**

```
MONIKER_SELFCHAIN=type in your name
CHAIN_ID_SELFCHAIN=self-dev-1
PORT_SELFCHAIN=37
```

- **Save variables, reload .bash_profile and check variable values**

```
echo "export MONIKER_SELFCHAIN="${MONIKER_SELFCHAIN}"" >> $HOME/.bash_profile
echo "export CHAIN_ID_SELFCHAIN="${CHAIN_ID_SELFCHAIN}"" >> $HOME/.bash_profile
echo "export PORT_SELFCHAIN="${PORT_SELFCHAIN}"" >> $HOME/.bash_profile
source $HOME/.bash_profile

echo -e "\nmoniker_SELFCHAIN > ${MONIKER_SELFCHAIN}.\n"
echo -e "\nchain_id_SELFCHAIN > ${CHAIN_ID_SELFCHAIN}.\n"
echo -e "\nport_SELFCHAIN > ${PORT_SELFCHAIN}.\n"
```

- **Setting up the config**

```
selfchaind config chain-id self-dev-1
selfchaind config keyring-backend test
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.005uself\"/" $HOME/.selfchain/config/app.toml
```

- **Initialize the node**

```
selfchaind init $MONIKER_SELFCHAIN --chain-id $CHAIN_ID_SELFCHAIN
```

- **Loading the genesis file and address book**

```
wget -O $HOME/.selfchain/config/genesis.json  https://raw.githubusercontent.com/hotcrosscom/selfchain-genesis/main/networks/devnet/genesis.json
curl -Ls https://snapshots.indonode.net/selfchain/addrbook.json > $HOME/.selfchain/config/addrbook.json
```

- **Adding seeds and peers**

```
SEEDS="94a7baabb2bcc00c7b47cbaa58adf4f433df9599@157.230.119.165:26656,d3b5b6ca39c8c62152abbeac4669816166d96831@165.22.24.236:26656
PEERS="94a7baabb2bcc00c7b47cbaa58adf4f433df9599@157.230.119.165:26656,d3b5b6ca39c8c62152abbeac4669816166d96831@165.22.24.236:26656
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" ~/.selfchaind/config/config.toml
```

- **Setting up pruning**

```
PRUNING="custom"
PRUNING_KEEP_RECENT="100"
PRUNING_INTERVAL="19"

sed -i -e "s/^pruning *=.*/pruning = \"$PRUNING\"/" $HOME/.selfchain/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \
\"$PRUNING_KEEP_RECENT\"/" $HOME/.selfchain/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \
\"$PRUNING_INTERVAL\"/" $HOME/.selfchain/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.selfchain/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.selfchain/config/config.toml
```

- **Create a service file**

```
sudo tee /etc/systemd/system/selfchaind.service > /dev/null <<EOF
[Unit]
Description=selfchaind testnet node
After=network-online.target
[Service]
User=$USER
ExecStart=$(which selfchaind) start
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
sudo systemctl enable selfchaind && \
sudo systemctl restart selfchaind && \
sudo journalctl -u selfchaind -f -o cat
```

- **We are waiting for the end of synchronization, you can check the synchronization with the command**

```
selfchaind status 2>&1 | jq .SyncInfo
```

If the output shows false, the sync is complete.


### Creating a wallet and validator

- **Create a wallet**

```
selfchaind keys add $MONIKER_SELFCHAIN
```

Save the mnemonic phrase in a safe place!

If you participated in previous testnets, restore the wallet with the command and enter the mnemonic phrase

```
selfchaind keys add $MONIKER_SELFCHAIN --recover
```

- **Create a variable with the address of the wallet and validator**

```
WALLET_SELFCHAIN=$(selfchaind keys show $MONIKER_SELFCHAIN -a)
VALOPER_SELFCHAIN=$(selfchaind keys show $MONIKER_SELFCHAIN --bech val -a)

echo "export WALLET_SELFCHAIN="${WALLET_SELFCHAIN}"" >> $HOME/.bash_profile
echo "export VALOPER_SELFCHAIN="${VALOPER_SELFCHAIN}"" >> $HOME/.bash_profile
source $HOME/.bash_profile
echo -e "\nwallet_SELFCHAIN > ${WALLET_SELFCHAIN}.\n"
echo -e "\nvaloper_SELFCHAIN > ${VALOPER_SELFCHAIN}.\n"
```

- **Checking your balance**

```
selfchaind q bank balances $WALLET_SELFCHAIN
```

- **After the synchronization is completed and the wallet is replenished, we create a validator**

```
selfchaind tx staking create-validator \
  --amount 1000000uself \
  --pubkey $(selfchaind tendermint show-validator) \
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

### Deleting a node

- **Before deleting a node, make sure that the files from the ~/.selfchaind/config directory are saved
  To remove a node, use the following commands**

```
sudo systemctl stop selfchaind
sudo systemctl disable selfchaind
sudo rm -rf $HOME/.selfchain
sudo rm -rf /etc/systemd/system/selfchaind.service
sudo rm -rf /usr/local/bin/selfchaind
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