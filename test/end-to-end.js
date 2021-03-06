/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

var path = require('path')

var patcher = require('../')
var mysql = require('mysql')

var test = require('tape')

var options = {
  createDatabase : true,
  user       : 'root',
  database   : 'patcher',
  password   : '',
  dir        : path.join(__dirname, 'end-to-end'),
  metaTable  : 'metadata',
  patchKey   : 'schema-patch-level',
  patchLevel : 3,
  mysql      : mysql,
}

// create a connection for us to use directly
var connection = mysql.createConnection(options)

test('run an end to end test, with no error (to patch 0)', function(t) {
  t.plan(5)

  // change the expected patchLevel to 0
  options.patchLevel = 0

  patcher.patch(options, function(err, res) {
    t.ok(!err, 'There was no error when patching the database')

    // check the metadata table does not yet exist
    connection.query("SELECT value FROM metadata WHERE name = 'schema-patch-level'", function(err, res) {
      t.ok(err, 'There was an error getting the database patch level')
      t.equal(err.code, 'ER_NO_SUCH_TABLE', 'No metadata table')
      t.equal(err.errno, 1146, 'Correct error number')
      t.equal(err.message, "ER_NO_SUCH_TABLE: Table 'patcher.metadata' doesn't exist", 'Correct message')

      t.end()
    })
  })
})

test('run an end to end test, with no error(to patch 3)', function(t) {
  t.plan(3)

  // change the expected patchLevel to 3
  options.patchLevel = 3

  patcher.patch(options, function(err, res) {
    t.ok(!err, 'There was no error when patching the database')

    // check the metadata key has been updated to 3
    connection.query("SELECT value FROM metadata WHERE name = 'schema-patch-level'", function(err, res) {
      t.ok(!err, 'There was no error getting the database patch level')

      t.equal(res[0].value, '3', 'The database patch level is correct')

      t.end()
    })
  })
})

test('run an end to end test, with no error (back to patch 0)', function(t) {
  t.plan(5)

  // change the expected patchLevel to 0
  options.patchLevel = 0

  patcher.patch(options, function(err, res) {
    t.ok(!err, 'There was no error when patching the database')

    // check the metadata table no longer exists
    connection.query("SELECT value FROM metadata WHERE name = 'schema-patch-level'", function(err, res) {
      t.ok(err, 'There was an error getting the database patch level')
      t.equal(err.code, 'ER_NO_SUCH_TABLE', 'No metadata table')
      t.equal(err.errno, 1146, 'Correct error number')
      t.equal(err.message, "ER_NO_SUCH_TABLE: Table 'patcher.metadata' doesn't exist", 'Correct message')

      t.end()
    })
  })
})

test('the last test, just to close the connection', function(t) {
  connection.end()
  t.end()
})

