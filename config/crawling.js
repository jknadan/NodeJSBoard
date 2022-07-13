const {pool} = require('../config/database');
const {response,errResponse} = require('../config/response');
constbaseResponse= require('../config/baseResponseDict');
constlogger= require('loglevel');
const axios = require('axios');

// Odsay ApiKey
const serviceKey =
    encodeURIComponent('HdCqR2fdx9sP+ae1CKFoosB6FRTKbZEluSjHXTbKcyY');


// 임시방편 대기 함수
function sleep(ms){
    const wakeUpTime =Date.now() + ms;
    while(Date.now() < wakeUpTime){}
}

function getCityCode(){

    // ODsay는 IP 주소 변경 시 설정 가서 추가해줘야함
    console.log("getCityCode 함수 시작");
    let url = 'https://api.odsay.com/v1/api/searchCID?lang=0'
        + '&apiKey='
        + serviceKey
        + '&output=json'

    console.log(url);
    axios.get(url).then((result) => {

        // Odsay에서 받아온 지역 코드
        const regionData = result.data.result.CID;
        const sql = `insert into region(cityRegion,cityName,cityCode) values (?,?,?);`

        //insertDb(sql,regionData);

        getTerminalName(regionData);
    })

}

async function getTerminalName(regionData){

    console.log("getTerminalName 시작");

/*
    for(let i in regionData){
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
*/

    for(let i in regionData){
        let url = 'https://api.odsay.com/v1/api/intercityBusTerminals?lang=0&' +
            'CID=' +
            regionData[i].cityCode +
            '&apiKey=' +
            serviceKey +
            '&output=json';

        await getOpenApi(regionData[i].cityCode,url);
        console.log("-----------------지역 코드 " + regionData[i].cityCode + "시작--------------------------" )
    }



}

async function getOpenApi(cityCode,url){
    await axios.get(url).then((result)=>{
        const resultData = result.data.result;
        let sql = `insert into terminal(cityCode,odseyTerId,terminalName,terminalX,terminalY) values (?,?,?,?,?);`;
        insertDb(sql,resultData,cityCode);
    })
}


async function insertDb(sql,data,cityCode){
    const connection = await pool.getConnection((conn)=>conn);
    console.log(data);
    for(let i in data){
        await connection.query(sql,[cityCode,data[i].stationID,data[i].stationName,data[i].x,data[i].y]);
    }

    connection.release();
    console.log("입력 완료");

}

function init(){
    console.log("처음시작");
    getCityCode();

    return 0;
}

init();
