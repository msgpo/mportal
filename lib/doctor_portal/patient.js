// -*- mode: js; indent-tabs-mode: nil; js-basic-offset: 4 -*-
//
// This file is part of Stanford MPortal
//
// Copyright 2016 Giovanni Campagna <gcampagn@cs.stanford.edu>
//
// See COPYING for details
"use strict";

module.exports = {
    getOrCreate: function(db, omletId, patientInfo) {
        return db('mhealth_patient').select('id').where({ username: omletId }).then(function(rows) {
            if (rows.length > 0) {
                return db('mhealth_patient').update({ gender: patientInfo.gender,
                                                      dob: patientInfo.date_of_birth,
                                                      full_name: patientInfo.full_name })
                    .where({ id: rows[0].id }).then(function() {
                        return rows[0].id;
                    });
            } else {
                return db('mhealth_patient').insert({ username: omletId,
                                                      gender: patientInfo.gender,
                                                      dob: patientInfo.date_of_birth,
                                                      full_name: patientInfo.full_name })
                    .then(function(ids) {
                        return ids[0];
                    });
            }
        });
    },

    getExisting: function(db, omletId) {
        return db('mhealth_patient').select('id').where({ username: omletId }).first();
    },

    _mapRecord: function(patientId, record) {
        if (record.type === 'height')
            return ({ patient_id: patientId, type: record.type, height: record.height, timestamp: record.collect_time });
        else if (record.type === 'weight')
            return ({ patient_id: patientId, type: record.type, weight: record.weight, timestamp: record.collect_time });
        else if (record.type !== 'gender') // ignore gender records
            return ({ patient_id: patientId, type: record.type, picture: record.picture_url, timestamp: record.collect_time });
    },

    syncMedicalRecords: function(db, patientId, records) {
        return db('mhealth_medicalrecord').where({ patient_id: patientId }).del().then(function() {
            return db('mhealth_medicalrecord').insert(records.map(function(record) {
                return this._mapRecord(patientId, record);
            }, this));
        }.bind(this));
    },

    insertMedicalRecord: function(db, patientId, record) {
        return db('mhealth_medicalrecord').insert(this._mapRecord(patientId, record));
    }
}