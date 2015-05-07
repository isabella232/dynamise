"use strict";

function set(client, definitions) {
  for (var definition in definitions) {
    if (definitions.hasOwnProperty(definition)) {
      client.tables[definition] = definitions[definition];
    }
  }
}

module.exports = set;