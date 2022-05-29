const axios = require('axios').default;
const fs = require('fs');

async function generateChart() {
  try {
    const response = await axios({
      method: 'post',
      url: 'http://localhost:8089',
      responseType: 'arraybuffer',
      data: {"infile":{"title":{"text":"Steep Chart"},"xAxis":{"categories":["Jan","Feb","Mar"]},"series":[{"data":[29.9,71.5,106.4]}]}}
    });
    const image = Buffer.from(response.data).toString('base64')
    return `data:${response.headers['content-type'].toLowerCase()};base64,${image}`;

  } catch (error) {
    console.error(error);
  }
}


async function generatePDF (payload) {
  try {
    const response = await axios({
      method: 'post',
      url: 'http://localhost:8088/file?filename=test.pdf',
      responseType: 'stream',
      data: payload
    });
    response.data.pipe(fs.createWriteStream("./temp/test.pdf"));
  } catch (error) {
    console.error(error);
  }
}

(async () => {
  const chartBase64 = generateChart();
  let payload = {"content":[{"text":"PDF with text and graphic from highcharts"}, {"image": chartBase64,"fit":[300,300]}],"theme":{"defaultStyle":{"fontSize":11},"pageSize":"A4","styles":{"p":{"marginTop":11},"ul":{"marginTop":11},"ol":{"marginTop":11},"h1":{"marginTop":36,"fontSize":36},"h2":{"fontSize":24,"marginTop":10},"h3":{"fontSize":20,"bold":true,"italics":true,"marginTop":10}}}}
  
  generatePDF(payload)

})()