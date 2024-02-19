<section class='flex gap-7 justify-center items-center flex-wrap text-white px-8% py-20'>
   <img class='rounded-xl' src="/images/testnet/avail.webp" alt="camiseta" />
   <div class='flex flex-col gap-4'>
   <h2 class='text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 from-10% via-primary via-30% to-green-600 font-semibold'>HOW TO INSTALL </h2>
   <p class='max-w-md'>

- **Update and install packages for compiling**

```
sudo apt update
sudo apt install make clang pkg-config libssl-dev build-essential
```

- **Create directory**

```
mkdir -p ${HOME}/avail-node/data
mkdir -p ${HOME}/avail-node/systemd
```

- **Download The Required Files**

```
cd ~/avail-node
wget https://github.com/availproject/avail/releases/download/v1.8.0.0/amd64-ubuntu-2204-data-avail.tar.gz
```
```
tar -xvzf amd64-ubuntu-2204-data-avail.tar.gz && rm amd64-ubuntu-2204-data-avail.tar.gz
mv amd64-ubuntu-2204-data-avail data-avail
```

- **Create a service file**

```
sudo tee /etc/systemd/system/availd.service > /dev/null <<EOF
[Unit]
Description=Avail Validator
After=network.target
StartLimitIntervalSec=0

[Service]
User=$USER
Type=simple
Restart=always
RestartSec=120
ExecStart=${HOME}/avail-node/data-avail --base-path ${HOME}/avail-node/data --chain goldberg --port 30333 --validator --name ""

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable availd
```

- **Start node**

```
sudo systemctl start availd
```

- **Check node logs**
```
sudo journalctl -fu availd
```

- The node will ouput the following when started:

```
2023-06-03 20:36:29 Avail Node
2023-06-03 20:36:29 ✌️  version 1.6.0-99b85257d6b
2023-06-03 20:36:29 ❤️  by Anonymous, 2017-2023
2023-06-03 20:36:29 📋 Chain specification: Avail Kate Testnet
2023-06-03 20:36:29 🏷  Node name: bewildered-distance-1229
2023-06-03 20:36:29 👤 Role:Authority
2023-06-03 20:36:29 💾 Database: RocksDb at /Users/thunder/code/avail/data/chains/Avail Testnet_6831251e-0222-11ee-a2c3-c90377335962/db/full
2023-06-03 20:36:29 ⛓  Native runtime: data-avail-9 (data-avail-0.tx1.au11)
2023-06-03 20:36:35 👶 Creating empty BABE epoch changes on what appears to be first startup.
2023-06-03 20:36:35 🏷  Local node identity is: 12D3KooWPt7odw3aeq7azZDugXjNuUvQNPU58n1VRBzY1YBqsjkr
2023-06-03 20:36:35 Prometheus metrics extended with avail metrics
2023-06-03 20:36:35 💻 Operating system: macos
2023-06-03 20:36:35 💻 CPU architecture: aarch64
2023-06-03 20:36:35 📦 Highest known block at #0
2023-06-03 20:36:35 〽️ Prometheus exporter started at 127.0.0.1:9615
2023-06-03 20:36:35 Running JSON-RPC HTTP server: addr=127.0.0.1:9933, allowed origins=["http://
2023-06-03 20:36:35 🏁 CPU score: 724.71 MiBs
2023-06-03 20:36:35 🏁 Memory score: 41.49 GiBs
2023-06-03 20:36:35 🏁 Disk score (seq. writes): 1.91 GiBs
2023-06-03 20:36:35 🏁 Disk score (rand. writes): 454.66 MiBs
```

- **Stake your validator**

Follow this guides : https://docs.availproject.org/operate/validator/staking/
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