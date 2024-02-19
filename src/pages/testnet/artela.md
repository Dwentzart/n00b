<section class='flex gap-7 justify-center items-center flex-wrap text-white px-8% py-20'>
   <img class='rounded-xl' src="/images/testnet/artela.webp" alt="camiseta" />
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
# Install artela through repository
cd $HOME
rm -rf artela
git clone https://github.com/artela-network/artela artela
cd artela
git checkout v0.4.7-rc6
make install
```

- **Checking the version**

```

```

- **Creating Variables**

```
MONIKER_ARTELA=type in your name
CHAIN_ID_ARTELA=artela_11822-1
PORT_ARTELA=42
```

- **Save variables, reload .bash_profile and check variable values**

```
echo "export MONIKER_ARTELA="${MONIKER_ARTELA}"" >> $HOME/.bash_profile
echo "export CHAIN_ID_ARTELA="${CHAIN_ID_ARTELA}"" >> $HOME/.bash_profile
echo "export PORT_SELFCHAIN="${PORT_ARTELA"" >> $HOME/.bash_profile
source $HOME/.bash_profile

echo -e "\nmoniker_ARTELA > ${MONIKER_ARTELA}.\n"
echo -e "\nchain_id_ARTELA > ${CHAIN_ID_ARTELA}.\n"
echo -e "\nport_ARTELA > ${PORT_ARTELA}.\n"
```

- **Setting up the config**

```
# Set Configuration for your node
artelad config chain-id artela_11822-1
artelad config keyring-backend test
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.005uartela\"/" $HOME/.artelad/config/app.toml
```

- **Initialize the node**

```
artelad init $MONIKER_ARTELA --chain-in $CHAIN_ID_ARTELA
```

- **Loading the genesis file and address book**

```
curl -Ls https://snapshots.indonode.net/artela-t/genesis.json > $HOME/.artelad/config/genesis.json
curl -Ls https://snapshots.indonode.net/artela-t/addrbook.json > $HOME/.artelad/config/addrbook.json
```

- **Adding seeds and peers**

```
SEEDS="8d0c626443a970034dc12df960ae1b1012ccd96a@artela-testnet-seed.itrocket.net:30656"
PEERS="5c9b1bc492aad27a0197a6d3ea3ec9296504e6fd@artela-testnet-peer.itrocket.net:30656"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.artelad/config/config.toml

```

- **Setting up pruning**

```
PRUNING="custom"
PRUNING_KEEP_RECENT="100"
PRUNING_INTERVAL="19"

sed -i -e "s/^pruning *=.*/pruning = "$PRUNING"/" $HOME/.artelad/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = "$PRUNING_KEEP_RECENT"/" $HOME/.artelad/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = "$PRUNING_INTERVAL"/" $HOME/.artelad/config/app.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.artelad/config/config.toml
```

- **Create a service file**

```
sudo tee /etc/systemd/system/artelad.service > /dev/null <<EOF
[Unit]
Description=artela testnet node
After=network-online.target
[Service]
User=$USER
ExecStart=$(which artelad) start
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
sudo systemctl enable artelad && \
sudo systemctl restart artelad && \
sudo journalctl -u artelad -f -o cat
```

- **We are waiting for the end of synchronization, you can check the synchronization with the command**

```
artelad status 2>&1 | jq .SyncInfo
```

If the output shows false, the sync is complete.


### Creating a wallet and validator

- **Create a wallet**

```
artelad  keys add wallet
```

Save the mnemonic phrase in a safe place!

If you participated in previous testnets, restore the wallet with the command and enter the mnemonic phrase

```
artelad keys add wallet --recover
```

- **Checking your balance**

```
artelad q bank balances $(artelad keys show wallet -a)
```

- **After the synchronization is completed and the wallet is replenished, we create a validator**

```
artelad tx staking create-validator \
  --amount "1000000uart" \
  --pubkey $(artelad tendermint show-validator) \
  --moniker "<MONIKER>" \
  --identity "" \
  --details "" \
  --website "YOUR WEBSITE" \
  --chain-id artela_11822-1 \
  --commission-rate "0.01" \
  --commission-max-rate "0.2" \
  --commission-max-change-rate "0.01" \
  --min-self-delegation "1" \
  --gas-prices 0.02uart \
  --gas "auto" \
  --gas-adjustment "1.5" \
  --from wallet \
  -y
```

### Deleting a node

- **Before deleting a node, make sure that the files from the ~/.artelad/config directory are saved
  To remove a node, use the following commands**

```
sudo systemctl stop artelad
sudo systemctl disable artelad
sudo rm -rf $HOME/.artelad
sudo rm -rf /etc/systemd/system/artelad.service
sudo rm -rf go/bin/artelad
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