const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiam9hb0BvdXRsb29rLmNvbSIsImlkIjoiNjQ2NTQ5MWJjZjI5YTc5MjRmZmUwZjk2In0sImlhdCI6MTY4NDc4MDU0NiwiZXhwIjoxNjg0ODcwNTQ2fQ.HESeG5z55qSVGHHPhAJMuP2lNN3fkfVLepOTs3psMRM"
const url = `http://localhost:3000/student`   

const authAxios = axios.create({
    baseURL: url,
    headers: {
        Authorization: `Bearer ${accessToken}`
    }
})

function displayStudents() {
    authAxios.get(url).then((res) => {
        let data = res.data

        for (let i = 0; i <= data.length; i++) {   
            const total = i + 1 
            const date = data[i].dateOfBirth

            let timestamp = new Date(date).getTime() 
            let day = new Date(timestamp).getDate() + 1
            let month = new Date(timestamp).getMonth() + 1
            let year = new Date(timestamp).getFullYear()
            let formattedDate = `${day}/${month}/${year}`   
            
            const content = `           
                <td class='dataCell'>${total}</td>
                <td class='dataCell'>${data[i].fullname}</td>
                <td class='dataCell'>${data[i].email}</td>
                <td class='dataCell'>${data[i].dateOfBirth}</td>
                <td class='dataCell'>${formattedDate}</td>
                <td class='dataCell'>${data[i].gender}</td>
                <td class='dataCell'>${data[i].degree}</td> 
            `
            document.querySelector('tbody').insertAdjacentHTML('beforeend', content)
         } 
    }) 
    .catch((error) => {
        console.log(error)
    })  
}
displayStudents()