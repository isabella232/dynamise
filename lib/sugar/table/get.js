"use strict";

function get(client, definition) {
  if (definition) {
    return client.tables[definition];
  }
  if (!definition) {
    return client.tables;
  }
}

module.exports = get;