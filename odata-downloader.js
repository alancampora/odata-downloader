var runClass = require('./run');

function init(){

    var downloader = new runClass();
    var args =  process.argv;
    var metadataUrl = args[2];
    var service = args[3];
    var output = args[4];

    downloader.getEntitiesName(metadataUrl,service,output);
}

init();