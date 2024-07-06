use pb::bitcoin::template::Txo;
use substreams;
use substreams_bitcoin::pb::btc::v1::Block;
mod pb;

#[substreams::handlers::map]
pub fn map_tx(block: Block) -> Result<Txo, substreams::errors::Error> {
    

    for tx in block.tx {
        substreams::log::println(format!("Tx Hash: {}", tx.hash));
        for vin in tx.vin {
            substreams::log::println(format!("Coinbase: {}", &vin.coinbase));
            substreams::log::println(format!("Linked Prev Tx: {}", &vin.txid));
            substreams::log::println(format!("Vout Index: {}", &vin.vout));

        }

        for vout in tx.vout {
            substreams::log::println(format!("Vout Value: {}", &vout.value));
        }
    }



    Ok(Txo{
        txo_count: 1
    })

}