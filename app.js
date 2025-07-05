const API_KEY="Gn2iXyI9n9BRiM9VRdgesEx1fTaylv0tEHxAOTPp";
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

document.addEventListener("DOMContentLoaded",()=>{
    getCurrentImageOfTheDay();
    addSearchToHistory();

    document.getElementById('search-form').addEventListener("submit",(e)=>{
        e.preventDefault();
        const selectedDate=document.getElementById('search-input').value;
        if(selectedDate){
            getImageOfTheDay(selectedDate);
        }
    });
})

function getCurrentImageOfTheDay(){
    const currDate=new Date().toISOString().split('T')[0];
    fetch(`${BASE_URL}?api_key=${API_KEY}&date=${currDate}`)
    .then(res=>res.json())
    .then(data=>displayImage(data))
    .catch(()=>displayError("Failed to fetch todays image"));
}

function displayImage(data){
    const container=document.getElementById('current-image-container');
    container.innerHTML=`<h3>${data.title} (${data.date})</h3>
    ${data.media_type==='image' ? `<img src="${data.url}" alt="${data.title}">` : `<iframe width="100%" height="400px" src="${data.url}" frameborder="0" allowFullScreen></iframe>`}
    <p>${data.explanation}</p>
    `;

}
function displayError(message){
    const container=document.getElementById('current-image-container');
    container.innerHTML=`<p style="color:red;" style="cursor:pointer;">${message}</p>`
}

function getImageOfTheDay(date){
    fetch(`${BASE_URL}?api_key=${API_KEY}&date=${date}`)
    .then(res=>res.json())
    .then(data=>{displayImage(data)
                saveSearch(date)
                addSearchToHistory()
    })
    .catch(()=>displayError("Failed to fetch image for the selected date"));
            
}

function saveSearch(date){
    let searches=JSON.parse(localStorage.getItem("searches")) || [];
    if(!searches.includes(date)){
        searches.push(date);
        localStorage.setItem("searches", JSON.stringify(searches));
    }
}

function addSearchToHistory(){
    const historyList=document.getElementById('search-history');

    historyList.innerHTML="";
    const searches=JSON.parse(localStorage.getItem("searches")) || [];
    searches.forEach(date => {
        let li=document.createElement('li');
        li.textContent=date;
        li.addEventListener("click",()=>{getImageOfTheDay(date)});
        historyList.appendChild(li);
    });
}




