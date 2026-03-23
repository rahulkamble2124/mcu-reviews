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
