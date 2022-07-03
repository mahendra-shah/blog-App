fetch("http://localhost:4040/data").then(resp=>{
    return resp.json()
}).then(d=>{
    div = document.querySelector("section")
    for ( data of d){
        div.innerHTML += `
        <div class="card mt-30 mb-3" style="width: 50vw;">
            <div class="card-body">
                <h3 class="card-title">${data.title}</h3>
                <h6 class="card-subtitle mb-3 text-muted">${data.posted_at}</h6>
                <p class="card-text">${data.content}</p>
                <a href="#" class="card-link"><button class="btn btn-secondary">like</button></a>
                <a href="#" class="card-link"><button class="btn btn-secondary">dislike</button></a>
            </div>
        </div>
        `
    }
})
{/* <h1 class="title">${data.title}</h1>
<p class="content">${data.content}</p> */}