<section class='flex gap-7 justify-center items-center flex-wrap text-white px-8% py-20'>
   <img class='rounded-xl' src="/images/testnet/webb.webp" alt="camiseta" />
   <div class='flex flex-col gap-4'>
   <h2 class='text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 from-10% via-primary via-30% to-green-600 font-semibold'>HOW TO INSTALL </h2>
   <h4></h4>
   <p class='max-w-md'>

- **Install Dependencies**

```
sudo apt install -y git clang curl libssl-dev llvm libudev-dev make protobuf-compiler
```
      
- **Download Binary & Copy to /usr/bin**
      
```
wget -O /usr/bin/tangle https://github.com/webb-tools/tangle/releases/download/v0.6.1/tangle-testnet-linux-amd64
```
```
sudo chmod +x tangle /usr/bin/tangle
```
      
- **Create a service**
```
sudo tee /etc/systemd/system/tangle.service > /dev/null << EOF
[Unit]
Description=Tangle Validator Node
After=network-online.target
StartLimitIntervalSec=0
      
[Service]
User=$USER
Restart=always
RestartSec=3
ExecStart=/usr/bin/tangle \
 --base-path $HOME/.tangle/data/validator/YourName \
 --name YourName \
 --chain tangle-testnet \
 --auto-insert-keys \
 --port 30333 \
 --telemetry-url "wss://telemetry.polkadot.io/submit/ 0" \
 --validator \
 --no-mdns
      
[Install]
WantedBy=multi-user.target
EOF
```     
- **Enable service**
      
```
sudo systemctl daemon-reload
sudo systemctl enable tangle
sudo systemctl start tangle
```
      
- **Check the logs**
      
```
sudo journalctl -u tangle -f --no-hostname -o cat
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