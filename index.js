#!/usr/env node

const request = require('request');
const fs = require('fs');
const path = require('path');
const { Client } = require('pg')
const Hecate = require('@mapbox/hecatejs');

const test = require('tape');

const user = require('./lib/user');

if (require.main === module) {
    const opts = require('minimist')(process.argv, {
        boolean: ['help'],
        string: ['users']
    });

    return runner(opts);
} else {
    module.exports = runner;
}

function runner(opts) {
    const hecate = new Hecate({
        host: 'localhost',
        port: 8000
    });

    test('Populate Hecate Instance', (t) => {
        t.test('Ensure server is running', (q) => {
            request('http://localhost:8000', (err, res) => {
                q.error(err);
                q.equals(res.statusCode, 200);
                q.end();
            });
        });

        t.test('Add Users', (t) => {
            user(hecate, {
                desired: opts.users
            }, t.end);
        });

        test('Populate Hecate Instance', (t) => {
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
                    q.equals(res.body, 'true');
                    q.end();
                });
            });

            t.test('Create User: mark', (q) => {
                request('http://localhost:8000/api/user/create?username=mark&password=ehyeah&email=mark@example.com', (err, res) => {
                    q.error(err);
                    q.equals(res.statusCode, 200);
                    q.equals(res.body, 'true');
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
                            "type": "Feature", //FEATURE 1
                            "action": "create",
                            "properties": { "highway": "primary", "name": "Route 28" },
                            "geometry": { "type": "LineString", "coordinates": [ [ -79.37619924545288, 38.8345346107744 ], [ -79.37287330627441, 38.83762675779815 ], [ -79.37230467796326, 38.83820338656929 ], [ -79.37211155891418, 38.83878001066818 ] ] }
                        },{
                            "type": "Feature", //FEATURE 2
                            "action": "create",
                            "properties": { "highway": "primary", "name": "Allegheny Drive" },
                            "geometry": { "type": "LineString", "coordinates": [ [ -79.37619924545288, 38.8345346107744 ], [ -79.37821626663208, 38.83474354385938 ], [ -79.38022255897522, 38.834944119043975 ], [ -79.38199281692505, 38.83490233259378 ] ] }
                        }, {
                            "type": "Feature", //FEATURE 3
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
                            "type": "Feature", //FEATURE 4
                            "action": "create",
                            "properties": { "building": true },
                            "geometry": { "type": "Polygon", "coordinates": [ [ [ -79.37664985656737, 38.834342391794515 ], [ -79.37683761119843, 38.83417942312231 ], [ -79.37662839889525, 38.83400809667998 ], [ -79.3764191865921, 38.83417524443351 ], [ -79.37664985656737, 38.834342391794515 ] ] ] }
                        },{
                            "type": "Feature", //FEATURE 5
                            "action": "create",
                            "properties": { "building": true },
                            "geometry": { "type": "Polygon", "coordinates": [ [ [ -79.37664985656737, 38.834342391794515 ], [ -79.37683761119843, 38.83417942312231 ], [ -79.37662839889525, 38.83400809667998 ], [ -79.3764191865921, 38.83417524443351 ], [ -79.37664985656737, 38.834342391794515 ] ] ] }
                        },{
                            "type": "Feature", //FEATURE 6
                            "action": "create",
                            "properties": { "building": true },
                            "geometry": { "type": "Polygon", "coordinates": [ [ [ -79.37707901000977, 38.83441133996658 ], [ -79.37686175107956, 38.83433194509595 ], [ -79.37679201364517, 38.83445103736866 ], [ -79.37700927257538, 38.8345346107744 ], [ -79.37707901000977, 38.83441133996658 ] ] ] }
                        },{
                            "type": "Feature", //FEATURE 7
                            "action": "create",
                            "properties": { "building": true },
                            "geometry": { "type": "Polygon", "coordinates": [ [ [ -79.377121925354, 38.83396839903083 ], [ -79.37703341245651, 38.83393496941438 ], [ -79.37689930200577, 38.83422538868303 ], [ -79.37697976827621, 38.8342462821099 ], [ -79.377121925354, 38.83396839903083 ] ] ] }
                        },{
                            "type": "Feature", //FEATURE 8
                            "action": "create",
                            "properties": { "building": true },
                            "geometry": { "type": "Polygon", "coordinates": [ [ [ -79.37730967998505, 38.83480622366528 ], [ -79.37731504440308, 38.8347310078916 ], [ -79.37715411186218, 38.83472473990687 ], [ -79.37714874744415, 38.83480622366528 ], [ -79.37730967998505, 38.83480622366528 ] ] ] }
                        },{
                            "type": "Feature", //FEATURE 9
                            "action": "create",
                            "properties": { "building": true },
                            "geometry": { "type": "Polygon", "coordinates": [ [ [ -79.3775886297226, 38.83360276174755 ], [ -79.37730699777603, 38.833542170244904 ], [ -79.37725871801376, 38.833671710636104 ], [ -79.37754839658737, 38.833730212670986 ], [ -79.37759131193161, 38.83361529791408 ], [ -79.3775886297226, 38.83360276174755 ] ] ] }
                        },{
                            "type": "Feature", //FEATURE 10
                            "action": "create",
                            "properties": { "building": true },
                            "geometry": { "type": "Polygon", "coordinates": [ [ [ -79.37747865915298, 38.833889003666094 ], [ -79.37751084566116, 38.83380334014694 ], [ -79.37729358673094, 38.83375737431368 ], [ -79.37726676464081, 38.833845127242355 ], [ -79.37747865915298, 38.833889003666094 ] ] ] }
                        },{
                            "type": "Feature", //FEATURE 11
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

            t.test('Modify Data: Buildings (mark)', (q) => {
                request.post({
                    url: 'http://mark:ehyeah@localhost:8000/api/data/features',
                    json: true,
                    body: {
                        "type": "FeatureCollection",
                        "message": "Add name of store",
                        "features": [{
                            "id": 5,
                            "type": "Feature",
                            "version": 1,
                            "action": "modify",
                            "properties": {
                                "building": true,
                                "name": "Tokumms"
                            },
                            "geometry": { "type": "Polygon", "coordinates": [ [ [ -79.37664985656737, 38.834342391794515 ], [ -79.37683761119843, 38.83417942312231 ], [ -79.37662839889525, 38.83400809667998 ], [ -79.3764191865921, 38.83417524443351 ], [ -79.37664985656737, 38.834342391794515 ] ] ] }
                        }, {
                            "id": 4,
                            "type": "Feature",
                            "version": 1,
                            "action": "modify",
                            "properties": {
                                "building": true,
                                "name": "Tokumms"
                            },
                            "geometry": { "type": "Polygon", "coordinates": [ [ [ -79.37664985656737, 38.834342391794515 ], [ -79.37683761119843, 38.83417942312231 ], [ -79.37662839889525, 38.83400809667998 ], [ -79.3764191865921, 38.83417524443351 ], [ -79.37664985656737, 38.834342391794515 ] ] ] }
                        }]
                    }
                }, (err, res) => {
                    q.error(err);
                    q.equals(res.statusCode, 200);
                    q.end();
                });
            });

            t.test('Modify Data: Buildings (mark)', (q) => {
                request.post({
                    url: 'http://mark:ehyeah@localhost:8000/api/data/features',
                    json: true,
                    body: {
                        "type": "FeatureCollection",
                        "message": "Fix name of store",
                        "features": [{
                            "id": 5,
                            "type": "Feature",
                            "version": 2,
                            "action": "modify",
                            "properties": {
                                "building": true,
                                "name": "Yokum's General Store"
                            },
                            "geometry": { "type": "Polygon", "coordinates": [ [ [ -79.37664985656737, 38.834342391794515 ], [ -79.37683761119843, 38.83417942312231 ], [ -79.37662839889525, 38.83400809667998 ], [ -79.3764191865921, 38.83417524443351 ], [ -79.37664985656737, 38.834342391794515 ] ] ] }
                        }, {
                            "id": 4,
                            "type": "Feature",
                            "version": 2,
                            "action": "modify",
                            "properties": {
                                "building": true,
                                "name": "Yokum's General Store"
                            },
                            "geometry": { "type": "Polygon", "coordinates": [ [ [ -79.37664985656737, 38.834342391794515 ], [ -79.37683761119843, 38.83417942312231 ], [ -79.37662839889525, 38.83400809667998 ], [ -79.3764191865921, 38.83417524443351 ], [ -79.37664985656737, 38.834342391794515 ] ] ] }
                        }]
                    }
                }, (err, res) => {
                    q.error(err);
                    q.equals(res.statusCode, 200);
                    q.end();
                });
            });

            t.test('Modify Data: Buildings (mark)', (q) => {
                request.post({
                    url: 'http://mark:ehyeah@localhost:8000/api/data/features',
                    json: true,
                    body: {
                        "type": "FeatureCollection",
                        "message": "Add store tag",
                        "features": [{
                            "id": 5,
                            "type": "Feature",
                            "version": 3,
                            "action": "modify",
                            "properties": {
                                "building": true,
                                "store": true,
                                "name": "Yokum's General Store"
                            },
                            "geometry": { "type": "Polygon", "coordinates": [ [ [ -79.37664985656737, 38.834342391794515 ], [ -79.37683761119843, 38.83417942312231 ], [ -79.37662839889525, 38.83400809667998 ], [ -79.3764191865921, 38.83417524443351 ], [ -79.37664985656737, 38.834342391794515 ] ] ] }
                        }, {
                            "id": 4,
                            "type": "Feature",
                            "version": 3,
                            "action": "modify",
                            "properties": {
                                "building": true,
                                "store": true,
                                "name": "Yokum's General Store"
                            },
                            "geometry": { "type": "Polygon", "coordinates": [ [ [ -79.37664985656737, 38.834342391794515 ], [ -79.37683761119843, 38.83417942312231 ], [ -79.37662839889525, 38.83400809667998 ], [ -79.3764191865921, 38.83417524443351 ], [ -79.37664985656737, 38.834342391794515 ] ] ] }
                        }]
                    }
                }, (err, res) => {
                    q.error(err);
                    q.equals(res.statusCode, 200);
                    q.end();
                });
            });

            t.test('Delete Data: Duplicate Buildings (ingalls)', (q) => {
                request.post({
                    url: 'http://mark:ehyeah@localhost:8000/api/data/features',
                    json: true,
                    body: {
                        "type": "FeatureCollection",
                        "message": "Add store tag",
                        "features": [{
                            "id": 4,
                            "type": "Feature",
                            "version": 4,
                            "action": "delete",
                            "properties": null,
                            "geometry": null
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

            for (let coords of [
                [ -79.37839329242706, 38.83277536987521 ],
                [ -79.37801241874695, 38.832689705015746 ],
                [ -79.37792927026749, 38.832652096020496 ],
                [ -79.37775760889052, 38.83238047490918 ],
                [ -79.3779131770134, 38.83243688860987 ],
                [ -79.37811434268951, 38.83248494469003 ],
                [ -79.3782913684845, 38.83240554767057 ],
                [ -79.37839061021805, 38.832516285594394 ],
                [ -79.37855422496796, 38.832662542965615 ],
                [ -79.37854886054993, 38.832744029084935 ],
                [ -79.37872320413588, 38.83270433073078 ],
                [ -79.37890291213989, 38.83271686705552 ],
                [ -79.37904238700867, 38.83273567153853 ],
                [ -79.37916576862335, 38.83278372741697 ],
                [ -79.37927037477493, 38.83282342572683 ],
                [ -79.37940180301666, 38.83282760449501 ],
                [ -79.37956005334854, 38.83273149276495 ],
                [ -79.37969952821732, 38.8328422301817 ],
                [ -79.37989801168442, 38.83278372741697 ],
                [ -79.38006162643433, 38.83257687797035 ],
                [ -79.38005089759827, 38.832710598893414 ],
                [ -79.38023865222931, 38.8326709005206 ]
            ]) {
                t.test('Create Data: Lots of Deltas (ingalls)', (q) => {
                    request.post({
                        url: 'http://ingalls:yeaheh@localhost:8000/api/data/features',
                        json: true,
                        body: {
                            "type": "FeatureCollection",
                            "message": "Seneca Picnic Sites",
                            "features": [{
                                "type": "Feature",
                                "action": "create",
                                "properties": { "building": true },
                                "geometry": { type: "Point", coordinates: coords }
                            }]
                        }
                    }, (err, res) => {
                        q.error(err);
                        q.equals(res.statusCode, 200);
                        q.end();
                    });
                });
            }

            t.end();
        });
    });
}
