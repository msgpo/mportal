// -*- mode: js; indent-tabs-mode: nil; js-basic-offset: 4 -*-
//
// This file is part of Stanford MPortal
//
// Copyright 2016 Giovanni Campagna <gcampagn@cs.stanford.edu>
//
// See COPYING for details
"use strict";

function getDB() {
    var url = process.env.PORTAL_DATABASE_URL;
    if (url === undefined)
        return "mysql://mhealthuser:R00t%40Mhealth@10.34.167.102/mhealthDB?charset=utf8mb4_bin";
    else
        return url;
}

module.exports = require('knex')({
    client: 'mysql',
    connection: getDB(),
});