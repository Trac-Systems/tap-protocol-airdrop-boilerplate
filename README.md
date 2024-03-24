# Airdrop Boilerplate for TAP Protocol

This boilerplate generates token-send (see https://github.com/BennyTheDev/tap-protocol-specs) inscription text for the TAP Protocol to perform airdrops.

Projects may find this boilerplate useful to create airdropping tools or perform actual airdrops.

It expects a CSV called "drop.csv" in its root folder that includes the token tickers, receiver addresses and amounts per token to be dropped.

Once generated, simply use an inscriber of your choice to perform the airdrop.

What it does:

- Validates all addresses and skips invalid ones
- Generates inscription text
- Chunks the results as text files into the "drop" folder

Check the "drop.csv" that ships with this boilerplate as sample and use exactly the same format.

## Requirements

NodeJS 20+

## Installation & Execution

Clone this repository in order to run:

```
git clone https://github.com/Trac-Systems/tap-protocol-airdrop-boilerplate.git
cd tap-protocol-airdrop-boilerplate
npm i
node tap-drop.mjs
```
