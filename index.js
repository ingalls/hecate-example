#!/usr/env node

const request = require('request');
const fs = require('fs');
const path = require('path');
const { Client } = require('pg')

const test = require('tape');

test('Populate Hecate Instance', (t) => {
    t.test('Ensure server is running', (q) => {
        request('http://localhost:8000', (err, res) => {
            q.error(err);
            q.equals(res.statusCode, 200);
            q.end();
        });
    });

    t.test('Add Bounds Data', (q) => {
        const client = new Client({
              user: 'postgres',
              host: 'localhost',
              database: 'hecate',
              port: 5432,
        });
        
        client.connect()

        client.query(`
            BEGIN;
                DELETE FROM bounds;

                INSERT INTO bounds(name, geom, props)
                    VALUES (
                        'us-wv',
                        ST_Multi(ST_SetSRID(ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-81.7547607421875,37.339591851359174],[-77.882080078125,37.339591851359174],[-77.882080078125,39.71141252523694],[-81.7547607421875,39.71141252523694],[-81.7547607421875,37.339591851359174]]]}'),4326)),
                        '{}'
                    );

                INSERT INTO bounds(name, geom, props)
                    VALUES (
                        'us-wv-senca_rocks',
                        ST_Multi(ST_SetSRID(ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-79.39862251281738,38.814097992007646],[-79.3476390838623,38.814097992007646],[-79.3476390838623,38.85849105875954],[-79.39862251281738,38.85849105875954],[-79.39862251281738,38.814097992007646]]]}'),4326)),
                        '{}'
                    );
            COMMIT;
        `, (err, res) => {
            q.error(err);

            client.end();

            q.end();
        });
    });

    t.test('Create User: ingalls', (q) => {
        request('http://localhost:8000/api/user/create?username=ingalls&password=yeaheh&email=ingalls@example.com', (err, res) => {
            q.error(err);
            q.equals(res.statusCode, 200);
            q.end();
        });
    });

    t.test('Create User: mark', (q) => {
        request('http://localhost:8000/api/user/create?username=mark&password=ehyeah&email=mark@example.com', (err, res) => {
            q.error(err);
            q.equals(res.statusCode, 200);
            q.end();
        });
    });

    t.test('Create Data: Highways (ingalls)', (q) => {
        request.post({
            url: 'http://ingalls:yeaheh@localhost:8000/api/data/features',
            json: true,
            body: {
                "type": "FeatureCollection",
                "message": "Import Seneca Rocks Streets",
                "features": [{
                    "type": "Feature",
                    "action": "create",
                    "properties": { "highway": "primary", "name": "Route 28" },
                    "geometry": { "type": "LineString", "coordinates": [ [ -79.37619924545288, 38.8345346107744 ], [ -79.37287330627441, 38.83762675779815 ], [ -79.37230467796326, 38.83820338656929 ], [ -79.37211155891418, 38.83878001066818 ] ] }
                },{
                    "type": "Feature",
                    "action": "create",
                    "properties": { "highway": "primary", "name": "Allegheny Drive" },
                    "geometry": { "type": "LineString", "coordinates": [ [ -79.37619924545288, 38.8345346107744 ], [ -79.37821626663208, 38.83474354385938 ], [ -79.38022255897522, 38.834944119043975 ], [ -79.38199281692505, 38.83490233259378 ] ] }
                }, {
                    "type": "Feature",
                    "action": "create",
                    "properties": { "highway": "primary", "name": "Route 33" },
                    "geometry": { "type": "LineString", "coordinates": [ [ -79.37752962112427, 38.8298794225814 ], [ -79.37637090682983, 38.8320691540529 ], [ -79.37600612640381, 38.83253717952298 ], [ -79.37619924545288, 38.8345346107744 ] ] }
                }]
            }
        }, (err, res) => {
            q.error(err);
            q.equals(res.statusCode, 200);
            q.end();
        });
    });

    t.test('Create Data: Buildings (ingalls)', (q) => {
        request.post({
            url: 'http://ingalls:yeaheh@localhost:8000/api/data/features',
            json: true,
            body: {
                "type": "FeatureCollection",
                "message": "Import Seneca Rocks Buildings",
                "features": [{
                    "type": "Feature",
                    "action": "create",
                    "properties": { "building": true },
                    "geometry": { "type": "Polygon", "coordinates": [ [ [ -79.37664985656737, 38.834342391794515 ], [ -79.37683761119843, 38.83417942312231 ], [ -79.37662839889525, 38.83400809667998 ], [ -79.3764191865921, 38.83417524443351 ], [ -79.37664985656737, 38.834342391794515 ] ] ] }
                },{
                    "type": "Feature",
                    "action": "create",
                    "properties": { "building": true },
                    "geometry": { "type": "Polygon", "coordinates": [ [ [ -79.37707901000977, 38.83441133996658 ], [ -79.37686175107956, 38.83433194509595 ], [ -79.37679201364517, 38.83445103736866 ], [ -79.37700927257538, 38.8345346107744 ], [ -79.37707901000977, 38.83441133996658 ] ] ] }
                },{
                    "type": "Feature",
                    "action": "create",
                    "properties": { "building": true },
                    "geometry": { "type": "Polygon", "coordinates": [ [ [ -79.377121925354, 38.83396839903083 ], [ -79.37703341245651, 38.83393496941438 ], [ -79.37689930200577, 38.83422538868303 ], [ -79.37697976827621, 38.8342462821099 ], [ -79.377121925354, 38.83396839903083 ] ] ] }
                },{
                    "type": "Feature",
                    "action": "create",
                    "properties": { "building": true },
                    "geometry": { "type": "Polygon", "coordinates": [ [ [ -79.37730967998505, 38.83480622366528 ], [ -79.37731504440308, 38.8347310078916 ], [ -79.37715411186218, 38.83472473990687 ], [ -79.37714874744415, 38.83480622366528 ], [ -79.37730967998505, 38.83480622366528 ] ] ] }
                },{
                    "type": "Feature",
                    "action": "create",
                    "properties": { "building": true },
                    "geometry": { "type": "Polygon", "coordinates": [ [ [ -79.3775886297226, 38.83360276174755 ], [ -79.37730699777603, 38.833542170244904 ], [ -79.37725871801376, 38.833671710636104 ], [ -79.37754839658737, 38.833730212670986 ], [ -79.37759131193161, 38.83361529791408 ], [ -79.3775886297226, 38.83360276174755 ] ] ] }
                },{
                    "type": "Feature",
                    "action": "create",
                    "properties": { "building": true },
                    "geometry": { "type": "Polygon", "coordinates": [ [ [ -79.37747865915298, 38.833889003666094 ], [ -79.37751084566116, 38.83380334014694 ], [ -79.37729358673094, 38.83375737431368 ], [ -79.37726676464081, 38.833845127242355 ], [ -79.37747865915298, 38.833889003666094 ] ] ] }
                },{
                    "type": "Feature",
                    "action": "create",
                    "properties": { "building": true },
                    "geometry": { "type": "Polygon", "coordinates": [ [ [ -79.37463551759718, 38.83350874042825 ], [ -79.3745282292366, 38.83346277440474 ], [ -79.37445312738417, 38.83357768940787 ], [ -79.37443435192107, 38.83355052769661 ], [ -79.37432438135147, 38.833680068072596 ], [ -79.37425196170805, 38.83366753191749 ], [ -79.37417685985565, 38.83388482496026 ], [ -79.37424927949905, 38.83409793864628 ], [ -79.37443971633911, 38.834039436913656 ], [ -79.37439948320389, 38.83396004162818 ], [ -79.37440752983093, 38.83384721659648 ], [ -79.37463551759718, 38.83350874042825 ] ] ] }
                }]
            }
        }, (err, res) => {
            q.error(err);
            q.equals(res.statusCode, 200);
            q.end();
        });
    });

    t.test('Create Style: building (ingalls)', (q) => {
        request.post({
            url: 'http://ingalls:yeaheh@localhost:8000/api/style',
            json: true,
            body: {
                name: "Buildings",
                style: {
                    version: 8,
                    layers: [{
                        id: 'building-polys',
                        type: 'fill',
                        source: 'hecate-data',
                        filter: ['==', '$type', 'Polygon'],
                        paint: {
                            'fill-opacity': 0.8,
                            'fill-color': '#408000'
                        }
                    }]
                }
            }
        }, (err, res) => {
            q.error(err);
            q.equals(res.statusCode, 200);

            request.post({
                url: 'http://ingalls:yeaheh@localhost:8000/api/style/1/public',
            }, (err, res) => {
                q.error(err);
                q.equals(res.statusCode, 200);
                q.end();
            });
        });
    });

    t.test('Create Style: building (mark)', (q) => {
        request.post({
            url: 'http://mark:ehyeah@localhost:8000/api/style',
            json: true,
            body: {
                name: "Rooftop Footprints",
                style: {
                    version: 8,
                    layers: [{
                        id: 'building-polys',
                        type: 'fill',
                        source: 'hecate-data',
                        filter: ['==', '$type', 'Polygon'],
                        paint: {
                            'fill-opacity': 0.8,
                            'fill-color': '#FF8000'
                        }
                    }]
                }
            }
        }, (err, res) => {
            q.error(err);
            q.equals(res.statusCode, 200);

            request.post({
                url: 'http://mark:ehyeah@localhost:8000/api/style/2/public',
            }, (err, res) => {
                q.error(err);
                q.equals(res.statusCode, 200);
                q.end();
            });
        });
    });

    t.end();
});

