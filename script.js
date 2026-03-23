let movies = [];

// Fetch movie data
fetch('movies.json')
    .then(response => response.json())
    .then(data => {
        movies = data;
        displayMovies(movies);
    });

function displayMovies(moviesToDisplay) {
    const feed = document.getElementById('movieFeed');
    feed.innerHTML = ''; // Clear current feed

    moviesToDisplay.forEach(movie => {
        feed.innerHTML += `
            <div class="post">
                <div class="post-header">${movie.title} (${movie.studio})</div>
                <img src="${movie.poster}" class="post-img" alt="${movie.title}">
                <div class="post-content">
                    <p class="release-date">Released in India: ${movie.releaseDate}</p>
                    <p><strong>Actors:</strong> ${movie.actors.join(', ')}</p>
                    <p class="review-text">${movie.review}</p>
                </div>
                <div class="feedback-section">
                    <input type="text" placeholder="Add a feedback...">
                    <button style="color: #0095f6; background: none; border: none; font-weight: 600;">Post</button>
                </div>
            </div>
        `;
    });
    function displayMovies(moviesToDisplay) {
    const feed = document.getElementById('movieFeed');
    feed.innerHTML = ''; 

    moviesToDisplay.forEach(movie => {
        feed.innerHTML += `
            <div class="post">
                <div class="post-header">${movie.title} | ${movie.phase}</div>
                
                <div class="video-container">
                    <iframe width="100%" height="315" 
                        src="https://www.youtube.com/embed/${movie.youtubeId}" 
                        frameborder="0" allowfullscreen>
                    </iframe>
                </div>

                <div class="post-content">
                    <p class="release-date">Released in India: ${movie.releaseDate}</p>
                    <p><strong>Starring:</strong> ${movie.actors.join(', ')}</p>
                    <p class="review-text">${movie.review}</p>
                    
                    <div class="links">
                        <a href="${movie.ottLink}" target="_blank" class="ott-button">Watch on OTT</a>
                    </div>
                </div>
            </div>
        `;
    });
}

// Phase Filter Logic
document.getElementById('phaseFilter').addEventListener('change', (e) => {
    const selectedPhase = e.target.value;
    const filtered = selectedPhase === "" ? movies : movies.filter(m => m.phase === selectedPhase);
    displayMovies(filtered);
});
}

// Search Feature
document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = movies.filter(m => 
        m.title.toLowerCase().includes(term) || 
        m.actors.some(a => a.toLowerCase().includes(term)) ||
        m.studio.toLowerCase().includes(term)
    );
    displayMovies(filtered);
});
