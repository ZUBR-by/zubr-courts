for (let id of ["1293" ,"1218" ,"1253" ,"1166", "1300"]){
    fetch(process.env.VUE_APP_API_URL + '/judge/' + id ).then(
        r => r.json()
    ).then(
        r => {
            document.getElementById(id + '_fines_rub').innerText = r.statistic.fines_rub;
            document.getElementById(id + '_arrests').innerText = r.statistic.arrests;
        }
    )
}
