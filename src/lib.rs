use pb::bitcoin::template::{Txo, Transaction, Address};
use substreams;
use substreams_bitcoin::pb::btc::v1::Block;
mod pb;

#[substreams::handlers::map]
pub fn map_tx(block: Block) -> Result<Txo, substreams::errors::Error> {
    let mut txo_count = 0;
    let mut transactions = vec![];
    let mut address_map = std::collections::HashMap::new();

    for tx in &block.tx {
        let mut tx_value = 0.0;
        let mut total_input_value = 0.0;
        let mut total_output_value = 0.0;

        for vin in &tx.vin {
            // Fetch the previous transaction output value
            if let Some(prev_tx) = block.tx.iter().find(|prev_tx| prev_tx.hash == vin.txid) {
                if let Some(prev_vout) = prev_tx.vout.get(vin.vout as usize) {
                    total_input_value += prev_vout.value;
                }
            }
        }

        for vout in &tx.vout {
            txo_count += 1;
            tx_value += vout.value;
            total_output_value += vout.value;

            if let Some(script_pub_key) = &vout.script_pub_key {
                if let Some(address) = script_pub_key.addresses.first() {
                    let balance = address_map.entry(address.clone()).or_insert(0.0);
                    *balance += vout.value;
                }
            }
        }

        let sender = tx.vin.first().map(|vin| vin.txid.clone()).unwrap_or_default();
        let receiver = tx.vout.first().and_then(|vout| vout.script_pub_key.as_ref().and_then(|spk| spk.addresses.first().cloned())).unwrap_or_default();

        transactions.push(Transaction {
            id: tx.hash.clone(),
            sender,
            receiver,
            value: tx_value as i64,
            block_number: block.height,
            timestamp: block.time,
            fee: (total_input_value - total_output_value) as i64, // Added this line
        });
    }

    let addresses: Vec<Address> = address_map.into_iter().map(|(id, balance)| Address {
        id,
        balance: balance as i64,
        transactions: vec![],
    }).collect();

    Ok(Txo {
        txo_count,
        addresses,
        transactions,
    })
}