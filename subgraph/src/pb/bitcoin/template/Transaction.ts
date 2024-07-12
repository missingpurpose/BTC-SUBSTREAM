// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";

export class Transaction {
  static encode(message: Transaction, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.id);

    writer.uint32(18);
    writer.string(message.sender);

    writer.uint32(26);
    writer.string(message.receiver);

    writer.uint32(32);
    writer.int64(message.value);

    writer.uint32(40);
    writer.int64(message.blockNumber);

    writer.uint32(48);
    writer.int64(message.timestamp);

    writer.uint32(56);
    writer.int64(message.fee);
  }

  static decode(reader: Reader, length: i32): Transaction {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new Transaction();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;

        case 2:
          message.sender = reader.string();
          break;

        case 3:
          message.receiver = reader.string();
          break;

        case 4:
          message.value = reader.int64();
          break;

        case 5:
          message.blockNumber = reader.int64();
          break;

        case 6:
          message.timestamp = reader.int64();
          break;

        case 7:
          message.fee = reader.int64();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  id: string;
  sender: string;
  receiver: string;
  value: i64;
  blockNumber: i64;
  timestamp: i64;
  fee: i64;

  constructor(
    id: string = "",
    sender: string = "",
    receiver: string = "",
    value: i64 = 0,
    blockNumber: i64 = 0,
    timestamp: i64 = 0,
    fee: i64 = 0
  ) {
    this.id = id;
    this.sender = sender;
    this.receiver = receiver;
    this.value = value;
    this.blockNumber = blockNumber;
    this.timestamp = timestamp;
    this.fee = fee;
  }
}
