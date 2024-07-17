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

        // Load sender entity
        let sender = GetOrCreateAddress(transaction.sender);

        // Ensure vouts is not null
        if (transaction.vouts == null) {
            log.warning("Transaction vouts is null for transaction ID: {}", [transaction.id]);
            continue;
        }

        // Loop through each vout to handle multiple receivers
        for (let j = 0; j < transaction.vouts.length; j++) {
            let vout = transaction.vouts[j];
            let receiver = GetOrCreateAddress(vout.receiver);

            // Create a new transaction entity
            let uniqueId = `${transaction.blockNumber}-${transaction.id}-${j}`;
            let transactionEntity = Transaction.load(uniqueId);
            if (!transactionEntity) {
                transactionEntity = new Transaction(uniqueId);
                transactionEntity.sender = sender.id;
                transactionEntity.receiver = receiver.id;
                transactionEntity.value = BigInt.fromI64(vout.value);
                transactionEntity.blockNumber = BigInt.fromI64(transaction.blockNumber);
                transactionEntity.timestamp = BigInt.fromI64(transaction.timestamp);
                transactionEntity.fee = BigInt.fromI64(transaction.fee);
                transactionEntity.save();
            }

            if (sender.balance < transactionEntity.value) {
                log.warning("Sender has insufficient balance for transaction ID: {}", [transaction.id]);
                continue;
            }

            sender.balance = sender.balance.minus(transactionEntity.value);
            receiver.balance = receiver.balance.plus(transactionEntity.value);

            sender.priorTransaction = transactionEntity.id;
            receiver.priorTransaction = transactionEntity.id;

            receiver.save();
        }

        sender.save();
    }
}

function GetOrCreateAddress(address: string): Address {
    let addressEntity = Address.load(address);
    if (addressEntity == null) {
        addressEntity = new Address(address);
        addressEntity.balance = BigInt.fromI64(0);
        addressEntity.save(); // Save the new address entity
    }
    return addressEntity as Address;
}