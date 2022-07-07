const {pool} = require('../config/database');
const {response,errResponse} = require('../config/response');
const baseResponse = require('../config/baseResponseDict');
const logger = require('loglevel');
const axios = require('axios');

// 공공데이터 포털 ApiKey
const serviceKey =
    encodeURIComponent('fLOlGqt3rEd2+0TiHJVirM3by2QIg839MAx7eJExVkm/pscLlORdmoDfHBH9cORxEdaiq5S4WecBwoi+LCjfXg==');


// 임시방편 대기 함수
function sleep(ms){
    const wakeUpTime = Date.now() + ms;
    while(Date.now() < wakeUpTime){}
}

function getCityCode(){

    console.log("getCityCode 함수 시작");
    let url = 'http://apis.data.go.kr/1613000/SuburbsBusInfoService/getCtyCodeList?serviceKey=' +
        serviceKey
        +'&_type=json'

    axios.get(url).then((result) => {

        // 공공데이터 포털에서 받아온 지역 코드
        const codeName = result.data.response.body.items.item;
        console.log(codeName[0].cityName);
        console.log(typeof (codeName));

        getTerminalName(codeName);

    });

}

async function getTerminalName(codeName){

    console.log("getTerminalName 시작");
/*

    const keyArray = Object.keys(codeName)
    console.log(keyArray);

    const url = keyArray.forEach((v) => {
        console.log ("반복문1 시작");
        let url2 = 'http://apis.data.go.kr/1613000/SuburbsBusInfoService/getSuberbsBusTrminlList?serviceKey=' +
            serviceKey +
            '&cityCode=' +
            codeName[v].cityCode +
            '&numOfRows=100' +
            '&_type=json';
        // console.log(data[v].cityCode);
        console.log(url2);

    })
*/


    for(let i in codeName){
        // console.log(codeName[i]);
        let url2 = 'http://apis.data.go.kr/1613000/SuburbsBusInfoService/getSuberbsBusTrminlList?serviceKey=' +
            serviceKey +
            '&cityCode=' +
            codeName[i].cityCode +
            '&numOfRows=600' +
            '&_type=json';

        console.log(url2);
        await getOpenApi(url2)
    }



}

async function getOpenApi(url){
    await axios.get(url).then((result)=>{
        const terminalData = result.data.response.body.items.item
        // console.log(terminalData);
        sleep(1000);

        for(let i in terminalData){
            insertDb(terminalData,i);
            // console.log(i + "% 진행중..");
        }



    })
}


async function insertDb(terminalData,i){
    const connection = await pool.getConnection((conn)=>conn);

    const query = `insert into terminal(cityName,terminalName) values (?,?);`

    const resultRow = await connection.query(query,[terminalData[i].cityName, terminalData[i].terminalNm]);

    connection.release();

    return console.log(i + " ::: " + terminalData[i]);
}

function init(){
    console.log("처음시작");
    getCityCode();

    return 0;
}

init();
