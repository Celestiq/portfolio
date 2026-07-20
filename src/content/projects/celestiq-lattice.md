---
title: Celestiq Lattice
description: "Lattice is a protocol for letting independent systems — a home's devices, a company's servers, an AI agent, another organization entirely — exchange structured data directly with each other, instead of routing it through a shared cloud service that sits in the middle and can see everything. Each installation, called a node, runs on its own, and any two nodes can choose to connect to each other as equals."
link: https://github.com/Celestiq/lattice/
---

# Celestiq Lattice

## Abstract

Lattice is a protocol for letting independent systems — a home's devices, a company's servers, an AI agent, another organization entirely — exchange structured data directly with each other, instead of routing it through a shared cloud service that sits in the middle and can see everything. Each installation, called a node, runs on its own, and any two nodes can choose to connect to each other as equals.

## Problem

When two parties need to exchange data today, they usually pick one of two options: route it through a shared cloud platform, which then has full visibility into everything passing through and can change its own rules unilaterally — or build a one-off custom integration, which only works for that single relationship and has to be rebuilt for the next one. Neither approach lets two operators who've never met agree on what a message means and then keep independent, revocable control over what actually crosses between them. Lattice exists to give any two parties — a home and a utility company, two businesses, a device and its owner's phone — a shared way to define their data and connect on their own terms, with no one else able to see what's flowing between them.

## Approach

Every participant in Lattice is identified the same way, whether it's a sensor, a person's laptop, or a company's server: a public/private keypair. There's no separate identity system for "devices" versus "users" versus "organizations" — one flat model covers all of them, which keeps the protocol simple as new kinds of participants show up.

Messages aren't just bytes with a meaning that lives in someone's documentation. Every message is checked against a declared schema before it's delivered, so both sides can be certain they're interpreting the data the same way — and this check happens inside the message bus itself, not left up to each application to enforce (or forget to enforce) on its own. This is what makes the exchange meaningful rather than just a transport: two independently built systems can understand each other because they share a contract, not just a pipe.

Two ways of addressing a message exist side by side. A message can be broadcast to a named topic, so that anyone interested can subscribe to it without the sender needing to know who's listening. Or it can be addressed directly to a specific participant, for a request that expects a response back — a command or a query rather than an announcement.

For connecting two separate installations to each other, the design favors something simple and understandable over adopting the most feature-complete existing peer-to-peer stack. Two nodes connect to each other directly over an encrypted channel; a small, separate lookup service only helps them find each other's current network address — it never sees any of the actual messages. A connection between two nodes only forms if both operators explicitly agree to it, and either side can pause or cut it at any time without needing the other's permission. Once connected, what data flows in each direction — and which of a node's own participants are even reachable from outside — is governed by rules each operator sets independently. An application running on a node has no way to bypass those rules; the node enforces them on its behalf.

Taken together, these ideas are what give Lattice its central property: sovereignty is built into the architecture rather than promised as a policy. A node's operator doesn't have to trust another party's word that data will be handled a certain way — the protocol simply never gives them a way to see or touch more than what's been explicitly agreed to.
