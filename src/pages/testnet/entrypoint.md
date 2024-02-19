<section class='flex gap-7 justify-center items-center flex-wrap text-white px-8% py-20'>
  <img class='rounded-xl' src="/images/testnet/entrypoint.webp" alt="camiseta" />
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
wget https://github.com/entrypoint-zone/testnets/releases/download/v1.2.0/entrypointd-1.2.0-linux-amd64 -O entrypointd
sudo chmod +x entrypointd
sudo mv entrypointd /usr/local/bin
```

- **Checking the version**

```
entrypointd version
#v1.2.0
```

- **Creating Variables**

```
MONIKER_ENTRYPOINT=type in your name
CHAIN_ID_ENTRYPOINT=mantrachain-1
PORT_ENTRYPOINT=47
```

- **Save variables, reload .bash_profile and check variable values**

```
echo "export MONIKER_ENTRYPOINT="${MONIKER_ENTRYPOINT}"" >> $HOME/.bash_profile
echo "export CHAIN_ID_ENTRYPOINT="${CHAIN_ID_ENTRYPOINT}"" >> $HOME/.bash_profile
echo "export PORT_ENTRYPOINT="${PORT_ENTRYPOINT}"" >> $HOME/.bash_profile
source $HOME/.bash_profile

echo -e "\nmoniker_ENTRYPOINT > ${MONIKER_ENTRYPOINT}.\n"
echo -e "\nchain_id_ENTRYPOINT > ${CHAIN_ID_ENTRYPOINT}.\n"
echo -e "\nport_ENTRYPOINT > ${PORT_ENTRYPOINT}.\n"
```

- **Setting up the config**

```
entrypointd config chain-id mantrachain-1
entrypointd config keyring-backend test
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0uaum\"/" $HOME/.entrypoint/config/app.toml
```

- **Initialize the node**

```
entrypointd init $MONIKER_ENTRYPOINT --chain-id $CHAIN_ID_ENTRYPOINT
```

- **Loading the genesis file and address book**

```
curl -Ls https://snapshots.indonode.net/entrypoint/genesis.json > $HOME/.entrypoint/config/genesis.json
curl -Ls https://snapshots.indonode.net/entrypoint/addrbook.json > $HOME/.entrypoint/config/addrbook.json
```

- **Adding seeds and peers**

```
SEEDS="e1b2eddac829b1006eb6e2ddbfc9199f212e505f@entrypoint-testnet-seed.itrocket.net:34656"
PEERS="7048ee28300ffa81103cd24b2af3d1af0c378def@entrypoint-testnet-peer.itrocket.net:34656"
sed -i -e "s/^seeds *=.*/seeds = \"$SEEDS\"/; s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.entrypoint/config/config.toml

```

- **Setting up pruning**

```
PRUNING="custom"
PRUNING_KEEP_RECENT="100"
PRUNING_INTERVAL="19"

sed -i -e "s/^pruning *=.*/pruning = \"$PRUNING\"/" $HOME/.entrypoint/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \
\"$PRUNING_KEEP_RECENT\"/" $HOME/.entrypoint/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \
\"$PRUNING_INTERVAL\"/" $HOME/.entrypoint/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.entrypoint/config/config.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.entrypoint/config/config.toml
```

- **Create a service file**

```
sudo tee /etc/systemd/system/entrypointd.service > /dev/null <<EOF
[Unit]
Description=entrypointd testnet node
After=network-online.target
[Service]
User=$USER
ExecStart=$(which entrypointd) start
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
sudo systemctl enable entrypointd && \
sudo systemctl restart entrypointd && \
sudo journalctl -u entrypointd -f -o cat
```

- **We are waiting for the end of synchronization, you can check the synchronization with the command**

```
entrypointd status 2>&1 | jq .SyncInfo
```

If the output shows false, the sync is complete.


### Creating a wallet and validator

- **Create a wallet**

```
entrypointd keys add $MONIKER_ENTRYPOINT
```

Save the mnemonic phrase in a safe place!

If you participated in previous testnets, restore the wallet with the command and enter the mnemonic phrase

```
entrypointd keys add $MONIKER_ENTRYPOINT --recover
```

- **Create a variable with the address of the wallet and validator**

```
WALLET_ENTRYPOINT=$(entrypointd keys show $MONIKER_ENTRYPOINT -a)
VALOPER_ENTRYPOINT=$(entrypointd keys show $MONIKER_ENTRYPOINT --bech val -a)

echo "export WALLET_ENTRYPOINT="${WALLET_ENTRYPOINT}"" >> $HOME/.bash_profile
echo "export VALOPER_ENTRYPOINT="${VALOPER_ENTRYPOINT}"" >> $HOME/.bash_profile
source $HOME/.bash_profile
echo -e "\nwallet_ENTRYPOINT > ${WALLET_ENTRYPOINT}.\n"
echo -e "\nvaloper_ENTRYPOINT > ${VALOPER_ENTRYPOINT}.\n"
```

- **Checking your balance**

```
entrypointd q bank balances $WALLET_ENTRYPOINT
```

- **After the synchronization is completed and the wallet is replenished, we create a validator**

```
entrypointd tx staking create-validator \
  --amount 1000000uentry \
  --pubkey $(entrypointd tendermint show-validator) \
  --moniker "MONIKER" \
  --identity="YOUR_KEYBASE_ID" \
  --details="YOUR_DETAILS" \
  --website="YOUR_WEBSITE_URL" \
  --chain-id entrypoint-pubtest-2 \
  --commission-rate="0.05" \
  --commission-max-rate="0.20" \
  --commission-max-change-rate="0.01" \
  --min-self-delegation "1" \
  --gas-prices="0.01ibc/8A138BC76D0FB2665F8937EC2BF01B9F6A714F6127221A0E155106A45E09BCC5" \
  --gas="auto" \
  --gas-adjustment="1.5" \
  --from wallet \
  -y
```

### Deleting a node

- **Before deleting a node, make sure that the files from the ~/.entrypointd/config directory are saved
  To remove a node, use the following commands**

```
sudo systemctl stop entrypointd
sudo systemctl disable entrypointd
sudo rm -rf $HOME/.entrypoint
sudo rm -rf /etc/systemd/system/entrypointd.service
sudo rm -rf /usr/local/bin/entrypointd
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