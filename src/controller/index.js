// database.js에서 exports 한 pool 모듈을 가져옴. ("" 써야함-> 왜? '' 랑 차이점은 뭔데?)
const { pool } = require("../../config/database");
const {response, errResponse} = require("../../config/response");
const baseResponse = require("../../config/baseResponseDict");
const logger = require('loglevel');
const indexDao = require("../DAO");
const axios = require('axios');


exports.indexTest = async function (req, res, next) {

    try{

        // pool에서 getConnection 의 뜻과 사용 용도를 아직 모름 -> 알아봐야할 듯
        const connection = await pool.getConnection(async (conn)=>conn);
        // 생성한 connection 객체를 DAO의 indexTestQuery 함수에 전달 → DAO에서 쿼리 수행 후 결과 값 반환 받음
        const result = await indexDao.indexTestQuery(connection);
        // connection을 썻으면 반드시 release를 해줘야한다. => 계속 connection 연결 시 중복 + Err
        connection.release();

        return res.send(response(baseResponse.SUCCESS("성공 메세지를 입력하세요"),result));


        //Error 발생시 catch 문 실행
    }catch (err) {
        // TODO : 에러 로그 템플릿 - catch 문에서 발생한 err log 는 아래와 같이 진행(반드시 그렇게 해야할 필요는 없음)
        logger.warn("응답 실패" + err)
        return res.send(errResponse(baseResponse.FAIL))
    }

}

// 도시코드와 터미널 이름에 따른 출발/도착 가능한 터미널 목록 조회
// router.get('/bus/:cid/:terminalName',index.getDB);

exports.getDB = async function(req,res){

    // request 에서 CityCode 와 터미널 이름 가져오기
    const cid = req.params.cid;
    const terminalName = req.params.terminalName;

    // 요청할 OpenAPI 주소
    const url = "https://api.odsay.com/v1/api/intercityBusTerminals?lang=0&" +
        "CID=" +
        cid +
        "&terminalName=" +
        encodeURIComponent(terminalName) +
        // 발급받은 API key 입력
        "&apiKey=" +
        'HdCqR2fdx9sP' +
            encodeURIComponent('+') +
            'ae1CKFoosB6FRTKbZEluSjHXTbKcyY'


    try{
        // axios를 이용한 Server Side url request
        axios.get(url).then((result)=>{
            // API 요청 받은 후 받은 결과에서 data 추출 후 성공 메세지 출력
            res.send(response(baseResponse.SUCCESS('성공입니다'),result.data))
        })



    }catch (err) {

        // 에러 발생 시 log 출력 및 응답 메세지 출력
        console.log(err);
        res.send(errResponse(baseResponse.FAIL));
    }


}

exports.login = async function(req,res){

    const email = req.body.email;
    const pw = req.body.pw;

    console.log([email,pw]);

    res.send(response(baseResponse.SUCCESS("성공입니다"),[email,pw]));

}
