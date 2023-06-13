const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { merge, isErrorResult } = require('openapi-merge');
const argv = require('minimist')(process.argv.slice(2));

function buildSpecArray(config, basePath) {
  const mergeArray = [];
  for (i in config.inputs) {
    let apiSpec = yaml.load(
      fs.readFileSync(`${basePath}${configFile.inputs[i].inputFile}`, 'utf8')
    );
    let servers = apiSpec.servers;

    for (specPath in apiSpec.paths) {
      apiSpec.paths[specPath].servers = servers;
    }

    delete apiSpec.info;
    delete apiSpec.servers;

    mergeObj = {
      oas: apiSpec,
    };

    mergeArray.push(mergeObj);
  }
  return mergeArray;
}

function mergeSpecs(mergeArray) {
  const mergeResult = merge(mergeArray);
  if (isErrorResult(mergeResult)) {
    console.error(`${mergeResult.message} (${mergeResult.type})`);
  } else {
    console.log(`Merge successful!`);
    // console.log(JSON.stringify(mergeResult.output, null, 2));
    return mergeResult;
  }
}

function main(config, basePath) {
  const mergeArray = buildSpecArray(config, basePath);
  const apiSpec = mergeSpecs(mergeArray).output;

  let info = {
    title: 'Bandwidth',
    description: `Bandwidth's Communication APIs`,
    contact: {
      name: 'Bandwidth',
      url: 'https://dev.bandwidth.com',
      email: 'letstalk@bandwidth.com',
    },
    version: '1.0.0',
  };
  apiSpec.info = info;

  /**
   * Only save the file if the -t/--test flag is not present
   */
  fileExtension = path.extname(configFile.output);
  if( argv.t != true && argv.test != true ){
    if(fileExtension == '.json'){
      fs.writeFileSync(`${basePath}${configFile.output}`, JSON.stringify(apiSpec, null, 4), 'utf8');
    } else if(fileExtension == '.yaml' || fileExtension == '.yml'){
      fs.writeFileSync(`${basePath}${configFile.output}`, yaml.dump(apiSpec));
    } else {
      throw new Error('Unsupported output file type. Only `.json`, `.yaml`, and `.yml` are supported.');
    }
  }
}

const configFile = yaml.load(fs.readFileSync(argv.c || argv.config, 'utf8'));
const basePath = argv.path;
main(configFile, basePath);
