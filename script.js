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
function displayMovies(moviesToDisplay) {
    const feed = document.getElementById('movieFeed');
    feed.innerHTML = ''; 

    moviesToDisplay.forEach(movie => {
        // Check if the user has already rated this movie (stored in LocalStorage)
        const savedRating = localStorage.getItem(`rating-${movie.title}`) || 0;

        const post = document.createElement('div');
        post.className = 'post';
        post.innerHTML = `
            <div class="post-header">
                <span class="movie-title">${movie.title}</span>
                <span class="phase-tag">${movie.phase}</span>
            </div>
            
            <div class="video-container">
                <iframe 
                    src="https://www.youtube.com/embed/${movie.youtubeId}?rel=0&enablejsapi=1&origin=${window.location.origin}" 
                    frameborder="0" allowfullscreen referrerpolicy="strict-origin-when-cross-origin">
                </iframe>
            </div>

            <div class="post-content">
                <p class="review-text">${movie.review}</p>
                
                <div class="rating-container">
                    <p>Rate this Movie:</p>
                    <div class="stars" data-movie="${movie.title}">
                        <span class="star" onclick="setRating('${movie.title}', 5)">★</span>
                        <span class="star" onclick="setRating('${movie.title}', 4)">★</span>
                        <span class="star" onclick="setRating('${movie.title}', 3)">★</span>
                        <span class="star" onclick="setRating('${movie.title}', 2)">★</span>
                        <span class="star" onclick="setRating('${movie.title}', 1)">★</span>
                    </div>
                    <p class="user-rating-display" id="rating-text-${movie.title}">
                        ${savedRating > 0 ? `You rated this: ${savedRating}/5` : 'Not rated yet'}
                    </p>
                </div>

                <div class="action-links" style="margin-top:15px;">
                    <a href="${movie.ottLink}" target="_blank" class="ott-button">Watch Now</a>
                </div>
            </div>
        `;
        feed.appendChild(post);
    });
}

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
