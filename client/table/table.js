const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiam9hb0BvdXRsb29rLmNvbSIsImlkIjoiNjQ2NTQ5MWJjZjI5YTc5MjRmZmUwZjk2In0sImlhdCI6MTY4NDc4MDU0NiwiZXhwIjoxNjg0ODcwNTQ2fQ.HESeG5z55qSVGHHPhAJMuP2lNN3fkfVLepOTs3psMRM"
const url = `http://localhost:3000/student`   
const authAxios = axios.create({
    baseURL: url,
    headers: {
        Authorization: `Bearer ${accessToken}`
    }
})
let currentData = 20

function displayStudents() {
    authAxios.get(url).then((res) => {
        let data = res.data

        for (let i = 0; i <= data.length; i++) {   
            const total = i + 1 
            const date = data[i].dateOfBirth

            let timestamp = new Date(date)
            timestamp = new Date(timestamp.getTime() + timestamp.getTimezoneOffset() * 60000)
            const result = timestamp.toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit' 
            })
                                 
            const content = `           
                <td class='dataCell'>${total}</td>
                <td class='dataCell'>${data[i].fullname}</td>
                <td class='dataCell'>${data[i].email}</td>
                <td class='dataCell'>${result}</td>
                <td class='dataCell'>${data[i].gender}</td>
                <td class='dataCell'>${data[i].degree}</td> 
                <td class='dataCell'>Editar</td> 
                <td class='dataCell'>Deletar</td> 
            `
            document.querySelector('tbody').insertAdjacentHTML('beforeend', content)
         } 
    }) 
    .catch((error) => {
        console.log(error)
    })  
}
displayStudents()

function loadMore() { 
    let bodyRow = [...document.querySelectorAll('tbody tr')]
    var endTable = currentData + 20

    if(endTable >= bodyRow.length) {
        endTable = bodyRow.length
        document.getElementById('buttonLoadMore').setAttribute('style', 'display: none')
    } 
    
    for(let i = currentData; i < endTable; i++) {
        bodyRow[i].style.display = 'table-row'
    }   
    currentData = endTable 
}