#!/usr/bin/env node

"use strict";

const minimist = require("minimist");
const { createDb } = require("./lib/db");
const argv = minimist(process.argv.slice(2));

async function main() {
  const db = await createDb();
  const command = argv._.shift();

  switch (command) {
    case "users:create":
      try {
        const { user, pass } = argv;
        await db.creteUser(user, pass);
        console.log(`${user} created`);
      } catch (err) {
        throw new Error("Cannot create user");
      }
      break;
    case "users:list":
      try {
        const results = await db.listUsers();
        results.users.forEach((u) => {
          console.log(`- ${u.user}`);
        });
        console.log(`Total: ${results.count}`);
      } catch (err) {
        throw new Error("Cannot list user");
      }
      break;
    case "secrets:create":
      try {
        const { user, name, value } = argv;
        await db.createSecret(user, name, value);
        console.log(`secret: ${name} created`);
      } catch (err) {
        throw new Error("Cannot create secret");
      }
      break;
    case "secrets:list":
      try {
        const { user } = argv;
        const secrets = await db.listSecrets(user);
        secrets.forEach((s) => {
          console.log(`- ${s.name}`);
        });
      } catch (err) {
        throw new Error("Cannot list secrets");
      }
      break;
    case "secrets:get":
      try {
        const { user, name } = argv;
        const secret = await db.getSecret(user, name);
        console.log(`- ${secret.name} = ${secret.value}`);
      } catch (err) {
        throw new Error("Cannot get secret");
      }
      break;
    default:
      console.error(`command not found: ${command}`);
  }
}

main().catch((err) => console.log(err));
