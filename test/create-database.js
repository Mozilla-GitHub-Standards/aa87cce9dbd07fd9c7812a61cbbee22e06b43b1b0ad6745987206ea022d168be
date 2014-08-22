/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

var path = require('path')

var test = require('tape')
var patcher = require('../')

test('check that createDatabase is being called when asked for', function(t) {
  t.plan(2)

  var count = 0
  var ctx = {
    connection : {
      query : function(sql, callback) {
        t.equal(sql, 'CREATE DATABASE IF NOT EXISTS database CHARACTER SET utf8 COLLATE utf8_unicode_ci')
        callback()
      },
    },
    options : {
      database       : 'database',
      createDatabase : true,
    },
  }

  patcher.createDatabase.call(ctx, function(err) {
    t.ok(!err, 'No error occurred')
    t.end()
  })
})

test('check that createDatabase is not being called when false', function(t) {
  t.plan(1)

  var count = 0
  var ctx = {
    connection : {
      query : function(sql, callback) {
        t.fail('.query() should not have been called with the create database command')
        callback()
      },
    },
    options : {
      database       : 'database',
      createDatabase : false,
    },
  }

  patcher.createDatabase.call(ctx, function(err) {
    t.ok(!err, 'No error occurred')
    t.end()
  })
})
