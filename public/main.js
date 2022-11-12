document.querySelectorAll('.fa-trash-o').forEach(element => {
  element.addEventListener('click', (e)=>{
    console.log(e.target.parentElement.parentElement.parentElement.parentElement.children[4])
    let _id = e.target.parentElement.parentElement.parentElement.parentElement.children[4].innerText
    let name = e.target.parentElement.parentElement.parentElement.parentElement.children[1].innerText
    fetch('deleteUser', {
      method: 'delete',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify({
        '_id': _id,
        'name': name
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      window.location.reload(true)
    })
  })
})

document.querySelectorAll('.fa-pencil').forEach(element => {
  element.addEventListener('click', (e)=>{
    console.log(e.target.parentElement.parentElement)    
    let _id = e.target.parentElement.parentElement.parentElement.parentElement.children[4].innerText
    let name = prompt('Enter a new UserName:ex.Jane Doe',e.target.parentElement.parentElement.parentElement.parentElement.children[1].innerText)
    let email = prompt('Enter a new Email: ex.ex@example.com',e.target.parentElement.parentElement.parentElement.parentElement.children[2].innerText)
    let permissions = prompt('Enter new Permissions: ex."Banned","Basic" or "Advanced"',e.target.parentElement.parentElement.parentElement.parentElement.children[3].innerText)
    fetch('updateUser', {
      method: 'put',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify({
        'name': name,
        'email':email,
        'permissions':permissions,
        '_id':_id
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      window.location.reload(true)
    })
  })
})