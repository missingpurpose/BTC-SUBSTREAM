import { log } from "@graphprotocol/graph-ts";
import { Txo } from "./pb/bitcoin/template/Txo"; // 1.
import { Protobuf } from 'as-proto/assembly';
import { Transaction } from "../generated/schema"; // 2.
import { BigInt } from "@graphprotocol/graph-ts";

export function handleBlock(bytes: Uint8Array): void {
    const transactionsProto: Txo = Protobuf.decode<Txo>(bytes, Txo.decode);
    const transactions = transactionsProto.transactions; 

    if (transactions.length == 0) {
        log.info("No transactions found", []);
        return;
    }

    for (let i = 0; i < transactions.length; i++) {
        let transaction = transactions[i];

        let entity = new Transaction(transaction.id);
        entity.sender = transaction.sender;
        entity.receiver = transaction.receiver;
        entity.value = BigInt.fromI64(transaction.value);
        entity.blockNumber = BigInt.fromI64(transaction.blockNumber);
        entity.timestamp = BigInt.fromI64(transaction.timestamp);
        entity.save();
    }
}