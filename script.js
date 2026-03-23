let movies = [];

// 1. Fetch data from your JSON file
async function loadMovies() {
    try {
        const response = await fetch('movies.json');
        movies = await response.json();
        displayMovies(movies);
    } catch (error) {
        console.error("Error loading movie data:", error);
    }
}

// 2. Display function (Creates the HTML for every movie)
function displayMovies(moviesToDisplay) {
    const feed = document.getElementById('movieFeed');
    feed.innerHTML = ''; 

    if (moviesToDisplay.length === 0) {
        feed.innerHTML = '<p class="no-results">No movies found. Try a different search or phase!</p>';
        return;
    }

    moviesToDisplay.forEach(movie => {
        // Create the movie post HTML
        const post = document.createElement('div');
        post.className = 'post';

        post.innerHTML = `
            <div class="post-header">
                <span class="movie-title">${movie.title}</span>
                <span class="phase-tag">${movie.phase}</span>
            </div>
            
            <div class="video-container">
                <iframe 
                    src="https://www.youtube.com/embed/${movie.youtubeId}?rel=0" 
                    title="${movie.title} Trailer" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>

            <div class="post-content">
                <div class="meta-info">
                    <p><strong>Released (India):</strong> ${movie.releaseDate}</p>
                    <p><strong>Starring:</strong> ${movie.actors.join(', ')}</p>
                </div>
                
                <div class="review-section">
                    <h4>Review & Analysis</h4>
                    <p class="review-text">${movie.review}</p>
                </div>
                
                <div class="action-links">
                    <a href="${movie.ottLink}" target="_blank" class="ott-button">Watch on OTT Platform</a>
                </div>
            </div>
        `;
        feed.appendChild(post);
    });
}

// 3. Search and Filter Logic
function filterMovies() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedPhase = document.getElementById('phaseFilter').value;

    const filtered = movies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm) || 
                              movie.actors.some(a => a.toLowerCase().includes(searchTerm));
        const matchesPhase = selectedPhase === "" || movie.phase === selectedPhase;
        
        return matchesSearch && matchesPhase;
    });

    displayMovies(filtered);
}

// 4. Event Listeners (Triggers when you type or click)
document.getElementById('searchInput').addEventListener('input', filterMovies);
document.getElementById('phaseFilter').addEventListener('change', filterMovies);

// Initialize the app
loadMovies();
