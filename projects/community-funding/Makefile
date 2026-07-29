.PHONY: install test node deploy

install:
	forge install foundry-rs/forge-std --no-commit

test:
	forge test -vv

node:
	anvil --chain-id 31337

deploy:
	forge script script/Deploy.s.sol:DeployCommunityFunding \
		--rpc-url $${RPC_URL} --broadcast
