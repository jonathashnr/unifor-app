const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiam9hb0BvdXRsb29rLmNvbSIsImlkIjoiNjQ2NTQ5MWJjZjI5YTc5MjRmZmUwZjk2In0sImlhdCI6MTY4NDk2MzMzMiwiZXhwIjoxNjg1MDUzMzMyfQ.OJNOV6vWj5PZ2ysPO7eLPnT50y5ugAjALvGa3fKvY6Q"
const url = `http://localhost:3000/student`   
const authAxios = axios.create({
    baseURL: url,
    headers: {
        Authorization: `Bearer ${accessToken}`
    }
})
let currentData = 20
let IDItem

function displayStudents() {
    authAxios.get(url).then((res) => {
        let data = res.data

        for (let i = 0; i <= data.length; i++) {   
            const total = i + 1

            let timestamp = new Date(data[i].dateOfBirth)
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
                <td class='dataCell'>
                    <i class='fa-solid fa-trash deleteIcon' onclick=openConfirmationModal() id=${data[i]._id}></i>
                </td> 
            `
            document.querySelector('tbody').insertAdjacentHTML('beforeend', content)
         } 
    }) 
    .catch((error) => {
        if (error.response) {
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers)
        } else if (error.request) {
            console.log(error.request)
        } else {
            console.log('Error', error.message)
        }
        console.log(error.config)
    })  
}
displayStudents()

function loadMore() { 
    let bodyRow = [...document.querySelectorAll('tbody tr')]
    let endTable = currentData + 20

    if(endTable >= bodyRow.length) {
        endTable = bodyRow.length
        document.getElementById('buttonLoadMore').setAttribute('style', 'display: none')
    } 
    
    for(let i = currentData; i < endTable; i++) {
        bodyRow[i].style.display = 'table-row'
    }   
    currentData = endTable 
}

function openConfirmationModal() {
    document.getElementById('dialog').showModal()
}

function closeConfirmationModal() {
    document.getElementById('dialog').close()
}

document.addEventListener('click', (e) => {
    if(e.target.classList.contains('deleteIcon')) {
        IDItem = e.target.id            
    }   
})

function deleteItem() {
    authAxios.delete(`${url}/${IDItem}`).then(() => {
        location.reload();          
    })
    .catch((error) => {
        if (error.response) {
                console.log(error.response.data)
                console.log(error.response.status)
                console.log(error.response.headers)
            } else if (error.request) {
                console.log(error.request)
            } else {
                console.log('Error', error.message)
            }
            console.log(error.config)
    })
}