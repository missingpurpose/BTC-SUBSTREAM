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

    // Loop through each transaction
    for (let i = 0; i < transactions.length; i++) {
        let transaction = transactions[i];

        // Load sender and receiver entity
        let sender = GetOrCreateAddress(transaction.sender);
        let receiver = GetOrCreateAddress(transaction.receiver);

        // Create a new transaction entity
        let transactionEntity = Transaction.load(transaction.id);
        if (!transactionEntity) {
            transactionEntity = new Transaction(transaction.id);
            transactionEntity.sender = sender.id;
            transactionEntity.receiver = receiver.id;
            transactionEntity.value = BigInt.fromI64(transaction.value);
            transactionEntity.blockNumber = BigInt.fromI64(transaction.blockNumber);
            transactionEntity.timestamp = BigInt.fromI64(transaction.timestamp);
            transactionEntity.fee = BigInt.fromI64(transaction.fee);
            transactionEntity.save();
        }

        sender.balance = sender.balance.minus(transactionEntity.value);
        receiver.balance = receiver.balance.plus(transactionEntity.value);

        sender.priorTransaction = transactionEntity.id;
        receiver.priorTransaction = transactionEntity.id;

        sender.save();
        receiver.save();

    }
}

function GetOrCreateAddress(address: string): Address {
    let addressEntity = Address.load(address);
    if (addressEntity == null) {
        addressEntity = new Address(address);
        addressEntity.balance = BigInt.fromI64(0);
    }
    return addressEntity as Address;
}