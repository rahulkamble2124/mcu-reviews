let movies = [];

// 1. Fetch data from your JSON file
async function loadMovies() {
    try {
        const response = await fetch('movies.json');
        if (!response.ok) throw new Error('Network response was not ok');
        movies = await response.json();
        displayMovies(movies);
    } catch (error) {
        console.error("Error loading movie data:", error);
        document.getElementById('movieFeed').innerHTML = `<p class="error-text">Failed to load movies. Please check your movies.json file syntax.</p>`;
    }
}

// 2. Display function with Referrer Fix for YouTube
let showingFavorites = false;

function displayMovies(moviesToDisplay) {
    const feed = document.getElementById('movieFeed');
    feed.innerHTML = ''; 

    // Get current favorites from LocalStorage
    const favorites = JSON.parse(localStorage.getItem('mcuFavorites')) || [];

    if (moviesToDisplay.length === 0) {
        feed.innerHTML = `<p class="no-results">${showingFavorites ? "You haven't added any favorites yet!" : "No movies found."}</p>`;
        return;
    }

    moviesToDisplay.forEach(movie => {
        const isFavorited = favorites.includes(movie.title);
        const post = document.createElement('div');
        post.className = 'post';

        post.innerHTML = `
            <div class="post-header">
                <div>
                    <span class="movie-title">${movie.title}</span>
                    <span class="phase-tag">${movie.phase}</span>
                </div>
                <span class="fav-heart ${isFavorited ? 'active' : ''}" 
                      onclick="toggleFavorite('${movie.title}')">
                      ${isFavorited ? '❤️' : '🤍'}
                </span>
            </div>
            
            <div class="video-container">
                <iframe src="https://www.youtube.com/embed/${movie.youtubeId}?rel=0&enablejsapi=1&origin=${window.location.origin}" 
                        frameborder="0" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
            </div>

            <div class="post-content">
                <p class="review-text">${movie.review}</p>
                <div class="action-links">
                    <a href="${movie.ottLink}" target="_blank" class="ott-button">Watch Now</a>
                </div>
            </div>
        `;
        feed.appendChild(post);
    });
}

// Logic to Add/Remove from Favorites
function toggleFavorite(movieTitle) {
    let favorites = JSON.parse(localStorage.getItem('mcuFavorites')) || [];

    if (favorites.includes(movieTitle)) {
        favorites = favorites.filter(title => title !== movieTitle); // Remove
    } else {
        favorites.push(movieTitle); // Add
    }

    localStorage.setItem('mcuFavorites', JSON.stringify(favorites));
    
    // Refresh the current view
    if (showingFavorites) {
        showFavorites();
    } else {
        filterMovies(); 
    }
}

// Logic to show ONLY favorites
function showFavorites() {
    const favorites = JSON.parse(localStorage.getItem('mcuFavorites')) || [];
    const favoriteMovies = movies.filter(m => favorites.includes(m.title));
    
    showingFavorites = true;
    document.getElementById('showFavoritesBtn').classList.add('active');
    document.getElementById('showFavoritesBtn').innerText = "⬅ Show All Movies";
    
    displayMovies(favoriteMovies);
}

// Event Listener for the Favorites Button
document.getElementById('showFavoritesBtn').addEventListener('click', function() {
    if (showingFavorites) {
        showingFavorites = false;
        this.classList.remove('active');
        this.innerText = "❤️ My Favorites";
        filterMovies(); // Goes back to normal list
    } else {
        showFavorites();
    }
});
// Function to save the rating
function setRating(movieTitle, rating) {
    // Save to browser memory
    localStorage.setItem(`rating-${movieTitle}`, rating);
    
    // Update the text on the screen immediately
    const textElement = document.getElementById(`rating-text-${movieTitle}`);
    if (textElement) {
        textElement.innerText = `You rated this: ${rating}/5`;
        textElement.style.color = "#ffcc00"; // Glow gold when rated
    }
    
    alert(`Thank you! You gave ${movieTitle} a ${rating} star rating.`);
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

// 4. Event Listeners
document.getElementById('searchInput').addEventListener('input', filterMovies);
document.getElementById('phaseFilter').addEventListener('change', filterMovies);

// Initialize the app
loadMovies();
// This tells the browser: "When the user types in 'searchInput', run the filterMovies function"
document.getElementById('searchInput').addEventListener('input', filterMovies);

// Also make sure your filterMovies function looks like this:
function filterMovies() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedPhase = document.getElementById('phaseFilter').value;

    const filtered = movies.filter(movie => {
        // This checks if the title OR the actors match what you typed
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm) || 
                              movie.actors.some(a => a.toLowerCase().includes(searchTerm));
        
        const matchesPhase = selectedPhase === "" || movie.phase === selectedPhase;
        
        return matchesSearch && matchesPhase;
    });

    displayMovies(filtered);
}
