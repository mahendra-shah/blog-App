fetch("http://localhost:4040/dataofallblogs").then(resp => {
    return resp.json()
}).then(d => {
    const dd = d.reverse()
    div = document.querySelector("section")
    for (data of dd) {
        div.innerHTML += `
        <div class="card mt-30 mb-4 hadow-lg p-3 mb-5 bg-white rounded" style="width: 60vw; background-image: url('https://gdj-inr5u0ip5pewom.stackpathdns.com/wp-content/uploads/2012/08/minimal-background-pattern-wordpress-1.jpg) ">
        <img src="${data.image}" style="height:50vh " class="mt-1 shadow-sm p-3 mb-3 bg-white rounded" alt="blog-img">
            <div class="card-body">
                <h3 class="card-title"><b>${data.title}</b></h3>
                <h6 class="card-subtitle mb-3 text-muted">Posted on - ${new Date(data.posted_at).toISOString().slice(0, 10)}</h6>
                <p class="card-text">${data.content}</p>
                <a href="#" class="card-link"><button class="btn btn-primary">like</button></a>
                <a href="#" class="card-link"><button class="btn btn-success">share</button></a>
            </div>
        </div>
        
        `
    }
})
