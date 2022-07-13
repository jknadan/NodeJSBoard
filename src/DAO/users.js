exports.getBusList = async function(connection){
    const sql = `
    select r.cityRegion,r.cityName,terminalName 
      from terminal
        inner join region r on terminal.cityCode = r.cityCode
    order by r.cityCode;
    `;

    const [resultRow] = await connection.query(sql);

    return resultRow;

}
