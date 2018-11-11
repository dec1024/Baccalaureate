//From https://gist.github.com/meiamsome/71eb62c56f25ace8c27a444eb2d91c46
//with final line in 'setup' function

let files = {
  trainingImages: 'train-images.idx3-ubyte',
  trainingLabels: 'train-labels.idx1-ubyte',
  t10kImages: 't10k-images.idx3-ubyte',
  t10kLabels: 't10k-labels.idx1-ubyte',
}

function loadMnist() {
  return Promise.all(Object.keys(files).map(async (key) => {
    return fetch(files[key])
      .then(r => r.arrayBuffer())
      .then(buffer => {
        let headerCount = 4;
        let headerView = new DataView(buffer, 0, 4 * headerCount);
        let headers = new Array(headerCount).fill().map((_, i) => headerView.getUint32(4 * i, false));

        // Get file type from the magic number
        let type, dataLength;
        if(headers[0] == 2049) {
          type = 'label';
          dataLength = 1;
          headerCount = 2;
        } else if(headers[0] == 2051) {
          type = 'image';
          dataLength = headers[2] * headers[3];
        } else {
          throw new Error("Unknown file type " + headers[0])
        }

        let data = new Uint8Array(buffer, headerCount * 4);
        if(type == 'image') {
          dataArr = [];
          for(let i = 0; i < headers[1]; i++) {
            dataArr.push(data.subarray(dataLength * i, dataLength * (i + 1)));
          }
          data = dataArr;
        }
        mnist[key] = data;
      });
  })).then(() => mnist);
}
