import { log } from "@graphprotocol/graph-ts";
import { Txo } from "./pb/bitcoin/template/Txo";
import { Protobuf } from 'as-proto/assembly';
import { Transaction, Address } from "../generated/schema";
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

        let senderAddress = Address.load(transaction.sender);
        if (senderAddress == null) {
            senderAddress = new Address(transaction.sender);
            senderAddress.save();
        }

        let receiverAddress = Address.load(transaction.receiver);
        if (receiverAddress == null) {
            receiverAddress = new Address(transaction.receiver);
            receiverAddress.save();
        }

        let entity = new Transaction(transaction.id);
        entity.sender = senderAddress.id;
        entity.receiver = receiverAddress.id;
        entity.value = BigInt.fromI64(transaction.value);
        entity.blockNumber = BigInt.fromI64(transaction.blockNumber);
        entity.timestamp = BigInt.fromI64(transaction.timestamp);
        entity.fee = BigInt.fromI64(transaction.fee);
        entity.save();
    }
}