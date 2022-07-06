const {pool} = require('../config/database');
const {response,errResponse} = require('../config/response');
const baseResponse = require('../config/baseResponseDict');
const logger = require('loglevel');
const axios = require('axios');

// 공공데이터 포털 ApiKey
const serviceKey =
    encodeURIComponent('fLOlGqt3rEd2+0TiHJVirM3by2QIg839MAx7eJExVkm/pscLlORdmoDfHBH9cORxEdaiq5S4WecBwoi+LCjfXg==');

// const connection = await pool.getConnection((conn)=>conn);

function getCityCode(){


    let url = 'http://apis.data.go.kr/1613000/SuburbsBusInfoService/getCtyCodeList?serviceKey=' +
        serviceKey
        +'&_type=json'

    axios.get(url).then((result) => {

        // 공공데이터 포털에서 받아온 지역 코드
        const data = result.data.response.body.items.item;
        console.log(data[0].cityName);
        console.log(typeof (data));

        getTerminalName(data);

    });

}

function getTerminalName(data){

    Object.keys(data).forEach(function(v){
        // console.log(v);
        let url2 = 'http://apis.data.go.kr/1613000/SuburbsBusInfoService/getSuberbsBusTrminlList?serviceKey=' +
            serviceKey +
            '&cityCode=' +
            data[v].cityCode +
            '&numOfRows=100' +
            '&_type=json';
        // console.log(data[v].cityCode);

        // console.log(url2);

        axios.get(url2).then((result)=>{
            console.log(result.data.response.body.items.item);
        })

    })



}

function init(){
    getCityCode();
}

init();
