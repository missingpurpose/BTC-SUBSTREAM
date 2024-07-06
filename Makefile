.PHONY: all
all:
	make build
	make pack
	make graph
	make info

.PHONY: build
build:
	AR=F:/clang_llvm/bin/llvm-ar CC=F:/clang_llvm/bin/clang cargo build --target wasm32-unknown-unknown --release

.PHONY: protogen
protogen:
	substreams protogen --exclude-paths sf/substreams,google

.PHONY: pack
pack:
	substreams pack

.PHONY: graph
graph:
	substreams graph

.PHONY: info
info:
	substreams info

.PHONY: gui
gui:
	substreams gui -e mainnet.btc.streamingfast.io:443 map_tx -s 850860 -t +100
