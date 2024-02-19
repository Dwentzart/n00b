
<section class='flex gap-7 justify-center items-center flex-wrap text-white px-8% py-20'>
   <img class='rounded-xl' src="/images/mainnet/blockx.webp" alt="camiseta" />
   <div class='flex flex-col gap-4'>
   <h2 class='text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 from-10% via-primary via-30% to-green-600 font-semibold'>HOW TO INSTALL </h2>
   
   <p class='max-w-md'>
   


## Server preparation

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


- **Clone the project repository with the node, go to the project folder and collect the binary files**

```
cd $HOME
git clone https://github.com/BlockXLabs/BlockX-Genesis-Mainnet1 blockx
cd blockx
git checkout c940d186c0d118ea017f6abc00225fdd9b26fe14
make install
```

- **Setting up the config**

```
blockxd config chain-id blockx_100-1
blockxd config keyring-backend file
```

- **Initialize the node**

```
blockxd init MyNode --chain-in blockx_100-1
```

- **Loading the genesis file and address book**

```
# Add Genesis File and Addrbook
curl -Ls https://snapshots.indonode.net/blockx/genesis.json > $HOME/.blockxd/config/genesis.json
curl -Ls https://snapshots.indonode.net/blockx/addrbook.json > $HOME/.blockxd/config/addrbook.json

```

- **Adding seeds and peers**

```
SEEDS=""
PEERS=""
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" ~/.blockxd/config/config.toml
```

- **Setting up pruning**

```
PRUNING="custom"
PRUNING_KEEP_RECENT="100"
PRUNING_INTERVAL="19"

sed -i -e "s/^pruning *=.*/pruning = "$PRUNING"/" $HOME/.blockxd/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = "$PRUNING_KEEP_RECENT"/" $HOME/.blockxd/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = "$PRUNING_INTERVAL"/" $HOME/.blockxd/config/app.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.blockxd/config/config.toml

```

- **Create a service file**

```
sudo tee /etc/systemd/system/blockxd.service > /dev/null <<EOF
[Unit]
Description=blockx mainnet node
After=network-online.target
[Service]
User=$USER
ExecStart=$(which blockxd) start
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
sudo systemctl enable blockxd && \
sudo systemctl restart blockxd && \
sudo journalctl -u blockxd -f -o cat
```

- **We are waiting for the end of synchronization, you can check the synchronization with the command**

```
blockxd status 2>&1 | jq .SyncInfo
```

If the output shows false, the sync is complete.


- **Create a wallet**

```
blockxd keys add wallet
```

Save the mnemonic phrase in a safe place!

If you participated in previous testnets, restore the wallet with the command and enter the mnemonic phrase

```
blockxd keys add wallet --recover
```
- **Checking your balance**

```
blockxd q bank balances $(blockxd keys show wallet -a)
```

- **After the synchronization is completed and the wallet is replenished, we create a validator**

```
blockxd tx staking create-validator \
  --amount "1000000abcx" \
  --pubkey $(blockxd tendermint show-validator) \
  --moniker "Dwentz" \
  --identity "" \
  --details "hey noders" \
  --website "YOUR WEBSITE" \
  --chain-id blockx_100-1 \
  --commission-rate "0.01" \
  --commission-max-rate "0.2" \
  --commission-max-change-rate "0.01" \
  --min-self-delegation "1" \
  --gas-prices 0.025abcx \
  --gas "auto" \
  --gas-adjustment "1.5" \
  --from wallet \
  -y
```

- **Before deleting a node, make sure that the files from the ~/.selfchaind/config directory are saved
  To remove a node, use the following commands**

```
sudo systemctl stop blockxd
sudo systemctl disable blockxd
sudo rm -rf $HOME/.blockxd
sudo rm -rf /etc/systemd/system/blockxd.service
sudo rm -rf go/bin/blockxd
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