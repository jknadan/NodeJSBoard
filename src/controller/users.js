const { pool } = require("../../config/database");
const {response,errResponse} = require('../../config/response');
const baseResponse = require('../../config/baseResponseDict');
const logger = require('loglevel');
const axios = require('axios');
const userDao = require("../DAO/users");
// TODO : userDAO 추가

const serviceKey = encodeURIComponent('HdCqR2fdx9sP+ae1CKFoosB6FRTKbZEluSjHXTbKcyY');

exports.userTest = async function(req, res, next) {

    try{
        let result = {
            type : 'json',
            message : '함수 처리 결과입니다.'
        };

        res.send(response(baseResponse.SUCCESS("성공 메세지를 입력하세요"),result));

    }catch (err){
        logger.error("응답 실패 : " + err);
        res.send(errResponse(baseResponse.FAIL));
    }


}

/*{
"code": "00000", // 성공코드
"message": "성공",
"response": {
"TER_LIST": [ // 터미널 리스트 : s -출발지 설정에 따른 도착가능한 터미널 설정 || a - 도착지설정에 따른 출발가능한 터미널 설정
    {
        "BAF_TYN": "Y", // 모름
        "TER_ENM": "Daejeon", // 터미널명(영문)
        "SYS_DVS_COD": "K", // 모름
        "LOC_COD": "X0", // 지역명(코드는 내부 회사 규율인듯)
        "TER_COD": "3455101", // 터미널 코드
        "TER_NAM": "대전복합" // 터미널명(국문)
    },
    {
        "BAF_TYN": "Y",
        "TER_ENM": "Cheongju",
        "SYS_DVS_COD": "K",
        "LOC_COD": "A4",
        "TER_COD": "2839701",
        "TER_NAM": "청주"
    }
   }*/

exports.busTest = async function(req,res){

    try{
        const terCod = req.params.terCod;
        const selDiv = req.params.selDiv;

        let url = 'https://apigw.tmoney.co.kr:5556/gateway/xzzLinListGet/v1/lin_list/' +
            selDiv +
            '/' +
            terCod;


        console.log(url);

        axios.get(url,{
            headers: {
                'x-Gateway-APIKey' : 'f3b6d44f-7278-43dd-856f-65ee49e0f4cd'
            }
        }).then(function (result) {

            return res.send(result.data);
        })
    }catch (err) {
        console.log(err);
        res.send(errResponse(baseResponse.FAIL));
    }
}

// 휴게소 정보 요청 API
exports.getRestArea = async function(req,res){
    try{

        // Open API 요청 주소
        let url = 'http://data.ex.co.kr/openapi/restinfo/restBestfoodList?key=1357919734&type=json&' +
            'numOfRows=3'

        // 결과에서 필요한 data 만 성공 메세지와 함께 출력
        await axios.get(url).then((result) => {
            return res.send(response(baseResponse.SUCCESS('성공입니다'),result.data))
        })

    }catch (err) {

        // 에러 발생 시 로그 출력 및 응답 메세지 출력
        console.log(err);
        res.send(errResponse(baseResponse.FAIL));
    }
}

exports.getBusList = async function(req,res){

    try{
        const connection = await pool.getConnection((conn)=>conn);

        const resultRow = await userDao.getBusList(connection);

        res.send(response(baseResponse.SUCCESS("성공하였습니다."),resultRow));

    }catch (err){
        logger.warn(err + "에러 발생");
        res.send(errResponse(baseResponse.FAIL));
    }

}

exports.searchTerminal = async function(req,res){
    try{

        const terNm = encodeURI(req.params.terNm);
        let url = 'https://api.odsay.com/v1/api/intercityBusTerminals?lang=0&' +
            '&terminalName='+
            terNm +
            '&apiKey=' +
            serviceKey +
            '&output=json';
        axios.get(url).then((result)=>{

            const resultRow = result.data.result[0].destinationTerminals;
            res.send(response(baseResponse.SUCCESS("성공하였습니다."),resultRow));
        })

        const connection = await pool.getConnection((conn)=>conn);

        const resultRow = await userDao.getBusList(connection);



    }catch (err){
        logger.warn(err + "에러 발생");
        res.send(errResponse(baseResponse.FAIL));
    }
}
