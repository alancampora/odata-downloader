var fs = require('fs');
var xml2js = require('xml2js');
var request = require('request');

module.exports = function run() {

    this.getEntitiesName = function (metadata, serviceUrl, output) {

        var parser = new xml2js.Parser();
        var _self = this;

        fs.readFile(metadata, function (err, data) {
            parser.parseString(data, function (err, result) {
                var entities = [];


                //TODO: THIS IS AAAAWWWWWWFUULLLL, need to enhance it for the future and to avoid headaches :)

                var entityConatiner = ((((result["edmx:Edmx"])["edmx:DataServices"])[0])["Schema"][1])["EntityContainer"][0];
                var entitySet = entityConatiner["EntitySet"];

                for (var i = 0; i < entitySet.length; i++) {
                    var entity = entitySet[i]['$'];
                    entities.push(entity.Name);
                    console.log(entity.Name)

                }

                _self._getJSONFiles(entities, serviceUrl, output);

            });

        });

    },

        this._getJSONFiles = function (entities, serviceUrl, output) {
            if (entities.length === 0) {
                return;
            }

            var _self = this;
            var entity = entities[entities.length-1];
            var url = serviceUrl + entity + '/?$format=json';

            request.get(url, function (err, res, body) {

                if (!err && res.statusCode == 200) {

                    var fileName = output + '/' + entity + '.json';
                    console.log(fileName);

                    fs.writeFile(fileName, body, function (err, data) {
                        if (err) throw err;
                        console.log(entity, 'saved');

                        //pop and continue
                        entities.pop();
                        _self._getJSONFiles(entities, serviceUrl, output);

                    });
                }

            });
        }

};

