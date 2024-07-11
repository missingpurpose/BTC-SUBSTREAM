// @generated
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Txo {
    #[prost(int64, tag="1")]
    pub txo_count: i64,
    #[prost(message, repeated, tag="2")]
    pub addresses: ::prost::alloc::vec::Vec<Address>,
    #[prost(message, repeated, tag="3")]
    pub transactions: ::prost::alloc::vec::Vec<Transaction>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Transaction {
    #[prost(string, tag="1")]
    pub id: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub sender: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub receiver: ::prost::alloc::string::String,
    #[prost(int64, tag="4")]
    pub value: i64,
    #[prost(int64, tag="5")]
    pub block_number: i64,
    #[prost(int64, tag="6")]
    pub timestamp: i64,
    #[prost(int64, tag="7")]
    pub fee: i64,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Address {
    #[prost(string, tag="1")]
    pub id: ::prost::alloc::string::String,
    #[prost(int64, tag="2")]
    pub balance: i64,
    #[prost(message, repeated, tag="3")]
    pub transactions: ::prost::alloc::vec::Vec<Transaction>,
}
// @@protoc_insertion_point(module)
