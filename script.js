const cardContainer = document.getElementById("card-container");

const apiKey = "e63ecdefd05d4e1d8f1a3326a192ee71";
const api = "https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=e63ecdefd05d4e1d8f1a3326a192ee71";
const api2 = "https://newsapi.org/v2/top-headlines?country=us&apiKey=e63ecdefd05d4e1d8f1a3326a192ee71";
const api3 = "https://news-application-6wijah9wg-rajendra-echras-projects.vercel.app/api/fetchNews"; // same api as api2 but after using serverless function
const api4 = "https://gnews.io/api/v4/search?q=example&lang=en&country=us&max=10&apikey=ae24c4b88de5d8eb4f1aedae6c5a2136" // api of gnews
let page = 1;
const pageSize = 6;

let isFetching = false;
async function fechingNews() {

    if (isFetching) return;
    isFetching = true;

    try {
        const response = await fetch(
            `${api2}&page=${page}&pageSize=${pageSize}`
        );

        console.log("reponse: ", response);

        const jsonResponse = await response.json()
        console.log("jsonResponse: ", jsonResponse);

        const articles = jsonResponse.articles;
        console.log("articles: ", articles);



        if (articles && articles.length > 0) {
            renderNews(articles);
            page++;
        }
        
        
        else {
            if(page === 1){
                cardContainer.innerHTML = `<p>No news found. Please try again later.</p>`
            }else {
                const endMessage = document.createElement("p");
                endMessage.innerHTML = "No more news to display. <br> <hr> Have a nice day :) come tomorrow!!!"
                cardContainer.appendChild(endMessage);
                window.removeEventListener("scroll", handleScroll);
            }
        }
        // handleScroll and renderNews are disclared outside but can be used inside this fechingNews function()

    } catch (error) {
        cardContainer.innerHTML = `<p>Error fetching news: ${error.message}</p>`
    } finally {
        isFetching = false;
    }
}

function renderNews(articles) {

    const loadingNews = cardContainer.querySelector('p');
    if(loadingNews){
        loadingNews.remove();
    }

    articles.forEach(article => {

        const cardDiv = document.createElement("div");
        cardDiv.innerHTML = "";
        cardDiv.className = "card";

        const NewsHeading = document.createElement("h3");
        const NewsDescription = document.createElement("p");
        const anchorTag = document.createElement("a");
        const imgTag = document.createElement("img");

        // will use newsUrl and imageUrl
        NewsHeading.innerHTML = article.title;
        NewsDescription.innerHTML = article.description || "No description available";
        anchorTag.innerHTML = "Read More..."
        anchorTag.target = "_blank"
        anchorTag.href = article.url;
        imgTag.src = article.urlToImage;
        imgTag.alt = "Image is not available";

        cardDiv.appendChild(NewsHeading);
        cardDiv.appendChild(imgTag);
        cardDiv.appendChild(NewsDescription);
        cardDiv.appendChild(anchorTag);

        cardContainer.appendChild(cardDiv);

    });
}

function handleScroll() {
    const {scrollTop, clientHeight, scrollHeight} = document.documentElement;

    if(scrollTop + clientHeight >= scrollHeight - 5){
        fechingNews();
    }
}

fechingNews();

window.addEventListener("scroll", handleScroll);